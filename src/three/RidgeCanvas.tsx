"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { RidgeScene, type RidgeState } from "./scenes/RidgeScene";

type Props = { state: React.RefObject<RidgeState>; quality: "desktop" | "mobile"; still?: boolean };

/** Canvas host for the Signal Ridge. Stops rendering entirely when off-screen; DPR is capped. */
export default function RidgeCanvas({ state, quality, still }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={quality === "mobile" ? [1, 1.5] : [1, 1.75]}
        frameloop={still ? "demand" : visible ? "always" : "never"}
        camera={{ fov: 40, near: 0.1, far: 60, position: [0, 3.1, 7.6] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <RidgeScene state={state} quality={quality} still={still} />
      </Canvas>
    </div>
  );
}
