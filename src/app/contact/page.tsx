import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { contactIntro } from "@/data/company";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactIntro,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageIntro index="07" eyebrow="Contact Us" title="Let's create something amazing." lead={contactIntro}>
      <address className="mt-16 grid gap-10 not-italic md:ml-[33%] md:grid-cols-2">
        <div>
          <p className="label mb-3 text-ink-400">Email</p>
          <a href={`mailto:${contact.email}`} className="text-h3 hover:text-signal">{contact.email}</a>
        </div>
        <div>
          <p className="label mb-3 text-ink-400">Phone</p>
          <ul className="space-y-1 text-lead">
            {contact.phones.map((p) => (
              <li key={p.href}><a href={p.href} className="hover:text-signal">{p.display}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-3 text-ink-400">Studio</p>
          <p className="text-lead">{contact.address.full}</p>
        </div>
      </address>
    </PageIntro>
  );
}
