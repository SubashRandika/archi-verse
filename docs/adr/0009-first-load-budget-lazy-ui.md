# ADR-0009: Keeping the first load small: lazy menus and dialogs, plain checks for saved data

- **Status:** Accepted (Phase 6, 2026-11-24). Supersedes the "validated with Zod on load" part
  of [ADR-0004](./0004-state-tiers-zustand.md).

## Context

At the end of Phase 5 the module page's first-load JavaScript was 350 KB gzipped, exactly the
approved limit. The next concepts will add code, so the limit needs headroom. A breakdown of the
first load (`next analyze`) showed three large costs that a first visit never uses:

| Cost                                                                | Size (gzip, approx.) |
| ------------------------------------------------------------------- | -------------------- |
| Menu, dialog and focus-management code (Base UI, floating-ui)       | ~25 KB               |
| `zod/mini`, used only to validate two small objects in localStorage | ~16 KB               |
| The studio strings, shipped twice (once per route chunk)            | ~3 KB                |

## Decision

1. **Menus load on first use.** `lazyMenu()` (`src/components/lazy-menu.tsx`) renders a menu's
   trigger on its own until the first click; hovering or focusing it prefetches the menu chunk.
   The first click mounts the real menu, already open. `useLazyMenuState()` moves focus to the
   real trigger before the menu opens, so closing it returns focus there.
2. **Dialogs and drawers load when first opened**: the reset-progress dialog
   (`sidebar-menus.tsx`) and the mobile drawers (`shell/mobile-sheets.tsx`), via `React.lazy`.
3. **Saved data is validated with small type guards** (`src/lib/validate.ts`), keeping the same
   behaviour: each preference falls back to its default on its own; invalid progress records
   are dropped with a warning. Zod stays for the content schemas, which only tests use.
4. **The shell uses the studio strings** (the explanation panel's resize handle), which places
   them in the shared layout chunk instead of each route's chunk.

Result: module page 350 → 309 KB, home page 201 → 185 KB.

## Alternatives considered

- **`next/dynamic` for whole components.** It would also defer the triggers, which must render
  with the page (layout shift, missing controls before load).
- **Keeping Zod, splitting it into a lazy chunk.** Stores must validate before the first
  render that uses saved data; waiting for a chunk would delay restoring progress.
- **Raising the limit.** It postpones the problem and the cost lands on every visit.

## Consequences

- The first click on each menu waits for its chunk. It is prefetched on hover and focus, and is
  a few KB, so the delay is not noticeable on the built site.
- New menus and dialogs must follow the same pattern; `CONVENTIONS.md` says so.
- The bundle check's limit is lowered so the headroom cannot silently disappear.
