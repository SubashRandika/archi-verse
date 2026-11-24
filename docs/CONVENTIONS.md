# Conventions

## Code

- **TypeScript strict** plus `noUncheckedIndexedAccess`, `noImplicitOverride`. No `any`; prefer
  `unknown` + narrowing: small type guards (`lib/validate.ts`) for saved data in the browser,
  Zod for content schemas in tests (ADR-0009).
- **Imports** use the `@/` alias for anything outside the current folder. Type-only imports use
  inline `type` (`import { type Foo } from ...`) — enforced by ESLint.
- **Server Components by default.** Add `"use client"` only for state, effects, event handlers or
  browser APIs, and push the boundary as low in the tree as possible.
- **Naming**
  - Files: `kebab-case.ts(x)`; React components exported in `PascalCase`; hooks `useThing`.
  - One main export per component file; named exports (no default exports) except where Next.js
    requires them (`page.tsx`, `layout.tsx`, …).
  - Ids in content are stable `kebab-case` strings (`api-gateway`, `orders-service`).
- **Styling**: Tailwind utility classes + design tokens defined as CSS variables in
  `src/app/globals.css`. Compose classes with `cn()`. No hard-coded colours in components.
- **UI primitives** come from shadcn/ui (`npx shadcn add <name>`) into `src/components/ui/`.
  They are built on **Base UI**: compose with the `render` prop (not Radix's `asChild`).
- **Icon-only buttons** always use `IconButton` (`src/components/icon-button.tsx`), which
  guarantees an accessible name and a matching tooltip.
- **Colour** comes from the design tokens in ADR-0007 (`bg-hull`, `text-graphite`,
  `text-flow-request`, …). Flow colours carry meaning only — never use them for decoration.
- **Copy**: sentence case, plain verbs, no all-caps labels. Errors and empty states say what
  happened and what to do next.
- **Responsive overlays inside the plate** use container queries (`@3xl:` etc.), not viewport
  breakpoints, because the plate width depends on panel sizes.
- **Menus, dialogs and drawers load on first use** (ADR-0009). A dropdown menu is created with
  `lazyMenu(() => import("./x-menus").then((m) => m.XMenu))`: the caller builds the trigger, the
  lazily loaded file holds `DropdownMenu` with `useLazyMenuState(defaultOpen)`. Dialogs and
  drawers mount with `React.lazy` the first time they open. Nothing from `ui/dropdown-menu`,
  `ui/alert-dialog` or `ui/sheet` belongs in first-load code.
- **No premature abstraction.** Extract a reusable piece when the second real use appears.

## 3D scenes (ADR-0008)

- **Scenes are data.** A module describes its layout and step beats with the types in
  `src/lib/scene-spec`; it never imports the engine. New component kinds are a shape entry in
  `src/engine/primitives/shapes.ts` (scaled unit boxes and cylinders), not a new model file.
- **Per-frame values never touch React state.** GSAP tweens plain channel objects; components
  read them in `useFrame` and update three.js objects through refs.
- **On-demand rendering.** Anything that changes the picture must request a frame with
  `invalidate()`. Something that animates continuously keeps the loop alive by calling it from
  inside `useFrame` (calling it only from outside renders every other frame).
- **Share GPU resources.** Geometries and generated textures come from `useSceneResources()`.
  Materials owned by a component are created in `useMemo` and disposed in an effect cleanup.
- **Lines and labels.** Outlines and wires use three's line add-ons (`three/addons/lines`), not
  Drei `Edges`/`Line`. Labels are DOM in one layer (`LabelLayer` + `LabelProjector`), not Drei
  `Html`.
- **Main bundle stays three-free.** Only `features/studio/studio-scene.tsx` (loaded with
  `next/dynamic`) may import `@/engine/scene`, `@/engine/primitives` or `@/engine/timeline`.
  Main-bundle code imports single files such as `@/engine/scene/webgl`. `npm run check:bundles`
  and the e2e suite verify this.
- **Lint exception:** `react-hooks/immutability` is off for `src/engine/**/*.tsx`, because
  imperatively updating three.js objects is the intended pattern there. It stays on everywhere
  else.
- **Accessibility:** every scene interaction must also be possible without the canvas (scene
  outline, the panel's "Parts in this step", dock, keyboard shortcuts).
- **Overlapping beats.** Beats run one after another. A packet's `next` (seconds until the next
  beat) lets later beats start while it travels, e.g. a burst; the step lasts until the last
  packet arrives.
- **Steps end before the boundary.** Every step starts from a clean slate set at its start
  time, so playback stops 1 ms before the next step's start (`TimelineController`).
- **Write beats with the kit** (`content/modules/beats.ts`): `send`, `work`, `stage`, `signal`,
  `status`, `wait`, plus `timed` (beats at absolute times) and `burst` (packets in flight at
  once). Wrap a kit helper locally when a module repeats the same arguments.
- **Badges are references**, never text: `status("gateway", "info", badge("left", 57))`. The
  text is in the module's `badges` table in each language (`"{count} of 60 left"`), so the
  scene follows the learner's language without recompiling its timeline.
- **Labels:** a component's name sits above it. When a wire or another label would cross it,
  set `labelPlacement: "right"` or `"below"` in the layout; at the edge of the view it falls
  back to above. Check every step and scenario in screenshots after changing a layout.
- **The no-WebGL fallback is generated** from the layout (`engine/static/isometric-drawing`),
  so a new module needs no extra work for it.

## Writing module text

- **Structure and text are separate.** Ids, layout and beats go in `<id>/structure.ts`; every
  word a learner reads goes in `<id>/text/`. Never put prose in the structure: it would ship as
  JavaScript.
- **Every step has both levels in every language.** Beginner: "In simple words" written for a
  five-year-old (short sentences, no unexplained jargon) and a "Like in real life" example.
  Advanced: the technical detail and a worked example (numbers, a real header, a query plan).
  Plus one "Watch in the scene" line that points at something visible.
- **Sinhala:** friendly spoken style ("කරනවා"); technical terms stay in English, in Latin script
  ("request එක", "token එක"). Glossary terms are English in every language; definitions are
  translated.
- Language-free references (a step's terms and message, message code, example code) live once
  in `text/shared.ts`.
- `modules.test.ts` fails when a language is missing a step, part, term, caption or badge.
  After changing text, regenerate the review copy: `npm run docs:module-text -- <id>` writes
  `docs/modules/<id>.text.md`.
- A new module starts from `npm run new:module <concept-id>`; see `docs/adding-a-concept.md`.
- Studio interface strings go in `features/locale/strings.ts` (both languages, same keys,
  enforced by the type).

## Formatting & linting

- Prettier owns formatting (`npm run format`); ESLint owns correctness and architecture rules
  (`npm run lint`). `eslint-config-prettier` disables overlapping stylistic rules.
- Line endings are LF everywhere (`.gitattributes`, `.editorconfig`).

## Testing

| Kind       | Tool                       | Location                      | Use for                                           |
| ---------- | -------------------------- | ----------------------------- | ------------------------------------------------- |
| Unit       | Vitest                     | `*.test.ts` next to the code  | pure logic: stores, timeline compiler, framing    |
| Component  | Vitest + Testing Library   | `*.test.tsx` next to the code | UI behaviour via roles/labels, not implementation |
| End-to-end | Playwright (static export) | `e2e/*.spec.ts`               | complete learning flows in a real browser         |

- `e2e/modules.spec.ts` opens every step and scenario step of **every** module and fails on any
  console error, so a new module is covered as soon as it is registered. Module-specific
  behaviour goes in its own spec (`e2e/<id>-module.spec.ts`).
- Tests that click right after opening a page use `gotoReady()` (`e2e/support.ts`), which waits
  for hydration: a click on the static HTML before it is lost.

- Query by role/label first (`getByRole`), never by CSS class.
- `localStorage` is cleared after every unit test (`vitest.setup.ts`).
- `npm run check` = typecheck + lint + format check + unit tests. Run it before every commit.
- jsdom has no WebGL, so component tests run the studio's static fallback. The 3D scene is tested
  in Playwright with software WebGL (SwiftShader), limited to 2 workers because it is CPU-bound.
  Those tests assert behaviour and rendering activity (frame counts), never frame rates.

## Dependencies

Before adding a dependency, answer (in the PR/commit or an ADR): why it is needed, what problem it
solves, whether it adds unnecessary complexity, and whether the existing stack already solves it.
Dependencies are installed in the phase that first uses them.

## Git

- Default branch `main`. Small, focused commits; imperative subject line
  (`Add progress store with versioned persistence`).
- Never commit `.env*` files or generated output (`.next/`, `out/`, reports).

## Next.js version note

This project uses **Next.js 16.4**, which differs from older versions (e.g. `LayoutProps`/`PageProps`
globals generated by `next typegen`, `typedRoutes`, Tailwind via the Turbopack loader). Check
`node_modules/next/dist/docs/` before relying on remembered APIs (see `AGENTS.md`).
