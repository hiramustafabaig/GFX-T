import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { NextChapter } from "@/components/layout/NextChapter";
import { PortfolioExhibition } from "@/components/portfolio/PortfolioExhibition";
import { portfolioIntro } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: portfolioIntro,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageIntro index="04" eyebrow="Selected Work" title="Our Portfolio" lead={portfolioIntro} className="pb-16 md:pb-24" />
      <section aria-label="Work" className="pb-[var(--spacing-section)]">
        <PortfolioExhibition />
      </section>
      <NextChapter current="/portfolio" />
    </>
  );
}

