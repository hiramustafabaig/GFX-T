import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { NextChapter } from "@/components/layout/NextChapter";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { ActionLink } from "@/components/buttons/ActionLink";
import { GrowthPath } from "@/components/sections/shared/GrowthPath";
import { YearMark } from "@/components/typography/YearMark";
import { VisionMission } from "@/components/sections/shared/VisionMission";
import { aboutParagraphs, aboutSummary } from "@/data/company";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutSummary,
  alternates: { canonical: "/about" },
};

// The philosophy paragraph opens with the company's core belief; it is set as a pull-quote
// and the rest of the paragraph follows, so no sentence appears twice.
const [origin, philosophy] = aboutParagraphs;
const splitAt = philosophy.indexOf(". ") + 1;
const belief = philosophy.slice(0, splitAt);
const philosophyRest = philosophy.slice(splitAt).trim();

export default function AboutPage() {
  return (
    <>
      <PageIntro index="02" eyebrow="Our story" title="About Us" subtitle="Welcome to GFX-T" />

      {/* ORIGIN — the year stays pinned while the story scrolls past it. */}
      <section aria-labelledby="origin-heading" className="border-t border-ink-800 py-[var(--spacing-section)]">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+6vh)]">
              <YearMark year={site.founded} fill="y" track="section" className="[--year-size:30vw] lg:[--year-size:min(19vw,22rem)]" />
              <p className="label mt-6 text-ink-400">Lahore, Pakistan — the COVID era</p>
            </div>
          </div>

          <div className="space-y-24 lg:col-span-5 lg:col-start-8 lg:pt-[12vh]">
            <article>
              <SectionLabel as="h2" id="origin-heading" index="01">
                Origin
              </SectionLabel>
              <RevealText split="words" className="mt-8 text-lead text-paper/90">
                {origin}
              </RevealText>
            </article>

            <article aria-labelledby="philosophy-heading">
              <SectionLabel as="h2" id="philosophy-heading" index="02">
                Philosophy
              </SectionLabel>
              <RevealText
                as="p"
                className="mt-8 font-display text-h3 font-semibold uppercase leading-[1.02] [font-variation-settings:'wdth'_104]"
              >
                {belief}
              </RevealText>
              <RevealText split="words" className="mt-8 text-paper/80">
                {philosophyRest}
              </RevealText>
            </article>
          </div>
        </div>
      </section>

      {/* GROWTH */}
      <section aria-labelledby="growth-heading" className="border-t border-ink-800 py-[var(--spacing-section)]">
        <div className="container-page">
          <SectionLabel index="03">Growth</SectionLabel>
          <RevealText as="h2" id="growth-heading" className="mt-8 max-w-[18ch] font-display text-h2 font-bold uppercase">
            Grown steadily since 2020
          </RevealText>
          <GrowthPath className="mt-16 lg:mt-24" />
        </div>
      </section>

      <VisionMission detail="full" index="04" />

      {/* PEOPLE — hands the story over to the Management chapter. */}
      <section className="py-[var(--spacing-section)]">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <SectionLabel index="05" className="lg:col-span-3">
            The people
          </SectionLabel>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="text-h3 font-display font-semibold uppercase leading-[1.02]">
              Led by over three decades of media experience and a creative head who has worked with clients
              across Qatar, UAE, UK and Jordan.
            </p>
            <div className="mt-10">
              <ActionLink href="/management">Meet our CEO &amp; COO</ActionLink>
            </div>
          </div>
        </div>
      </section>

      <NextChapter current="/about" />
    </>
  );
}
