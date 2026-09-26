import { contact } from "@/lib/site";
import { cn } from "@/lib/cn";

type Network = (typeof contact.social)[number]["name"];

/** Simple line icons, drawn to match the site's hairline style. */
const ICONS: Record<Network, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10.5v6M8 7.6v.1M11.5 16.5v-6M11.5 13c0-1.7 1-2.6 2.3-2.6s2.2.9 2.2 2.6v3.5" />
    </>
  ),
  Facebook: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M14.6 7.8h-1.3c-1.2 0-1.9.8-1.9 2v10.7M9.6 12.6h4.8" />
    </>
  ),
};

type Props = { className?: string; size?: "md" | "lg" };

/**
 * Instagram / LinkedIn / Facebook. Profiles without a URL yet (see `contact.social`) render as
 * non-link icons, so there are never dead links; they become links as soon as a URL is set.
 */
export function SocialLinks({ className, size = "md" }: Props) {
  const box = size === "lg" ? "size-12" : "size-11";
  return (
    <ul className={cn("flex items-center gap-2", className)} aria-label="Social media">
      {contact.social.map((s) => {
        const icon = (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {ICONS[s.name]}
          </svg>
        );
        const cls = cn(
          "grid place-items-center border border-ink-700 text-paper transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-ink-950",
          box,
        );
        return (
          <li key={s.name}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`GFX-T on ${s.name}`} className={cls}>
                {icon}
              </a>
            ) : (
              <span role="img" aria-label={`${s.name} (coming soon)`} title={`${s.name} — coming soon`} className={cls}>
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
