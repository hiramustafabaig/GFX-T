import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No on-screen Next.js badge in development (it sat in the hero's bottom-left corner).
  devIndicators: false,
  images: {
    // AVIF first (smallest), WebP fallback. Portfolio and portraits are served through next/image.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
};

export default nextConfig;
