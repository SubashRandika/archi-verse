#!/usr/bin/env node
/**
 * Writes the review copy of a module's text, both languages side by side:
 *
 *   npm run docs:module-text            (every module)
 *   npm run docs:module-text -- <id>    (one module)
 *
 * Output: docs/modules/<id>.text.md. The TypeScript text files are the source of truth;
 * this document is for reading and reviewing (e.g. by a native Sinhala speaker). Loads the
 * TypeScript sources with jiti (the `@/` alias is mapped to src/).
 */
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

const root = process.cwd();
const jiti = createJiti(path.join(root, "scripts/"), {
  alias: { "@/": path.join(root, "src/") },
});
const { modules } = await jiti.import(path.join(root, "src/content/modules/index.ts"));
const { getModuleText } = await jiti.import(path.join(root, "src/content/modules/text.ts"));
const { getConcept } = await jiti.import(path.join(root, "src/content/catalog/index.ts"));

const requested = process.argv[2];
const ids = requested ? [requested] : Object.keys(modules);
for (const id of ids) {
  if (!modules[id]) {
    console.error(
      `docs:module-text: no module "${id}" (known: ${Object.keys(modules).join(", ")})`,
    );
    process.exit(1);
  }
  const file = path.join(root, "docs/modules", `${id}.text.md`);
  writeFileSync(file, render(modules[id], getModuleText(id), getConcept(id)?.title ?? id));
  console.log(`Wrote ${path.relative(root, file)}`);
}

function render(learningModule, text, title) {
  const { en, si } = text.locales;
  const out = [];
  const push = (...lines) => out.push(...lines);
  const cell = (value) => String(value).replace(/\|/g, "\\|");

  const blocks = (list) => {
    for (const block of list) {
      if (block.type === "paragraph") push(block.text, "");
      else if (block.type === "callout") push(`> ${block.text}`, "");
      else if (block.type === "list") {
        for (const item of block.items) {
          push(item.term ? `- **${item.term}:** ${item.text}` : `- ${item.text}`);
        }
        push("");
      } else if (block.type === "code") {
        const fence = "```" + (block.language === "text" ? "" : block.language);
        push(`*${block.caption}*`, "", fence, ...block.lines, "```", "");
      } else if (block.type === "table") {
        push(
          `*${block.caption}*`,
          "",
          `| ${block.columns[0]} | ${block.columns[1]} |`,
          "| --- | ---: |",
        );
        for (const [name, value] of block.rows) push(`| ${cell(name)} | ${cell(value)} |`);
        if (block.footer) push(`| **${block.footer[0]}** | **${block.footer[1]}** |`);
        push("");
      }
    }
  };

  const notes = existsSync(path.join(root, "docs/modules", `${learningModule.id}.md`));
  push(
    `# ${title} module text (English and Sinhala)`,
    "",
    `- **Generated** by \`npm run docs:module-text\` from`,
    `  \`src/content/modules/${learningModule.id}/text/\`. Edit the TypeScript files, not this document.`,
    "- **Beginner** is written as if for a five-year-old, with an everyday example.",
    "  **Advanced** keeps the technical depth and adds a worked example.",
    "- **Sinhala** uses a friendly spoken style; technical terms stay in English.",
    ...(notes
      ? [
          "- The learning objectives and scene notes are in",
          `  [${learningModule.id}.md](${learningModule.id}.md).`,
        ]
      : []),
    "",
    "---",
    "",
  );

  const step = (id, n) => {
    const e = en.steps[id];
    const s = si.steps[id];
    push(`### ${n}. ${e.title} · ${s.title}`, "");
    push(`**Watch:** ${e.watch}`, "", `**බලන්න:** ${s.watch}`, "");
    push("#### Beginner", "", "**In simple words**", "");
    blocks(e.explanation.beginner.body);
    push("**Like in real life**", "");
    blocks(e.explanation.beginner.example);
    push("**සරලව කිව්වොත්**", "");
    blocks(s.explanation.beginner.body);
    push("**සැබෑ ජීවිතයෙන් උදාහරණයක්**", "");
    blocks(s.explanation.beginner.example);
    push("#### Advanced", "", "**How it works**", "");
    blocks(e.explanation.advanced.body);
    push("**Example**", "");
    blocks(e.explanation.advanced.example);
    push("**මෙය වැඩ කරන හැටි**", "");
    blocks(s.explanation.advanced.body);
    push("**උදාහරණය**", "");
    blocks(s.explanation.advanced.example);
    const links = text.steps[id];
    const terms = links.terms.map((term) => en.glossary[term]?.term ?? term).join(", ");
    const message = links.message ? ` · *Message:* ${en.messages[links.message]}` : "";
    push(`*Words to know:* ${terms || "none"}${message}`, "", "---", "");
  };

  push("## Main path", "");
  let n = 0;
  for (const chapter of learningModule.chapters) {
    push(`## ${en.chapters[chapter.id]} · ${si.chapters[chapter.id]}`, "");
    for (const s of learningModule.steps.filter((x) => x.chapterId === chapter.id)) step(s.id, ++n);
  }

  if (learningModule.scenarios.length > 0) push("## Scenarios", "");
  for (const scenario of learningModule.scenarios) {
    const e = en.scenarios[scenario.id];
    const s = si.scenarios[scenario.id];
    push(`## Scenario: ${e.title} · ${s.title}`, "", e.summary, "", s.summary, "");
    scenario.steps.forEach((x, i) => step(x.id, i + 1));
  }

  push("## Parts of the scene", "");
  for (const id of Object.keys(en.components)) {
    const e = en.components[id];
    const s = si.components[id];
    const row = (label, english, sinhala) =>
      push(`| ${label} | ${cell(english)} | ${cell(sinhala)} |`);
    const list = (values) => values.join("; ");
    push(`### ${e.name} (${id})`, "", "| | English | සිංහල |", "| --- | --- | --- |");
    row("Kind", e.kind, s.kind);
    row("Simple summary", e.beginner.summary, s.beginner.summary);
    row("Like in real life", e.beginner.analogy, s.beginner.analogy);
    row("What it does", list(e.beginner.jobs), list(s.beginner.jobs));
    row("Talks to", list(e.talksTo), list(s.talksTo));
    row("Technical summary", e.advanced.summary, s.advanced.summary);
    row("How it works", e.advanced.howItWorks, s.advanced.howItWorks);
    for (const key of [
      "responsibilities",
      "inputs",
      "outputs",
      "examples",
      "advantages",
      "limitations",
    ]) {
      row(key[0].toUpperCase() + key.slice(1), list(e.advanced[key]), list(s.advanced[key]));
    }
    row("Technologies", e.advanced.technologies.join(", "), "");
    push("");
  }

  push("## Words to know", "", "| Term | English | සිංහල |", "| --- | --- | --- |");
  for (const id of Object.keys(en.glossary)) {
    push(
      `| ${en.glossary[id].term} | ${cell(en.glossary[id].definition)} | ${cell(si.glossary[id].definition)} |`,
    );
  }
  push("", "## Message captions", "", "| Message | English | සිංහල |", "| --- | --- | --- |");
  for (const id of Object.keys(en.messages))
    push(`| ${id} | ${cell(en.messages[id])} | ${cell(si.messages[id])} |`);
  push("", "## Scene badges", "", "`{count}` is replaced by a number in the scene.", "");
  push("| Badge | English | සිංහල |", "| --- | --- | --- |");
  for (const id of Object.keys(en.badges))
    push(`| ${id} | ${cell(en.badges[id])} | ${cell(si.badges[id])} |`);
  push("");
  return out.join("\n");
}
