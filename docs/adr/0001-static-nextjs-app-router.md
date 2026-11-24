# ADR-0001: Static Next.js (App Router) application

- **Status:** Accepted (Phase 0, 2026-11-24)

## Context

Archiverse is a personal learning tool with no backend: content ships with the code and progress is
stored in the browser. It needs file-based routing for ~300 concept pages, fast first loads, and a
heavy client-only 3D island.

## Decision

Use **Next.js 16 (App Router)** with `output: "export"`. All routes are generated at build time
(`generateStaticParams`); no route handlers, server actions or cookies. The 3D canvas is a
client-only lazily loaded component.

## Alternatives considered

- **Vite + React Router SPA** — slightly simpler mental model, but loses static HTML per concept,
  built-in font optimisation and per-route code splitting conventions.
- **Next.js with a server** — no current need; can be adopted later by removing `output: "export"`.

## Consequences

- Deployable to any static host. Server-only Next.js features are unavailable (build fails loudly).
- `next/image` default optimisation is unavailable; use static assets or `unoptimized`.
- **`cacheComponents` / `partialPrefetching` are disabled** (Phase 1 finding). Next 16.4's
  create-next-app enables them by default, but the build fails with "PPR cannot be enabled in
  export mode". The app has no server data, so Cache Components offered no benefit. Side effect:
  visited routes unmount normally (no hidden `<Activity>` routes holding a WebGL context).
- Risk: Next.js states both flags become always-on in the next major version. Re-evaluate static
  export compatibility when upgrading to Next 17.
