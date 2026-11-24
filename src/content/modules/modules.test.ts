import { concepts } from "@/content/catalog";
import { getModule, modules } from "./index";
import { learningModuleSchema, moduleTextSchema } from "./schema";
import { getModuleText } from "./text";

describe.each(Object.values(modules))("module $id", (learningModule) => {
  const text = getModuleText(learningModule.id)!;
  const components = learningModule.layout.components;
  const componentIds = new Set(components.map((component) => component.id));
  const connectionIds = new Set(learningModule.layout.connections.map((c) => c.id));
  const chapterIds = new Set(learningModule.chapters.map((chapter) => chapter.id));
  const scenarioSteps = learningModule.scenarios.flatMap((scenario) => scenario.steps);
  const allSteps = [...learningModule.steps, ...scenarioSteps];

  it("matches the module and text schemas", () => {
    expect(() => learningModuleSchema.parse(learningModule)).not.toThrow();
    expect(text).toBeDefined();
    expect(() => moduleTextSchema.parse(text)).not.toThrow();
  });

  it("is linked from exactly one catalog concept", () => {
    expect(concepts.filter((concept) => concept.moduleId === learningModule.id)).toHaveLength(1);
  });

  it("has unique ids", () => {
    expect(componentIds.size).toBe(components.length);
    expect(connectionIds.size).toBe(learningModule.layout.connections.length);
    expect(chapterIds.size).toBe(learningModule.chapters.length);
    expect(new Set(allSteps.map((step) => step.id)).size).toBe(allSteps.length);
    expect(new Set(learningModule.scenarios.map((s) => s.id)).size).toBe(
      learningModule.scenarios.length,
    );
  });

  it("connects existing components", () => {
    for (const connection of learningModule.layout.connections) {
      expect(componentIds, connection.id).toContain(connection.from);
      expect(componentIds, connection.id).toContain(connection.to);
    }
  });

  it("only references existing components, stages, connections and messages in steps", () => {
    for (const step of allSteps) {
      for (const id of [
        ...step.scene.focus,
        ...(step.scene.frame ?? []),
        ...Object.keys(step.scene.initial?.status ?? {}),
      ]) {
        expect(componentIds, step.id).toContain(id);
      }
      for (const beat of step.scene.beats) {
        if (beat.type === "packet" || beat.type === "signal") {
          expect(connectionIds, step.id).toContain(beat.connection);
        }
        if (beat.type === "packet" && beat.message) {
          expect(text.messages, step.id).toHaveProperty(beat.message);
        }
        if (beat.type === "process" || beat.type === "status") {
          expect(componentIds, step.id).toContain(beat.component);
        }
        if (beat.type === "process" && beat.stage) {
          const stages = components.find((c) => c.id === beat.component)?.stages ?? [];
          expect(
            stages.map((stage) => stage.id),
            step.id,
          ).toContain(beat.stage);
        }
      }
    }
  });

  it("lists main steps in chapter order, and branches scenarios from main steps", () => {
    for (const step of learningModule.steps) expect(chapterIds, step.id).toContain(step.chapterId);
    const order = learningModule.steps.map((step) =>
      learningModule.chapters.findIndex((c) => c.id === step.chapterId),
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));

    const mainIds = learningModule.steps.map((step) => step.id);
    for (const scenario of learningModule.scenarios) {
      expect(mainIds, scenario.id).toContain(scenario.branchesFromStepId);
    }
  });

  it("explains every step at both levels, with known terms and messages", () => {
    for (const step of allSteps) {
      const stepText = text.steps[step.id];
      expect(stepText, step.id).toBeDefined();
      expect(stepText!.explanation.beginner.length, step.id).toBeGreaterThan(0);
      expect(stepText!.explanation.advanced.length, step.id).toBeGreaterThan(0);
      for (const term of stepText!.terms) expect(text.glossary, step.id).toHaveProperty(term);
      if (stepText!.message) expect(text.messages, step.id).toHaveProperty(stepText!.message);
    }
    // No text for steps that don't exist.
    expect(Object.keys(text.steps).sort()).toEqual(allSteps.map((step) => step.id).sort());
  });

  it("documents every selectable component", () => {
    for (const component of components.filter((c) => !c.decorative)) {
      expect(text.components, component.id).toHaveProperty(component.id);
    }
  });
});

describe("getModule", () => {
  it("finds modules by id", () => {
    expect(getModule("api-gateway")?.steps).toHaveLength(12);
    expect(getModule("nope")).toBeUndefined();
    expect(getModule(undefined)).toBeUndefined();
  });
});
