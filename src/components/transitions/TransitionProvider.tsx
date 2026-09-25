"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, motion, ScrollTrigger } from "@/lib/motion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { useReducedMotion } from "@/lib/device";
import { findNavItem } from "@/data/navigation";

type TransitionApi = { navigate: (href: string) => void };
const TransitionContext = createContext<TransitionApi | null>(null);

export const usePageTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
};

/**
 * Page transition: a signal-yellow blade followed by an ink panel sweep across the screen
 * along the logo's slash angle, covering the page. The route swaps underneath, then the
 * panel continues off-screen to reveal it. The destination chapter label is shown on the ink
 * panel so the transition doubles as wayfinding.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const bladeRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current || href === pathname) return;

      if (reduced) {
        router.push(href);
        return;
      }

      busy.current = true;
      pending.current = href;
      lenis?.stop();

      const item = findNavItem(href);
      if (labelRef.current) labelRef.current.textContent = `${item.index} — ${item.label}`;

      gsap
        .timeline({ defaults: { ease: motion.ease.inOut } })
        .set(rootRef.current, { visibility: "visible" })
        .fromTo(bladeRef.current, { xPercent: -130 }, { xPercent: 0, duration: 0.55 }, 0)
        .fromTo(panelRef.current, { xPercent: -130 }, { xPercent: 0, duration: 0.6 }, 0.07)
        .fromTo(labelRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: motion.ease.out }, 0.4)
        .add(() => router.push(href, { scroll: false }));
    },
    [lenis, pathname, reduced, router],
  );

  // Reveal once the new route has committed.
  useEffect(() => {
    if (!pending.current || pending.current !== pathname) return;
    pending.current = null;

    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.start();
    ScrollTrigger.refresh();

    gsap
      .timeline({
        defaults: { ease: motion.ease.inOut },
        delay: 0.08,
        onComplete: () => {
          gsap.set(rootRef.current, { visibility: "hidden" });
          busy.current = false;
        },
      })
      .to(labelRef.current, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0)
      .to(panelRef.current, { xPercent: 130, duration: 0.65 }, 0.05)
      .to(bladeRef.current, { xPercent: 130, duration: 0.6 }, 0.12);
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={rootRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-transition)] overflow-hidden"
        style={{ visibility: "hidden" }}
      >
        {/* Skewed so the leading edge follows the logo's slash. Oversized to cover corners. */}
        <div
          ref={bladeRef}
          className="absolute -inset-y-[20%] -left-[40%] w-[180%] bg-signal"
          style={{ transform: "translateX(-130%)", clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}
        />
        <div
          ref={panelRef}
          className="absolute -inset-y-[20%] -left-[40%] w-[180%] bg-ink-950"
          style={{ transform: "translateX(-130%)", clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}
        />
        <p
          ref={labelRef}
          className="label absolute inset-0 m-auto h-fit w-fit text-paper opacity-0"
        />
      </div>
    </TransitionContext.Provider>
  );
}
