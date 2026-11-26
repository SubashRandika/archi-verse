# Visual Refresh (light theme and Glossy toy components) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light theme to the whole app (dark stays the default) and replace the monochrome
box components with colourful, detailed, code-built "Glossy toy" models in both themes.

**Architecture:** A theme preference (`dark | light | system`, default `dark`) lives in the
persisted preferences store; a boot script in `<head>` sets `data-theme` on `<html>` before first
paint, and CSS token sets switch on it. The engine receives the resolved theme as a prop and reads
colours from a per-theme scene palette through context. Component shapes become role-tagged part
lists; each kind is merged once per theme into a few shared geometries (solid Phong parts with
vertex colours, an emissive screen atlas, emissive lights) and states show as a ground ring plus
colour/emissive changes instead of outlines.

**Tech Stack:** Next.js 16 static export, React 19, three.js 0.187 (+ addons
`RoundedBoxGeometry`, `BufferGeometryUtils.mergeGeometries`), React Three Fiber 9, drei `Grid`,
Zustand persist, Tailwind 4 tokens, Vitest, Playwright + axe.

**Spec:** `docs/superpowers/specs/2026-11-25-visual-refresh-design.md`

## Global Constraints

- Default theme on a first visit is **dark**; toggle offers Dark, Light and System; choice persisted.
- Request, response, warning, error and selection colours only on packets, glows, rings and badges, never a component body; no gold or amber body.
- Kind body colours: client `#ff8f45`, mobile `#8b5cf6`, service `#3b82f6`, database `#10b981`; gateway `#84cc16` (lime; indigo was too close to blue and violet), identity `#d946ef`, breaker `#64748b`, hop `#94a3b8` are proposals fixed at checkpoint 1.
- Light flow colours: request `#0ea5e9`, response `#16a34a`, warning `#d97706`; dark flow colours unchanged (`#4cc9f0`, `#3dd68c`, `#f5b83d`, `#f2577a`, `#a78bfa`).
- Budgets: shell first load ≤ 333 KB, lazy 3D chunk ≤ 300 KB (`npm run check:bundles`). If the 3D chunk would pass 300 KB, stop and ask the learner.
- Performance: median frame ≈ 16.7 ms, draw calls per module no higher than before (BFF 68, Retry 47), 0 idle frames.
- ESLint layers: app → features → engine/content → lib. The engine never reads the preferences store or storage.
- UI text contrast ≥ 4.5:1 in both themes; axe: no serious violations in either theme.
- Reduced motion keeps working (`smooth` flag).
- **Commit only when the learner asks** (CLAUDE.md). Tasks end in verification, not commits. Two approval checkpoints (after Task 6 and Task 10), then a Completion Report.
- Sinhala strings: friendly, spoken; technical terms in English.
- Status lights on components use the kind's own light tint (role `light`), not green/amber, and the screen's Pay button uses the kind colour; this simplifies the spec's `light-ok` / `light-busy` / `accent` roles so no body detail borrows a flow colour.

## Review Focus

1. **Switching theme while a step plays:** the scene recolours in place; playback, badges and the current step continue. → Task 10, `theme.spec.ts` "switches theme mid-playback".
2. **Storage unavailable or throwing (private mode):** the boot script must not throw; the page renders dark. → Task 1, `theme.test.ts` "falls back to dark when storage throws".
3. **Old or corrupted saved preferences** (no `theme`, `theme: "blue"`): theme becomes dark, other fields kept. → Task 1, store test.
4. **Theme changed in another tab:** this tab follows without reload. → Task 10, `theme.spec.ts` "follows a change made in another tab".
5. **No WebGL:** the fallback drawing uses the current theme's colours. → Task 8, drawing test "colours parts by kind and theme".

---

## Checkpoint 1: look-dev in the real engine

### Task 1: Theme preference and boot script

**Files:**

- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`
- Modify: `src/features/preferences/preferences-store.ts`, `src/features/preferences/preferences-store.test.ts`

**Interfaces:**

- Produces (`src/lib/theme.ts`):
  - `THEME_PREFERENCES = ["dark", "light", "system"] as const`, `type ThemePreference`
  - `type ResolvedTheme = "dark" | "light"`
  - `DEFAULT_THEME: ThemePreference = "dark"`
  - `resolveTheme(preference: ThemePreference, systemPrefersLight: boolean): ResolvedTheme`
  - `THEME_BOOT_SCRIPT: string` — self-contained IIFE: reads `localStorage["archiverse:preferences"]`, takes `state.theme`, resolves (System uses `matchMedia("(prefers-color-scheme: light)")`), sets `document.documentElement.dataset.theme`; any exception → `"dark"`.
- Produces (store): `theme: ThemePreference`, `setTheme(theme: ThemePreference): void`; `theme` included in `partialize` and validated in `parsePersistedPreferences` (`isOneOf(THEME_PREFERENCES, …)`, fallback `"dark"`).
- Note: the storage key string is duplicated inside the script; a test pins it to `PREFERENCES_STORAGE_KEY`.

- [ ] **Step 1: Write failing tests** in `src/lib/theme.test.ts`:
  - `resolveTheme("dark", true) === "dark"`, `resolveTheme("light", false) === "light"`, `resolveTheme("system", true) === "light"`, `resolveTheme("system", false) === "dark"`.
  - "boot script matches resolveTheme": for each preference × system value, set `localStorage` to `{"state":{"theme":p},"version":1}`, stub `window.matchMedia`, run `new Function(THEME_BOOT_SCRIPT)()`, expect `document.documentElement.dataset.theme === resolveTheme(p, light)`.
  - "falls back to dark when storage throws": stub `localStorage.getItem` to throw → `"dark"`; invalid JSON → `"dark"`; `theme: "blue"` → `"dark"`; no saved state → `"dark"`.
  - "uses the preferences storage key": `THEME_BOOT_SCRIPT.includes(JSON.stringify(PREFERENCES_STORAGE_KEY))` (import the key from the store in the test only).
- [ ] **Step 2: Add store tests**: `setTheme("light")` persists `state.theme === "light"`; `parsePersistedPreferences({ theme: "blue", locale: "si" })` → `theme: "dark"`, `locale: "si"`; `parsePersistedPreferences(undefined).theme === "dark"`.
- [ ] **Step 3: Run** `npx vitest run src/lib/theme.test.ts src/features/preferences` → FAIL (module missing).
- [ ] **Step 4: Implement** `src/lib/theme.ts` and the store field, setter, validation and `partialize` entry.
- [ ] **Step 5: Run** the same command → PASS.

### Task 2: App theming (tokens, layout, sync, toggle)

**Files:**

- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/features/studio/studio-header.tsx`, `src/features/locale/strings.ts`
- Create: `src/features/preferences/theme-sync.tsx`, `src/features/preferences/use-resolved-theme.ts`, `src/features/preferences/theme-menu.tsx`, `e2e/theme.spec.ts`

**Interfaces:**

- Consumes: Task 1 `THEME_BOOT_SCRIPT`, `resolveTheme`, store `theme`/`setTheme`.
- Produces:
  - `useResolvedTheme(): ResolvedTheme` — store preference + `matchMedia` listener; returns `"dark"` before hydration.
  - `<ThemeSync />` — rendered next to `<PersistedStateSync />`; sets `document.documentElement.dataset.theme` and the `meta[name=theme-color]` content (`#0c1420` dark, `#eef2f8` light) whenever the resolved theme changes.
  - `<ThemeMenu />` — icon button (Moon / Sun / Monitor from lucide) opening a radio menu (Dark, Light, System); keyboard accessible; aria-label from strings; placed in the studio header's right-hand group. Lazy-load the menu content like the existing sidebar menus if needed to stay within the shell budget.
  - Strings (en / si): `theme: "Theme" / "තේමාව"`, `themeDark: "Dark" / "අඳුරු"`, `themeLight: "Light" / "ආලෝක"`, `themeSystem: "System" / "System එක අනුව"`, `themeButton: (name) => \`Theme, ${name}\`` / `` `තේමාව, ${name}` ``.

- [ ] **Step 1: CSS.** Keep the current `:root` block as the dark set and add `color-scheme: dark` there. Add `:root[data-theme="light"]` overriding: `--hull #eef2f8`, `--hull-raised #ffffff`, `--hull-hover #e3e9f3`, `--ink #f8fafd`, `--rule #d5ddea`, `--rule-strong #b8c4d8`, `--paper #1d2638`, `--graphite #5b6880`, flow tokens to the light values (error `#e11d48`, selection `#7c3aed`), `color-scheme: light`. Change the variant to `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.
- [ ] **Step 2: Layout.** `<html data-theme="dark" suppressHydrationWarning>` without the `dark` class; `<script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />` first in `<head>`; viewport `themeColor: "#0c1420"` stays (ThemeSync updates it), remove `colorScheme`; render `<ThemeSync />`.
- [ ] **Step 3: Write `e2e/theme.spec.ts`** (fails first): "opens in dark on a first visit" (`html[data-theme=dark]`); "switches to light and remembers it" (open ThemeMenu by role button name `/^Theme, /`, choose menuitemradio "Light", expect `data-theme=light`, reload, still light); "applies the saved theme before the app loads" (save light via `addInitScript` setting localStorage, `page.goto(..., { waitUntil: "commit" })`, then `waitForEvent("domcontentloaded")`, expect `data-theme=light`); "follows the system when set to System" (`page.emulateMedia({ colorScheme: "light" })` → light, `"dark"` → dark).
- [ ] **Step 4: Implement** ThemeSync, hook, menu and strings; place the menu in `StudioHeader`.
- [ ] **Step 5: Run** `npm run typecheck && npm run lint && npx vitest run && npm run build && npx playwright test e2e/theme.spec.ts` → PASS.
- [ ] **Step 6: Run** `npm run check:bundles` → shell ≤ 333 KB.

### Task 3: Scene palettes and theme plumbing in the engine

**Files:**

- Modify: `src/engine/scene/palette.ts`, `src/engine/scene/scene-canvas.tsx`, `src/engine/scene/index.ts`, `src/engine/primitives/connection-wire.tsx`, `src/engine/primitives/packet.tsx`, `src/features/studio/studio-scene.tsx`
- Create: `src/engine/scene/palette-context.tsx`, `src/engine/scene/palette.test.ts`

**Interfaces:**

- Produces (`palette.ts`, no three.js import):
  - `type SceneTheme = "dark" | "light"`
  - `type PartRole = "tile" | "body" | "trim" | "panel" | "dark" | "screen" | "key" | "light"`
  - `interface ScenePalette { grid; gridMajor; wire; footprint; tile; screen; key; fade; request; response; warning; error; selection; screenUi: { text; faint; card }; kinds: Record<ComponentKind, string>; hemisphere: { sky; ground; intensity: number }; keyLight: number }` (strings are hex).
  - `SCENE_PALETTES: Readonly<Record<SceneTheme, ScenePalette>>`
  - `mixHex(a: string, b: string, t: number): string`
  - `roleColor(palette: ScenePalette, kind: ComponentKind, role: PartRole): string` — body = kind colour; trim = mix(body, black, .25); panel = mix(body, white, .35); dark = mix(body, black, .5); light = mix(body, white, .65); tile/screen/key from the palette.
  - `SCENE_COLORS` is removed; its users switch to the palette.
- Produces (`palette-context.tsx`): `ScenePaletteProvider({ theme, children })`, `useScenePalette(): ScenePalette`.
- `SceneCanvas` gains `theme: SceneTheme`; it wraps children in the provider, sets the hemisphere light (`sky`, `ground`, `intensity`) and one directional key light (`keyLight`) from the palette, and colours the `Grid` from it. Starting values: dark tile `#1a2540`, screen `#070b16`, key `#e2e8f0`, fade `#0c1220`; light tile `#ffffff`, screen `#0f172a`, key `#f8fafc`, fade `#eef2f8` (tune at the checkpoint).
- `studio-scene.tsx` passes `useResolvedTheme()` to `SceneCanvas`.

- [ ] **Step 1: Write failing `palette.test.ts`:** both themes define a colour for every `COMPONENT_KINDS` entry; "keeps bodies away from flow colours": for every kind and every flow colour of the same theme, RGB distance > 40 (not the same colour; the learner's chosen orange, violet and emerald are near the warning, selection and response hues by design, and those colours appear only on rings, packets and badges); "keeps kinds apart": every pair of kind colours distance > 45; `mixHex("#000000", "#ffffff", 0.5) === "#808080"`; `roleColor(p, "service", "body") === p.kinds.service`.
- [ ] **Step 2: Run** `npx vitest run src/engine/scene/palette.test.ts` → FAIL.
- [ ] **Step 3: Implement** palettes, context, canvas prop and wire/packet/grid colours from `useScenePalette()` (light theme: wire glow uses normal blending instead of additive, since additive vanishes on a light background).
- [ ] **Step 4: Run** palette tests → PASS; `npm run typecheck && npm run lint` → clean.

### Task 4: Role-tagged shapes and detailed models for client, mobile, service and database

**Files:**

- Modify: `src/engine/primitives/shapes.ts`, `src/engine/primitives/shapes.test.ts`
- Create: `src/engine/primitives/shape-library.ts`

**Interfaces:**

- Produces (`shapes.ts`):
  - `type ShapePart = PartBase & ({ geometry: "box"; size: Vec3 } | { geometry: "rounded"; size: Vec3; bevel: number } | { geometry: "cylinder"; radius: number; height: number } | { geometry: "screen"; size: [w: number, h: number]; picture: ScreenPicture })` with `PartBase = { at: Vec3; role: PartRole; station?: number }`. Screens are planes facing +z.
  - `type ScreenPicture = "web-page" | "app"`
  - `SHAPES` re-exported from `shape-library.ts`; `shapeBounds`, `componentsBounds`, `labelAnchor` unchanged in signature (screens count as zero-depth boxes).
- Rule for the library: parts are declared in painter's order (back to front, bottom to top), so the fallback drawing can keep their order.
- Details for the four kinds as listed in the spec's table (section 6.2), each starting with a `tile` part (rounded, about 0.12 high, 0.35 wider than the body each side). Gateway, identity, breaker and hop get roles on their current parts plus a tile, so they keep working until Task 7.

- [ ] **Step 1: Add failing tests** to `shapes.test.ts`: "every part has a role"; "every kind except hop stands on a tile" (first part role `tile`); "only client and mobile have screens" (`client` → `web-page`, `mobile` → `app`); "stations are unchanged" (gateway 5, breaker 3); "detail is richer" (client ≥ 40 parts, service ≥ 20). Existing `labelAnchor` tests stay.
- [ ] **Step 2: Run** `npx vitest run src/engine/primitives/shapes.test.ts` → FAIL.
- [ ] **Step 3: Implement** the types and the library (helpers such as `keyGrid`, `driveBays` as local functions).
- [ ] **Step 4: Run** → PASS; `npm run typecheck` → clean (the fallback drawing may need a temporary `screen` case drawing a box until Task 8).

### Task 5: Model builder, screen atlas and model cache

**Files:**

- Create: `src/engine/primitives/model-builder.ts`, `src/engine/primitives/model-builder.test.ts`, `src/engine/primitives/screen-atlas.ts`
- Modify: `src/engine/primitives/resources.tsx`

**Interfaces:**

- Produces (`model-builder.ts`):
  - `interface KindModel { solid: THREE.BufferGeometry; screens: THREE.BufferGeometry | null; lights: THREE.BufferGeometry | null; stations: { index: number; geometry: THREE.BufferGeometry }[]; dispose(): void }`
  - `buildKindModel(kind: ComponentKind, palette: ScenePalette): KindModel` — each part becomes a unit geometry (Box / `RoundedBoxGeometry` / Cylinder(48) / Plane) scaled and translated, converted with `toNonIndexed()`, given a `color` attribute from `roleColor`, then grouped: `screen` → screens (UVs remapped into the picture's atlas region), `light` → lights, `station !== undefined` → stations, everything else → solid; groups merged with `mergeGeometries`.
- Produces (`screen-atlas.ts`): `SCREEN_REGIONS: Record<ScreenPicture, { u0; v0; u1; v1 }>` (web-page left half, app right half of a 512×256 canvas); `createScreenAtlas(palette: ScenePalette): THREE.CanvasTexture` drawing the mockup's pictures (title-bar dots, address bar, heading, text lines, a card and a Pay button in the kind's colour; the app: header, amount, card, Pay button); guards a missing 2D context like `radialTexture`.
- Produces (`resources.tsx`): `useKindModel(kind: ComponentKind): KindModel` and `useScreenAtlas(): THREE.Texture`, cached per theme inside `SceneResourcesProvider` (which now takes `theme`) and disposed on theme change and unmount.

- [ ] **Step 1: Write failing `model-builder.test.ts`:** for each kind, the solid geometry has `position`, `normal` and `color` attributes and its bounding box lies within `shapeBounds(kind)` (±0.01); `client` and `mobile` have screens with a `uv` attribute inside their `SCREEN_REGIONS`; other kinds have `screens === null`; `buildKindModel("gateway", p).stations.length === 5`; the service solid's colour attribute contains the service body colour (converted to linear like `THREE.Color`).
- [ ] **Step 2: Run** `npx vitest run src/engine/primitives/model-builder.test.ts` → FAIL.
- [ ] **Step 3: Implement** builder, atlas and cache.
- [ ] **Step 4: Run** → PASS.

### Task 6: Component rendering and state feedback, then checkpoint 1

**Files:**

- Modify: `src/engine/primitives/component-node.tsx`, `src/engine/scene/scene-view.tsx` (if props change)

**Interfaces:**

- Consumes: Task 5 `useKindModel`, `useScreenAtlas`; Task 3 `useScenePalette`.
- `ComponentNode` props are unchanged. It renders: the footprint shadow; one solid mesh (`MeshPhongMaterial`, `vertexColors`, shininess ≈ 60, specular ≈ `#444444`); a screens mesh (`MeshBasicMaterial` with the atlas, `toneMapped: false`); a lights mesh (`MeshBasicMaterial`, `vertexColors`); one mesh per station with its own Phong material; a ground ring (`RingGeometry`, on the tile, `MeshBasicMaterial`, additive in dark, normal blending in light). No outline or edge-glow lines.
- State mapping (eased with the existing `damp` logic and `smooth` flag):
  - ring colour/opacity: selection (strongest) > busy tone > warning/error/down status; hidden when none;
  - busy: `emissive` += tone × 0.25 × activity; hover: `emissive` += white × 0.06;
  - dimmed: `color` = 1 − 0.45·dim and `emissive` += `palette.fade` × 0.45·dim (mixes toward the background in both themes, no transparency); screens/lights colour × (1 − 0.6·dim);
  - down: solid colour × 0.55, screens and lights off, error ring;
  - stations: their own emissive in the stage tone while busy (gateway checks, breaker lamps).

- [ ] **Step 1: Implement** the renderer.
- [ ] **Step 2: Run** `npm run check` → all pass (fix any broken engine tests).
- [ ] **Step 3: Run** `npm run build`, serve `out`, `npx playwright test` → all pass.
- [ ] **Step 4: Run** `npm run check:bundles` → within budgets (if the 3D chunk > 300 KB: stop and ask).
- [ ] **Step 5: Measure** with the scratchpad scripts: screenshots of every Retry step in dark and light (`shoot-module.mjs`), `measure-fps.mjs` on `retry-and-exponential-backoff` and `backend-for-frontend` (draw calls ≤ 47 and ≤ 68).
- [ ] **Step 6: Present checkpoint 1** (screenshots, numbers, proposed final colours for gateway, identity, breaker, hop) and wait for approval.

## Checkpoint 2: roll-out

### Task 7: Detailed models for gateway, identity, breaker and hop

**Files:**

- Modify: `src/engine/primitives/shape-library.ts`, `src/engine/scene/palette.ts`, `src/engine/primitives/shapes.test.ts`

- [ ] **Step 1: Add failing tests:** gateway ≥ 15 parts with 5 stations; breaker 3 stations; identity has a `dark` dial part; kind colours equal the values approved at checkpoint 1 (update the palette test's expectations).
- [ ] **Step 2: Run** shape and palette tests → FAIL.
- [ ] **Step 3: Implement** the details from the spec's table and the approved colours.
- [ ] **Step 4: Run** → PASS; screenshots of the API Gateway and Circuit Breaker modules in both themes.

### Task 8: Fallback drawing with roles and themes

**Files:**

- Modify: `src/engine/static/isometric-drawing.tsx`, `src/engine/static/isometric-drawing.test.tsx`, `src/features/studio/studio-stage.tsx`

**Interfaces:**

- `IsometricDrawingProps` gains `theme: SceneTheme`; `studio-stage.tsx` passes `useResolvedTheme()`.
- Components sorted by depth; parts drawn in declaration order. Faces: top `mix(role colour, white, .2)`, right `mix(…, black, .2)`, front the role colour; `rounded` drawn as a box; `screen` as a polygon in the palette's screen colour; keys may be reduced to the key-well polygon. Unfocused components at opacity 0.35. Wires and labels use the palette and tokens.

- [ ] **Step 1: Add failing tests:** "colours parts by kind and theme" (a client layout in light contains a polygon filled with `roleColor(light, "client", "body")`; in dark the same with the dark palette); "dims unfocused components" (group opacity 0.35); existing label/view-box tests keep passing.
- [ ] **Step 2: Run** `npx vitest run src/engine/static` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** → PASS; screenshot the no-WebGL view of every module in both themes.

### Task 9: Light UI polish and contrast

**Files:**

- Modify: `src/app/globals.css` (and any component whose light rendering needs a token fix)
- Create: `src/app/tokens.test.ts`

- [ ] **Step 1: Write failing `tokens.test.ts`:** read `globals.css`, parse the dark (`:root {`) and light (`:root[data-theme="light"]`) blocks; for each theme assert WCAG contrast ≥ 4.5 for `--paper` on `--hull`, `--hull-raised` and `--ink`, and `--graphite` on `--hull` and `--hull-raised`.
- [ ] **Step 2: Run** `npx vitest run src/app/tokens.test.ts` → FAIL until values pass.
- [ ] **Step 3: Review** screenshots of the explorer, studio header, dock, scenario and speed menus, inspector (both levels, Sinhala), completion and reset dialogs, and the planned-concept page in light; fix tokens or classes.
- [ ] **Step 4: Run** the token test → PASS.

### Task 10: Every module in both themes, end-to-end checks, then checkpoint 2

**Files:**

- Modify: `src/content/modules/*/structure.ts` (only `labelPlacement` or small position fixes), `e2e/theme.spec.ts`

- [ ] **Step 1: Add e2e tests** to `theme.spec.ts`: "switches theme mid-playback" (choose Step 4 of the Retry module, switch to Light while it plays, expect the badge `attempt 4 · paid` within 20 s and the current step still Step 4); "follows a change made in another tab" (two pages in one context; set Light in page A; page B gets `data-theme=light` without reload); "walks a module in light" (saved Light; open every Retry step and scenario step, no page errors); axe on the Retry module page and the explorer in Light with no serious violations.
- [ ] **Step 2: Run** `npx playwright test e2e/theme.spec.ts` → FAIL where unimplemented, then fix until PASS.
- [ ] **Step 3: Screenshot** all four modules (every step and scenario step) in both themes; fix label and wire collisions with `labelPlacement` or small position changes.
- [ ] **Step 4: Run** `npm run check`, `npm run build`, `npx playwright test`, `npm run check:bundles`, `measure-fps.mjs` for all four modules → all pass, budgets and frame time met.
- [ ] **Step 5: Present checkpoint 2** and wait for approval.

### Task 11: Documentation and Completion Report

**Files:**

- Create: `docs/adr/0010-glossy-toy-style-and-light-theme.md`
- Modify: `docs/adr/README.md`, `docs/adr/0006-stylized-isometric-visual-style.md` and `0007-drafting-plate-design-system.md` (status note "partly superseded by ADR-0010"), `CLAUDE.md` (theme line: "Dark (default) and light"; "Dark-first interface" notes the light option), `README.md`, `docs/adding-a-concept.md` (a new kind needs roles, a tile, a body colour that passes the palette tests).

- [ ] **Step 1: Write** the ADR (context, decision, consequences: tokens per theme, role palette, merged models, ring states, budgets measured).
- [ ] **Step 2: Update** the other docs; `npx prettier --write` them.
- [ ] **Step 3: Run** `npm run check` → PASS.
- [ ] **Step 4: Present** the Completion Report (CLAUDE.md format); commit only when asked.
