# ADR-0002: React Three Fiber + Drei for 3D rendering

- **Status:** Accepted (Phase 0, 2026-11-24) — dependencies installed in Phase 4

## Context

The Learning Studio renders an interactive 3D isometric scene whose contents (highlighted
components, selected item, current step) are driven by React application state.

## Decision

Use **three.js** through **React Three Fiber** with **Drei** helpers (`CameraControls`, `Html`,
`RoundedBox`, `Edges`/`Outlines`, `ContactShadows`).

## Alternatives considered

- **Plain three.js** — full control, but requires hand-written synchronisation between React state
  and the scene graph, manual disposal, and manual event handling (raycasting).
- **Babylon.js / PlayCanvas** — capable engines, but heavier and outside the React ecosystem.

## Consequences

- Scene is declarative; resources are disposed when components unmount.
- React reconciliation must not run per frame: animation mutates three.js objects via refs
  (`useFrame` / GSAP), never via React state.
- three.js adds ~150 KB gzip; it must stay in a lazily loaded chunk.
