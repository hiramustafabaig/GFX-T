import type { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
};

/** Opening block for inner pages: chapter index, oversized title, lead copy. */
export function PageIntro({ index, eyebrow, title, lead, children }: Props) {
  return (
    <section className="container-page pb-[var(--spacing-section)] pt-[calc(var(--header-h)+clamp(4rem,12vw,11rem))]">
      <p className="label mb-8 flex items-center gap-3 text-ink-300">
        <span className="text-paper">{index}</span>
        <span aria-hidden className="h-px w-10 bg-ink-700" />
        {eyebrow}
      </p>
      <h1 className="max-w-[16ch] font-display text-[length:var(--text-display)] font-bold uppercase leading-[0.9] tracking-[-0.02em] [font-variation-settings:'wdth'_112]">
        {title}
      </h1>
      {lead && <div className="mt-10 max-w-2xl text-lead text-paper/85 md:ml-[33%]">{lead}</div>}
      {children}
    </section>
  );
}
