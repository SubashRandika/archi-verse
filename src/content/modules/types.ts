import type { Locale } from "@/lib/locale";
import type { SceneLayout, StepScene } from "@/lib/scene-spec";

/*
 * A learning module has two halves:
 *
 * - **Structure** (`LearningModule`): ids, the scene layout and each step's beats. Small and
 *   language-free; ships to the browser because the 3D scene and the dock need it.
 * - **Text** (`ModuleText`): titles, explanations, messages, component documentation and the
 *   glossary, in every language. Read only by server code (the concept routes) and delivered
 *   as route data, never bundled into client JavaScript (ADR-0005, Phase 5).
 */

export interface ModuleChapter {
  readonly id: string;
}

export interface ModuleStep {
  /** Unique across the module, including scenario steps. */
  readonly id: string;
  /** What the 3D scene shows and animates during this step. */
  readonly scene: StepScene;
}

export interface MainStep extends ModuleStep {
  readonly chapterId: string;
}

/** A failure (or alternative) path that branches from a step of the main path. */
export interface ModuleScenario {
  readonly id: string;
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
      readonly language: "http" | "sql" | "json" | "text";
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

/** One level of a step's explanation. */
export interface LevelExplanation {
  /** "In simple words" (beginner) or "How it works" (advanced). */
  readonly body: readonly ExplanationBlock[];
  /** "Like in real life" (beginner) or a worked "Example" (advanced). */
  readonly example: readonly ExplanationBlock[];
}

/** A step's text in one language. */
export interface StepCopy {
  readonly title: string;
  /** What to look at in the 3D scene while the step plays (both levels). */
  readonly watch: string;
  readonly explanation: Readonly<Record<ExplanationLevel, LevelExplanation>>;
}

/** Language-free references of a step. */
export interface StepLinks {
  /** Glossary term ids, shown as "Words to know". */
  readonly terms: readonly string[];
  /** The message shown as "message in flight" for this step. */
  readonly message?: string;
}

/** The code of a message a packet carries (the same in every language). */
export interface MessageCode {
  /** `text` for what is not a wire message, e.g. a timeout or a rejected call in a log. */
  readonly language: "http" | "sql" | "text";
  readonly lines: readonly string[];
}

/** A message with its caption in the current language. */
export interface ModuleMessage extends MessageCode {
  readonly caption: string;
}

export interface ComponentDoc {
  readonly name: string;
  readonly kind: string;
  readonly beginner: {
    /** One or two simple sentences. */
    readonly summary: string;
    /** "Like in real life". */
    readonly analogy: string;
    /** "What it does", in simple words. */
    readonly jobs: readonly string[];
  };
  readonly advanced: {
    readonly summary: string;
    readonly howItWorks: string;
    readonly responsibilities: readonly string[];
    readonly inputs: readonly string[];
    readonly outputs: readonly string[];
    readonly technologies: readonly string[];
    readonly examples: readonly string[];
    readonly advantages: readonly string[];
    readonly limitations: readonly string[];
  };
  readonly talksTo: readonly string[];
}

export interface GlossaryTerm {
  /** The term itself, in English in every language. */
  readonly term: string;
  readonly definition: string;
}

export interface ScenarioCopy {
  readonly title: string;
  /** One line shown in the scenario menu. */
  readonly summary: string;
}

/** Everything a module says, in one language. */
export interface LocaleText {
  /** By chapter id. */
  readonly chapters: Readonly<Record<string, string>>;
  /** By scenario id. */
  readonly scenarios: Readonly<Record<string, ScenarioCopy>>;
  /** By step id (main path and scenario steps). */
  readonly steps: Readonly<Record<string, StepCopy>>;
  /** Message captions, by message id. */
  readonly messages: Readonly<Record<string, string>>;
  /** By scene component id (selectable components only). */
  readonly components: Readonly<Record<string, ComponentDoc>>;
  /** By term id. */
  readonly glossary: Readonly<Record<string, GlossaryTerm>>;
  /** Scene badge texts by badge id; `{count}` is replaced by the badge's count. */
  readonly badges: Readonly<Record<string, string>>;
}

export interface ModuleText {
  /** By step id. */
  readonly steps: Readonly<Record<string, StepLinks>>;
  /** By message id (referenced by packet beats and steps). */
  readonly messages: Readonly<Record<string, MessageCode>>;
  readonly locales: Readonly<Record<Locale, LocaleText>>;
}

/** The titles the studio around the inspector needs (dock, menus), in one language. */
export interface ModuleLabels {
  readonly chapters: Readonly<Record<string, string>>;
  readonly scenarios: Readonly<Record<string, ScenarioCopy>>;
  readonly steps: Readonly<Record<string, string>>;
  /** Scene badge texts (see `LocaleText.badges`). */
  readonly badges: Readonly<Record<string, string>>;
}
