import type { ReactNode } from "react";
import { navigation } from "@/data/navigation";
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

/**
 * Opening block for inner pages. Sits on the hero's artboard dot grid so every chapter opens
 * in the same environment, and closes with a design-tool style status row.
 */
export function PageIntro({ index, eyebrow, title, subtitle, lead, children, className }: Props) {
  return (
    <section className={cn("relative isolate pb-[var(--spacing-section)]", className)}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(var(--color-ink-700)_1px,transparent_1.2px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]"
      />
      <div className="container-page pt-[calc(var(--header-h)+clamp(4rem,12vw,11rem))]">
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

        <div aria-hidden className="label mt-16 flex items-center justify-between border-t border-ink-800 pt-4 text-ink-500 md:mt-24">
          <span>
            <span className="text-paper">{index}</span> / {String(navigation.length).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-3">
            Scroll
            <span className="relative block h-px w-10 overflow-hidden bg-ink-700">
              <span className="absolute inset-0 animate-[scroll-cue_2.4s_var(--ease-in-out-quart)_infinite] bg-signal motion-reduce:hidden" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
