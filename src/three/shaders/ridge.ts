/**
 * GLSL for the "Signal Ridge" — stacked ridgelines of a living terrain (closing CTA).
 * Height is computed on the GPU from layered simplex noise, shaped by a central envelope and
 * lifted by the pointer. Each row also has an ink "curtain" below it so the rows in front
 * hide the rows behind — the drawn, hidden-line look rather than a see-through wireframe.
 */

// 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
const noise = /* glsl */ `
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

const height = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2  uPointer;   // world xz on the ground plane
  uniform float uPointerAmp;
  ${noise}

  // Returns height; writes how much of it came from the pointer (0..1) for colouring.
  float ridgeHeight(vec2 xz, float xn, out float lift) {
    // Flat at the edges, alive in the middle — the classic ridgeline silhouette.
    float env = smoothstep(0.08, 0.42, xn) * smoothstep(0.92, 0.58, xn);
    float n = snoise(vec2(xz.x * 0.55, xz.y * 0.42 - uTime * 0.18)) * 0.75
            + snoise(vec2(xz.x * 1.6 + 4.0, xz.y * 0.9 - uTime * 0.32)) * 0.3;
    float h = max(n, -0.1) * env * 1.35 * uAmp;

    float d = distance(xz, uPointer);
    float peak = exp(-d * d * 0.9) * uPointerAmp;
    float ripple = sin(d * 4.5 - uTime * 3.2) * exp(-d * 0.55) * 0.12 * uPointerAmp;
    lift = clamp(peak, 0.0, 1.0);
    return h + peak * 1.9 + ripple * env;
  }
`;

const attrs = /* glsl */ `
  attribute float aRow;  // 0 = back row, 1 = front row
  attribute float aXn;   // 0..1 across the row
`;

export const lineVertex = /* glsl */ `
  ${height}
  ${attrs}
  varying float vRow;
  varying float vLift;
  void main() {
    float lift;
    vec3 p = position;
    p.y = ridgeHeight(p.xz, aXn, lift);
    vRow = aRow;
    vLift = lift;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const lineFragment = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uSignal;
  varying float vRow;
  varying float vLift;
  void main() {
    vec3 col = mix(uPaper, uSignal, smoothstep(0.08, 0.55, vLift));
    // Depth: back rows recede into the ink.
    float a = mix(0.12, 0.95, pow(vRow, 1.6));
    a = max(a, vLift);
    gl_FragColor = vec4(col, a);
  }
`;

export const curtainVertex = /* glsl */ `
  ${height}
  ${attrs}
  attribute float aTop;  // 1 = on the ridge line, 0 = below the terrain
  void main() {
    float lift;
    vec3 p = position;
    p.y = aTop > 0.5 ? ridgeHeight(p.xz, aXn, lift) : -2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const curtainFragment = /* glsl */ `
  uniform vec3 uInk;
  void main() { gl_FragColor = vec4(uInk, 1.0); }
`;
