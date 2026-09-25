import { navigation } from "@/data/navigation";
import { TransitionLink } from "@/components/transitions/TransitionLink";

/**
 * Closing link on inner pages: the next chapter's name at display size, so the site reads as
 * one continuous story rather than seven separate pages. Wraps from Contact back to Home.
 */
export function NextChapter({ current }: { current: string }) {
  const i = navigation.findIndex((n) => n.href === current);
  const next = navigation[(i + 1) % navigation.length];

  return (
    <section aria-label="Next chapter" className="border-t border-ink-800">
      <TransitionLink
        href={next.href}
        data-cursor="next"
        className="container-page group flex flex-col gap-6 py-16 md:flex-row md:items-end md:justify-between md:py-24"
      >
        <span className="label flex items-center gap-3 text-ink-400">
          <span className="text-paper">{next.index}</span>
          <span aria-hidden className="h-px w-10 bg-ink-700 transition-[width,background-color] duration-500 group-hover:w-16 group-hover:bg-signal" />
          Next chapter
        </span>
        <span className="font-display text-h2 font-bold uppercase tracking-[-0.02em] transition-[font-variation-settings,color] duration-700 [font-variation-settings:'wdth'_100] group-hover:text-signal group-hover:[font-variation-settings:'wdth'_122]">
          {next.label}
        </span>
      </TransitionLink>
    </section>
  );
}
