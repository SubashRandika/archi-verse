# ADR-0010: "Glossy toy" components and a light theme

- **Status:** Accepted (visual refresh, 2026-11-26). Partly supersedes
  [ADR-0006](./0006-stylized-isometric-visual-style.md) (outlines and the small single-hue
  palette) and [ADR-0007](./0007-drafting-plate-design-system.md) (dark-only tokens).
- **Design:** `docs/superpowers/specs/2026-11-25-visual-refresh-design.md`

## Context

After four modules, the scene looked monotone: every component was the same navy body with a
cyan outline, so a laptop, a gateway and a database were told apart only by silhouette. The
learner also wanted a light theme for daytime use. Both had to keep the constraints of
ADR-0006 (stylized, code-built, no glTF), the meaning of the flow colours, and the budgets
(3D chunk ≤ 300 KB, 60 fps, draw calls no higher than before).

Three looks were mocked up; the learner chose **B, "Glossy toy"**: no outlines, a saturated
colour per component kind, rounded bodies, a plastic sheen, glowing screens and lights, each
component on a soft tile, with real detail (a laptop keyboard, rack drive bays).

## Decision

### Themes

- **Dark stays the default.** The header's theme menu offers Dark, Light and System. The
  choice is a validated field (`theme`) in the persisted preferences store.
- **Tokens per theme.** `globals.css` keeps the dark set on `:root` and overrides it under
  `:root[data-theme="light"]` (its own palette, not an inversion). Tailwind's `dark:` variant
  follows `data-theme`.
- **No flash.** An inline boot script (`THEME_BOOT_SCRIPT`, `src/lib/theme.ts`) sets
  `data-theme` in `<head>` before first paint, from the same storage key and rule as the store.
  `<ThemeSync/>` keeps the attribute and the browser theme colour in step with the store, the
  system setting and changes made in other tabs; each token set declares its `color-scheme`.
- **Contrast is tested.** `src/app/tokens.test.ts` parses both token sets and requires 4.5:1
  for the main text-on-surface pairs.

### Scene colours

- `src/engine/scene/palette.ts` has a palette per theme. **Each component kind has one body
  colour in both themes** (client orange, mobile violet, service blue, database emerald,
  gateway lime, identity fuchsia, breaker graphite, hop slate). The engine gets the resolved
  theme as a prop and a context (`ScenePaletteProvider`); it never reads storage.
- **Parts have roles** (`tile`, `body`, `trim`, `panel`, `dark`, `screen`, `key`, `light`), and
  `roleColor()` derives each role's colour from the kind's body colour or from the theme.
- **Flow colours keep their meaning.** Request, response, warning, error and selection appear
  only on packets, wires, rings, halos and badges, never on a body. Tests keep every body
  colour away from the flow colours (RGB distance > 40) and the kinds apart from each other
  (> 45).

### Models and rendering

- **Shapes stay code-built data** (`shape-library.ts`): boxes, rounded boxes, upright cylinders
  and flat screens, in painter's order, each with a role. Screens show a picture from one small
  canvas atlas (`screen-atlas.ts`: a web page for the laptop, an app for the phone).
- **Merged per kind.** `buildKindModel()` merges a kind's parts into a few geometries with
  vertex colours: solid parts, screens, lights, and one geometry per animated station. Models
  are cached per kind and theme and shared by every instance.
- **Materials:** one glossy Phong material for solids, unlit materials for screens and lights,
  hemisphere and key lights per theme. No environment map, no post-processing.
- **States without outlines:** busy, warning, error and selected show as a glowing ground ring
  with a soft halo in the tone colour; busy also tints the body slightly; down darkens the body
  and switches off screens and lights; hover lifts brightness; dimmed components fade toward
  the background by a per-theme amount (`dimFade`), without transparency.
- **The no-WebGL drawing** (`isometric-drawing.tsx`) uses the same shapes and role colours,
  with a lighter top and a darker side per face.

## Consequences

- **Fewer draw calls**, despite more detail: Retry 47 → 21, Backend for Frontend 68 → 36,
  Circuit Breaker 54 → 26 (API Gateway 40). Median frame 16.7 ms on every module; no frames
  drawn while idle.
- **Budgets held:** 3D chunk 291 / 300 KB, module page first load 314 / 333 KB. The 3D chunk
  has little headroom left; a future engine feature may need to win some back first.
- **A new component kind** needs a body colour that passes the palette tests, parts with roles,
  a tile as its first part (except the hop), and parts declared in painter's order.
- **New layouts** must be checked in both themes; the larger tiles moved three labels and two
  positions in the existing modules.
- A theme switch recolours the scene in place (the canvas is not remounted), so the current
  step and its playback carry on.

## Alternatives considered

- **Modelled glTF files.** The richest detail, but a modelling workflow, a loader and asset
  downloads, and slow to recolour per theme; against ADR-0006's code-built rule.
- **Simple boxes with painted textures.** Fewest polygons, but the detail looks stuck on when
  orbiting and the sheen is lost.
- **A light theme by inverting the dark tokens.** Cheap, but grey and low in contrast; the light
  set was designed and contrast-tested instead.
- **Keeping outlines for selection.** Outlines fight the glossy look; a ground ring reads at any
  zoom and keeps the body's colour visible.
