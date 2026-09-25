/**
 * Client roster from the Word document, grouped by industry.
 *
 * Adding a logo: drop the file at `public/clients/<category>/<slug>.svg` (SVG preferred,
 * otherwise a transparent PNG/WebP at least 600px wide) and set `logo` on the entry.
 * Entries without a logo render as a typographic wordmark, never a fake image.
 */

export type ClientCategory = "fashion" | "food" | "beauty" | "others";

export type ClientLogo = {
  src: string;
  width: number;
  height: number;
  /** Logos drawn dark-on-light need inverting on dark surfaces. */
  tone?: "dark" | "light" | "color";
};

export type Client = {
  slug: string;
  name: string;
  category: ClientCategory;
  logo?: ClientLogo;
};

export const clientCategories: { id: ClientCategory; label: string }[] = [
  { id: "fashion", label: "Fashion" },
  { id: "food", label: "Food" },
  { id: "beauty", label: "Beauty" },
  { id: "others", label: "Others" },
];

const group = (category: ClientCategory, names: string[]): Client[] =>
  names.map((name) => ({
    name,
    category,
    slug: name
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  }));

export const clients: Client[] = [
  ...group("fashion", ["Lala", "Munib Nawaz", "Javandi", "Al Nasser", "Futbolux", "Divinely Crafted"]),
  ...group("food", ["Baskin Robbins", "Gauchos", "Wild Wings", "Boxpark Pica", "Ricky's", "Meet Me in Paris"]),
  ...group("beauty", ["Bellezza Salon", "Stylo", "Suhaira's Beauty Hub", "Rosmatic"]),
  ...group("others", ["POEPA", "MB Marketing", "Saadi's Enterprises", "Tower 9 Luxury Living", "Fuego Events PR", "GoSaaS Labs"]),
];
