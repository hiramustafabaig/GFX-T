import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { NextChapter } from "@/components/layout/NextChapter";
import { LeaderProfile } from "@/components/management/LeaderProfile";
import { leaders, managementHeading } from "@/data/management";

export const metadata: Metadata = {
  title: "Our Management",
  description: "Meet Syed Zamir Ahmad Naushahi (CEO) and Syed Taimoor Hassan Naushahi (COO / Creative Head) of GFX-T.",
  alternates: { canonical: "/management" },
};

export default function ManagementPage() {
  return (
    <>
      <PageIntro index="06" eyebrow="Our Management" title={managementHeading}>
        <ol className="mt-16 grid gap-6 md:ml-[33%] md:grid-cols-2">
          {leaders.map((l, i) => (
            <li key={l.slug}>
              <a href={`#${l.slug}`} className="group flex items-baseline gap-4 border-t border-ink-800 pt-4">
                <span className="label text-ink-400 group-hover:text-signal">0{i + 1}</span>
                <span>
                  <span className="block text-paper">{l.name}</span>
                  <span className="label text-ink-400">{l.role}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </PageIntro>
      {leaders.map((l, i) => (
        <LeaderProfile key={l.slug} leader={l} index={i} />
      ))}
      <NextChapter current="/management" />
    </>
  );
}
