import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback, original format otherwise. The optimizer
    // never upscales: a source smaller than the requested width is served at
    // its own size, so layouts are sized to what each photo can hold.
    formats: ["image/avif", "image/webp"],
    // 90 for photography (portfolio images must stay sharp), 75 for the rest.
    qualities: [75, 90],
    localPatterns: [{ pathname: "/assets/**", search: "" }],
  },
};

export default nextConfig;
