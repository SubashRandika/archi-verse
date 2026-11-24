import type { SceneLayout, StepScene } from "@/lib/scene-spec";

export interface ModuleChapter {
  readonly id: string;
  readonly title: string;
}

export interface ModuleStep {
  readonly id: string;
  readonly chapterId: string;
  readonly title: string;
  /** What the 3D scene shows and animates during this step. */
  readonly scene: StepScene;
}

/** A learning module: one concept's interactive scene and its guided steps (ADR-0005). */
export interface LearningModule {
  /** Matches `ConceptDefinition.moduleId` in the catalog. */
  readonly id: string;
  readonly layout: SceneLayout;
  readonly chapters: readonly ModuleChapter[];
  readonly steps: readonly ModuleStep[];
}
