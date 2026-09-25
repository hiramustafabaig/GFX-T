"use client";

import { useRef, type ReactNode } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/cn";
import { useMagnetic } from "@/lib/useMagnetic";

type Props = {
  href: string;
  children: ReactNode;
  /** "primary" is the one next action in a view: a signal-yellow fill. */
  variant?: "primary" | "ghost";
  /** The surface the control sits on. */
  tone?: "ink" | "paper";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * The site's button language. On hover a fill wipes across along the logo's slash, the label
 * rolls to a second copy, and the arrow chip turns — three quick, coordinated moves. Internal
 * links run through the page transition; mailto/tel/external links are plain anchors. On fine
 * pointers the whole control leans toward the cursor.
 */
export function ActionLink({ href, children, variant = "ghost", tone = "ink", size = "md", className }: Props) {
  const magnetRef = useRef<HTMLSpanElement>(null);
  useMagnetic(magnetRef, 0.2);

  const skin = {
    primary: {
      base: "bg-signal text-ink-950",
      fill: tone === "ink" ? "bg-paper" : "bg-ink-950",
      // Plain `hover:` — `group-hover:` only styles descendants, never the group element itself.
      hoverText: tone === "ink" ? "hover:text-ink-950" : "hover:text-signal",
      chip: tone === "ink" ? "bg-ink-950 text-signal" : "bg-ink-950 text-signal group-hover:bg-signal group-hover:text-ink-950",
    },
    ghost: {
      base: tone === "ink" ? "border border-ink-700 text-paper" : "border border-ink-950/30 text-ink-950",
      fill: tone === "ink" ? "bg-signal" : "bg-ink-950",
      hoverText: tone === "ink" ? "hover:border-signal hover:text-ink-950" : "hover:border-ink-950 hover:text-paper",
      chip: tone === "ink" ? "bg-signal text-ink-950 group-hover:bg-ink-950 group-hover:text-signal" : "bg-ink-950 text-paper group-hover:bg-signal group-hover:text-ink-950",
    },
  }[variant];

  const classes = cn(
    "group label relative isolate inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap font-medium transition-[color,border-color] duration-500",
    size === "lg" ? "h-14 gap-4 pl-7 pr-2" : size === "sm" ? "h-11 gap-3 pl-4 pr-1" : "h-12 gap-4 pl-5 pr-1.5",
    skin.base,
    skin.hoverText,
    className,
  );

  const content = (
    <>
      {/* Fill: wipes in on a slant, like the transition blade. */}
      <span
        aria-hidden
        className={cn(
          "absolute -inset-y-1 -left-[15%] -z-10 w-[130%] -translate-x-full skew-x-[-24deg] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0",
          skin.fill,
        )}
      />
      {/* Label: rolls up to an identical copy. */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {/* Arrow chip */}
      <span
        aria-hidden
        className={cn(
          "grid place-items-center transition-colors duration-500",
          size === "lg" ? "size-10" : size === "sm" ? "size-8" : "size-9",
          skin.chip,
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3.5 -rotate-45 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
      </span>
    </>
  );

  const isInternal = href.startsWith("/");
  const link = isInternal ? (
    <TransitionLink href={href} className={classes}>
      {content}
    </TransitionLink>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  );
  return (
    <span ref={magnetRef} className="inline-block">
      {link}
    </span>
  );
}
