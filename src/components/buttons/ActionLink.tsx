import type { ReactNode } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  /** "primary" is the one next action in a view — the only place yellow fills a control. */
  variant?: "primary" | "ghost";
  /** The surface the control sits on. */
  tone?: "ink" | "paper";
  className?: string;
};

/**
 * The site's single button language: a mono label beside an anchor square that turns into
 * an arrow on hover. Internal links run through the page transition; mailto/tel/external
 * links render as plain anchors.
 */
export function ActionLink({ href, children, variant = "ghost", tone = "ink", className }: Props) {
  const classes = cn(
    "group label inline-flex h-12 items-center gap-4 pl-5 pr-4 transition-colors duration-300",
    variant === "primary"
      ? cn("bg-signal text-ink-950", tone === "ink" ? "hover:bg-paper" : "hover:bg-ink-950 hover:text-paper")
      : tone === "ink"
        ? "border border-ink-700 text-paper hover:border-paper"
        : "border border-ink-950/25 text-ink-950 hover:border-ink-950",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden className="relative grid size-4 place-items-center overflow-hidden">
        <span className="size-1.5 bg-current transition-transform duration-300 group-hover:scale-0" />
        <svg
          viewBox="0 0 16 16"
          className="absolute size-4 -translate-x-4 transition-transform duration-300 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
      </span>
    </>
  );

  const isInternal = href.startsWith("/");
  return isInternal ? (
    <TransitionLink href={href} className={classes}>
      {content}
    </TransitionLink>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
