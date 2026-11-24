#!/usr/bin/env node
/**
 * Works around a Next.js static-export bug on Windows (runs after `next build`).
 *
 * The export names each route segment's prefetch file by replacing "/" with "." in the
 * segment path (`__next.learn.$d$conceptSlug.__PAGE__.txt`). On Windows the path uses "\",
 * which is not replaced, so the file is written into nested folders instead
 * (`__next.learn/$d$conceptSlug/__PAGE__.txt`). The browser requests the dotted name and gets
 * a 404, so link prefetching does nothing.
 *
 * This moves every such file back to its dotted name. Elsewhere (Linux CI and hosting) there
 * are no nested folders and it does nothing. Remove it once Next.js fixes the export.
 */
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const OUT = "out";

/** Files under `dir`, as paths relative to it. */
function filesIn(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    return entry.isDirectory() ? filesIn(path.join(dir, entry.name), relative) : [relative];
  });
}

let moved = 0;
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      visit(full);
      continue;
    }
    for (const file of filesIn(full)) {
      const dotted = `${entry.name}.${file.split(path.sep).join(".")}`;
      renameSync(path.join(full, file), path.join(dir, dotted));
      moved += 1;
    }
    rmSync(full, { recursive: true });
  }
}

if (statSync(OUT, { throwIfNoEntry: false })?.isDirectory()) {
  visit(OUT);
  if (moved > 0) console.log(`fix-export-segments: renamed ${moved} prefetch file(s).`);
}
