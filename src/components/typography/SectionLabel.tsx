import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  index?: string;
  children: ReactNode;
  tone?: "ink" | "paper";
  className?: string;
  /** Render as a heading when the label is the section's only title. */
  as?: "p" | "h2";
  id?: string;
};

/** Chapter marker: "02 ── About Us". Tone refers to the surface it sits on. */
export function SectionLabel({ index, children, tone = "ink", className, as: Tag = "p", id }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "label flex items-center gap-3",
        tone === "ink" ? "text-ink-300" : "text-ink-700",
        className,
      )}
    >
      {index && <span className={tone === "ink" ? "text-paper" : "text-ink-950"}>{index}</span>}
      <span aria-hidden className={cn("h-px w-10", tone === "ink" ? "bg-ink-700" : "bg-ink-300")} />
      {children}
    </Tag>
  );
}
