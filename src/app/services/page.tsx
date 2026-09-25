import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { services, servicesIntro } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <PageIntro index="03" eyebrow="Our Services" title="Our Services" lead={servicesIntro}>
      <ol className="mt-20 border-t border-ink-800">
        {services.map((s) => (
          <li key={s.slug} className="grid gap-4 border-b border-ink-800 py-8 md:grid-cols-12">
            <span className="label text-ink-400 md:col-span-1">{s.index}</span>
            <h2 className="font-display text-h3 font-semibold uppercase md:col-span-5">{s.title}</h2>
            <p className="text-paper/80 md:col-span-6">{s.description}</p>
          </li>
        ))}
      </ol>
    </PageIntro>
  );
}
