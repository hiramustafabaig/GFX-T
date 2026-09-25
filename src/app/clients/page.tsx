import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { clientCategories, clients } from "@/data/clients";
import { clientsTeaser } from "@/data/company";

export const metadata: Metadata = {
  title: "Clients",
  description: clientsTeaser.body,
  alternates: { canonical: "/clients" },
};

export default function ClientsPage() {
  return (
    <PageIntro index="05" eyebrow="Clients" title={clientsTeaser.heading} lead={clientsTeaser.body}>
      <div className="mt-20 grid gap-12 md:grid-cols-4">
        {clientCategories.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <h2 id={`cat-${cat.id}`} className="label mb-4 text-ink-400">{cat.label}</h2>
            <ul className="space-y-2">
              {clients.filter((c) => c.category === cat.id).map((c) => (
                <li key={c.slug} className="text-lead">{c.name}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageIntro>
  );
}
