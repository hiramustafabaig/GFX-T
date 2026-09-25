import type { Metadata } from "next";
import { NextChapter } from "@/components/layout/NextChapter";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { RevealText } from "@/components/typography/RevealText";
import { FormStage } from "@/three/FormStage";
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
      {/* The story's last frame: the nib forms once more behind the invitation. */}
      <section aria-labelledby="contact-heading" className="relative isolate min-h-svh overflow-hidden">
        <div className="absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black_0%,black_35%,rgb(0_0_0/0.2)_65%)] lg:[mask-image:linear-gradient(90deg,rgb(0_0_0/0.25)_0%,rgb(0_0_0/0.4)_40%,black_65%)]">
          <FormStage drive="intro" />
        </div>
        <div className="container-page flex min-h-svh flex-col justify-end pb-12 pt-[45svh] md:pb-16 lg:pt-[calc(var(--header-h)+8rem)]">
          <SectionLabel as="h1" id="contact-heading" index="07" className="mb-8 self-start">
            Contact Us
          </SectionLabel>
          <RevealText
            as="p"
            immediate
            delay={0.2}
            className="font-display text-[clamp(3rem,10.5vw,11rem)] lg:text-[min(7.6vw,10rem)] font-bold uppercase leading-[0.86] tracking-[-0.03em]"
          >
            <span className="block">Let&apos;s create</span>
            <span className="block [font-variation-settings:'wdth'_88]">something</span>
            <span className="block text-signal [font-variation-settings:'wdth'_122]">amazing.</span>
          </RevealText>
          <p className="mt-10 max-w-xl text-lead text-paper/85 lg:ml-[33%]">{contactIntro}</p>
        </div>
      </section>

      {/* Details: every route to GFX-T at a glance. */}
      <section aria-labelledby="details-heading" className="border-t border-ink-800 py-[var(--spacing-section)]">
        <div className="container-page">
          <h2 id="details-heading" className="sr-only">
            Contact details
          </h2>
          <address className="grid gap-12 not-italic md:grid-cols-2 lg:grid-cols-12">
            <div className="md:col-span-2 lg:col-span-6">
              <p className="label text-ink-400">Email</p>
              <a href={mailto()} className="mt-3 block break-all font-display text-h2 font-bold leading-none tracking-[-0.02em] transition-colors hover:text-signal">
                {contact.email}
              </a>
              <CopyButton value={contact.email} label="Copy email" className="mt-6" />
            </div>
            <div className="lg:col-span-3">
              <p className="label text-ink-400">Phone</p>
              <ul className="mt-3 space-y-3">
                {contact.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="block text-lead text-paper transition-colors hover:text-signal">
                      {p.display}
                    </a>
                    {p.label && <span className="label text-ink-400">{p.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-3">
              <p className="label text-ink-400">Studio</p>
              <p className="mt-3 text-lead text-paper">
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.country}
              </p>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="label mt-4 inline-flex items-center gap-2 text-ink-300 hover:text-signal">
                Open in Maps <span aria-hidden>↗</span>
              </a>
            </div>
          </address>
        </div>
      </section>

      <section aria-labelledby="brief-heading" className="bg-ink-900 py-[var(--spacing-section)]">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Start a project</SectionLabel>
            <h2 id="brief-heading" className="mt-8 font-display text-h2 font-bold uppercase">
              Send us a brief
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>

      <NextChapter current="/contact" />
    </>
  );
}
