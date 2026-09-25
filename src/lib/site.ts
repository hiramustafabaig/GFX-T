/**
 * Site-wide configuration. Content source of truth: "GFX-T_Website Content" Word document.
 *
 * NOTE: The production domain is not confirmed yet. Set NEXT_PUBLIC_SITE_URL once it is;
 * the placeholder below uses the reserved `.example` TLD so it can never resolve to a real site.
 */
export const site = {
  name: "GFX-T",
  legalName: "GFX-T Creative Agency",
  descriptor: "Creative Agency",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gfx-t.example",
  founded: 2020,
  tagline:
    "At GFX-T, we craft unforgettable experiences, blending creativity, strategy, and innovation to elevate brands and create lasting impressions.",
  heroHeading: ["We Create.", "We Strategize.", "We Elevate."] as const,
  locale: "en_PK",
} as const;

export type Phone = { display: string; href: string; label?: string };

export const contact = {
  email: "info@gfxt.com",
  phones: [
    { display: "+92 321 4006247", href: "tel:+923214006247" },
    { display: "+92 324 0321027", href: "tel:+923240321027" },
    { display: "+92 300 9453725", href: "tel:+923009453725", label: "CEO direct line" },
  ] satisfies Phone[],
  /** The number the Word doc names for "book a call directly with our CEO". */
  ceoPhone: { display: "+92 300 9453725", href: "tel:+923009453725" } satisfies Phone,
  address: {
    street: "677-B, Faisal Town",
    city: "Lahore",
    country: "Pakistan",
    countryCode: "PK",
    full: "677-B, Faisal Town, Lahore, Pakistan",
  },
} as const;

export const mailto = (subject?: string) =>
  `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
