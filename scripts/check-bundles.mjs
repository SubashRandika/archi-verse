#!/usr/bin/env node
/**
 * Bundle budget check for the static export (`out/`). Run after `next build`:
 *
 *   npm run check:bundles
 *
 * - First-load JS per page = gzip size of the scripts referenced by the page's HTML.
 * - The 3D chunk = lazily loaded chunks containing three.js (found by content, since chunk
 *   names are hashes), plus any chunk only they pull in.
 *
 * Budgets: docs/ARCHITECTURE.md → Performance budgets.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const OUT = "out";
const CHUNKS = path.join(OUT, "_next/static/chunks");
const BUDGET_KB = { shell: 350, threeChunk: 300 };
const PAGES = {
  "/ (resume)": "index.html",
  "/learn/api-gateway (module)": "learn/api-gateway.html",
  "/learn/cap-theorem (planned)": "learn/cap-theorem.html",
};

const kb = (bytes) => Math.round(bytes / 1024);
const gzipSize = (file) => gzipSync(readFileSync(file)).length;
const initialChunks = (html) => [
  ...new Set(
    [
      ...readFileSync(path.join(OUT, html), "utf8").matchAll(
        /_next\/static\/chunks\/([^"?]+\.js)/g,
      ),
    ].map((match) => match[1]),
  ),
];

let failed = false;
const report = (label, size, budget) => {
  const over = budget !== undefined && size > budget;
  failed ||= over;
  console.log(
    `${over ? "✗" : "✓"} ${label.padEnd(34)} ${String(size).padStart(4)} KB${budget ? ` / ${budget} KB` : ""}`,
  );
};

const initialByPage = Object.fromEntries(
  Object.entries(PAGES).map(([label, html]) => [label, initialChunks(html)]),
);
const allInitial = new Set(Object.values(initialByPage).flat());

console.log("First-load JS (gzip)");
for (const [label, chunks] of Object.entries(initialByPage)) {
  const size = kb(chunks.reduce((sum, chunk) => sum + gzipSize(path.join(CHUNKS, chunk)), 0));
  report(label, size, BUDGET_KB.shell);
}

const lazyThree = readdirSync(CHUNKS).filter(
  (file) =>
    file.endsWith(".js") &&
    !allInitial.has(file) &&
    readFileSync(path.join(CHUNKS, file), "utf8").includes("WebGLRenderer"),
);
const leaked = [...allInitial].filter((file) =>
  readFileSync(path.join(CHUNKS, file), "utf8").includes("WebGLRenderer"),
);

console.log("\nLazy 3D chunk (gzip)");
for (const file of lazyThree) console.log(`  ${file} ${kb(gzipSize(path.join(CHUNKS, file)))} KB`);
report(
  "3D chunk total",
  kb(lazyThree.reduce((sum, file) => sum + gzipSize(path.join(CHUNKS, file)), 0)),
  BUDGET_KB.threeChunk,
);

if (leaked.length > 0) {
  failed = true;
  console.log(`\n✗ three.js found in first-load chunks: ${leaked.join(", ")}`);
} else {
  console.log("\n✓ three.js is not in any page's first-load JS");
}

process.exit(failed ? 1 : 0);
