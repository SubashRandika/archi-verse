import type { SceneLayout, StepScene } from "@/lib/scene-spec";

/*
 * A learning module has two halves:
 *
 * - **Structure** (`LearningModule`): the scene layout, chapters, steps and scenarios with
 *   their beats. Small; ships to the browser because the 3D scene and the dock need it.
 * - **Text** (`ModuleText`): explanations, messages, component documentation, glossary.
 *   Large; read only by server code (the inspector route) and delivered as route data, never
 *   bundled into client JavaScript (ADR-0005, Phase 5).
 */

export interface ModuleChapter {
  readonly id: string;
  readonly title: string;
}

export interface ModuleStep {
  /** Unique across the module, including scenario steps. */
  readonly id: string;
  readonly title: string;
  /** What the 3D scene shows and animates during this step. */
  readonly scene: StepScene;
}

export interface MainStep extends ModuleStep {
  readonly chapterId: string;
}

/** A failure (or alternative) path that branches from a step of the main path. */
export interface ModuleScenario {
  readonly id: string;
  readonly title: string;
  /** One line shown in the scenario menu. */
  readonly summary: string;
  readonly branchesFromStepId: string;
  readonly steps: readonly ModuleStep[];
}

export interface LearningModule {
  /** Matches `ConceptDefinition.moduleId` in the catalog. */
  readonly id: string;
  readonly layout: SceneLayout;
  readonly chapters: readonly ModuleChapter[];
  readonly steps: readonly MainStep[];
  readonly scenarios: readonly ModuleScenario[];
}

// ---------------------------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------------------------

export type ExplanationLevel = "beginner" | "advanced";

export type ExplanationBlock =
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly { term?: string; text: string }[] }
  | { readonly type: "callout"; readonly text: string }
  | {
      readonly type: "code";
      readonly language: "http" | "sql" | "json";
      readonly caption: string;
      readonly lines: readonly string[];
    }
  | {
      readonly type: "table";
      readonly caption: string;
      readonly columns: readonly [string, string];
      readonly rows: readonly (readonly [string, string])[];
      /** Emphasised last row, e.g. a total. */
      readonly footer?: readonly [string, string];
    };

export type LevelText = Readonly<Record<ExplanationLevel, readonly ExplanationBlock[]>>;

/** A message a packet carries ("message in flight"). */
export interface ModuleMessage {
  readonly caption: string;
  readonly language: "http" | "sql";
  readonly lines: readonly string[];
}

export interface StepText {
  readonly explanation: LevelText;
  /** Glossary term ids, shown as "Terms in this step". */
  readonly terms: readonly string[];
  /** The message shown as "message in flight" for this step. */
  readonly message?: string;
}

export interface ComponentDoc {
  readonly name: string;
  readonly kind: string;
  readonly purpose: Readonly<Record<ExplanationLevel, string>>;
  readonly howItWorks: string;
  readonly responsibilities: readonly string[];
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly talksTo: readonly string[];
  readonly technologies: readonly string[];
  readonly examples: readonly string[];
  readonly advantages: readonly string[];
  readonly limitations: readonly string[];
}

export interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
}

export interface ModuleText {
  /** By step id (main path and scenario steps). */
  readonly steps: Readonly<Record<string, StepText>>;
  /** By message id (referenced by packet beats and steps). */
  readonly messages: Readonly<Record<string, ModuleMessage>>;
  /** By scene component id. */
  readonly components: Readonly<Record<string, ComponentDoc>>;
  /** By term id. */
  readonly glossary: Readonly<Record<string, GlossaryTerm>>;
}
