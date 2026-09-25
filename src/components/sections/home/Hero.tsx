"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { gsap, motion, ScrollTrigger, useGSAP, registerGsap } from "@/lib/motion";
import { hasWebGL, useFinePointer, useIsMobile, useReducedMotion } from "@/lib/device";
import { ActionLink } from "@/components/buttons/ActionLink";
import { HERO_BEATS, type AnchorFieldState } from "@/three/scenes/AnchorFieldScene";
import { HeroFallback } from "./HeroFallback";
import { cn } from "@/lib/cn";

registerGsap();

const AnchorFieldCanvas = dynamic(() => import("@/three/AnchorFieldCanvas"), { ssr: false });

/** Per-beat width axis: create = neutral, strategize = condensed (order), elevate = expanded. */
const BEAT_WIDTH = [100, 86, 122] as const;
const BEAT_LABELS = ["Create", "Strategize", "Elevate"] as const;

/**
 * HERO — "Anchor → Path → Form".
 * A pinned (CSS sticky) stage. Scrolling moves the WebGL field through three beats while the
 * headline "selects" the matching line with a design-tool bounding box.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const fieldState = useRef<AnchorFieldState>({
    progress: 0,
    pointer: { x: 10, y: 10 },
    pointerActive: false,
  });

  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const finePointer = useFinePointer();
  const [beat, setBeat] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- capability probe runs client-side only
  useEffect(() => setWebgl(hasWebGL()), []);

  // Scroll → field progress + active headline beat.
  useGSAP(
    () => {
      if (reduced) {
        fieldState.current.progress = 1;
        return;
      }
      const [b1, b2] = HERO_BEATS.headline;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          fieldState.current.progress = self.progress;
          setBeat(self.progress < b1 ? 0 : self.progress < b2 ? 1 : 2);
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
  );

  // Load-in choreography: headline lines rise from their masks, then supporting copy.
  useGSAP(
    () => {
      if (reduced) return;
      gsap
        .timeline({ delay: 0.15 })
        .from("[data-hero-line]", {
          yPercent: 108,
          duration: motion.duration.scene,
          stagger: motion.stagger.lines * 1.5,
        })
        .from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 16, duration: motion.duration.slow, stagger: motion.stagger.items },
          0.55,
        );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  // Headline width axis follows the beat.
  useGSAP(
    () => {
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.to(line, {
          "--wdth": i === beat ? BEAT_WIDTH[i] : 100,
          duration: reduced ? 0 : motion.duration.scene,
          ease: motion.ease.inOut,
        });
      });
    },
    { dependencies: [beat, reduced] },
  );

  // Pointer → NDC for the pen-tool interaction; coordinates readout like a design tool.
  useEffect(() => {
    if (!finePointer || reduced) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const inHero = (sectionRef.current?.getBoundingClientRect().bottom ?? 0) > e.clientY;
      fieldState.current.pointer = { x, y };
      fieldState.current.pointerActive = inHero;
      if (coordsRef.current)
        coordsRef.current.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}  Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
    };
    const onLeave = () => (fieldState.current.pointerActive = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className={cn("relative", reduced ? "h-svh" : "h-[240svh] md:h-[320svh]")}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Artboard dot grid (echoes the dotted patches in the company deck). */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--color-ink-700)_1px,transparent_1.2px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_75%)]"
        />
        {/* The field recedes on the copy side (left) and stays vivid where the form lands (right). */}
        <div className="absolute inset-0 [mask-image:linear-gradient(180deg,black_0%,black_38%,rgb(0_0_0/0.22)_62%)] lg:[mask-image:linear-gradient(90deg,rgb(0_0_0/0.3)_0%,rgb(0_0_0/0.45)_30%,black_58%)]">
          {webgl === true && (
            <AnchorFieldCanvas state={fieldState} quality={mobile ? "mobile" : "desktop"} still={reduced} />
          )}
          {webgl === false && <HeroFallback />}
        </div>

        {/* Legibility floor under the headline; the only gradient in the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent"
        />

        {/* Mobile order: [form] headline, tagline, beats. Desktop: tagline top-left, form right, headline bottom-left. */}
        <div className="container-page relative flex h-full flex-col pb-6 pt-[var(--header-h)] md:pb-10">
          <div aria-hidden className="order-first flex-1 lg:order-2" />

          <div className="order-1 lg:order-3">
            <p data-hero-fade className="label mb-5 flex items-center gap-3 text-ink-300 md:mb-7">
              <span aria-hidden className="size-1.5 bg-signal" />
              {site.descriptor} — Lahore, Pakistan — Est. {site.founded}
            </p>
            <h1
              id="hero-heading"
              className="whitespace-nowrap font-display text-[9.2vw] font-bold uppercase leading-[0.92] tracking-[-0.02em] md:text-[clamp(2.6rem,7.2vw,9rem)]"
            >
              {site.heroHeading.map((line, i) => {
                const active = beat === i;
                return (
                  <span key={line} className="relative block w-fit">
                    <span className="reveal-mask">
                      <span
                        data-hero-line
                        ref={(el) => {
                          lineRefs.current[i] = el;
                        }}
                        style={{ "--wdth": 100 } as React.CSSProperties}
                        className={cn(
                          "inline-block pr-[0.06em] transition-colors duration-700 [font-variation-settings:'wdth'_var(--wdth)]",
                          active ? "text-paper" : "text-ink-500",
                        )}
                      >
                        {line}
                      </span>
                    </span>
                    <SelectionBox visible={active} />
                  </span>
                );
              })}
            </h1>
          </div>

          <div className="order-2 mt-8 max-w-md lg:order-1 lg:mt-[7vh] lg:max-w-sm xl:max-w-md">
            <p data-hero-fade className="text-lead text-paper/85">
              {site.tagline}
            </p>
            <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/contact" variant="primary">
                Start a project
              </ActionLink>
              <ActionLink href="/services">Our services</ActionLink>
            </div>
          </div>

          <div
            data-hero-fade
            aria-hidden
            className="label order-3 mt-8 flex items-center justify-between border-t border-ink-800 pt-4 text-ink-400 lg:order-4 lg:mt-10"
          >
            <span className="flex items-center gap-6">
              {BEAT_LABELS.map((label, i) => (
                <span key={label} className={cn("transition-colors duration-500", beat === i && "text-paper")}>
                  <span className={cn("mr-2", beat === i ? "text-signal" : "text-ink-500")}>0{i + 1}</span>
                  {label}
                </span>
              ))}
            </span>
            <span ref={coordsRef} className="hidden tabular-nums md:inline">
              {reduced ? "" : "Scroll to begin"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A design-tool bounding box: hairline frame with square handles at the corners. */
function SelectionBox({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -left-[0.1em] -right-[0.04em] bottom-[0.02em] top-[0.08em] border border-signal/80 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
        <span key={pos} className={cn("absolute size-2 border border-signal bg-ink-950", pos)} />
      ))}
    </span>
  );
}
