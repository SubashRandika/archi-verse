import type { LearningModule, ModuleStep } from "@/content/modules";
import { MAIN_TRACK } from "./session-store";

/*
 * A module's steps form tracks: the main path, and one track per scenario. The 3D timeline
 * compiles every step of every track, in this order, into one master timeline; these helpers
 * translate between (track, index) and that global order.
 */

export function trackSteps(learningModule: LearningModule, trackId: string): readonly ModuleStep[] {
  if (trackId === MAIN_TRACK) return learningModule.steps;
  return learningModule.scenarios.find((scenario) => scenario.id === trackId)?.steps ?? [];
}

/** Step counts by track id (for the session store). */
export function trackLengths(learningModule: LearningModule): Record<string, number> {
  return {
    [MAIN_TRACK]: learningModule.steps.length,
    ...Object.fromEntries(learningModule.scenarios.map((s) => [s.id, s.steps.length])),
  };
}

/** Every step of every track, in timeline order. */
export function allSteps(learningModule: LearningModule): readonly ModuleStep[] {
  return [...learningModule.steps, ...learningModule.scenarios.flatMap((s) => s.steps)];
}

/** Position of a track's step in `allSteps`. */
export function globalStepIndex(
  learningModule: LearningModule,
  trackId: string,
  index: number,
): number {
  if (trackId === MAIN_TRACK) return index;
  let offset = learningModule.steps.length;
  for (const scenario of learningModule.scenarios) {
    if (scenario.id === trackId) return offset + index;
    offset += scenario.steps.length;
  }
  return index;
}

/** The (track, index) of a position in `allSteps`. */
export function locateStep(
  learningModule: LearningModule,
  globalIndex: number,
): { trackId: string; index: number } {
  if (globalIndex < learningModule.steps.length) return { trackId: MAIN_TRACK, index: globalIndex };
  let offset = learningModule.steps.length;
  for (const scenario of learningModule.scenarios) {
    if (globalIndex < offset + scenario.steps.length) {
      return { trackId: scenario.id, index: globalIndex - offset };
    }
    offset += scenario.steps.length;
  }
  return { trackId: MAIN_TRACK, index: 0 };
}
