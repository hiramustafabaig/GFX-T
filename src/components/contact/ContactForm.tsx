"use client";

import { useId, useState, type FormEvent } from "react";
import { services } from "@/data/services";
import { contact } from "@/lib/site";
import { cn } from "@/lib/cn";

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

  const field = "peer w-full border-b border-ink-700 bg-transparent pb-3 pt-7 text-lead text-paper outline-none transition-colors placeholder:text-transparent focus:border-signal";
  const label = "label pointer-events-none absolute left-0 top-0 text-ink-400 transition-colors peer-focus:text-signal";

  return (
    <form onSubmit={send} className="grid gap-8 md:grid-cols-2" aria-describedby={`${id}-note`}>
      <div className="relative">
        <input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Name" className={field} />
        <label htmlFor={`${id}-name`} className={label}>Name *</label>
      </div>
      <div className="relative">
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        <label htmlFor={`${id}-email`} className={label}>Email *</label>
      </div>
      <div className="relative">
        <input id={`${id}-company`} name="company" autoComplete="organization" placeholder="Company" className={field} />
        <label htmlFor={`${id}-company`} className={label}>Company / brand</label>
      </div>
      <div className="relative">
        <select id={`${id}-service`} name="service" defaultValue="" className={cn(field, "appearance-none [&>option]:bg-ink-900")}>
          <option value="">Not sure yet</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
        </select>
        <label htmlFor={`${id}-service`} className={label}>Service</label>
        <span aria-hidden className="pointer-events-none absolute bottom-4 right-0 text-ink-400">↓</span>
      </div>
      <div className="relative md:col-span-2">
        <textarea id={`${id}-message`} name="message" required rows={4} placeholder="Message" className={cn(field, "resize-y")} />
        <label htmlFor={`${id}-message`} className={label}>Tell us about your project *</label>
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p id={`${id}-note`} className="label text-ink-400" aria-live="polite">
          {sent ? "Your email app should now be open with the message ready to send." : `Opens your email app, addressed to ${contact.email}.`}
        </p>
        <button type="submit" className="group label inline-flex h-12 items-center gap-4 bg-signal pl-5 pr-4 text-ink-950 transition-colors hover:bg-paper">
          Compose email
          <span aria-hidden className="size-1.5 bg-current" />
        </button>
      </div>
    </form>
  );
}
