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
