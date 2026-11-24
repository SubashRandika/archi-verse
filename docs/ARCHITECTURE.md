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

| Path                        | Responsibility                                               | Phase   |
| --------------------------- | ------------------------------------------------------------ | ------- |
| `src/app/`                  | Routes: `/` (studio shell), later `/learn/[conceptSlug]`     | ✅ 2–3  |
| `src/components/`           | App-wide UI helpers (`IconButton`) + `ui/` shadcn primitives | ✅ 2    |
| `src/features/shell/`       | Responsive frame, resizable/collapsible panels, `useShell()` | ✅ 2    |
| `src/features/explorer/`    | Category/concept navigation, search, progress indicators     | ✅ 2–3  |
| `src/features/studio/`      | Studio composition: header, drafting plate, (3D) scene       | ✅ 2, 5 |
| `src/features/inspector/`   | Step explanation, component details, explanation blocks      | ✅ 2, 5 |
| `src/features/playback/`    | Playback dock (title block)                                  | ✅ 2, 4 |
| `src/features/progress/`    | Persisted progress store, selectors, reset                   | ⏳ 3    |
| `src/engine/scene/`         | Canvas, lights, isometric camera rig, selection/highlight    | ⏳ 4    |
| `src/engine/primitives/`    | Reusable 3D parts: device shells, connections, packets       | ⏳ 4    |
| `src/engine/timeline/`      | Beats → GSAP timeline compiler, playback controller          | ⏳ 4    |
| `src/content/catalog/`      | 16 categories (✅ Phase 2) + concept index (⏳ Phase 3)      | ✅ 2–3  |
| `src/content/modules/<id>/` | One learning module: steps, components, scenarios, layout    | ⏳ 5    |
| `src/lib/`                  | Utilities, Zod schemas, storage                              | ✅ 1+   |
| `src/test/`                 | Test helpers (`renderInStudio`)                              | ✅ 2    |

### Placeholders

Phase 2 uses realistic placeholder content so the shell can be judged with real copy. Every
placeholder lives in a `placeholder.ts` / `placeholder-*.tsx` file (or is marked `PLACEHOLDER` in
its doc comment) and names the phase that replaces it:

- `features/studio/placeholder.ts`, `studio-preview-context.tsx`, `placeholder-scene.tsx` → Phases 4–5
- `features/explorer/placeholder.ts` → Phase 3
- `features/inspector/placeholder.ts` → Phase 5

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

## Performance budgets (initial; verified from Phase 4 onward)

| Metric                                      | Budget                                          |
| ------------------------------------------- | ----------------------------------------------- |
| Explorer route JS (gzip, first load)        | ≤ 200 KB                                        |
| Studio route JS incl. three.js (gzip)       | ≤ 450 KB, 3D chunk lazy-loaded                  |
| Frame rate, integrated GPU (Iris Xe), 1080p | 60 fps while animating                          |
| Idle GPU usage                              | Near zero — render on demand when paused        |
| LCP (desktop, local)                        | ≤ 1.5 s                                         |
| Accessibility                               | WCAG 2.2 AA for all 2D UI; Lighthouse a11y ≥ 95 |
