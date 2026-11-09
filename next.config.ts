import type { NextConfig } from "next";

// GH_PAGES=1 produces a static export served at https://emroze.dev/fortress-group (GitHub Pages).
// The default build (Vercel) keeps the server runtime for /api/lead.
const ghPages = process.env.GH_PAGES === "1";

const nextConfig: NextConfig = {
  // Partial prerendering is not available in export mode, so these are on for Vercel only.
  cacheComponents: !ghPages,
  partialPrefetching: !ghPages,
  ...(ghPages
    ? { output: "export" as const, basePath: "/fortress-group", trailingSlash: true, images: { loader: "custom" as const, loaderFile: "./src/lib/imageLoader.ts" } }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
