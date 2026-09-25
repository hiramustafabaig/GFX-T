"use client";

import { useRef } from "react";
import { whyChooseUs, whyChooseUsPoints } from "@/data/company";
import { gsap, SplitText, useGSAP, registerGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/device";
import { SectionLabel } from "@/components/typography/SectionLabel";

registerGsap();

/**
 * WHY CHOOSE US — a statement, not a feature grid. The copy is set large and lights up
 * word by word as it scrolls through the viewport, so the reading pace follows the scroll.
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
            { opacity: 0.18 },
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
    <section ref={ref} aria-labelledby="why-heading" className="bg-ink-900 py-[var(--spacing-section)] text-paper">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel as="h2" id="why-heading" index="07">
            {whyChooseUs.heading}
          </SectionLabel>
          <ul className="mt-10 space-y-3">
            {whyChooseUsPoints.map((p, i) => (
              <li key={p} className="label flex items-center gap-3 text-ink-300">
                <span aria-hidden className={i === 0 ? "size-2 bg-signal" : "size-2 border border-paper"} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p
          data-statement
          className="font-display text-[clamp(1.6rem,1rem+2.4vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.015em] lg:col-span-9"
        >
          {whyChooseUs.body}
        </p>
      </div>
    </section>
  );
}
