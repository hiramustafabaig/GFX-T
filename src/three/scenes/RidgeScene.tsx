"use client";
/* eslint-disable react-hooks/immutability -- R3F idiom: uniforms are GPU state mutated in useFrame. */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry, Color, MathUtils, Plane, Raycaster, ShaderMaterial, Vector2, Vector3 } from "three";
import { curtainFragment, curtainVertex, lineFragment, lineVertex } from "../shaders/ridge";

export type RidgeState = {
  /** 0..1 — how far the section has scrolled in; drives the terrain amplitude. */
  progress: number;
  /** Pointer in NDC relative to the canvas, or null when absent (touch / outside). */
  pointer: { x: number; y: number } | null;
};

type Props = { state: React.RefObject<RidgeState>; quality: "desktop" | "mobile"; still?: boolean };

const WIDTH = 16;
const NEAR_Z = 2.5;
const FAR_Z = -11;
const PRESETS = { desktop: { rows: 56, cols: 180 }, mobile: { rows: 30, cols: 96 } };

function buildGeometry(rows: number, cols: number) {
  // Lines: one polyline per row as independent segments.
  const lineVerts = rows * (cols - 1) * 2;
  const lp = new Float32Array(lineVerts * 3);
  const lRow = new Float32Array(lineVerts);
  const lXn = new Float32Array(lineVerts);
  // Curtains: one quad strip per row (top on the ridge, bottom below the terrain).
  const curtainVerts = rows * cols * 2;
  const cp = new Float32Array(curtainVerts * 3);
  const cRow = new Float32Array(curtainVerts);
  const cXn = new Float32Array(curtainVerts);
  const cTop = new Float32Array(curtainVerts);
  const index: number[] = [];

  let l = 0;
  let c = 0;
  for (let r = 0; r < rows; r++) {
    const rowN = r / (rows - 1);
    const z = FAR_Z + (NEAR_Z - FAR_Z) * rowN;
    for (let i = 0; i < cols; i++) {
      const xn = i / (cols - 1);
      const x = (xn - 0.5) * WIDTH;
      for (const top of [1, 0]) {
        cp.set([x, 0, z], c * 3);
        cRow[c] = rowN;
        cXn[c] = xn;
        cTop[c] = top;
        c++;
      }
      if (i < cols - 1) {
        const base = (r * cols + i) * 2;
        index.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
        for (const j of [i, i + 1]) {
          const xj = j / (cols - 1);
          lp.set([(xj - 0.5) * WIDTH, 0, z], l * 3);
          lRow[l] = rowN;
          lXn[l] = xj;
          l++;
        }
      }
    }
  }

  const lines = new BufferGeometry();
  lines.setAttribute("position", new BufferAttribute(lp, 3));
  lines.setAttribute("aRow", new BufferAttribute(lRow, 1));
  lines.setAttribute("aXn", new BufferAttribute(lXn, 1));

  const curtains = new BufferGeometry();
  curtains.setAttribute("position", new BufferAttribute(cp, 3));
  curtains.setAttribute("aRow", new BufferAttribute(cRow, 1));
  curtains.setAttribute("aXn", new BufferAttribute(cXn, 1));
  curtains.setAttribute("aTop", new BufferAttribute(cTop, 1));
  curtains.setIndex(index);
  return { lines, curtains };
}

export function RidgeScene({ state, quality, still = false }: Props) {
  const { camera, size } = useThree();
  const geo = useMemo(() => buildGeometry(PRESETS[quality].rows, PRESETS[quality].cols), [quality]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: still ? 1 : 0.25 },
      uPointer: { value: new Vector2(0, -2) },
      uPointerAmp: { value: 0 },
      uPaper: { value: new Color("#f3f0e8") },
      uSignal: { value: new Color("#ffbf01") },
      uInk: { value: new Color("#0b0b0b") },
    }),
    [still],
  );

  const materials = useMemo(
    () => ({
      lines: new ShaderMaterial({ vertexShader: lineVertex, fragmentShader: lineFragment, uniforms, transparent: true, depthWrite: false }),
      curtains: new ShaderMaterial({
        vertexShader: curtainVertex,
        fragmentShader: curtainFragment,
        uniforms,
        // Pushed back a hair so each row's own line is never hidden by its curtain.
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    }),
    [uniforms],
  );

  useEffect(
    () => () => {
      geo.lines.dispose();
      geo.curtains.dispose();
      materials.lines.dispose();
      materials.curtains.dispose();
    },
    [geo, materials],
  );

  const scratch = useMemo(() => ({ ray: new Raycaster(), plane: new Plane(new Vector3(0, 1, 0), 0), hit: new Vector3(), ndc: new Vector2(), target: new Vector2(0, -2) }), []);

  useEffect(() => {
    camera.position.set(0, 3.1, 7.6);
    camera.lookAt(0, 0.2, -2.2);
  }, [camera, size]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 20);
    const u = uniforms;
    const s = state.current;
    if (!still) u.uTime.value += dt;
    const t = u.uTime.value;

    u.uAmp.value = still ? 1 : MathUtils.damp(u.uAmp.value, 0.25 + 0.75 * s.progress, 3, dt);

    // Pointer → ground plane. Without one, an invisible "pen" wanders so the terrain stays alive.
    if (s.pointer && !still) {
      scratch.ndc.set(s.pointer.x, s.pointer.y);
      scratch.ray.setFromCamera(scratch.ndc, camera);
      if (scratch.ray.ray.intersectPlane(scratch.plane, scratch.hit)) scratch.target.set(scratch.hit.x, scratch.hit.z);
    } else {
      scratch.target.set(Math.sin(t * 0.21) * 4.2, -2.5 + Math.sin(t * 0.13 + 1.3) * 2.6);
    }
    const p = u.uPointer.value;
    p.x = MathUtils.damp(p.x, scratch.target.x, 4, dt);
    p.y = MathUtils.damp(p.y, scratch.target.y, 4, dt);
    u.uPointerAmp.value = still ? 0.6 : MathUtils.damp(u.uPointerAmp.value, s.pointer ? 1 : 0.65, 3, dt);
  });

  return (
    <group>
      <mesh geometry={geo.curtains} material={materials.curtains} frustumCulled={false} />
      <lineSegments geometry={geo.lines} material={materials.lines} frustumCulled={false} />
    </group>
  );
}
