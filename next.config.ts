import type { NextConfig } from "next";

/**
 * Archiverse is a fully static, client-heavy learning app (see docs/adr/0001).
 * - `output: "export"` produces a static site in `out/` that can be hosted anywhere.
 *   This forbids server-only features (route handlers, server actions, cookies, rewrites).
 * - `cacheComponents` / `partialPrefetching` (create-next-app defaults in Next 16.4) are
 *   intentionally NOT enabled: Partial Prerendering cannot run in export mode, and the app
 *   has no server data to cache.
 * - `typedRoutes` gives compile-time checking of `<Link href>` values.
 */
const nextConfig: NextConfig = {
  output: "export",
  typedRoutes: true,
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
