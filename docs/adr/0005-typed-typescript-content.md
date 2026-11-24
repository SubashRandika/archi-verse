# ADR-0005: Learning content as typed TypeScript data

- **Status:** Accepted (Phase 0, 2026-11-24)

## Context

Content (categories, concepts, steps, beginner/advanced explanations, component docs, scenarios)
must be separate from visualisation code, validated, and versioned with the code. There is a
single author.

## Decision

Store content as **typed TypeScript objects** under `src/content/`, validated by **Zod** schemas in
unit tests. Rich explanations use a small set of typed blocks (paragraph, list, callout, code,
term) instead of MDX. The catalog (metadata only) loads eagerly; each module's content is loaded
with dynamic `import()` when its concept is opened.

## Alternatives considered

- **MDX** — nicer prose authoring, but adds build tooling and weakens structure/validation.
  Revisit in Phase 6 if authoring becomes painful.
- **Headless CMS** — infrastructure and network dependency with no benefit for a single author.

## Consequences

- Compile-time errors for broken references (e.g. a step focusing an unknown component id).
- Content cannot import React, three.js or engine code (ESLint rule).

## Update (Phase 5, 2026-11-24)

- **Delivery changed:** module text is not loaded with a dynamic `import()` on the client.
  Server routes read it and pass it as props, so it ships as route data (HTML and RSC payload)
  and never as client JavaScript: `@inspector/[conceptSlug]` (a parallel route) passes the full
  text to the explanation panel; `[conceptSlug]` passes the titles to the studio. Only the
  language-free structure (layout, beats) is client code. An ESLint rule keeps text out of
  `features/` and `components/`. Concept summaries left the eager catalog for the same reason.
- **Languages:** text is stored per locale (`en`, `si`) with language-free references in one
  shared file. Both languages ship with the page so switching is instant. Typed blocks gained
  `table` and a `text` code language; each level has a body and an example.
