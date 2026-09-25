import { cn } from "@/lib/cn";

type Kind = "cube" | "ring" | "anchor" | "plus";
type Shape = { kind: Kind; top: string; left: string; size: number; dur: number; delay: number };

/** Deterministic layouts so server and client render identically. */
const LAYOUTS: Shape[][] = [
  [
    { kind: "cube", top: "8%", left: "78%", size: 34, dur: 14, delay: 0 },
    { kind: "ring", top: "46%", left: "6%", size: 40, dur: 18, delay: -4 },
    { kind: "anchor", top: "80%", left: "84%", size: 16, dur: 11, delay: -2 },
    { kind: "plus", top: "30%", left: "90%", size: 14, dur: 16, delay: -6 },
  ],
  [
    { kind: "ring", top: "12%", left: "82%", size: 36, dur: 16, delay: -3 },
    { kind: "cube", top: "62%", left: "86%", size: 28, dur: 13, delay: -5 },
    { kind: "plus", top: "88%", left: "8%", size: 14, dur: 15, delay: 0 },
    { kind: "anchor", top: "22%", left: "5%", size: 14, dur: 12, delay: -7 },
  ],
  [
    { kind: "anchor", top: "10%", left: "88%", size: 16, dur: 10, delay: -1 },
    { kind: "cube", top: "40%", left: "4%", size: 30, dur: 15, delay: -6 },
    { kind: "ring", top: "74%", left: "80%", size: 44, dur: 19, delay: -2 },
    { kind: "plus", top: "92%", left: "46%", size: 12, dur: 14, delay: -4 },
  ],
];

function ShapeView({ s, tone }: { s: Shape; tone: "ink" | "paper" }) {
  const line = tone === "ink" ? "var(--color-paper)" : "var(--color-ink-950)";
  const accent = "var(--color-signal)";
  const common = { width: s.size, height: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` };

  if (s.kind === "cube") {
    const half = s.size / 2;
    const faces = [
      `rotateY(0deg) translateZ(${half}px)`,
      `rotateY(90deg) translateZ(${half}px)`,
      `rotateY(180deg) translateZ(${half}px)`,
      `rotateY(-90deg) translateZ(${half}px)`,
      `rotateX(90deg) translateZ(${half}px)`,
      `rotateX(-90deg) translateZ(${half}px)`,
    ];
    return (
      <span className="block [perspective:400px]" style={{ width: s.size, height: s.size }}>
        <span className="relative block animate-[shape-tumble_linear_infinite] [transform-style:preserve-3d]" style={common}>
          {faces.map((t) => (
            <span key={t} className="absolute inset-0 border" style={{ transform: t, borderColor: accent }} />
          ))}
        </span>
      </span>
    );
  }
  if (s.kind === "ring") {
    return (
      <span className="block [perspective:400px]" style={{ width: s.size, height: s.size }}>
        <span className="block animate-[shape-flip_linear_infinite] rounded-full border-2" style={{ ...common, borderColor: line }} />
      </span>
    );
  }
  if (s.kind === "anchor") {
    return <span className="block animate-[shape-spin_linear_infinite] border-2" style={{ ...common, borderColor: accent, background: "transparent" }} />;
  }
  return (
    <span className="relative block animate-[shape-spin_linear_infinite]" style={common}>
      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2" style={{ background: line }} />
      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2" style={{ background: line }} />
    </span>
  );
}

/**
 * Phones only: a few slowly rotating objects (wireframe cube, ring, anchor square, plus) drifting
 * behind a section — the mobile counterpart of the desktop interactions. Pure CSS 3D, low
 * opacity, no pointer events; hidden from md up and under reduced motion. The parent section
 * needs `relative isolate` so the layer sits above its background and below its content.
 */
export function MobileShapes({ variant = 0, tone = "ink", className }: { variant?: number; tone?: "ink" | "paper"; className?: string }) {
  const layout = LAYOUTS[variant % LAYOUTS.length];
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden md:hidden", className)}>
      {layout.map((s, i) => (
        <span
          key={i}
          className="absolute animate-[shape-drift_ease-in-out_infinite] opacity-45"
          style={{ top: s.top, left: s.left, animationDuration: `${s.dur * 0.6}s`, animationDelay: `${s.delay}s` }}
        >
          <ShapeView s={s} tone={tone} />
        </span>
      ))}
    </div>
  );
}
