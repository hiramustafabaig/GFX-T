/**
 * Portfolio exhibition data.
 *
 * Intentionally EMPTY: no work is invented. When the client supplies files:
 *   1. Put originals in `assets-src/portfolio/<slug>/` (not committed if large),
 *   2. Run `npm run images` to write optimised versions to `public/portfolio/<slug>/`,
 *   3. Add an entry below. Components adapt to the aspect ratio of each piece.
 */

export type PortfolioCategory = "social" | "campaign" | "branding" | "print";

export type PortfolioMedia = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  /** Must match a client slug from `clients.ts` when the work is for a listed client. */
  clientSlug?: string;
  clientName: string;
  category: PortfolioCategory;
  services: string[];
  cover: PortfolioMedia;
  media: PortfolioMedia[];
};

export const portfolioCategories: { id: PortfolioCategory; label: string }[] = [
  { id: "social", label: "Social Media" },
  { id: "campaign", label: "Campaigns" },
  { id: "branding", label: "Branding" },
  { id: "print", label: "Print" },
];

export const portfolioIntro =
  "Showcase of past creative work - social media posts, campaign ads, and branding visuals - along with client brand/project logos.";

export const portfolio: PortfolioProject[] = [];
