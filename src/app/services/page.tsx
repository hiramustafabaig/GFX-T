import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { NextChapter } from "@/components/layout/NextChapter";
import { ServiceArtboard } from "@/components/services/ServiceArtboard";
import { ActionLink } from "@/components/buttons/ActionLink";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { services, servicesIntro } from "@/data/services";
import { servicesTeaser } from "@/data/company";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: servicesTeaser.body,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro index="03" eyebrow="Our Services" title={servicesTeaser.heading} lead={servicesIntro}>
        {/* Index: the whole offer is readable before any scrolling. */}
        <nav aria-label="Services index" className="mt-16 md:ml-[33%]">
          <ol className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="group flex items-baseline gap-4 py-1 text-paper/85 transition-colors hover:text-paper">
                  <span className="label text-ink-400 group-hover:text-signal">{s.index}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageIntro>

      {/* Artboards: hairline grid, no cards. */}
      <section aria-label="Services" className="container-page">
        <div className="grid border-l border-t border-ink-800 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <div key={s.slug} className="border-b border-r border-ink-800">
              <ServiceArtboard service={s} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="services-cta" className="py-[var(--spacing-section)]">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <SectionLabel className="lg:col-span-3">
            Next step
          </SectionLabel>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 id="services-cta" className="font-display text-h2 font-bold uppercase">
              Book a call directly with our CEO
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <ActionLink href={contact.ceoPhone.href} variant="primary">
                {contact.ceoPhone.display}
              </ActionLink>
              <ActionLink href="/contact">All contact details</ActionLink>
            </div>
          </div>
        </div>
      </section>

      <NextChapter current="/services" />
    </>
  );
}
