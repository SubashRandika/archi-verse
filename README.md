# Archiverse

A personal learning platform for software architecture and system design, built around
interactive, guided **3D isometric** visualizations.

> Status: **Phase 7 — one concept at a time.** All 291 concepts are browsable. Four are complete
> interactive modules, with beginner and advanced explanations in English and Sinhala: API
> Gateway (12 steps, 4 scenarios), Circuit Breaker (8 steps, 2 scenarios), Backend for Frontend
> (8 steps, 2 scenarios) and Retry and Exponential Backoff (8 steps, 2 scenarios). New modules start from `npm run new:module` (see
> [Adding a concept](docs/adding-a-concept.md)). The approved roadmap is in
> [`docs/phase-0-plan.md`](docs/phase-0-plan.md).
>
> The app is dark by default, with a light theme (and a System option) in the header's theme
> menu. Each kind of component has its own colour in the 3D scene
> ([ADR-0010](docs/adr/0010-glossy-toy-style-and-light-theme.md)).

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

| Script                     | What it does                                                 |
| -------------------------- | ------------------------------------------------------------ |
| `npm run dev`              | Start the dev server (Turbopack)                             |
| `npm run build`            | Static production build into `out/`                          |
| `npm run new:module`       | Scaffold a learning module for a catalog concept             |
| `npm run docs:module-text` | Write the two-language review copy of module text            |
| `npm run preview`          | Serve the static build on http://localhost:3000              |
| `npm run typecheck`        | TypeScript type checking                                     |
| `npm run lint`             | ESLint, including architecture dependency rules              |
| `npm run format`           | Format with Prettier (`format:check` to verify only)         |
| `npm test`                 | Unit & component tests (Vitest); `test:watch` for watch mode |
| `npm run test:e2e`         | Build, then run Playwright end-to-end tests                  |
| `npm run check:bundles`    | Check JS budgets of the last build (`out/`)                  |
| `npm run check`            | typecheck + lint + format check + unit tests                 |

Append `?perf` to a module URL (e.g. `/learn/api-gateway?perf`) to show frame rate and draw calls.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, dependency rules, state tiers, budgets
- [Conventions](docs/CONVENTIONS.md) — code, testing, dependency and git conventions
- [Architecture Decision Records](docs/adr/README.md)
- [Phase 0 plan](docs/phase-0-plan.md) — approved scope and data model
- [Adding a concept](docs/adding-a-concept.md) — the checklist for a new learning module
- [API Gateway module](docs/modules/api-gateway.md) — objectives and scene notes; its text in
  both languages is in [api-gateway.text.md](docs/modules/api-gateway.text.md)
- [Circuit Breaker module](docs/modules/circuit-breaker.md) — objectives and scene notes; text in
  [circuit-breaker.text.md](docs/modules/circuit-breaker.text.md)
- [Backend for Frontend module](docs/modules/backend-for-frontend.md) — objectives and scene
  notes; text in [backend-for-frontend.text.md](docs/modules/backend-for-frontend.text.md)
- [Retry and Exponential Backoff module](docs/modules/retry-and-exponential-backoff.md) —
  objectives and scene notes; text in
  [retry-and-exponential-backoff.text.md](docs/modules/retry-and-exponential-backoff.text.md)
