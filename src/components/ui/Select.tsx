"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string };

type Props = {
  /** id of the visible <label>; the trigger is labelled by it. */
  labelId: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  className?: string;
};

/**
 * Custom select (listbox pattern). Native <select> popups are drawn by the OS, so their
 * highlight colour can't follow the brand; this one highlights in signal yellow. Submits via a
 * hidden input so it works in a plain <form>. Keyboard: arrows, Home/End, Enter/Space, Escape.
 */
export function Select({ labelId, name, options, defaultValue = "", className }: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === defaultValue)));
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option in view inside the list.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const choose = (i: number) => {
    setValue(options[i].value);
    setActive(i);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((a) => (e.key === "ArrowDown" ? Math.min(last, a + 1) : Math.max(0, a - 1)));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? 0 : last);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else setOpen(true);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab" && open) {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className={cn(
          "mt-2 flex w-full items-center justify-between border bg-ink-950 px-4 py-3 text-left text-base text-paper outline-none transition-colors",
          open ? "border-signal" : "border-ink-700 hover:border-ink-500 focus-visible:border-signal",
        )}
      >
        <span className={value ? "text-paper" : "text-paper/80"}>{selected.label}</span>
        <span aria-hidden className={cn("text-ink-400 transition-transform duration-300", open && "rotate-180 text-signal")}>
          ↓
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto border border-ink-700 bg-ink-900 py-1 shadow-[0_18px_40px_rgb(0_0_0/0.5)]"
          data-lenis-prevent
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value || "none"}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-[0.9375rem] transition-colors",
                  i === active ? "bg-signal text-ink-950" : isSelected ? "text-signal" : "text-paper/90",
                )}
              >
                {o.label}
                {isSelected && <span aria-hidden>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
