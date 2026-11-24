# Conventions

## Code

- **TypeScript strict** plus `noUncheckedIndexedAccess`, `noImplicitOverride`. No `any`; prefer
  `unknown` + narrowing (Zod at trust boundaries such as `localStorage`).
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
  outline, inspector component list, dock, keyboard shortcuts).

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
