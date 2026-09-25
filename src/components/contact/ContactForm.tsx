"use client";

import { useId, useState, type FormEvent } from "react";
import { services } from "@/data/services";
import { contact } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Select } from "@/components/ui/Select";

/**
 * Project brief form. There is no mail backend yet, so submitting composes the message in the
 * visitor's own email app (addressed to info@gfxt.com) — stated plainly next to the button.
 * Swap `send` for a Server Action when a mail provider is chosen.
 */
export function ContactForm() {
  const id = useId();
  const [sent, setSent] = useState(false);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `Project enquiry${get("service") ? ` — ${get("service")}` : ""}${get("company") ? ` (${get("company")})` : ""}`;
    const body = [
      get("message"),
      "",
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      ...(get("company") ? [`Company: ${get("company")}`] : []),
      ...(get("service") ? [`Interested in: ${get("service")}`] : []),
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "mt-2 block w-full border border-ink-700 bg-ink-950 px-4 py-3 text-base text-paper outline-none transition-colors placeholder:text-ink-500 hover:border-ink-500 focus:border-signal";
  const label = "label text-ink-300";

  return (
    <form onSubmit={send} className="grid gap-5 md:grid-cols-2" aria-describedby={`${id}-note`}>
      <div>
        <label htmlFor={`${id}-name`} className={label}>
          Name <span className="text-signal">*</span>
        </label>
        <input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Your name" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={label}>
          Email <span className="text-signal">*</span>
        </label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-company`} className={label}>
          Company / brand
        </label>
        <input id={`${id}-company`} name="company" autoComplete="organization" placeholder="Optional" className={field} />
      </div>
      <div>
        <p id={`${id}-service-label`} className={label}>
          Service
        </p>
        <Select
          labelId={`${id}-service-label`}
          name="service"
          options={[{ value: "", label: "Not sure yet" }, ...services.map((s) => ({ value: s.title, label: s.title }))]}
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>
          Tell us about your project <span className="text-signal">*</span>
        </label>
        <textarea id={`${id}-message`} name="message" required rows={5} placeholder="Goals, timeline, anything we should know" className={cn(field, "resize-y")} />
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p id={`${id}-note`} className="text-sm text-ink-400" aria-live="polite">
          {sent ? "Your email app should now be open with the message ready to send." : `Opens your email app, addressed to ${contact.email}.`}
        </p>
        <button
          type="submit"
          className="label inline-flex h-12 items-center justify-center gap-3 bg-signal px-6 font-medium text-ink-950 transition-colors hover:bg-paper"
        >
          Compose email
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
