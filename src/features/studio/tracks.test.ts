import { getModule } from "@/content/modules";
import { MAIN_TRACK } from "./session-store";
import { allSteps, globalStepIndex, locateStep, trackLengths, trackSteps } from "./tracks";

const learningModule = getModule("api-gateway")!;

describe("module tracks", () => {
  it("has a main path of 12 steps and one track per scenario", () => {
    expect(trackLengths(learningModule)).toEqual({
      [MAIN_TRACK]: 12,
      unauthorized: 3,
      "rate-limited": 3,
      timeout: 3,
      unavailable: 3,
    });
    expect(trackSteps(learningModule, "nope")).toEqual([]);
  });

  it("maps every (track, index) to its position in the timeline and back", () => {
    const steps = allSteps(learningModule);
    expect(steps).toHaveLength(24);

    for (const trackId of Object.keys(trackLengths(learningModule))) {
      trackSteps(learningModule, trackId).forEach((step, index) => {
        const global = globalStepIndex(learningModule, trackId, index);
        expect(steps[global]).toBe(step);
        expect(locateStep(learningModule, global)).toEqual({ trackId, index });
      });
    }
  });
});
