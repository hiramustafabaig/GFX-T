"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { portfolio, portfolioCategories, type PortfolioCategory, type PortfolioProject } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP, registerGsap } from "@/lib/motion";
import { useMediaQuery, useReducedMotion } from "@/lib/device";
import { FilterChips, type FilterOption } from "@/components/ui/FilterChips";
import { ExhibitionPending } from "./ExhibitionPending";
import { ProjectViewer } from "./ProjectViewer";

registerGsap();

type Filter = PortfolioCategory | "all";

/**
 * PORTFOLIO — a digital exhibition. On large screens the work hangs in one pinned horizontal
 * gallery that the vertical scroll walks through; on small screens it is a vertical sequence.
 * Every panel opens the full-screen viewer. With no data it renders the pending exhibition.
 */
export function PortfolioExhibition({ projects = portfolio }: { projects?: PortfolioProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const horizontal = wide && !reduced;

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!horizontal || !track || !sectionRef.current) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
    },
    { dependencies: [horizontal, filter], revertOnUpdate: true },
  );

  if (projects.length === 0) return <ExhibitionPending />;

  const options: FilterOption<Filter>[] = [
    { id: "all", label: "All", count: projects.length },
    ...portfolioCategories.map((c) => ({ id: c.id, label: c.label, count: projects.filter((p) => p.category === c.id).length })),
  ];

  return (
    <>
      <div className="container-page">
        <FilterChips label="Filter work by category" options={options} value={filter} onChange={setFilter} />
      </div>

      <div ref={sectionRef} className="lg:flex lg:h-svh lg:items-center lg:overflow-hidden">
        <ol
          ref={trackRef}
          className="container-page mt-10 flex flex-col gap-14 lg:mt-0 lg:w-max lg:max-w-none lg:flex-row lg:items-end lg:gap-[6vw] lg:pr-[20vw]"
        >
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectPanel project={p} number={projects.indexOf(p) + 1} onOpen={() => setOpen(visible.indexOf(p))} />
            </li>
          ))}
        </ol>
      </div>

      <ProjectViewer projects={visible} index={open} onChange={setOpen} />
    </>
  );
}

function ProjectPanel({ project, number, onOpen }: { project: PortfolioProject; number: number; onOpen: () => void }) {
  const { cover } = project;
  const category = portfolioCategories.find((c) => c.id === project.category)?.label;
  return (
    <button type="button" onClick={onOpen} data-cursor="view" className="group block w-full text-left lg:w-auto">
      {/* Height is fixed on large screens; width follows the piece's own aspect ratio. */}
      <span
        className="relative block w-full overflow-hidden bg-ink-850 lg:h-[min(62svh,44rem)] lg:w-auto"
        style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </span>
      <span className="mt-4 flex items-baseline justify-between gap-6 border-t border-ink-800 pt-3">
        <span className="min-w-0">
          <span className="block truncate font-display text-lead font-semibold uppercase transition-colors group-hover:text-signal">
            {project.title}
          </span>
          <span className="label mt-1 block text-ink-400">
            {project.clientName} — {category}
          </span>
        </span>
        <span className="label text-ink-500">{String(number).padStart(2, "0")}</span>
      </span>
    </button>
  );
}
