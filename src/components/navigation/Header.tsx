"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { navigation, findNavItem } from "@/data/navigation";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Logo } from "@/components/brand/Logo";
import { MenuOverlay } from "./MenuOverlay";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP, registerGsap } from "@/lib/motion";

registerGsap();

export function Header() {
  const pathname = usePathname();
  const current = findNavItem(pathname);
  // The menu belongs to the route it was opened on, so any navigation (incl. back/forward) closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(progressRef.current, { scaleX: self.progress });
          setScrolled(self.scroll() > 24);
          setHidden(self.direction === 1 && self.scroll() > window.innerHeight * 0.6);
        },
      });
      return () => st.kill();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[var(--z-header)] transition-[transform,background-color] duration-500",
          scrolled && !menuOpen ? "bg-ink-950/95" : "bg-transparent",
          hidden && !menuOpen && "-translate-y-full",
        )}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" aria-label="GFX-T — home" className="relative z-10 shrink-0">
            <Logo tone="paper" priority className="w-[112px] md:w-[132px]" />
          </TransitionLink>

          <p className="label hidden text-ink-400 md:block xl:absolute xl:left-1/2 xl:-translate-x-1/2" aria-hidden>
            <span className="text-paper">{current.index}</span> — {current.label}
          </p>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {navigation.slice(1).map((item) => {
                const active = item.href === current.href;
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "label group relative flex items-center gap-2 py-2 transition-colors",
                        active ? "text-paper" : "text-ink-300 hover:text-paper",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 transition-[transform,background-color] duration-300",
                          active ? "scale-100 bg-signal" : "scale-0 bg-paper group-hover:scale-100",
                        )}
                      />
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="label relative z-10 flex items-center gap-3 py-2 text-paper lg:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
            <span aria-hidden className="relative block h-2.5 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500",
                  menuOpen && "translate-y-[5px] rotate-[34deg]",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500",
                  menuOpen && "-translate-y-[4px] -rotate-[34deg]",
                )}
              />
            </span>
          </button>
        </div>
        {/* Reading progress: a single hairline path. */}
        <div
          ref={progressRef}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal/70"
        />
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} currentHref={current.href} />
    </>
  );
}
