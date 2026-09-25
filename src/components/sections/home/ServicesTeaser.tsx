"use client";

import { useState } from "react";
import { services } from "@/data/services";
import { servicesTeaser } from "@/data/company";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { ActionLink } from "@/components/buttons/ActionLink";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { ServiceGlyph } from "@/components/ui/ServiceGlyph";
import { cn } from "@/lib/cn";

/**
 * SERVICES TEASER — the first paper surface after the dark opening chapters. An index of the
 * six services at display size; the hovered/focused row widens and draws its glyph. Every row
 * deep-links into the Services page.
 */
export function ServicesTeaser() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-labelledby="services-teaser-heading" className="bg-paper py-[var(--spacing-section)] text-ink-950">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="04" tone="paper">
              Services
            </SectionLabel>
            <RevealText
              as="h2"
              id="services-teaser-heading"
              className="mt-8 font-display text-h2 font-bold uppercase [font-variation-settings:'wdth'_104]"
            >
              {servicesTeaser.heading}
            </RevealText>
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-5 lg:col-start-8">
            <p className="text-lead text-ink-800">{servicesTeaser.body}</p>
            <div>
              <ActionLink href="/services" tone="paper">
                All services
              </ActionLink>
            </div>
          </div>
        </div>

        <ul className="mt-16 border-t border-ink-950/15 lg:mt-24" onPointerLeave={() => setActive(null)}>
          {services.map((s) => {
            const on = active === s.slug;
            return (
              <li key={s.slug} className="border-b border-ink-950/15">
                <TransitionLink
                  href={`/services#${s.slug}`}
                  onPointerEnter={() => setActive(s.slug)}
                  onFocus={() => setActive(s.slug)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[5rem_1fr_auto] md:py-7"
                >
                  <span className={cn("label transition-colors duration-300", on ? "text-ink-950" : "text-ink-700")}>
                    {s.index}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[clamp(1.6rem,1rem+3vw,4.5rem)] font-semibold uppercase leading-none tracking-[-0.015em] transition-[font-variation-settings,color] duration-700",
                      on ? "[font-variation-settings:'wdth'_118]" : "[font-variation-settings:'wdth'_96]",
                      active && !on ? "text-ink-400" : "text-ink-950",
                    )}
                  >
                    {s.title}
                  </span>
                  <ServiceGlyph
                    glyph={s.glyph}
                    tone="paper"
                    play={on}
                    className={cn(
                      "size-9 transition-opacity duration-300 md:size-14",
                      on ? "opacity-100" : "opacity-100 md:opacity-0",
                    )}
                  />
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
