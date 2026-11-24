import { z } from "zod";
import {
  CATEGORY_ICONS,
  type CategoryDefinition,
  type ConceptDefinition,
  type ConceptRef,
} from "./types";

/**
 * Zod schemas for catalog content (ADR-0005). Used by unit tests to validate every category
 * file; never imported by application code, so Zod stays out of the browser bundle.
 * Each schema is typed against its TypeScript type, so the two cannot drift apart.
 */

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected a lowercase kebab-case id");

export const conceptDefinitionSchema: z.ZodType<ConceptDefinition> = z.strictObject({
  id: slug,
  title: z.string().min(2),
  summary: z.string().min(30).max(260),
  keywords: z.array(z.string().min(1)).optional(),
  moduleId: slug.optional(),
});

export const conceptRefSchema: z.ZodType<ConceptRef> = z.strictObject({ ref: slug });

export const categoryDefinitionSchema: z.ZodType<CategoryDefinition> = z.strictObject({
  id: slug,
  title: z.string().min(2),
  description: z.string().min(40).max(300),
  icon: z.enum(CATEGORY_ICONS),
  order: z.number().int().positive(),
  concepts: z.array(z.union([conceptDefinitionSchema, conceptRefSchema])).min(1),
});
