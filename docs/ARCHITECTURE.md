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
        lib/     Framework-free utilities, scene-spec types (content ↔ engine contract).
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

| Path                        | Responsibility                                                     | Phase   |
| --------------------------- | ------------------------------------------------------------------ | ------- |
| `src/app/`                  | Routes: `/`, `/learn` layout, `/learn/[conceptSlug]`, `@inspector` | ✅ 2–5  |
| `src/components/`           | App-wide UI helpers (`IconButton`) + `ui/` shadcn primitives       | ✅ 2    |
| `src/features/shell/`       | Responsive frame, resizable/collapsible panels, `useShell()`       | ✅ 2    |
| `src/features/explorer/`    | Category/concept navigation, search, progress indicators           | ✅ 2–3  |
| `src/features/studio/`      | Studio composition, session store, 3D stage, outline, shortcuts    | ✅ 2–4  |
| `src/features/inspector/`   | Explanation panel: step view, part view, explanation blocks        | ✅ 2, 5 |
| `src/features/locale/`      | Studio interface strings (English, Sinhala), `useStrings()`        | ✅ 5    |
| `src/features/playback/`    | Playback dock (title block), driving the session store             | ✅ 2–4  |
| `src/features/progress/`    | Persisted progress store, selectors, completion, hydration         | ✅ 3    |
| `src/features/preferences/` | Persisted preferences: level, language, speed, layouts, last       | ✅ 3, 5 |
| `src/engine/scene/`         | Canvas, isometric camera rig + framing, labels, stats, WebGL       | ✅ 4    |
| `src/engine/primitives/`    | Reusable 3D parts: component shapes, wires, packets, resources     | ✅ 4    |
| `src/engine/timeline/`      | Beats → GSAP timeline compiler, step playback controller           | ✅ 4    |
| `src/content/catalog/`      | 16 categories, 291 concepts; summaries in their own file           | ✅ 2–5  |
| `src/content/modules/<id>/` | `structure.ts` (layout, steps, beats) + `text/` (per language)     | ✅ 4–5  |
| `src/lib/scene-spec/`       | Scene layout, step scene and beat types shared by content/engine   | ✅ 4    |
| `src/lib/`                  | Utilities, `useReducedMotion`, locales                             | ✅ 1+   |
| `src/test/`                 | Test helpers (`renderInStudio`)                                    | ✅ 2    |

### Placeholders

Phase 2 uses realistic placeholder content so the shell can be judged with real copy. Every
placeholder lives in a `placeholder.ts` / `placeholder-*.tsx` file (or is marked `PLACEHOLDER` in
its doc comment) and names the phase that replaces it:

- ~~`features/inspector/placeholder.ts`~~ → replaced by the API Gateway module text in Phase 5
- ~~`features/studio/placeholder.ts`, `studio-preview-context.tsx`~~ → replaced by the module
  data and the session store in Phase 4
- `features/studio/static-scene.tsx` (formerly the placeholder sketch) is now the **WebGL
  fallback**, not a placeholder
- ~~`features/explorer/placeholder.ts`~~ → replaced by the real catalog in Phase 3

## Concept catalog

- One file per category in `src/content/catalog/categories/`, listing concepts in roadmap order.
- A concept is **defined once**, in the first category where it appears; later categories
  reference it with `ref("id")`. 304 roadmap entries resolve to 291 unique concepts.
- `types.ts` holds Zod-free types (shipped to the browser); `schema.ts` holds the matching Zod
  schemas, used only by `catalog.test.ts`, so Zod's full build stays out of the bundle.
- Routes: every concept gets a static page at `/learn/<id>` (`generateStaticParams`).
- Summaries live in `summaries.ts`, outside the first-load bundle (Phase 5). Server routes import
  them (page metadata, planned-concept pages); the sidebar loads them lazily on the first search
  or preview card (`features/explorer/concept-summaries.ts`). Search matches titles and keywords
  at once, and summaries once loaded. ESLint forbids static imports from client code.

## Learning modules and languages

A module has two halves (`src/content/modules/types.ts`):

- **Structure** (`<id>/structure.ts`): ids, the scene layout and each step's beats. Small and
  language-free; the client imports it because the 3D scene and the dock need it.
- **Text** (`<id>/text/`): `shared.ts` (the terms and message of each step, message code),
  `en.ts` / `en-steps.ts` and `si.ts` / `si-steps.ts` (titles, explanations at both levels,
  part descriptions, glossary, captions). **Server-only.**

Text reaches the browser as **route data**, not JavaScript:

```text
/learn/[conceptSlug]/page.tsx             → <Studio labels={titles in every language} />
/learn/@inspector/[conceptSlug]/page.tsx  → <InspectorPanel text={all text, every language} />
```

`@inspector` is a parallel route, so the panel's content comes from the server while the shell
around it stays mounted. Both languages ship with the page, so switching is instant (the
API Gateway page is ~57 KB gzipped HTML). ESLint forbids importing module text from
`features/` or `components/`.

- **Levels:** Beginner explains each step as if to a five-year-old ("In simple words" plus a
  "Like in real life" example); Advanced gives the technical detail plus a worked example. Both
  share a "Watch in the scene" line.
- **Languages** (`lib/locale.ts`): English (default) and Sinhala. Sinhala uses a friendly spoken
  style and keeps technical terms in English. The learner's choice is a persisted preference.
  Studio interface strings are in `features/locale/strings.ts`; the sidebar and catalog stay
  English. Labels inside the 3D scene are technical names and stay English.
- **Fonts:** IBM Plex has no Sinhala glyphs, so Noto Sans Sinhala follows it in every font stack.
  Its `@font-face` covers only the Sinhala block, so it downloads only when Sinhala is on screen.
- `modules.test.ts` checks both languages have the same steps, parts, terms and captions, every
  step has both levels, glossary terms stay English and Sinhala text is in Sinhala script.
- Review copy: `docs/modules/api-gateway.text.md` (generated from the text files).

## Persistence

- Stores use Zustand `persist` with `skipHydration`. `<PersistedStateSync />` (root layout) loads
  saved state after hydration and re-syncs when another tab changes it.
- **Never write before loading.** Persist writes on every change, so anything that runs at
  startup (saving the panel layout, remembering the last concept) waits for `useHasHydrated()`.
- Stored data is validated with `zod/mini` on load: progress record by record, preferences field
  by field. Invalid data falls back to defaults with a console warning.
- Keys: `archiverse:progress` (v1), `archiverse:preferences` (v1; `locale` added in Phase 5,
  defaulting to English when absent, so no migration is needed).

## State tiers

| Tier      | Lives in                                       | Examples                                      |
| --------- | ---------------------------------------------- | --------------------------------------------- |
| Persisted | Zustand + `persist` (versioned, Zod-validated) | progress, explanation level, playback speed   |
| Session   | Zustand store per studio (`session-store.ts`)  | step, playing, step complete, mode, selection |
| URL       | search params                                  | `?step=5&scenario=timeout` (shareable)        |
| Per-frame | three.js objects mutated via refs / GSAP       | packet positions, glow intensity              |

Per-frame values never go through React state. The playhead within a step reaches the dock
through a tiny progress channel (subscribe + direct DOM write), not the store.

## Rendering

- Every route is statically generated (`output: "export"`).
- The 3D scene (`features/studio/studio-scene.tsx` + `engine/*`) is one lazily loaded chunk,
  imported only by `StudioStage` on module pages, after the page is interactive. Planned
  concepts never download it (checked by `npm run check:bundles` and e2e).
- **On-demand rendering** (`frameloop="demand"`): frames are drawn only while the timeline
  plays, the camera moves or a highlight eases. Paused, the scene renders zero frames. Hidden
  tabs pause playback. See ADR-0008 and docs/CONVENTIONS.md → 3D scenes.
- **Fallbacks:** no WebGL, or a lost WebGL context, shows the static isometric drawing with
  the same steps, explanations and controls. Reduced motion makes packets jump between
  stations and the camera cut instead of fly.
- `cacheComponents` is disabled because it is incompatible with static export (ADR-0001), so
  routes unmount normally on navigation; GPU resources are disposed on unmount.

## Performance budgets

**Measured in Phase 3** (static export, gzip, first-load JavaScript), for reference:

| Page                       | Measured | Notes                                                   |
| -------------------------- | -------- | ------------------------------------------------------- |
| `/` (redirect only)        | 212 KB   | ≈ framework baseline: React 19 + Next.js 16 runtime     |
| `/learn/<concept>` (shell) | 343 KB   | + Base UI/floating-ui, panels, catalog (~24 KB), stores |

The original 200 KB explorer budget was set before the framework baseline could be measured and
is not reachable with this stack (the baseline alone is ~190 KB). **Revised after Phase 3
(approved):** 350 KB for the shell. Lazy-loading menus, dialogs and preview cards (est. 30–50 KB)
is scheduled for Phase 6.

**Measured at the end of Phase 5** (`npm run check:bundles`):

| Budget                           | Measured | Limit  |
| -------------------------------- | -------- | ------ |
| Module page first load           | 350 KB   | 350 KB |
| Planned-concept page first load  | 350 KB   | 350 KB |
| Lazy 3D chunk (three, R3F, GSAP) | 288 KB   | 300 KB |
| Concept summaries (lazy chunk)   | 14 KB    | —      |

The shell is at its limit. Known slack for Phase 6: the studio strings module is duplicated in
two route chunks (~2 KB), plus the lazy menus and dialogs above.

**Phase 4 split budget (approved):** the original "≤ 450 KB studio total" could not hold three.js
on top of the shell, so the budget is split into the first load (what blocks the page) and the
lazily loaded 3D chunk (loaded after the page is interactive, on module pages only).

| Metric                                   | Budget                                 | Measured (Phase 4)                       |
| ---------------------------------------- | -------------------------------------- | ---------------------------------------- |
| Shell / explorer JS (gzip, first load)   | ≤ 350 KB                               | **352 KB** (2 KB over, see Known issues) |
| 3D chunk (gzip, lazy, module pages only) | ≤ 300 KB                               | 287 KB                                   |
| Frame rate, integrated GPU, 1080p        | 60 fps while animating                 | 60 fps, p95 frame 16.8 ms (Radeon 860M)  |
| Idle rendering                           | Zero frames while paused               | 0 frames (asserted in e2e)               |
| Draw calls (API Gateway scene)           | —                                      | 33–47                                    |
| LCP (desktop, local)                     | ≤ 1.5 s                                | not yet measured (Phase 6)               |
| Accessibility                            | WCAG 2.2 AA for 2D UI; Lighthouse ≥ 95 | axe: no serious violations               |

`npm run check:bundles` checks the JS budgets against the last build. Frame rates are measured
by hand on hardware (`?perf` overlay); headless browsers render WebGL in software.

**Known issue:** the shell first load grew 9 KB in Phase 4 (session store, module data, stage,
outline, shortcuts, draft step explanations) to 352 KB. Recovery is planned with the Phase 5
content-loading design and the Phase 6 lazy-loading work (menus, dialogs, preview cards).
