# ADR-0004: State tiers with Zustand and localStorage

- **Status:** Accepted (Phase 0, 2026-11-24) — implemented from Phase 3. Validation on load:
  superseded by [ADR-0009](./0009-first-load-budget-lazy-ui.md) (plain type guards instead of Zod).

## Context

The app has long-lived learner data (progress, preferences), per-session studio state (step,
selection, mode), shareable location (URL) and per-frame animation values. Mixing these causes
unnecessary re-renders and persistence bugs.

## Decision

| Tier      | Mechanism                                                                                 |
| --------- | ----------------------------------------------------------------------------------------- |
| Persisted | Zustand `persist` → `localStorage`, versioned with migrations, validated with Zod on load |
| Session   | A Zustand store created per studio instance (reset on concept change)                     |
| URL       | Search params for step and scenario                                                       |
| Per-frame | three.js objects mutated by GSAP/refs — never React state                                 |

## Alternatives considered

- **Redux Toolkit** — robust, but more ceremony than this app needs.
- **React Context only** — re-renders every consumer on change; no transient subscriptions.
- **IndexedDB** — async and more complex; justified only for large or binary data. Progress is a
  few KB.

## Consequences

- Zustand selectors and transient `subscribe` keep the canvas isolated from UI re-renders.
- Stores are callable outside React (e.g. from GSAP callbacks).
- Corrupted or outdated storage resets safely instead of crashing the app.
