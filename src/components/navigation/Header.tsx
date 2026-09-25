"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { navigation, findNavItem } from "@/data/navigation";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Logo } from "@/components/brand/Logo";
import { ActionLink } from "@/components/buttons/ActionLink";
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
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(progressRef.current, { scaleX: self.progress });
          setScrolled(self.scroll() > 24);
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
          // Always present. Transparent over the hero; frosted glass once the page scrolls.
          "fixed inset-x-0 top-0 z-[var(--z-header)] border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !menuOpen
            ? "border-paper/10 bg-ink-950/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" aria-label="GFX-T — home" className="relative z-10 shrink-0">
            <Logo tone="paper" priority className="w-[112px] md:w-[132px]" />
          </TransitionLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navigation.slice(1).map((item) => {
                const active = item.href === current.href;
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-2 px-3 py-2.5 text-[0.9375rem] font-medium tracking-[-0.01em]",
                        active ? "text-paper" : "text-paper/75",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 transition-transform duration-300",
                          active ? "scale-100 bg-signal" : "scale-0 bg-signal group-hover:scale-100",
                        )}
                      />
                      {/* Label rolls up to a signal-yellow copy. */}
                      <span className="relative block overflow-hidden">
                        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
                          {item.label}
                        </span>
                        <span aria-hidden className="absolute inset-0 block translate-y-full text-signal transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
                          {item.label}
                        </span>
                      </span>
                      {/* Underline draws from the centre. */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 bottom-1 h-px origin-center bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)]",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden xl:block">
            <ActionLink href="/contact" variant="primary">
              Let&apos;s talk
            </ActionLink>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="label relative z-10 flex h-11 items-center gap-3 border border-paper/20 px-4 text-paper transition-colors hover:border-signal lg:hidden"
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
