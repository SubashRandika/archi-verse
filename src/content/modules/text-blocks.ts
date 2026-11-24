import type { ExplanationBlock, LevelExplanation, StepCopy } from "./types";

/** Small builders that keep module text files readable. Server-only, like the text itself. */

export const p = (text: string): ExplanationBlock => ({ type: "paragraph", text });

export const callout = (text: string): ExplanationBlock => ({ type: "callout", text });

export const list = (...items: (string | [term: string, text: string])[]): ExplanationBlock => ({
  type: "list",
  items: items.map((item) =>
    typeof item === "string" ? { text: item } : { term: item[0], text: item[1] },
  ),
});

export const code = (
  language: "http" | "sql" | "json" | "text",
  caption: string,
  lines: readonly string[],
): ExplanationBlock => ({ type: "code", language, caption, lines });

interface LevelInput {
  body: ExplanationBlock[];
  example: ExplanationBlock[];
}

const level = ({ body, example }: LevelInput): LevelExplanation => ({ body, example });

/** A step's copy: title, what to watch, then each level's body and example. */
export const step = (
  title: string,
  watch: string,
  beginner: LevelInput,
  advanced: LevelInput,
): StepCopy => ({
  title,
  watch,
  explanation: { beginner: level(beginner), advanced: level(advanced) },
});
