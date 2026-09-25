"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { portfolio, portfolioCategories, portfolioNote, type PortfolioCategory, type PortfolioProject } from "@/data/portfolio";
import { mailto } from "@/lib/site";
import { Flip, gsap, motion, useGSAP, registerGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/device";
import { FilterChips, type FilterOption } from "@/components/ui/FilterChips";
import { ActionLink } from "@/components/buttons/ActionLink";
import { SelectionBox } from "@/components/ui/SelectionBox";
import { ExhibitionPending } from "./ExhibitionPending";
import { ProjectViewer } from "./ProjectViewer";

registerGsap();

type Filter = PortfolioCategory | "all";

/**
 * PORTFOLIO — an exhibition wall. Pieces hang in a tight grid sized close to their native
 * resolution (the current files are preview crops), re-flow with FLIP when filtered, and open
 * in the full-screen viewer. With no data it renders the pending exhibition instead.
 */
export function PortfolioExhibition({ projects = portfolio }: { projects?: PortfolioProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLOListElement>(null);
  const flipState = useRef<Flip.FlipState>(null);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const choose = (next: Filter) => {
    if (next === filter) return;
    if (!reduced && gridRef.current) flipState.current = Flip.getState(gridRef.current.children);
    setFilter(next);
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !gridRef.current) return;
      flipState.current = null;
      Flip.from(state, {
        targets: gridRef.current.children,
        duration: motion.duration.slow,
        ease: motion.ease.inOut,
        absolute: true,
        stagger: 0.01,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: motion.duration.base, delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: motion.duration.fast }),
      });
    },
    { dependencies: [filter] },
  );

  if (projects.length === 0) return <ExhibitionPending />;

  // Only categories that actually hold work are offered as filters.
  const options: FilterOption<Filter>[] = [
    { id: "all", label: "All", count: projects.length },
    ...portfolioCategories
      .map((c) => ({ id: c.id as Filter, label: c.label, count: projects.filter((p) => p.category === c.id).length }))
      .filter((o) => o.count > 0),
  ];

  return (
    <div className="container-page">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <FilterChips label="Filter work by category" options={options} value={filter} onChange={choose} />
        <p className="label text-ink-400" aria-live="polite">
          Showing <span className="text-paper">{String(visible.length).padStart(2, "0")}</span> pieces
        </p>
      </div>

      <ol ref={gridRef} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {projects.map((p, i) => {
          const shown = visible.includes(p);
          return (
            <li key={p.slug} data-flip-id={p.slug} hidden={!shown}>
              <PieceTile project={p} number={i + 1} onOpen={() => setOpen(visible.indexOf(p))} />
            </li>
          );
        })}
      </ol>

      <div className="mt-12 flex flex-col gap-6 border border-ink-800 bg-ink-900 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <p className="max-w-md text-paper/80">{portfolioNote}</p>
        <ActionLink href={mailto("Portfolio request")} variant="primary">
          Request the complete portfolio
        </ActionLink>
      </div>

      <ProjectViewer projects={visible} index={open} onChange={setOpen} />
    </div>
  );
}

function PieceTile({ project, number, onOpen }: { project: PortfolioProject; number: number; onOpen: () => void }) {
  const { cover } = project;
  const category = portfolioCategories.find((c) => c.id === project.category)?.label;
  const identity = project.category === "branding";
  return (
    <button type="button" onClick={onOpen} data-cursor="view" className="group relative block w-full text-left">
      <span className={identity ? "relative block aspect-square overflow-hidden bg-white" : "relative block aspect-square overflow-hidden bg-ink-850"}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={
            identity
              ? "object-contain p-[8%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              : "object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          }
        />
      </span>
      <SelectionBox visible={false} className="inset-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="mt-3 flex items-baseline justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-paper transition-colors group-hover:text-signal">
            {project.clientName ?? project.title}
          </span>
          {/* Second line only when it adds something: a named client's work type, or "brand identity". */}
          {(project.clientName || identity) && (
            <span className="label mt-0.5 block text-ink-400">{identity ? "Brand identity" : category}</span>
          )}
        </span>
        <span className="label text-ink-400">{String(number).padStart(2, "0")}</span>
      </span>
    </button>
  );
}
