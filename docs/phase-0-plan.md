# Phase 0 — Approved Plan

Approved 2026-11-24. This is the reference for scope decisions; `CLAUDE.md` holds the full brief.

## Decisions on open questions

| #   | Question                              | Decision                                                                   |
| --- | ------------------------------------- | -------------------------------------------------------------------------- |
| Q1  | 3D asset strategy                     | Stylized isometric, built in code — no realism requirement (ADR-0006)      |
| Q2  | First module scope                    | One complete concept: **API Gateway — the life of a request**              |
| Q3  | Concepts without a module             | Shown as _Planned_ with a description; can be marked complete manually     |
| Q4  | Performance target                    | Integrated GPU (Intel Iris Xe class), 1080p, 60 fps                        |
| Q5  | Content review workflow               | Module script drafted as a markdown doc and reviewed before implementation |
| —   | Concepts listed in several categories | Stored once, referenced by several categories, single progress record      |

## MVP scope

| Feature             | In MVP                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Concept Explorer    | 16 categories, all concepts, descriptions, status (not started / in progress / completed / planned), category progress, search & filter |
| Learning Studio     | Isometric scene, selection, highlighting, animated request/response packets, per-step camera, Guided & Explore modes                    |
| Explanation Panel   | Beginner/Advanced toggle without losing position, step explanations, glossary terms                                                     |
| Component Inspector | Purpose, responsibilities, how it works, inputs/outputs, talks to, technologies, examples, pros/limits; packet inspection               |
| Playback            | Play/pause, prev/next, restart, 0.5×–2× speed, chapter-segmented timeline, keyboard shortcuts                                           |
| Scenarios           | Success, 401, 429, timeout → retry with backoff, 503 → re-route to healthy instance                                                     |
| Progress            | localStorage, manual "Mark complete", resume last step, reset                                                                           |

Excluded: quizzes, gamification, auth, cloud sync, dashboards, AI-generated content features.

## Data model (initial)

| Entity         | Key fields                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Category       | `id, slug, title, description, order, icon, conceptIds[]`                                                                                               |
| Concept        | `id, slug, title, summary, categoryIds[], availability: 'available' \| 'planned', moduleId?`                                                            |
| LearningModule | `id, conceptId, objectives[], components[], connections[], chapters[], steps[], scenarios[]`                                                            |
| ComponentDoc   | `id, kind, name` + beginner/advanced `purpose, responsibilities, howItWorks, inputs, outputs, talksTo, technologies, examples, advantages, limitations` |
| Step           | `id, chapterId, title, explanation{beginner, advanced}, focus[], camera, initialState, beats[], terms[]`                                                |
| Beat           | union on `type`: `packet \| process \| pulse \| reveal \| setStatus \| camera`                                                                          |
| Scenario       | `id, title, branchesFromStepId, steps[]`                                                                                                                |
| ProgressState  | `version, concepts: Record<conceptId, {status, lastStepId, updatedAt, completedAt?}>`                                                                   |
| Preferences    | `version, explanationLevel, playbackSpeed, autoAdvance, panelLayout`                                                                                    |

## First module — API Gateway: the life of a request

Scene: Browser client · network path · API Gateway (with an internal pipeline: TLS → Auth → Rate
limit → Validate → Route) · Orders Service ×2 · Users Service · PostgreSQL · Identity Provider
(idle; the gateway validates JWTs with cached JWKS).

| Chapter            | Steps                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| 1. The request     | 1 Meet the client · 2 Anatomy of an HTTP request · 3 Across the network                   |
| 2. The gateway     | 4 One front door · 5 Authentication · 6 Rate limiting · 7 Validation & routing            |
| 3. The backend     | 8 Service business logic · 9 Querying the database · 10 Building the response             |
| 4. The return trip | 11 Response flows back · 12 Full lifecycle recap & latency breakdown → scenarios unlocked |

## UI/UX direction

Dark graphite-blue developer instrument. Semantic colour: cyan = request, emerald = response,
amber = warning/throttle, rose = error, violet = selection. Geist Sans for UI, Geist Mono for
technical data. Layout: collapsible left sidebar (~280px) · central isometric canvas · resizable
right inspector (~380px, Step/Component tabs, Beginner/Advanced switch) · floating playback dock
with chapter-segmented timeline. Keyboard shortcuts, screen-reader scene outline, reduced-motion
support, WebGL fallback.

## Phases

| Phase | Deliverable                                                                   |
| ----- | ----------------------------------------------------------------------------- |
| 1     | Project foundation (this repo setup)                                          |
| 2     | Application shell & UI foundation                                             |
| 3     | Learning navigation & local progress                                          |
| 4     | 3D visualization foundation — starts with a look-dev spike for style approval |
| 5     | API Gateway module — content doc reviewed first                               |
| 6     | Engine hardening                                                              |
| 7+    | One concept at a time                                                         |
