# ADR-0008: 3D scene engine architecture

- **Status:** Accepted (Phase 4, 2026-11-24)
- **Builds on:** ADR-0002 (React Three Fiber), ADR-0003 (GSAP timeline), ADR-0004 (state
  tiers), ADR-0006 (stylized isometric style)

## Context

Phase 4 turns the placeholder sketch into an interactive isometric scene with guided playback.
The engine has to serve future modules without knowing about any specific concept, stay idle
when nothing moves (integrated-GPU laptops are the target), keep three.js out of pages that
don't need it, and remain testable without a GPU.

## Decision

### Layers

- **`lib/scene-spec`**: the contract. A module describes a _layout_ (components with a kind,
  label, role and ground position; connections with optional waypoints) and, per step, a
  _step scene_: components in focus, components to frame, and a list of **beats** (`packet`,
  `process`, `wait`) that run in order. Plain serialisable data, shared by `content/` and
  `engine/`, which may not import each other.
- **`engine/timeline`**: compiles beats into **one paused GSAP master timeline** with a span
  per step. GSAP tweens plain _channels_ (packet progress and visibility, component activity),
  never three.js objects. A `TimelineController` plays the current step to its end with
  `tweenFromTo` and stops exactly there. Jumping to any step seeks the master timeline, which
  restores every channel. Pure TypeScript, unit-tested in jsdom.
- **`engine/primitives`**: reusable 3D parts. Component shapes are **data** (a few scaled unit
  boxes and cylinders per kind), drawn from shared geometries. Outlines and glows are three.js
  fat lines (`three/addons/lines`) over shared edge geometries. Each component owns four
  materials and eases its emphasis (dimmed, hovered, selected, busy) per frame.
- **`engine/scene`**: the canvas (orthographic, `frameloop="demand"`, pixel ratio ≤ 1.75), the
  camera rig (camera-controls via Drei, bounded orbit, zoom and pan, framing computed by a pure
  `computeFraming`), scene labels as one DOM layer positioned per frame, render stats, and a
  `?perf` overlay.
- **`features/studio`**: the per-studio **session store** (Zustand: step, playing, step
  complete, mode, selection, hover) plus the glue. `TimelineDriver` keeps the controller in
  sync with the store, `CameraDirector` frames steps, `StudioStage` handles lazy loading and
  the WebGL fallback, and `SceneOutline` and the keyboard shortcuts provide accessible control.

### Playback model

- Navigating to a step (next, previous, timeline tick, restart) **plays that step once** and
  stops on its final state, so a learner reads the explanation against a settled scene.
- Play on a finished step moves to the next step. On the last step it replays.
- Playing or navigating records the step in local progress ("in progress").

### Rendering budget

- Render **on demand only**: the timeline (while playing), camera-controls (while moving) and
  easing highlights (while settling) request frames. A paused scene renders **zero frames**,
  which the browser tests assert. Hidden tabs stop playback.
- Per-frame values never enter React. The dock's progress bar subscribes to a tiny progress
  channel and writes a CSS transform.
- The 3D code is one lazily loaded chunk, imported only by `StudioStage` on module pages.

### Look (from the Phase 4 look-dev spike)

The **hybrid** style approved by the product owner: lit solid bodies with paper outlines and
soft ground footprints (legible form), plus an additive glow in a flow colour on whatever is
active or selected (focus). No post-processing (no bloom); glows are wide, transparent,
additively blended lines and sprites. Screenshots of the two candidates are in `docs/look-dev/`.

## Alternatives considered

- **GSAP tweening three.js objects directly**: simpler at first, but untestable without WebGL
  and hard to seek reliably. Rejected.
- **One GSAP timeline per step**: no global seek. Restoring state when jumping between steps
  would need hand-written "reset" code. Rejected in favour of one master timeline.
- **Drei `Html` labels**: each label creates its own React root. Under React 19 dev mode a label
  went missing during the spike, and it costs a root per label. Replaced by one DOM layer.
- **Drei `Edges` / `Line`**: create a geometry per instance and pull in `three-stdlib`'s copy of
  the line code. Replaced by three's own line add-ons over shared geometry.
- **Bloom post-processing for glow**: an extra full-screen pass and a dependency, for an effect
  that layered lines reproduce well at this scale. Rejected.

## Consequences

- New modules add data (layout, steps, beats). New component kinds add a shape entry.
- Beats run strictly in sequence. Parallel beats (two packets at once) can be added to the
  compiler when a module needs them.
- Real frame rates can only be measured on hardware (headless browsers render WebGL in
  software). The `?perf` overlay supports that manual check.
- The React Compiler's `react-hooks/immutability` lint rule is disabled for `src/engine/**/*.tsx`
  only, because imperatively updating three.js objects is the intended R3F pattern there.
