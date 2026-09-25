"use client";

import { useRef } from "react";
import { whyChooseUs, whyChooseUsPoints } from "@/data/company";
import { gsap, SplitText, useGSAP, registerGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/device";
import { SectionLabel } from "@/components/typography/SectionLabel";

registerGsap();

/**
 * WHY CHOOSE US — the one full signal-yellow chapter. The heading is set like the wordmark
 * (extended, heavy, slanted); the statement inks in word by word as it scrolls through the viewport, so the reading pace follows the scroll.
 */
export function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      SplitText.create("[data-statement]", {
        type: "words",
        aria: "auto",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            // Opacity rather than colour: GSAP can't interpolate between CSS variables.
            { opacity: 0.22 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
      });
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={ref} aria-labelledby="why-heading" className="relative isolate overflow-hidden bg-signal py-[var(--spacing-section)] text-ink-950">
      {/* The logo's slash, repeated as a quiet texture. */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.07] [background-image:repeating-linear-gradient(-56deg,var(--color-ink-950)_0_2px,transparent_2px_26px)]" />
      <div className="container-page">
        <SectionLabel index="07" tone="signal">
          Our promise
        </SectionLabel>
        <h2
          id="why-heading"
          className="group/why mt-8 font-logo text-[clamp(2.8rem,1rem+7.4vw,9.5rem)] leading-[0.88] transition-[letter-spacing] duration-700 ease-[var(--ease-out-expo)] hover:tracking-[0.01em]"
        >
          Why choose <span className="relative inline-block bg-ink-950 px-[0.12em] text-signal transition-transform duration-500 group-hover/why:-rotate-2">us</span>
        </h2>

        <div className="mt-12 grid gap-10 border-t-2 border-ink-950 pt-10 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <ul className="flex flex-wrap content-start gap-2 lg:col-span-4 lg:flex-col lg:items-start">
            {whyChooseUsPoints.map((p, i) => (
              <li
                key={p}
                className="label flex cursor-default items-center gap-3 border-2 border-ink-950 px-4 py-3 font-medium transition-colors duration-300 hover:bg-ink-950 hover:text-signal"
              >
                <span className="text-ink-950/60">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </li>
            ))}
          </ul>
          <p
            data-statement
            className="font-display text-[clamp(1.4rem,0.9rem+1.8vw,2.75rem)] font-semibold italic leading-[1.15] tracking-[-0.01em] [font-variation-settings:'wdth'_108] lg:col-span-8"
          >
            {whyChooseUs.body}
          </p>
        </div>
      </div>
    </section>
  );
}
