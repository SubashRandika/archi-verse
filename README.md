# Archiverse

A personal learning platform for software architecture and system design, built around
interactive, guided **3D isometric** visualizations.

> Status: **Phase 4 — 3D visualization foundation.** All 291 concepts are browsable. API Gateway
> has an interactive isometric 3D scene with three demonstration steps; its full 12-step module
> follows in Phase 5. See [`docs/phase-0-plan.md`](docs/phase-0-plan.md) for the approved roadmap.

## Requirements

- Node.js 22+ (`.nvmrc`)
- npm 10+

## Getting started

```bash
npm install
npx playwright install chromium   # once, for end-to-end tests
npm run dev                        # http://localhost:3000
```

## Scripts

| Script                  | What it does                                                 |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Start the dev server (Turbopack)                             |
| `npm run build`         | Static production build into `out/`                          |
| `npm run preview`       | Serve the static build on http://localhost:3000              |
| `npm run typecheck`     | TypeScript type checking                                     |
| `npm run lint`          | ESLint, including architecture dependency rules              |
| `npm run format`        | Format with Prettier (`format:check` to verify only)         |
| `npm test`              | Unit & component tests (Vitest); `test:watch` for watch mode |
| `npm run test:e2e`      | Build, then run Playwright end-to-end tests                  |
| `npm run check:bundles` | Check JS budgets of the last build (`out/`)                  |
| `npm run check`         | typecheck + lint + format check + unit tests                 |

Append `?perf` to a module URL (e.g. `/learn/api-gateway?perf`) to show frame rate and draw calls.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, dependency rules, state tiers, budgets
- [Conventions](docs/CONVENTIONS.md) — code, testing, dependency and git conventions
- [Architecture Decision Records](docs/adr/README.md)
- [Phase 0 plan](docs/phase-0-plan.md) — approved scope and data model
