# Architecture

Archiverse is a **static, client-heavy** Next.js application. There is no backend: all learning
content ships with the build, and learner progress lives in the browser (`localStorage`).

Decisions are recorded as ADRs in [`docs/adr/`](./adr/). The approved product plan is in
[`docs/phase-0-plan.md`](./phase-0-plan.md); the visual design system is ADR-0007.

## Layers

```text
 app/        Routes only. Thin: reads params, composes features. (Next.js App Router)
   │
 features/   User-facing capabilities: explorer, studio, inspector, playback, progress.
   │         Owns UI state and connects content to the engine.
   ├──────────────┐
 engine/      content/
   │            │   engine/  — domain-agnostic 3D scene + timeline engine (R3F, GSAP).
   │            │   content/ — pure learning data (catalog, modules, steps, component docs).
   └──────┬─────┘
        lib/     Framework-free utilities, Zod schemas, storage helpers.
 components/ui/  shadcn/ui primitives (generated, lightly customised).
```

### Dependency rules (enforced by ESLint `no-restricted-imports`)

| Layer       | May import                                   | Must not import                             |
| ----------- | -------------------------------------------- | ------------------------------------------- |
| `lib/`      | npm packages                                 | anything else in `src/`                     |
| `content/`  | `lib/`                                       | React, three.js, `engine/`, `features/`, UI |
| `engine/`   | `lib/`, `components/ui/`                     | `content/`, `features/`, `app/`             |
| `features/` | `engine/`, `content/`, `lib/`, `components/` | `app/`                                      |
| `app/`      | everything                                   | —                                           |

Why: learning content must stay reusable and testable without rendering; the engine must stay
reusable across concepts without knowing about any specific concept.

## Module map

Folders are created when the phase that needs them starts (no empty abstractions).
Status: ✅ exists · ⏳ planned.

| Path                        | Responsibility                                                   | Phase   |
| --------------------------- | ---------------------------------------------------------------- | ------- |
| `src/app/`                  | Routes: `/` (resume), `/learn` layout, `/learn/[conceptSlug]`    | ✅ 2–3  |
| `src/components/`           | App-wide UI helpers (`IconButton`) + `ui/` shadcn primitives     | ✅ 2    |
| `src/features/shell/`       | Responsive frame, resizable/collapsible panels, `useShell()`     | ✅ 2    |
| `src/features/explorer/`    | Category/concept navigation, search, progress indicators         | ✅ 2–3  |
| `src/features/studio/`      | Studio composition: header, drafting plate, (3D) scene           | ✅ 2, 5 |
| `src/features/inspector/`   | Step explanation, component details, explanation blocks          | ✅ 2, 5 |
| `src/features/playback/`    | Playback dock (title block)                                      | ✅ 2, 4 |
| `src/features/progress/`    | Persisted progress store, selectors, completion, hydration       | ✅ 3    |
| `src/features/preferences/` | Persisted preferences: level, speed, panel layouts, last concept | ✅ 3    |
| `src/engine/scene/`         | Canvas, lights, isometric camera rig, selection/highlight        | ⏳ 4    |
| `src/engine/primitives/`    | Reusable 3D parts: device shells, connections, packets           | ⏳ 4    |
| `src/engine/timeline/`      | Beats → GSAP timeline compiler, playback controller              | ⏳ 4    |
| `src/content/catalog/`      | 16 categories, 291 concepts (one file per category)              | ✅ 2–3  |
| `src/content/modules/<id>/` | One learning module: steps, components, scenarios, layout        | ⏳ 5    |
| `src/lib/`                  | Utilities, Zod schemas, storage                                  | ✅ 1+   |
| `src/test/`                 | Test helpers (`renderInStudio`)                                  | ✅ 2    |

### Placeholders

Phase 2 uses realistic placeholder content so the shell can be judged with real copy. Every
placeholder lives in a `placeholder.ts` / `placeholder-*.tsx` file (or is marked `PLACEHOLDER` in
its doc comment) and names the phase that replaces it:

- `features/studio/placeholder.ts`, `studio-preview-context.tsx`, `placeholder-scene.tsx` → Phases 4–5
- `features/inspector/placeholder.ts` → Phase 5
- ~~`features/explorer/placeholder.ts`~~ → replaced by the real catalog in Phase 3

## Concept catalog

- One file per category in `src/content/catalog/categories/`, listing concepts in roadmap order.
- A concept is **defined once**, in the first category where it appears; later categories
  reference it with `ref("id")`. 304 roadmap entries resolve to 291 unique concepts.
- `types.ts` holds Zod-free types (shipped to the browser); `schema.ts` holds the matching Zod
  schemas, used only by `catalog.test.ts`, so Zod's full build stays out of the bundle.
- Routes: every concept gets a static page at `/learn/<id>` (`generateStaticParams`).

## Persistence

- Stores use Zustand `persist` with `skipHydration`. `<PersistedStateSync />` (root layout) loads
  saved state after hydration and re-syncs when another tab changes it.
- **Never write before loading.** Persist writes on every change, so anything that runs at
  startup (saving the panel layout, remembering the last concept) waits for `useHasHydrated()`.
- Stored data is validated with `zod/mini` on load: progress record by record, preferences field
  by field. Invalid data falls back to defaults with a console warning.
- Keys: `archiverse:progress` (v1), `archiverse:preferences` (v1).

## State tiers

| Tier      | Lives in                                       | Examples                                    |
| --------- | ---------------------------------------------- | ------------------------------------------- |
| Persisted | Zustand + `persist` (versioned, Zod-validated) | progress, explanation level, playback speed |
| Session   | Zustand store scoped to one studio instance    | mode, step, scenario, selection, playing    |
| URL       | search params                                  | `?step=5&scenario=timeout` (shareable)      |
| Per-frame | three.js objects mutated via refs / GSAP       | packet positions, glow intensity            |

Per-frame values never go through React state.

## Rendering

- Every route is statically generated (`output: "export"`).
- The 3D canvas is a client-only, lazily imported island; three.js must never enter the
  explorer's bundle.
- `cacheComponents` is disabled because it is incompatible with static export (ADR-0001), so
  routes unmount normally on navigation. The studio must still dispose WebGL resources on
  unmount and pause rendering when the tab is hidden (Phase 4).

## Performance budgets

**Measured in Phase 3** (static export, gzip, first-load JavaScript):

| Page                       | Measured | Notes                                                   |
| -------------------------- | -------- | ------------------------------------------------------- |
| `/` (redirect only)        | 212 KB   | ≈ framework baseline: React 19 + Next.js 16 runtime     |
| `/learn/<concept>` (shell) | 343 KB   | + Base UI/floating-ui, panels, catalog (~24 KB), stores |

The original 200 KB explorer budget was set before the framework baseline could be measured and
is not reachable with this stack (the baseline alone is ~190 KB). **Revised after Phase 3
(approved):** 350 KB for the shell. Lazy-loading menus, dialogs and preview cards (est. 30–50 KB)
is scheduled for Phase 6.

| Metric                                      | Budget                                          |
| ------------------------------------------- | ----------------------------------------------- |
| Shell / explorer JS (gzip, first load)      | ≤ 350 KB (measured 343 KB in Phase 3)           |
| Studio route JS incl. three.js (gzip)       | ≤ 450 KB, 3D chunk lazy-loaded                  |
| Frame rate, integrated GPU (Iris Xe), 1080p | 60 fps while animating                          |
| Idle GPU usage                              | Near zero — render on demand when paused        |
| LCP (desktop, local)                        | ≤ 1.5 s                                         |
| Accessibility                               | WCAG 2.2 AA for all 2D UI; Lighthouse a11y ≥ 95 |
