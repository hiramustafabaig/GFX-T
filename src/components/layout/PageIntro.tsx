import type { ReactNode } from "react";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  /** Secondary heading set under the title (e.g. "Welcome to GFX-T"). */
  subtitle?: string;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Opening block for inner pages: chapter index, oversized title, lead copy. */
export function PageIntro({ index, eyebrow, title, subtitle, lead, children, className }: Props) {
  return (
    <section className={cn("container-page pb-[var(--spacing-section)] pt-[calc(var(--header-h)+clamp(4rem,12vw,11rem))]", className)}>
      <SectionLabel index={index} className="mb-8">
        {eyebrow}
      </SectionLabel>
      <RevealText
        as="h1"
        immediate
        delay={0.2}
        className="max-w-[16ch] font-display text-[length:var(--text-display)] font-bold uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_96] sm:[font-variation-settings:'wdth'_112]"
      >
        {title}
      </RevealText>
      {subtitle && (
        <p className="mt-8 flex items-center gap-4 font-display text-h3 font-semibold uppercase text-paper md:ml-[33%]">
          <span aria-hidden className="size-2.5 shrink-0 bg-signal" />
          {subtitle}
        </p>
      )}
      {lead && <div className="mt-10 max-w-2xl text-lead text-paper/85 md:ml-[33%]">{lead}</div>}
      {children}
    </section>
  );
}
