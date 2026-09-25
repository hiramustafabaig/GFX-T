"use client";

import { useRef } from "react";
import { aboutDisciplines } from "@/data/company";
import { site } from "@/lib/site";
import { gsap, useGSAP, registerGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/device";
import { cn } from "@/lib/cn";

registerGsap();

/**
 * 2020 → today as one drawn path. The nodes are the disciplines named in the About copy;
 * no dates are attached to them because the source material doesn't give any.
 */
export function GrowthPath({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } })
        .from("[data-line]", { scaleX: 0, transformOrigin: "0 50%", duration: 1.4, ease: "gfx.inOut" })
        .from("[data-node]", { autoAlpha: 0, y: 12, stagger: 0.12, duration: 0.6 }, 0.3);
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div data-line aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-ink-700 lg:block" />
      <ol className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        <Node label={String(site.founded)} caption="Founded" variant="accent" />
        {aboutDisciplines.map((d) => (
          <Node key={d} label={d} caption="Grew into" />
        ))}
        <Node label="Today" caption="Now" variant="hollow" />
      </ol>
    </div>
  );
}

function Node({ label, caption, variant }: { label: string; caption: string; variant?: "accent" | "hollow" }) {
  return (
    <li data-node className="pr-6">
      <span
        aria-hidden
        className={cn(
          "block size-[11px]",
          variant === "accent" ? "bg-signal" : variant === "hollow" ? "border border-paper bg-ink-950" : "border border-ink-500 bg-ink-950",
        )}
      />
      <p className="label mt-5 text-ink-400">{caption}</p>
      <p className="mt-1 text-lead text-paper">{label}</p>
    </li>
  );
}
