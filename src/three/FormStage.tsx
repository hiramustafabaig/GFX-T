"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, registerGsap } from "@/lib/motion";
import { hasWebGL, useFinePointer, useIsMobile, useReducedMotion } from "@/lib/device";
import { HeroFallback } from "@/components/sections/home/HeroFallback";
import type { AnchorFieldState } from "./scenes/AnchorFieldScene";

registerGsap();

const AnchorFieldCanvas = dynamic(() => import("./AnchorFieldCanvas"), { ssr: false });

/** Hero progress where the field is an ordered lattice, just before the nib starts to lift. */
const LATTICE = 0.42;

type Props = {
  /**
   * "scroll" — the nib re-forms as the section scrolls into view (Home closing CTA).
   * "intro"  — it forms once, on arrival (Contact page).
   */
  drive: "scroll" | "intro";
  className?: string;
};

/**
 * The hero's Anchor Field, re-used to close the story: the lattice lifts back into the GFX-T
 * nib. The canvas is only created when the stage nears the viewport, and the underlying
 * canvas stops rendering whenever it is off-screen.
 */
export function FormStage({ drive, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef<AnchorFieldState>({ progress: LATTICE, pointer: { x: 10, y: 10 }, pointerActive: false });
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
      ([entry]) => {
        if (!entry.isIntersecting) return;
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
      const s = state.current;
      if (drive === "scroll") {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "center center",
          onUpdate: (self) => (s.progress = LATTICE + (1 - LATTICE) * self.progress),
        });
      } else {
        gsap.fromTo(s, { progress: LATTICE }, { progress: 1, duration: 2.6, delay: 0.5, ease: "gfx.inOut" });
      }
    },
    { dependencies: [drive, reduced], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!finePointer || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      state.current.pointer = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
      state.current.pointerActive = e.clientY >= r.top && e.clientY <= r.bottom;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, reduced]);

  return (
    <div ref={ref} aria-hidden className={className ?? "absolute inset-0"}>
      {near && webgl === true && (
        <AnchorFieldCanvas state={state} quality={mobile ? "mobile" : "desktop"} still={reduced} />
      )}
      {webgl === false && <HeroFallback />}
    </div>
  );
}
