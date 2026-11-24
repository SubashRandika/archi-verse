# ADR-0003: Declarative step "beats" compiled to a GSAP timeline

- **Status:** Accepted (Phase 0, 2026-11-24) — implemented in Phase 4

## Context

Guided learning needs play/pause, previous/next step, restart, speed control, a scrubbable
timeline and scenario switching — all in sync with the 3D scene and the explanation panel.

## Decision

Each learning step declares a list of **beats** (`packet`, `process`, `pulse`, `reveal`,
`setStatus`, `camera`) as plain data. An engine compiler turns them into one **GSAP master
timeline** with a label per step. The timeline is the single source of truth for playback; React
state mirrors only coarse values (current step, playing, speed).

Every step also declares its **initial scene state**, so jumping directly to any step renders
correctly without replaying earlier steps.

## Alternatives considered

- **Custom `useFrame` timeline** — no dependency, but would re-implement labels, seeking,
  `timeScale`, reversing and easing.
- **Motion (Framer Motion) for 3D** — good for UI, weaker for long, seekable, multi-object
  sequences.
- **Theatre.js** — powerful authoring UI, but adds an editor workflow we do not need.

## Consequences

- Playback controls map almost 1:1 to GSAP (`seek(label)`, `timeScale`, `pause`, `play`).
- GSAP is free under its own "no-charge" license (not OSI open source); acceptable for a personal
  project.
- Camera transitions use Drei `CameraControls` rather than GSAP, to avoid two systems fighting
  over the camera.
