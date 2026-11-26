# Visual refresh: light theme and "Glossy toy" scene components

- **Date:** 2026-11-25
- **Status:** Draft for approval (learner decisions recorded in section 12)
- **Phase:** between Phase 7 concepts (Retry and Exponential Backoff is committed as 9ac0656;
  the next concept waits until this is done).

## 1. Intent

The learner finds the 3D scene too plain: every component is the same navy, built from a few
sharp boxes, with little detail. They want the scene to be more beautiful and eye-catching:
**varied colours** and **more detail** (a laptop with a keyboard and a screen, for example),
**without** photorealism. They also want a **light mode** for the whole app.

Inspiration was two screenshots of another learning app (cream background, pastel coloured
objects, detailed laptop). The look must be our own, not a copy.

Three directions were mocked up (soft clay, glossy toy, drafting + colour), each in light and
dark. The learner chose **B, "Glossy toy"**: no outlines; saturated colours, lit like small
plastic toys; glowing screens and status lights; each component on a soft tile. The approved
mockup is in `.superpowers/brainstorm/` (local only).

## 2. Goals

1. **Light theme** for the whole app: shell, explorer, inspector, dock, menus, dialogs, scene
   and the no-WebGL drawing. **Dark stays the default** on a first visit. The toggle offers
   Dark, Light and System (follow the computer's setting); the choice is remembered.
2. **Glossy toy components** for every component kind in use (client, mobile, gateway, service,
   database, identity, breaker, hop), in both themes:
   - a colour per kind (the same kind looks the same in every module);
   - richer code-built detail per kind (see section 6.2);
   - softly rounded bodies, a plastic sheen, glowing screens and status lights;
   - each component on a soft tile.
3. Keep everything the scene does today: guided playback, packets, badges and labels,
   selection, hover, dimming, warning/error/down statuses, animated stations (gateway checks,
   breaker lamps), reduced motion, the static fallback.
4. Keep the existing four modules looking right, with no label or wire collisions.

## 3. Non-goals

- Photorealism, imported 3D models (glTF), new component kinds, people figures.
- Changing module content, steps or layouts beyond small label or position fixes the new
  shapes need.
- A theme editor or more than two themes.

## 4. Anti-goals (failure even if it works)

- **Colour that competes with meaning.** Packets and status glows must stay the most salient
  things on screen. Request, response, warning, error and selection colours stay reserved for
  packets, glows, rings and badges, never a component's body.
- **A light theme that is an inverted dark theme.** It needs its own palette, contrast checked.
- **Losing readability when dimmed or small.** Out-of-focus components must still recede
  clearly in both themes.
- **Slower or heavier.** No frame-rate regression, and no budget raised without approval.

## 5. Approaches considered

| Approach                                                | Trade-off                                                                                                                                                                                            | Decision                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **1. Code-built detailed models, merged per component** | Detail lives in code as data (as today), so colours per theme, new kinds and tweaks stay cheap; merging keeps draw calls low. Rounded edges and sheen come from geometry and lighting, not textures. | **Chosen** by the learner. |
| 2. Modelled glTF files (Blender)                        | The richest detail, but needs a modelling workflow, a loader and asset downloads; slower to recolour or extend; against CLAUDE.md's "code-built geometry".                                           | Rejected.                  |
| 3. Simple boxes with painted faces                      | Fewest polygons, but details look stuck-on when orbiting and the plastic sheen is lost.                                                                                                              | Rejected.                  |

Light mode had one sensible way (token sets switched by an attribute on `<html>`), stated as
my call.

## 6. Design

### 6.1 Theme mechanics (app)

- `globals.css`: today's tokens become the **dark** set (default, on `:root`). A **light** set
  overrides them under `:root[data-theme="light"]`, with `color-scheme: light`. Every UI colour
  already comes from tokens (one hard-coded `themeColor` in `layout.tsx` is the only
  exception).
- The shadcn `dark:` variant currently keys off a hard-coded `dark` class on `<html>`. It is
  changed to follow `data-theme="dark"`, and the hard-coded class is removed.
- **Preference:** `theme: "system" | "light" | "dark"` in the persisted preferences store
  (validated on load like the other fields; default `"dark"`).
- **No flash:** the app is a static export, so a tiny inline script in `<head>` reads the saved
  preference (and `prefers-color-scheme`) and sets `data-theme` before first paint. The store
  and the script share one storage key and one parsing rule.
- **Toggle:** a small control in the app header: System, Light, Dark (an icon button with a
  menu, or a three-state toggle), labelled in English and Sinhala. `themeColor` metadata gets a
  light and a dark value.
- The light UI palette: a cool off-white workspace (around `#eef2f8`), white raised surfaces,
  ink text (around `#1d2638`), with the flow colours darkened where needed for AA contrast on
  light backgrounds (request `#0ea5e9`, response `#16a34a`, warning `#d97706` were used in the
  mockup). Exact values are set at checkpoint 1 and contrast-tested.

### 6.2 Component models (engine)

**Shape data** stays in `src/engine/primitives/shapes.ts`, extended:

- Each part gets a **role**: `body`, `trim` (darker body), `panel` (lighter body), `screen`,
  `key`, `light-ok`, `light-busy`, `accent`, `tile`. Roles map to colours per theme and kind.
- Geometry types: `box`, `rounded` (a box with rounded edges, `RoundedBoxGeometry` from the
  three.js addons), `cylinder`.
- `station: i` stays, for parts that light up with a stage.
- Screens get a **screen picture**: `"web-page"` (laptop) or `"app"` (phone), a small texture
  generated once on a canvas (title bar dots, address bar, heading and text lines, a card, a
  Pay button), like the mockup.

**Planned detail per kind** (from the approved mockup; the builder may refine):

| Kind             | Body colour (both themes)   | Details                                                                                                                             |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| client (laptop)  | orange `#ff8f45`            | rounded base; keyboard well with a grid of keys and a space bar; touchpad; lid with screen showing the web-page picture; webcam dot |
| mobile (phone)   | violet `#8b5cf6`            | dock; rounded body; app picture on screen; notch                                                                                    |
| service (rack)   | blue `#3b82f6`              | three rounded units; four drive bays each; two status lights per unit; side vents; a card icon on top                               |
| database         | emerald `#10b981`           | three discs with a lighter band; a status light per disc; an emblem on top                                                          |
| gateway          | proposed lime `#84cc16`     | stepped plinth; gate posts and lintel; the five check stations as lamps                                                             |
| identity (vault) | proposed fuchsia `#d946ef`  | plinth; tower with a vault door (round dial) and a keyhole; cap                                                                     |
| breaker          | proposed graphite `#64748b` | body; lever; the three state lamps (stations)                                                                                       |
| hop              | neutral `#94a3b8`           | a small router puck with two lights                                                                                                 |

The four extra kind colours are proposals; they are fixed at checkpoint 1 against the rule in
section 4 (distinct from each other and from the flow colours as used on rings and packets).
Gold or amber is avoided for any body, since it reads as the warning colour. The phone's violet
is close to the selection colour; that is acceptable because selection shows as a ring on the
tile, not on the body (builder's call, check in screenshots).

**Rendering:**

- At first use, each kind's static parts are **merged into one geometry** (vertex colours from
  their roles, `mergeGeometries` from the three.js addons), cached per kind and theme in the
  scene resources, and shared by every instance. Station parts stay separate meshes, as now.
- **Materials:** one glossy `MeshPhongMaterial` (vertex colours, specular highlight) for solid
  parts; one unlit/emissive material for screens and lights, so they glow. No environment map.
- **Lights:** a hemisphere light (sky and ground colours per theme) and a key directional light,
  tuned for the plastic look; the existing footprint shadow stays.
- **States**, replacing today's outline and edge glow (Glossy toy has no outlines):
  - _busy/active:_ the body brightens slightly in the tone colour, and a **ground ring** around
    the tile glows in that tone;
  - _warning / error status:_ a steady ring in that tone;
  - _down:_ body desaturated and darkened, screens and lights off, error ring;
  - _selected:_ a ring in the selection colour, slightly stronger than a status ring;
  - _hovered:_ a small brightness lift;
  - _dimmed:_ the colour is mixed toward the scene background (lighter in light mode, darker in
    dark mode) through a single uniform on the material, without transparency.
- **Ground, wires and packets** take per-theme colours (grid, wire, packet halo). Packets keep
  their flow colours, darkened for the light theme where contrast needs it.
- The scene palette (`palette.ts`) becomes two palettes, picked by the resolved theme; a theme
  switch recolours the scene without reloading it.

### 6.3 Static fallback drawing

`isometric-drawing.tsx` draws the same shape data with filled, shaded faces per role (top
lighter, sides darker, as in the mockup), rounded parts as boxes, cylinders as ellipses with a
side, and screens as simple coloured blocks. Colours come from CSS variables, so it follows the
theme. Fine detail may be simplified (for example fewer keys) to keep the SVG light.

### 6.4 Labels and badges

Labels and badges are DOM and already use tokens; they follow the theme. New shapes have new
bounds, so `labelAnchor` and scene framing are re-checked, and each module is screenshot in
both themes to fix any collision (by `labelPlacement` or small position changes).

## 7. Constraints

- **Budgets** (`npm run check:bundles`): shell first load ≤ 333 KB (now 313); lazy 3D chunk
  ≤ 300 KB (now **288**). The rounded-box and merge helpers add a few KB to the 3D chunk.
  The outline line code cannot be dropped (wires use the same line classes), so there is little
  to offset it. If the chunk would pass 300 KB, stop and ask before raising the budget.
- **Performance:** median frame ≈ 16.7 ms on the reference laptop; draw calls no higher than
  today per module (BFF: 68); render-on-demand idle frames stay 0.
- **Layers** (ESLint): app → features → engine/content → lib. The theme preference lives in
  features; the engine receives the resolved theme as a prop or context, never reads storage.
- **Accessibility:** UI text meets WCAG AA in both themes; axe checks run in light and dark;
  reduced motion keeps working.
- **Phase gating** (CLAUDE.md): two checkpoints and a Completion Report; commit only when asked.

## 8. Plan of delivery (checkpoints)

1. **Look-dev in the real engine (checkpoint 1):** the new shape roles, merging, materials,
   lights, rings and dimming; the four kinds of the Retry module (client, mobile, service,
   database) in both scene palettes. The theme preference, the no-flash script and a first
   pass of the light UI tokens land here too, so the light scene is reviewed inside a light
   page (builder's call: cheaper than a temporary scene-only switch).
   Show screenshots of the Retry module in both themes, with draw calls, frame time and the
   3D chunk size. Fix the four remaining kind colours.
2. **Roll-out (checkpoint 2):** the remaining kinds; the full light UI theme, toggle and no-flash
   script; the fallback drawing; every module screenshot in both themes and collisions fixed;
   tests; ADR and docs.
3. **Completion Report.**

## 9. Testing

- Unit: shape builder (roles mapped, merged bounds match `shapeBounds`, station counts
  unchanged); preferences store (theme saved, invalid values rejected, default `system`); token
  contrast (text on surfaces ≥ 4.5:1 in both themes); palette completeness per theme.
- Browser: theme toggle applies and persists across reload; no flash (`data-theme` set before
  hydration); system preference honoured; axe with no serious violations in light and dark.
  The existing module specs run in the default theme; the light theme gets the theme spec, axe
  on a module page and the explorer, and one full module walk (builder's call: keeps the suite
  near its current 2.6 minutes).
- Visual: screenshots of every module step and the fallback in both themes; frame-time and
  draw-call measurement; bundle check.

## 10. Documentation

- New **ADR-0010** "Glossy toy scene style and light theme", superseding the dark-only rule of
  ADR-0007 and the monochrome body of ADR-0006/the hybrid look (flow colours stay
  meaning-only).
- CLAUDE.md: the confirmed decision "Theme: Dark theme" becomes "Dark (default) and light", and
  "Dark-first interface" stays, noting the light option (the learner approved this edit).
- README status and `docs/adding-a-concept.md` (how to give a new kind its roles and colour).

## 11. Left to the builder

- Exact part sizes and detail counts per kind; shininess and light intensities; ring size and
  glow strength; the screen pictures' layout.
- Whether the toggle is a menu or a three-state button (must be keyboard accessible and
  labelled).
- How far to simplify fine detail in the fallback drawing.

## 12. Learner decisions

- Direction **B, Glossy toy** (from the mockups), built with **approach 1** (code-built detailed
  models, merged per component).
- **Default theme: Dark** on a first visit; Light and System are options.
- **CLAUDE.md** may be updated: the theme line, as in section 10.
