#!/usr/bin/env node
/**
 * Scaffolds a learning module for a catalog concept:
 *
 *   npm run new:module <concept-id>
 *
 * - Creates src/content/modules/<id>/structure.ts (a two-part scene, one chapter, one step)
 *   and text/ (shared, English and Sinhala, both levels), following docs/CONVENTIONS.md.
 * - Registers it in content/modules/index.ts and text.ts, and links the catalog concept.
 *
 * The result typechecks and passes modules.test.ts straight away; every placeholder text
 * starts with "TODO" so it is easy to find. Next steps: docs/adding-a-concept.md.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "src/content/modules");
const CATEGORIES = path.join(ROOT, "src/content/catalog/categories");

const fail = (message) => {
  console.error(`new:module: ${message}`);
  process.exit(1);
};

const id = process.argv[2];
if (!id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  fail("usage: npm run new:module <concept-id>   (a kebab-case catalog concept id)");
}
const dir = path.join(MODULES, id);
if (existsSync(dir)) fail(`src/content/modules/${id} already exists.`);

// The catalog concept the module belongs to (defined once, with `id: "<id>"`).
const conceptPattern = new RegExp(`(\\n(\\s*)id: "${id}",\\n(?:\\2.*\\n)*?)(\\s*)\\},`);
const categoryFile = readdirSync(CATEGORIES).find((file) =>
  conceptPattern.test(readFileSync(path.join(CATEGORIES, file), "utf8")),
);
if (!categoryFile) fail(`no catalog concept with id "${id}" in src/content/catalog/categories.`);
const categoryPath = path.join(CATEGORIES, categoryFile);
const category = readFileSync(categoryPath, "utf8");
const conceptBlock = category.match(conceptPattern)[1];
if (conceptBlock.includes("moduleId:")) fail(`concept "${id}" already has a module.`);
const title = conceptBlock.match(/title: "([^"]+)"/)?.[1] ?? id;

const camel = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const moduleName = `${camel}Module`;
const textName = `${camel}Text`;

// ---------------------------------------------------------------------------------------------

const files = {
  "structure.ts": `import type { SceneLayout } from "@/lib/scene-spec";
import { send, wait, work } from "../beats";
import type { LearningModule } from "../types";

/**
 * ${title}: scene layout, steps and scenarios. The text lives in ./text (server only).
 * Steps are written with the beat builders in ../beats.ts (docs/CONVENTIONS.md).
 */

const layout: SceneLayout = {
  components: [
    { id: "client", kind: "client", label: "Client", role: "Client", position: [-3, 0, 0] },
    { id: "server", kind: "service", label: "Server", role: "Backend service", position: [3, 0, 0] },
  ],
  connections: [{ id: "client-server", from: "client", to: "server" }],
};

export const ${moduleName}: LearningModule = {
  id: "${id}",
  layout,
  chapters: [{ id: "basics" }],
  steps: [
    {
      id: "first-step",
      chapterId: "basics",
      scene: {
        focus: ["client", "server"],
        beats: [
          send("client-server", "request"),
          work("server", 1),
          wait(0.3),
          send("client-server", "response", { back: true }),
        ],
      },
    },
  ],
  scenarios: [],
};
`,

  "text/shared.ts": `import type { MessageCode, StepLinks } from "../../types";

/**
 * Language-free parts of the ${title} module text: each step's terms and message, and the
 * code of every message. SERVER ONLY (see ../../text.ts).
 */

export const messages: Readonly<Record<string, MessageCode>> = {};

export const steps: Readonly<Record<string, StepLinks>> = {
  "first-step": { terms: [] },
};
`,

  "text/en-steps.ts": `import { p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";

/**
 * ${title} module, English step text. SERVER ONLY.
 * Beginner: explained as if to a five-year-old, with an everyday example.
 * Advanced: the technical detail, with a worked example.
 */
export const enSteps: Readonly<Record<string, StepCopy>> = {
  "first-step": step(
    "TODO: step title",
    "TODO: what to watch in the scene.",
    {
      body: [p("TODO: in simple words.")],
      example: [p("TODO: an everyday example.")],
    },
    {
      body: [p("TODO: how it works.")],
      example: [p("TODO: a worked example.")],
    },
  ),
};
`,

  "text/si-steps.ts": `import { p, step } from "../../text-blocks";
import type { StepCopy } from "../../types";

/**
 * ${title} module, Sinhala step text. SERVER ONLY. Friendly spoken style; technical terms stay
 * in English (docs/CONVENTIONS.md → Writing module text).
 */
export const siSteps: Readonly<Record<string, StepCopy>> = {
  "first-step": step(
    "TODO: පියවරේ නම",
    "TODO: scene එකේ බලන්න ඕන දේ.",
    {
      body: [p("TODO: සරලව කිව්වොත්.")],
      example: [p("TODO: එදිනෙදා උදාහරණයක්.")],
    },
    {
      body: [p("TODO: වැඩ කරන විදිහ.")],
      example: [p("TODO: උදාහරණයක්.")],
    },
  ),
};
`,

  "text/en.ts": localeFile("en", "English", {
    chapter: "TODO: chapter",
    parts: {
      client: ["Client", "Client"],
      server: ["Server", "Backend service"],
    },
    todo: "TODO: describe this part.",
    list: "TODO",
  }),

  "text/si.ts": localeFile("si", "Sinhala", {
    chapter: "TODO: පරිච්ඡේදය",
    parts: {
      client: ["Client", "Client"],
      server: ["Server", "Backend service"],
    },
    todo: "TODO: මේ කොටස ගැන ලියන්න.",
    list: "TODO",
  }),

  "text/index.ts": `import type { ModuleText } from "../../types";
import { en } from "./en";
import { messages, steps } from "./shared";
import { si } from "./si";

/**
 * ${title} module text in every language. SERVER ONLY: read by the concept routes and
 * delivered as route data (ESLint forbids importing it from client code).
 */
export const ${textName}: ModuleText = { steps, messages, locales: { en, si } };
`,
};

function localeFile(locale, language, { chapter, parts, todo, list }) {
  const doc = ([name, kind], other) => `    ${name.toLowerCase()}: {
      name: "${name}",
      kind: "${kind}",
      beginner: { summary: "${todo}", analogy: "${todo}", jobs: ["${list}"] },
      advanced: {
        summary: "${todo}",
        howItWorks: "${todo}",
        responsibilities: ["${list}"],
        inputs: ["${list}"],
        outputs: ["${list}"],
        technologies: ["${list}"],
        examples: ["${list}"],
        advantages: ["${list}"],
        limitations: ["${list}"],
      },
      talksTo: ["${other}"],
    },`;
  return `import type { LocaleText } from "../../types";
import { ${locale}Steps } from "./${locale}-steps";

/** ${title} module, ${language}. SERVER ONLY. */
export const ${locale}: LocaleText = {
  chapters: { basics: "${chapter}" },
  scenarios: {},
  steps: ${locale}Steps,
  messages: {},
  components: {
${doc(parts.client, parts.server[0])}
${doc(parts.server, parts.client[0])}
  },
  // Short texts shown in the scene next to a component's name; \`{count}\` is replaced.
  badges: {},
  glossary: {},
};
`;
}

// ---------------------------------------------------------------------------------------------

mkdirSync(path.join(dir, "text"), { recursive: true });
for (const [file, content] of Object.entries(files)) {
  writeFileSync(path.join(dir, file), content);
}

function insert(file, after, line) {
  const full = path.join(ROOT, file);
  const source = readFileSync(full, "utf8");
  const index = source.indexOf(after);
  if (index === -1)
    fail(`could not find "${after.trim()}" in ${file}; register the module by hand.`);
  const at = index + after.length;
  writeFileSync(full, source.slice(0, at) + line + source.slice(at));
}

insert(
  "src/content/modules/index.ts",
  'import { apiGatewayModule } from "./api-gateway/structure";\n',
  `import { ${moduleName} } from "./${id}/structure";\n`,
);
insert(
  "src/content/modules/index.ts",
  "  [apiGatewayModule.id]: apiGatewayModule,\n",
  `  [${moduleName}.id]: ${moduleName},\n`,
);
insert(
  "src/content/modules/text.ts",
  'import { apiGatewayText } from "./api-gateway/text";\n',
  `import { ${textName} } from "./${id}/text";\n`,
);
insert(
  "src/content/modules/text.ts",
  '  "api-gateway": apiGatewayText,\n',
  `  "${id}": ${textName},\n`,
);

// Link the catalog concept: add `moduleId` after its title line.
writeFileSync(
  categoryPath,
  category.replace(
    conceptBlock,
    conceptBlock.replace(/(\n(\s*)title: "[^"]+",\n)/, `$1$2moduleId: "${id}",\n`),
  ),
);

console.log(`Created src/content/modules/${id}/ and registered it (catalog: ${categoryFile}).
Next:
  1. npx prettier --write src/content
  2. Write the layout and steps in structure.ts, the text in text/ (search for "TODO").
  3. npm run check, then npm run docs:module-text -- ${id} for the review copy.
See docs/adding-a-concept.md.`);
