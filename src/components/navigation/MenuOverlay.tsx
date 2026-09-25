"use client";

import { useEffect, useRef } from "react";
import { navigation } from "@/data/navigation";
import { contact } from "@/lib/site";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { useLenis } from "@/components/providers/SmoothScroll";
import { gsap, motion, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = { open: boolean; onClose: () => void; currentHref: string };

/**
 * Full-screen menu for touch/tablet widths. Opens with the site's slash wipe, then links
 * rise out of masks. Focus is trapped while open and Escape closes it.
 */
export function MenuOverlay({ open, onClose, currentHref }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: motion.ease.inOut } })
        .set(rootRef.current, { visibility: "visible" })
        .fromTo(
          "[data-menu-bg]",
          { clipPath: "polygon(0 0, 0 0, -20% 100%, 0 100%)" },
          { clipPath: "polygon(0 0, 120% 0, 100% 100%, 0 100%)", duration: 0.7 },
        )
        .fromTo(
          "[data-menu-link]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, ease: motion.ease.out, stagger: motion.stagger.items },
          0.3,
        )
        .fromTo("[data-menu-meta]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.6);
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const timeline = tl.current;
    if (!timeline) return;
    if (open) {
      lenis?.stop();
      timeline.timeScale(1).play();
      rootRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      timeline.timeScale(1.6).reverse();
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !rootRef.current) return;
      const focusables = rootRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className="fixed inset-0 z-[var(--z-menu)] lg:hidden"
      style={{ visibility: "hidden" }}
    >
      <div data-menu-bg className="absolute inset-0 bg-ink-900" />
      <div className="container-page relative flex h-full flex-col justify-between pb-8 pt-[calc(var(--header-h)+2rem)]">
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {navigation.map((item) => {
              const active = item.href === currentHref;
              return (
                <li key={item.href} className="reveal-mask">
                  <TransitionLink
                    data-menu-link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 py-1 font-display text-[clamp(2.5rem,11vw,5rem)] font-semibold uppercase leading-none tracking-tight [font-variation-settings:'wdth'_112]",
                      active ? "text-signal" : "text-paper",
                    )}
                  >
                    <span className="label w-6 text-ink-400">{item.index}</span>
                    {item.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div data-menu-meta className="grid gap-4 border-t border-ink-700 pt-6 sm:grid-cols-2">
          <a href={`mailto:${contact.email}`} className="text-lead text-paper">
            {contact.email}
          </a>
          <ul className="label flex flex-col gap-1.5 text-ink-300">
            {contact.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.display}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
