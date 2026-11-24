import { concepts } from "@/content/catalog";
import { getModule, modules } from "./index";

describe.each(Object.values(modules))("module $id", (module) => {
  const componentIds = new Set(module.layout.components.map((component) => component.id));
  const connectionIds = new Set(module.layout.connections.map((connection) => connection.id));
  const chapterIds = new Set(module.chapters.map((chapter) => chapter.id));

  it("is linked from exactly one catalog concept", () => {
    expect(concepts.filter((concept) => concept.moduleId === module.id)).toHaveLength(1);
  });

  it("has unique component, connection, chapter and step ids", () => {
    expect(componentIds.size).toBe(module.layout.components.length);
    expect(connectionIds.size).toBe(module.layout.connections.length);
    expect(chapterIds.size).toBe(module.chapters.length);
    expect(new Set(module.steps.map((step) => step.id)).size).toBe(module.steps.length);
  });

  it("connects existing components", () => {
    for (const connection of module.layout.connections) {
      expect(componentIds, connection.id).toContain(connection.from);
      expect(componentIds, connection.id).toContain(connection.to);
    }
  });

  it("only references existing chapters, components and connections in steps", () => {
    for (const step of module.steps) {
      expect(chapterIds, step.id).toContain(step.chapterId);
      for (const id of [...step.scene.focus, ...(step.scene.frame ?? [])]) {
        expect(componentIds, step.id).toContain(id);
      }
      for (const beat of step.scene.beats) {
        if (beat.type === "packet") expect(connectionIds, step.id).toContain(beat.connection);
        if (beat.type === "process") expect(componentIds, step.id).toContain(beat.component);
      }
    }
  });

  it("lists steps in chapter order", () => {
    const order = module.steps.map((step) =>
      module.chapters.findIndex((c) => c.id === step.chapterId),
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });
});

describe("getModule", () => {
  it("finds modules by id", () => {
    expect(getModule("api-gateway")?.steps.length).toBeGreaterThan(0);
    expect(getModule("nope")).toBeUndefined();
    expect(getModule(undefined)).toBeUndefined();
  });
});
