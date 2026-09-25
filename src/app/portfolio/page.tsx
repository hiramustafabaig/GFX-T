import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { portfolio, portfolioIntro } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: portfolioIntro,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <PageIntro index="04" eyebrow="Selected Work" title="Our Portfolio" lead={portfolioIntro}>
      {portfolio.length === 0 && (
        <p className="label mt-16 border border-dashed border-ink-700 p-6 text-ink-400 md:ml-[33%]">
          Portfolio pieces are being prepared and will be published here.
        </p>
      )}
    </PageIntro>
  );
}
