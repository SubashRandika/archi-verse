import { z } from "zod";
import { COMPONENT_KINDS } from "@/lib/scene-spec";
import type { LearningModule, ModuleText } from "./types";

/*
 * Zod schemas for learning modules. Used only by tests (like the catalog schema), so Zod's
 * full build stays out of the browser bundle. Referential integrity (ids that must exist) is
 * checked in modules.test.ts.
 */

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "kebab-case id");
const vec3 = z.tuple([z.number(), z.number(), z.number()]);
const status = z.object({
  tone: z.enum(["info", "warning", "error", "down"]),
  badge: z.object({ id, count: z.number().int().min(0).optional() }).optional(),
});

const beat = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("packet"),
    connection: id,
    flow: z.enum(["request", "response", "error"]),
    reverse: z.boolean().optional(),
    stay: z.boolean().optional(),
    duration: z.number().positive().optional(),
    next: z.number().min(0).optional(),
    message: id.optional(),
  }),
  z.object({
    type: z.literal("process"),
    component: id,
    stage: id.optional(),
    tone: z.enum(["active", "warning", "error"]).optional(),
    duration: z.number().positive().optional(),
  }),
  z.object({
    type: z.literal("signal"),
    connection: id,
    duration: z.number().positive().optional(),
  }),
  z.object({ type: z.literal("status"), component: id, status: status.nullable() }),
  z.object({ type: z.literal("wait"), duration: z.number().positive() }),
]);

const stepScene = z.object({
  focus: z.array(id).min(1),
  frame: z.array(id).min(1).optional(),
  initial: z.object({ status: z.record(id, status).optional() }).optional(),
  beats: z.array(beat).min(1),
});

const step = z.object({ id, scene: stepScene });

export const learningModuleSchema: z.ZodType<LearningModule> = z.object({
  id,
  layout: z.object({
    components: z
      .array(
        z.object({
          id,
          kind: z.enum(COMPONENT_KINDS),
          label: z.string().min(2),
          role: z.string().min(2),
          position: vec3,
          stages: z.array(z.object({ id, label: z.string().min(2) })).optional(),
          decorative: z.boolean().optional(),
          labelPlacement: z.enum(["above", "right", "below"]).optional(),
        }),
      )
      .min(2),
    connections: z.array(
      z.object({
        id,
        from: id,
        to: id,
        via: z.array(vec3).optional(),
        style: z.enum(["solid", "dashed"]).optional(),
        hidden: z.boolean().optional(),
      }),
    ),
  }),
  chapters: z.array(z.object({ id })).min(1),
  steps: z.array(step.extend({ chapterId: id })).min(1),
  scenarios: z.array(
    z.object({
      id,
      branchesFromStepId: id,
      steps: z.array(step).min(1),
    }),
  ),
});

const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string().min(5) }),
  z.object({
    type: z.literal("list"),
    items: z.array(z.object({ term: z.string().optional(), text: z.string().min(3) })).min(1),
  }),
  z.object({ type: z.literal("callout"), text: z.string().min(10) }),
  z.object({
    type: z.literal("code"),
    language: z.enum(["http", "sql", "json", "text"]),
    caption: z.string(),
    lines: z.array(z.string()).min(1),
  }),
  z.object({
    type: z.literal("table"),
    caption: z.string(),
    columns: z.tuple([z.string(), z.string()]),
    rows: z.array(z.tuple([z.string(), z.string()])).min(1),
    footer: z.tuple([z.string(), z.string()]).optional(),
  }),
]);
const blocks = z.array(block).min(1);
const text = z.string().min(2);
const texts = z.array(text).min(1);
const level = z.object({ body: blocks, example: blocks });

const localeTextSchema = z.object({
  chapters: z.record(id, z.string().min(3)),
  scenarios: z.record(id, z.object({ title: z.string().min(3), summary: z.string().min(10) })),
  steps: z.record(
    id,
    z.object({
      title: z.string().min(3),
      watch: z.string().min(10),
      explanation: z.object({ beginner: level, advanced: level }),
    }),
  ),
  messages: z.record(id, z.string().min(3)),
  components: z.record(
    id,
    z.object({
      name: text,
      kind: text,
      beginner: z.object({ summary: z.string().min(10), analogy: z.string().min(10), jobs: texts }),
      advanced: z.object({
        summary: z.string().min(10),
        howItWorks: z.string().min(10),
        responsibilities: texts,
        inputs: texts,
        outputs: texts,
        technologies: texts,
        examples: texts,
        advantages: texts,
        limitations: texts,
      }),
      talksTo: texts,
    }),
  ),
  glossary: z.record(
    z.string().regex(/^[a-z0-9-]+$/),
    z.object({ term: text, definition: z.string().min(10) }),
  ),
  badges: z.record(id, z.string().min(1).max(32)),
});

export const moduleTextSchema: z.ZodType<ModuleText> = z.object({
  steps: z.record(id, z.object({ terms: z.array(z.string()), message: id.optional() })),
  messages: z.record(
    id,
    z.object({ language: z.enum(["http", "sql", "text"]), lines: z.array(z.string()).min(1) }),
  ),
  locales: z.object({ en: localeTextSchema, si: localeTextSchema }),
});
