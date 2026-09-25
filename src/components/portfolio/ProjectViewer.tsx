"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { portfolioCategories, type PortfolioProject } from "@/data/portfolio";
import { useLenis } from "@/components/providers/SmoothScroll";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { gsap, motion, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/device";

type Props = {
  projects: PortfolioProject[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Full-screen project viewer. Media scroll natively inside the dialog (Lenis is paused);
 * Escape closes, arrow keys step between projects, focus is trapped and restored on close.
 */
export function ProjectViewer({ projects, index, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const open = index !== null;
  const project = open ? projects[index] : null;

  const close = () => onChange(null);
  useFocusTrap(ref, open, close);

  // Open/close: pause page scrolling, move focus in, and hand it back to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lenis?.stop();
    ref.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      lenis?.start();
      opener?.focus?.();
    };
  }, [open, lenis]);

  // Each project starts at the top of its media.
  useEffect(() => scrollRef.current?.scrollTo(0, 0), [index]);

  const step = (dir: 1 | -1) => onChange(((index ?? 0) + dir + projects.length) % projects.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onChange(((index ?? 0) + 1) % projects.length);
      if (e.key === "ArrowLeft") onChange(((index ?? 0) - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, onChange, projects.length]);

  useGSAP(
    () => {
      if (!open || reduced) return;
      gsap.fromTo(ref.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: motion.duration.slow, ease: motion.ease.inOut });
    },
    { dependencies: [open], scope: ref },
  );

  if (!project) return null;
  const category = portfolioCategories.find((c) => c.id === project.category)?.label;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      className="fixed inset-0 z-[var(--z-menu)] flex flex-col bg-ink-950"
    >
      <header className="container-page flex min-h-[var(--header-h)] items-center justify-between gap-6 border-b border-ink-800 py-3">
        <div className="min-w-0">
          <p className="label text-ink-400">
            <span className="text-signal">{String(index! + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")} — {category}
          </p>
          <h2 id="viewer-title" className="truncate font-display text-lead font-semibold uppercase">
            {project.title}
          </h2>
        </div>
        <button data-close type="button" onClick={close} className="label flex h-11 items-center gap-3 border border-ink-700 px-4 hover:border-paper">
          Close <span aria-hidden>✕</span>
        </button>
      </header>

      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
        <div className="container-page grid gap-10 py-10 lg:grid-cols-12">
          <dl className="label grid h-fit gap-5 text-ink-400 lg:sticky lg:top-10 lg:col-span-3">
            {project.clientName && (
              <div>
                <dt>Client</dt>
                <dd className="mt-1 text-paper">{project.clientName}</dd>
              </div>
            )}
            <div>
              <dt>Category</dt>
              <dd className="mt-1 text-paper">{category}</dd>
            </div>
            {project.services.length > 0 && (
              <div>
                <dt>Services</dt>
                <dd className="mt-1 text-paper">{project.services.join(", ")}</dd>
              </div>
            )}
          </dl>
          <div className="space-y-6 lg:col-span-9">
            {project.media.map((m, i) => (
              <Image
                key={`${m.src}-${i}`}
                src={m.src}
                width={m.width}
                height={m.height}
                alt={m.alt}
                sizes="(max-width: 1024px) 100vw, 70vw"
                // Never enlarge a piece far beyond its native size — preview files stay crisp.
                style={{ maxWidth: Math.min(m.width * 2, 1600) }}
                className="mx-auto h-auto w-full"
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="container-page flex h-16 items-center justify-between border-t border-ink-800">
        <button type="button" className="label hover:text-signal" onClick={() => step(-1)}>
          ← Previous
        </button>
        <button type="button" className="label hover:text-signal" onClick={() => step(1)}>
          Next →
        </button>
      </footer>
    </div>
  );
}
