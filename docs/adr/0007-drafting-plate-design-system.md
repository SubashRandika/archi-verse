# ADR-0007: "Drafting plate" design system

- **Status:** Accepted (Phase 2, 2026-11-24). Supersedes the UI colour/typography direction in
  `docs/phase-0-plan.md`.

## Context

The Phase 0 direction (neutral near-black, Geist, a single cyan accent) was the most generic
"dark developer tool" look. The subject matter — software architecture — has its own visual
vernacular: technical drawings, isometric drafting, title blocks. That is where a distinctive,
purposeful identity can come from.

## Decision

**One bold element:** the Learning Studio canvas is a _drafting plate_ — an ink-blue surface with a
true isometric grid (±30°), corner registration marks, and a playback dock designed as the
drawing's **title block** (ruled cells: transport · timeline · current step · speed). Everything
around it stays quiet.

| Token         | Value                                                                                          | Role                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `hull`        | `#0c1420`                                                                                      | Chrome background (sidebar, inspector, header)                            |
| `hull-raised` | `#121c2b`                                                                                      | Raised surfaces (dock, popovers, code blocks)                             |
| `hull-hover`  | `#172437`                                                                                      | Hover / current-item background                                           |
| `ink`         | `#0f1b2d`                                                                                      | The plate (canvas) — brightest dark surface                               |
| `rule`        | `#1d3150`                                                                                      | Borders, minor grid                                                       |
| `rule-strong` | `#2b4467`                                                                                      | Input borders, major grid, dock border                                    |
| `paper`       | `#e3e9f2`                                                                                      | Primary text, primary button                                              |
| `graphite`    | `#8a97ac`                                                                                      | Secondary text, icons                                                     |
| `flow-*`      | request `#4cc9f0`, response `#3dd68c`, warning `#f5b83d`, error `#f2577a`, selection `#a78bfa` | **Meaning only** — never decoration. Selection doubles as the focus ring. |

**Typography:** IBM Plex. Sans for UI and reading text; Sans Condensed for drafting labels (title
block, canvas labels, wordmark); Mono only for real protocol text (HTTP, headers, JSON). Sentence
case everywhere; no all-caps labels. Type scale tokens: `label` 12, `caption` 13, `ui` 14,
`reading` 15 (line-height 1.6), `title` 20, `display` 28.

**Motion:** CSS transitions only; all motion collapses under `prefers-reduced-motion`.

## Verification

All text/background token pairs meet WCAG AA (lowest: graphite on `hull-hover`, 5.29:1). axe
reports no serious/critical violations at desktop and mobile sizes (Phase 2 e2e tests).

## Consequences

- Chrome has no accent colour; interactive emphasis uses `paper` (e.g. the play button), so flow
  colours in the 3D scene stay unambiguous.
- The plate is a CSS container (`@container`); overlays adapt to the plate width, not the
  viewport, because panel sizes change independently of the window.
