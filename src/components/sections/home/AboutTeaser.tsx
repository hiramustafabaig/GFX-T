import { aboutSummary } from "@/data/company";
import { site } from "@/lib/site";
import { ActionLink } from "@/components/buttons/ActionLink";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { GrowthPath } from "@/components/sections/shared/GrowthPath";
import { YearMark } from "@/components/typography/YearMark";

/**
 * ABOUT TEASER — editorial. The founding year is the anchor: an outline that fills with ink
 * as the visitor scrolls, followed by the growth path from 2020 to today.
 */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser-heading" className="relative bg-ink-950 py-[var(--spacing-section)]">
      <div className="container-page">
        <SectionLabel index="02">About GFX-T</SectionLabel>

        <div className="mt-10 grid gap-x-10 gap-y-12 lg:mt-16 lg:grid-cols-12">
          {/* Year: outline underneath, solid copy revealed over it by scroll. */}
          <YearMark year={site.founded} fill="x" className="[--year-size:34vw] lg:col-span-7 lg:[--year-size:min(20vw,22rem)]" />

          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="label mb-6 text-signal">Founded {site.founded} — the COVID era</p>
            <RevealText as="h2" id="about-teaser-heading" className="font-display text-h3 font-semibold uppercase">
              Welcome to GFX-T
            </RevealText>
            <RevealText split="words" className="mt-6 text-lead text-paper/85">
              {aboutSummary}
            </RevealText>
            <div className="mt-10">
              <ActionLink href="/about">Read more</ActionLink>
            </div>
          </div>
        </div>

        {/* 2020 → today: the disciplines named in the copy, plotted on one path. */}
        <GrowthPath className="mt-20 lg:mt-28" />
      </div>
    </section>
  );
}
