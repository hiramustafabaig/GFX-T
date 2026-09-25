import { clientCategories, clients, type Client } from "@/data/clients";
import { clientsTeaser } from "@/data/company";
import { ActionLink } from "@/components/buttons/ActionLink";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { ClientMark } from "@/components/clients/ClientMark";

/**
 * CLIENTS TEASER — deliberately quiet after the Services index: the roster drifts past in two
 * counter-moving rows. Pauses on hover/focus; static and scrollable under reduced motion.
 */
export function ClientsTeaser() {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];

  return (
    <section aria-labelledby="clients-teaser-heading" className="overflow-hidden bg-ink-950 py-[var(--spacing-section)]">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index="05">Clients</SectionLabel>
          <RevealText as="h2" id="clients-teaser-heading" className="mt-8 font-display text-h2 font-bold uppercase">
            {clientsTeaser.heading}
          </RevealText>
        </div>
        <div className="flex flex-col justify-end gap-8 lg:col-span-5 lg:col-start-8">
          <p className="text-lead text-paper/85">{clientsTeaser.body}</p>
          <dl className="label grid grid-cols-4 gap-4 border-t border-ink-800 pt-5">
            {clientCategories.map((c) => (
              <div key={c.id}>
                <dt className="text-ink-400">{c.label}</dt>
                <dd className="mt-1 text-paper">{String(clients.filter((x) => x.category === c.id).length).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.slug}>{c.name}</li>
        ))}
      </ul>
      <div aria-hidden className="mt-16 space-y-4 md:mt-24 md:space-y-6">
        {rows.map((row, i) => (
          <MarqueeRow key={i} clients={row} reverse={i === 1} />
        ))}
      </div>

      <div className="container-page mt-16">
        <ActionLink href="/clients">View all clients</ActionLink>
      </div>
    </section>
  );
}

function MarqueeRow({ clients: row, reverse }: { clients: Client[]; reverse?: boolean }) {
  // The list is rendered twice so the -50% loop is seamless.
  const items = [...row, ...row];
  return (
    <div className="marquee overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className="marquee-track"
        style={{ "--marquee-duration": "70s", "--marquee-direction": reverse ? "reverse" : "normal" } as React.CSSProperties}
      >
        {items.map((c, i) => (
          <span key={`${c.slug}-${i}`} className="flex items-center">
            <ClientMark
              client={c}
              logoHeight={48}
              className="px-6 text-[clamp(1.75rem,1rem+3.2vw,4.5rem)] leading-none text-paper/90 [font-variation-settings:'wdth'_108] md:px-10"
            />
            <span className="size-2 shrink-0 border border-ink-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
