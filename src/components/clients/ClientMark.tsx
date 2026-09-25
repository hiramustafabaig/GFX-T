import Image from "next/image";
import type { Client } from "@/data/clients";
import { cn } from "@/lib/cn";

type Props = {
  client: Client;
  /** Surface the mark sits on. */
  surface?: "ink" | "paper";
  className?: string;
  /** Rendered height of a logo image, in px. */
  logoHeight?: number;
  /** Let long names wrap (grid tiles); marquees keep them on one line. */
  wrap?: boolean;
};

/**
 * A client's mark. Uses the supplied logo file when `client.logo` is set; until then the name
 * is set as a typographic wordmark — never a fabricated logo.
 */
export function ClientMark({ client, surface = "ink", className, logoHeight = 40, wrap = false }: Props) {
  const { logo } = client;
  if (logo) {
    // Single-colour logos are shown monochrome so the wall reads as one system.
    const invert = (surface === "ink" && logo.tone === "dark") || (surface === "paper" && logo.tone === "light");
    return (
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={client.name}
        sizes="240px"
        style={{ height: logoHeight, width: "auto" }}
        className={cn("max-w-full object-contain", invert && "invert", className)}
      />
    );
  }
  return (
    <span className={cn("font-display font-semibold uppercase tracking-[-0.01em]", wrap ? "text-balance" : "whitespace-nowrap", className)}>
      {client.name}
    </span>
  );
}
