import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutParagraphs } from "@/data/company";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutParagraphs[0],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageIntro index="02" eyebrow="About Us" title="Welcome to GFX-T">
      <div className="mt-16 grid max-w-5xl gap-8 text-paper/85 md:ml-[33%] md:grid-cols-2">
        {aboutParagraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </PageIntro>
  );
}
