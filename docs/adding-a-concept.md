# Adding a concept

How to turn a planned concept from the catalog into a learning module, from Phase 7 on. It
follows the 13 steps in CLAUDE.md and names the file or command for each. API Gateway is the
worked example throughout (`src/content/modules/api-gateway/`).

One concept at a time: the next one starts only after this one is approved.

## 1. Plan it on paper (steps 1–9), then get approval

Write `docs/modules/<id>.md`, like [api-gateway.md](modules/api-gateway.md), and get it approved
before writing code. It covers:

1. **The concept**: what it is, and the one problem it solves.
2. **Learning objectives**: what the learner can explain afterwards (4–6 points).
3. **Beginner level**: the everyday analogy that will run through every step.
4. **Advanced level**: the technical points, numbers and trade-offs worth showing.
5. **Parts of the scene**: the components and connections. Reuse the existing shapes
   (`client`, `mobile`, `gateway`, `service`, `database`, `identity`, `breaker`, `hop`) where
   they fit. Add a new kind (`COMPONENT_KINDS` in `lib/scene-spec`) only when no existing shape
   works. It needs (ADR-0010):
   - a list of parts in `src/engine/primitives/shape-library.ts`, each with a role (`body`,
     `trim`, `panel`, `dark`, `light`, …), declared in painter's order (back to front, bottom
     to top), starting with a `tile`;
   - a body colour in `KINDS` (`src/engine/scene/palette.ts`) that passes the palette tests:
     clearly apart from the flow colours (request, response, warning, error, selection) and
     from the other kinds. Never gold or amber, which read as a warning.
6. **The 3D picture**: a sketch of the layout on the grid, which parts each step focuses on.
7. **Animations and interactions**: per step, the beats (packets, work, statuses, badges) and
   what to click.
8. **Scenarios**: the failure or alternative paths that teach something the main path cannot,
   and the main step each one branches from.
9. **The learning sequence**: chapters and steps, each with one idea and one "watch" line.

## 2. Build it (step 10)

```bash
npm run new:module <concept-id>     # the id from src/content/catalog/categories
npx prettier --write src/content
```

The scaffold creates `src/content/modules/<id>/`, registers it, and links the catalog concept
(which makes it "available" in the sidebar). It already passes the checks, so build in small
verified steps:

1. **Layout** in `structure.ts`: components on the grid (one unit = one cell; x right, z towards
   the viewer), connections with `via` waypoints along the grid.
2. **Steps and beats** with the kit in `src/content/modules/beats.ts`: `send`, `work`, `stage`,
   `signal`, `status` + `badge`, `wait`, `timed`, `burst`. Set `focus` (what is lit) and, when
   the camera should frame less than the focus, `frame`.
3. **Text** in `text/`: `en-steps.ts` and `si-steps.ts` (both levels, every step), `en.ts` and
   `si.ts` (chapters, scenarios, part descriptions, glossary, captions, badges), `shared.ts`
   (each step's terms and message, message code). Rules: CONVENTIONS.md → Writing module text.
4. **Scenarios**: `scenarios` in `structure.ts`, with `initial` statuses for each step so that
   jumping to any step shows the right state.
5. Search for `TODO`; none may remain.

Nothing outside `src/content/modules/<id>/` should need to change. If it does, that is an engine
improvement: discuss it first.

## 3. Test it (step 11)

- `npm run check`: `modules.test.ts` checks the module against the schema, the links between
  structure and text, and both languages.
- `npm run test:e2e`: `e2e/modules.spec.ts` opens every step and scenario step of the new
  module and fails on console errors. Add `e2e/<id>-module.spec.ts` for anything specific
  (see `e2e/api-gateway-module.spec.ts`).
- `npm run docs:module-text -- <id>` writes `docs/modules/<id>.text.md` for reading the text in
  both languages side by side.

## 4. Review it (step 12)

- **Screenshots of every step and scenario step, in the dark and the light theme**, at the end
  of each step: no wire or label crosses another label (use `labelPlacement` or a small
  position change), focus and badges read clearly.
- **The fallback**: with WebGL turned off, the drawing shows the same layout in both themes.
- **Performance**: `npm run build && npm run check:bundles` (shell ≤ 333 KB, 3D chunk ≤ 300 KB).
  On real hardware, `/learn/<id>?perf` shows the frame rate (60 fps while animating) and draw
  calls.
- **Usability**: walk the module once with the keyboard only, once in Sinhala, once in Advanced.

## 5. Progress (step 13)

Nothing to build: resuming at the last step and marking the concept completed come with the
studio. Check them in the browser: reload mid-module, and mark it completed from the last step.

Then write the completion report and ask for approval.
