import { navigation } from "@/data/navigation";
import { contact, site } from "@/lib/site";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Logo } from "@/components/brand/Logo";
import { BackToTop, StudioTime } from "./FooterMeta";

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 pb-8 pt-16 md:pt-24">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="paper" variant="full" className="w-[180px] md:w-[220px]" />
          <p className="mt-6 max-w-sm text-ink-300">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-4 text-ink-400">Index</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="text-paper/90 transition-colors hover:text-signal">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic md:col-span-4">
          <p className="label mb-4 text-ink-400">Contact</p>
          <a href={`mailto:${contact.email}`} className="block text-paper hover:text-signal">
            {contact.email}
          </a>
          <ul className="mt-3 space-y-1">
            {contact.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="text-ink-300 hover:text-paper">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-ink-300">{contact.address.full}</p>
        </address>
      </div>

      <div className="container-page label mt-16 flex flex-col justify-between gap-3 border-t border-ink-800 pt-6 text-ink-500 md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <StudioTime />
          <span>Since {site.founded}</span>
          <BackToTop />
        </p>
      </div>
    </footer>
  );
}
