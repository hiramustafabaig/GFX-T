import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/layout/PageIntro";
import { leaders, managementHeading } from "@/data/management";

export const metadata: Metadata = {
  title: "Our Management",
  description: "Meet Syed Zamir Ahmad Naushahi (CEO) and Syed Taimoor Hassan Naushahi (COO / Creative Head) of GFX-T.",
  alternates: { canonical: "/management" },
};

export default function ManagementPage() {
  return (
    <PageIntro index="06" eyebrow="Our Management" title={managementHeading}>
      <div className="mt-20 grid gap-16 md:grid-cols-2">
        {leaders.map((l) => (
          <article key={l.slug}>
            <Image
              src={l.portrait.src}
              width={l.portrait.width}
              height={l.portrait.height}
              alt={l.portrait.alt}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <p className="label mt-6 text-ink-400">{l.role}</p>
            <h2 className="mt-2 font-display text-h3 font-semibold uppercase">{l.name}</h2>
            <p className="mt-4 text-paper/80">{l.bio}</p>
          </article>
        ))}
      </div>
    </PageIntro>
  );
}
