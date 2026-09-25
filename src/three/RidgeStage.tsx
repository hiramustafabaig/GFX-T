"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP, registerGsap } from "@/lib/motion";
import { hasWebGL, useFinePointer, useIsMobile, useReducedMotion } from "@/lib/device";
import type { RidgeState } from "./scenes/RidgeScene";

registerGsap();

const RidgeCanvas = dynamic(() => import("./RidgeCanvas"), { ssr: false });

/** Static stand-in for devices without WebGL: a few ridgelines drawn once in SVG. */
function RidgeFallback() {
  const rows = Array.from({ length: 14 }, (_, r) => {
    const y = 40 + r * 14;
    const pts = Array.from({ length: 61 }, (_, i) => {
      const x = i * 10;
      const xn = i / 60;
      const env = Math.max(0, Math.sin(Math.PI * xn)) ** 3;
      const h = env * (18 + 14 * Math.sin(i * 0.7 + r * 1.3) + 8 * Math.sin(i * 0.23 - r));
      return `${x},${(y - h).toFixed(1)}`;
    });
    return { r, d: `M${pts.join(" L")}` };
  });
  return (
    <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      {rows.map(({ r, d }) => (
        <path key={r} d={d} fill="var(--color-ink-950)" stroke="var(--color-paper)" strokeOpacity={0.15 + (r / 14) * 0.7} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

/**
 * Host for the closing CTA's Signal Ridge: mounts the canvas only when the section nears the
 * viewport, feeds it scroll progress and the pointer (relative to this box).
 */
export function RidgeStage({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef<RidgeState>({ progress: 0, pointer: null });
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const finePointer = useFinePointer();
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- capability probe runs client-side only
  useEffect(() => setWebgl(hasWebGL()), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "center center",
        onUpdate: (self) => (state.current.progress = self.progress),
      });
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!finePointer || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      state.current.pointer = inside
        ? { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }
        : null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, reduced]);

  return (
    <div ref={ref} aria-hidden className={className ?? "absolute inset-0"}>
      {near && webgl === true && <RidgeCanvas state={state} quality={mobile ? "mobile" : "desktop"} still={reduced} />}
      {webgl === false && <RidgeFallback />}
    </div>
  );
}
