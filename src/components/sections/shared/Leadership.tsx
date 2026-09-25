import Image from "next/image";
import { leaders } from "@/data/management";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { ActionLink } from "@/components/buttons/ActionLink";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { cn } from "@/lib/cn";

/**
 * LEADERSHIP — the CEO and COO as two portrait cards (photos shown as supplied: no crop tricks,
 * no filters). Each card links to the full profile on the Management page.
 */
export function Leadership({ index, compact, className }: { index: string; compact?: boolean; className?: string }) {
  return (
    <section aria-labelledby="leadership-heading" className={cn("bg-ink-900", compact ? "py-12 md:py-16" : "py-[var(--spacing-section)]", className)}>
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index={index}>Leadership</SectionLabel>
            <SectionHeading id="leadership-heading" accent="Management" size={compact ? "md" : "lg"} className={compact ? "mt-6" : "mt-8"}>
              Our Management
            </SectionHeading>
          </div>
          <div>
            <ActionLink href="/management" variant="primary" size="lg">
              Meet our CEO &amp; COO
            </ActionLink>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-6">
          {leaders.map((l) => (
            <li key={l.slug}>
              <TransitionLink
                href={`/management#${l.slug}`}
                data-cursor="view"
                className="group relative block overflow-hidden border border-ink-800 bg-ink-900 transition-colors duration-500 hover:border-signal"
              >
                <span className="relative block aspect-[4/5] overflow-hidden">
                  <Image
                    src={l.portrait.src}
                    alt={l.portrait.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/90 to-transparent" />
                  <span className="label absolute left-4 top-4 bg-signal px-2.5 py-1.5 font-medium text-ink-950">{l.role}</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                  <span>
                    <span className="block font-display text-[clamp(1.25rem,0.9rem+1.2vw,2rem)] font-extrabold uppercase leading-tight text-paper">
                      {l.name}
                    </span>
                    <span className="mt-2 block text-sm text-paper/80">
                      <span className="font-semibold text-signal">{l.experience.value}</span> {l.experience.unit}
                      {l.reach.length > 0 && <> · {l.reach.join(", ")}</>}
                    </span>
                  </span>
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-signal text-ink-950 transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
