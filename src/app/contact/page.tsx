import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { NextChapter } from "@/components/layout/NextChapter";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/ui/CopyButton";
import { contactIntro } from "@/data/company";
import { contact, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactIntro,
  alternates: { canonical: "/contact" },
};

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address.full)}`;

export default function ContactPage() {
  return (
    <>
      <PageIntro index="07" eyebrow="Get in touch" title="Contact Us" lead={contactIntro} />

      <section aria-label="Contact details and form" className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        {/* Details */}
        <div className="lg:col-span-5">
          <h2 className="font-display text-[clamp(1.75rem,1.1rem+2.2vw,3rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            Let&apos;s create something <span className="text-signal">amazing.</span>
          </h2>

          <address className="mt-8 grid gap-3 not-italic">
            <div className="border border-ink-800 bg-ink-900 p-5">
              <p className="label text-ink-400">Email</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <a href={mailto()} className="break-all text-xl font-medium text-paper transition-colors hover:text-signal">
                  {contact.email}
                </a>
                <CopyButton value={contact.email} label="Copy" />
              </div>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-5">
              <p className="label text-ink-400">Phone</p>
              <ul className="mt-2 space-y-2">
                {contact.phones.map((p) => (
                  <li key={p.href} className="flex flex-wrap items-baseline justify-between gap-2">
                    <a href={p.href} className="text-lg font-medium text-paper transition-colors hover:text-signal">
                      {p.display}
                    </a>
                    {p.label && <span className="label text-signal">{p.label}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink-800 bg-ink-900 p-5">
              <p className="label text-ink-400">Studio</p>
              <p className="mt-2 text-lg font-medium text-paper">{contact.address.full}</p>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="label mt-3 inline-flex items-center gap-2 text-ink-300 hover:text-signal">
                Open in Maps <span aria-hidden>↗</span>
              </a>
            </div>
          </address>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="border border-ink-700 bg-ink-900 p-6 md:p-8">
            <p className="label text-signal">Start a project</p>
            <h2 id="brief-heading" className="mt-2 font-display text-2xl font-extrabold uppercase md:text-3xl">
              Send us a brief
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <NextChapter current="/contact" />
    </>
  );
}
