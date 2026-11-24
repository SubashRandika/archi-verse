# Archiverse

A personal learning platform for software architecture and system design, built around
interactive, guided **3D isometric** visualizations.

> Status: **Phase 1 — project foundation.** See [`docs/phase-0-plan.md`](docs/phase-0-plan.md) for
> the approved roadmap.

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

| Script              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Start the dev server (Turbopack)                             |
| `npm run build`     | Static production build into `out/`                          |
| `npm run preview`   | Serve the static build on http://localhost:3000              |
| `npm run typecheck` | TypeScript type checking                                     |
| `npm run lint`      | ESLint, including architecture dependency rules              |
| `npm run format`    | Format with Prettier (`format:check` to verify only)         |
| `npm test`          | Unit & component tests (Vitest); `test:watch` for watch mode |
| `npm run test:e2e`  | Build, then run Playwright end-to-end tests                  |
| `npm run check`     | typecheck + lint + format check + unit tests                 |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, dependency rules, state tiers, budgets
- [Conventions](docs/CONVENTIONS.md) — code, testing, dependency and git conventions
- [Architecture Decision Records](docs/adr/README.md)
- [Phase 0 plan](docs/phase-0-plan.md) — approved scope and data model
