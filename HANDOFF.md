# Handoff

> Generated: 2026-11-25
> Project: archi-verse (`c:\My Workspace\Personal Projects\archi-verse`)
> Session summary: Phase 7 concept work. Circuit Breaker (21eaf15) and Backend for Frontend
> (e9992d2) modules are built and committed. The user has just APPROVED the plan for the next
> concept, **Retry and Exponential Backoff**. Start with checkpoint 1 (the module script).

## Goal

Archiverse is a personal 3D isometric system-design learning platform (Next.js 16 static export,
React 19, R3F, GSAP, Zustand). In Phase 7 the user adds learning modules one concept at a time,
under strict phase gating (CLAUDE.md, Rules 1–2). The current goal is a complete **Retry and
Exponential Backoff** module (catalog id `retry-and-exponential-backoff`) in English and Sinhala,
with Beginner and Advanced levels, reaching the same quality bar as the Circuit Breaker and BFF
modules. It goes through two approval checkpoints, then a Completion Report, and is committed only
when the user asks.

## Current State

**Working (verified at e9992d2, working tree clean):**

- Three complete modules: `api-gateway`, `circuit-breaker`, `backend-for-frontend`.
- `npm run check`: typecheck, lint, format and 183/183 unit tests pass.
- `npx playwright test`: 64/64 pass (needs `npm run build` first).
- `npm run check:bundles`: shell first load 312/333 KB on module pages; lazy 3D chunk 288/300 KB.
- BFF scene: median frame 16.7 ms, 68 draw calls, 0 idle frames.

**Broken:** nothing known. Known non-issues:

- The R3F 9.8.2 THREE.Clock console warning is harmless.
- `scripts/fix-export-segments.mjs`, run after `next build`, is a needed Windows workaround.
- The Sinhala still needs a native speaker's review.

**Approved plan, as presented to and approved by the user (all items as recommended):**

- **Running example:** three shoppers press Pay at the same moment, and the Payments service has a
  brief problem (a deploy or a short overload).
- **Scene, with no new shapes:**
  - Shopper A (`client`, the laptop), Shopper B (`mobile`), Shopper C (`mobile`)
  - Payments service (`service`)
  - Payments DB (`database`)
- **Chapter "Things fail for a moment":**
  1. A blip: one payment gets a 503, but Payments is fine a second later (transient vs permanent
     errors).
  2. Just try again: the retry succeeds. Which errors to retry (5xx, timeouts, 429) and which not
     (400, 401, 404).
- **Chapter "Retrying without making it worse":**
  3. Everyone retries at once: Payments' load badge triples (a retry storm).
  4. Exponential backoff: waits of 1 s, 2 s, 4 s, with attempt and wait badges.
  5. Add jitter: the three shoppers' retries drift apart. The offsets are fixed, so every replay is
     the same; the text says so.
  6. Know when to stop: a limit on attempts, a deadline, then a clear error (and where a circuit
     breaker takes over).
- **Chapter "Is it safe to repeat?":**
  7. The double charge: the POST succeeds, the response is lost, and the retry charges again
     ("charged twice").
  8. Idempotency keys: an `Idempotency-Key` header returns the first result ("charged once").
     Kept introductory, because the separate Idempotency concept will go deeper.
- **Scenarios:**
  - "The server says when" (from step 4): a 503 with `Retry-After: 5`, and the clients wait
    exactly that long.
  - "Retries multiply" (from step 6): 3 client attempts × 3 Payments→DB attempts = up to 9 queries.
    Retry at one layer only.
- **Illustrative numbers:** 1/2/4 s waits, 3 attempts, 10 req/s capacity. Time is compressed in
  playback, and the badges show the real values.

## Files in Play

| File | Why It Matters |
| --- | --- |
| `CLAUDE.md` | Phase gating and the required plan / Completion Report formats. Follow exactly. |
| `C:\Users\Lenovo\.claude\projects\c--My-Workspace-Personal-Projects-archi-verse\memory\project-phase-status.md` | Phase status memory. Update it at each checkpoint. |
| `docs/modules/backend-for-frontend.md` | The latest script. Copy its structure (objectives, running example, scene table, steps with Beginner/Advanced, scenarios, components, glossary, numbered **Review** items). |
| `docs/modules/circuit-breaker.md` | The other script template. Its "Status" header shows how to mark a script Approved and list what changed while building. |
| `src/content/modules/backend-for-frontend/structure.ts` | The latest module structure: `timed()` for parallel callers, hidden wires, `labelPlacement`, badge helpers. |
| `src/content/modules/circuit-breaker/structure.ts` | Has `burst()` with `onArrive` and the retry-storm scenario (`no-breaker` → `retry-storm`). The most similar visuals. |
| `src/content/modules/*/text/{shared,en,en-steps,si,si-steps,index}.ts` | The text format: `shared.ts` holds language-free messages (HTTP/text lines), step links (`terms`, `message`) and `exampleCode`; `en.ts`/`si.ts` hold chapters, scenarios, messages, components, badges and glossary. |
| `src/content/modules/beats.ts` | The authoring kit: `send`, `work`, `stage`, `signal`, `badge`, `status`, `wait`, `timed`, `burst`. |
| `src/content/modules/text-blocks.ts` | `p`, `list`, `callout`, `code(lang, caption, lines)`, `step(title, watch, beginner, advanced)`. |
| `src/content/modules/types.ts` | `LocaleText`, `ComponentDoc`, `StepLinks`, `MessageCode`, etc. |
| `src/lib/scene-spec/index.ts` | `COMPONENT_KINDS`: client, mobile, gateway, service, database, identity, breaker, hop. |
| `src/engine/timeline/compile.ts` | How beats become a timeline (see the pitfalls below). |
| `e2e/backend-for-frontend-module.spec.ts` | The template for the new module's browser test spec. |
| `scripts/check-bundles.mjs` | Add `"/learn/retry-and-exponential-backoff (module)"` to `PAGES`. |
| `src/content/catalog/categories/07-api-communication.ts` | The concept definition (also a `ref(...)` in `10-resilience-reliability.ts`). The scaffold links it. |
| `README.md` | The status line counts complete modules (now "Three"), plus a docs link list. Update both. |

## What Has Been Tried (and Why It Failed)

Lessons from the Circuit Breaker and BFF builds. Don't repeat them.

### `process` beats inside `timed()`

- **What:** putting `work(...)` beats in a `timed([...])` list to make components glow in parallel.
- **Why it fails:** `compile.ts` advances the clock by a process beat's duration, but `timed()`
  assumes beats take no time. Everything after it drifts late.
- **Instead:** in `timed()`, use only packets with `next: 0` and `status` beats. Put `work()` before
  or after the timed block.

### e2e: clicking Play after choosing a step

- **What:** `click(step)`, then `click(Play)`, then expect a badge.
- **Why it fails:** choosing a step already plays it. The extra click let playback continue into
  the next step, and the Circuit Breaker test passed only because step 6 had the same badge.
- **Instead:** `await expect(sceneLabels(page)).toContainText("…", { timeout: 20_000 })`, then
  assert `currentStep(page)` has the right accessible name.

### Badge text over 32 characters

- **What:** a long Sinhala badge.
- **Why it fails:** the schema caps badges at 32 characters, so `modules.test.ts` fails with
  `too_big … badges.<id>`.
- **Instead:** keep badges short in both languages.

### Wires through components or labels

- **What:** in the first BFF layout, a `via` point sat in front of the Mobile BFF, and the wire
  crossed its label.
- **Why it fails:** in this isometric view +x goes screen down-right and +z goes screen down-left.
  A tall rack hides ground behind it in the screen-up direction.
- **Instead:** always take screenshots. Fix crossings by spreading rows in z, moving `via` points, or
  using `labelPlacement: "below" | "right"`.

### Shell quoting in Bash with apostrophes

- **What:** `node -e '...'` containing text like "client's".
- **Why it fails:** the apostrophe ends bash's single quotes.
- **Instead:** write a `.cjs` file in the scratchpad (with a `<<'EOF'` heredoc) and run it.

### Tests that hard-code which concepts have modules

- **What:** `filter.test.ts` and `catalog.test.ts` once listed concepts by hand.
- **Why it fails:** they broke whenever a module was added.
- **Instead:** they are generic now. Check for new failures of this kind after scaffolding.

### Sinhala Play button locator

- **What:** guessing the Sinhala name of the Play button in screenshot scripts.
- **Why it fails:** the guessed name doesn't match, so the locator times out.
- **Instead:** use `waitForTimeout`, or select by the English UI.

## Current Best Theory

The approved plan fits the current kit with no engine changes:

- Use `timed()` for the three shoppers in parallel, with fixed jitter offsets.
- Use `burst()` for storms.
- Show load, attempts, waits and charges as `status` badges: Payments load ("30 req/s · capacity
  10"), attempt counters ("attempt 2 · wait 2 s"), "charged twice" and "charged once".
- Use `work(..., { tone: "warning" | "error" })` for a struggling Payments service.
- Show a lost response as a response packet with `flow: "error"` that stops short, or as an error
  packet plus a message ("connection reset").

If a step truly needs a new engine feature, stop and ask (CLAUDE.md Rule 8).

## Next Steps

1. **Read** `CLAUDE.md`, the memory file above and `docs/modules/backend-for-frontend.md`.
2. **Write the script** `docs/modules/retry-and-exponential-backoff.md` in the same structure as the
   BFF script:
   - Status: "Draft for review (checkpoint 1)".
   - Learning objectives, running example and scene table.
   - The 8 steps (scene notes, Beginner with "Like in real life", Advanced with a worked example
     in a code block, Terms).
   - The 2 scenarios, components, glossary.
   - About 5 numbered **Review** items with recommendations. Suggested: three shoppers;
     introductory idempotency in steps 7–8; illustrative numbers and compressed time; fixed jitter
     offsets; how the lost response is drawn.
   - Run `npx prettier --write` on it.
   - Accuracy checks: AWS "Exponential Backoff and Jitter" (full jitter is
     `sleep = random(0, min(cap, base·2^attempt))`); `Retry-After` takes seconds or an HTTP date;
     the IETF `Idempotency-Key` header draft; Stripe uses idempotency keys; gRPC and AWS SDKs
     retry with backoff by default.
3. **Present checkpoint 1** (a summary plus the Review items) and wait for approval. Update memory.
4. **After approval:**
   - Run `npm run new:module retry-and-exponential-backoff`, then `npx prettier --write src/content`.
   - Write `structure.ts`, `text/shared.ts`, `en-steps.ts`, `en.ts`, `si-steps.ts`, `si.ts`. Sinhala
     is friendly and spoken, with technical terms in English. Remove every scaffold "TODO".
   - Run `npm run check`.
5. **Build and screenshot:**
   - `npm run build`, then start `npx serve out -l 3000 --no-clipboard` (background).
   - In the scratchpad
     (`C:\Users\Lenovo\AppData\Local\Temp\claude\5c1fc00462d67f66\97a74317-99ad-4cfc-87fe-7a4d3fc43ede\scratchpad`),
     run `node shoot-module.mjs retry-and-exponential-backoff <outDir> mid`.
   - Read the individual PNGs (the contact sheet crops them). Also adapt `shoot-bff-extra.mjs` for
     Sinhala and the no-WebGL fallback.
   - Fix label and wire collisions.
6. **Present checkpoint 2** (in-app review), then:
   - Add `e2e/retry-and-exponential-backoff-module.spec.ts`, copied from the BFF spec.
   - Add the page to `scripts/check-bundles.mjs`.
   - Run `npx playwright test`, `npm run check:bundles`, and
     `node measure-fps.mjs http://localhost:3000 retry-and-exponential-backoff` (scratchpad).
   - Run `npm run docs:module-text -- retry-and-exponential-backoff`.
   - Update the README status and links. Mark the script Approved, with "Changes made while
     building".
7. **Completion Report** in the CLAUDE.md format. Commit only when asked, ending the commit
   message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Key Constraints

- **Never assume approval.** Each checkpoint and phase needs an explicit "approved". "Proceed"
  after a report means: present the next plan.
- **Commit only when the user asks.** Do not commit `HANDOFF.md`.
- **Writing style:**
  - Beginner is written for a five-year-old, with an everyday example.
  - Advanced is technical, with a worked example.
  - Sinhala is friendly and spoken, with technical terms in English.
  - Text is server-only, delivered as route data. ESLint blocks importing module text in client
    code.
- **Privacy:** the user's email is private; never send it to external services.
- **Budgets:** shell ≤ 333 KB and 3D chunk ≤ 300 KB (raising either needs approval); target
  60 fps.
- **Layers:** app → features → engine/content → lib, enforced by ESLint. Content must not import
  the engine.
- **Environment:** Windows. The Bash tool runs Git Bash; the project path contains spaces, so quote
  it. Python is not installed; use node scripts. Put temporary files in the scratchpad, never in
  the repo.
- **The user's phrasing:** "approved, all recommended options, proceed" approves the Review items as
  recommended.

## Memory Pointers

- Observations:
  - #3634: BFF checkpoint 1 approved with all five recommendations (the approval pattern).
  - #3652: the round-trip e2e test now waits for the badge instead of clicking Play.
  - #3681: an inline node edit failed on an apostrophe in bash.
  - #3646: the Sinhala Play locator timed out in a screenshot script.
  - #3702: catalog entries for the Phase 7 candidate concepts.
- Searches worth re-running:
  - `search("archi-verse Circuit Breaker retry storm burst")`
  - `search("archi-verse backend-for-frontend layout labels screenshot")`
