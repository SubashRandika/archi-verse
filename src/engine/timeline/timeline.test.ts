import type { SceneLayout, StepScene } from "@/lib/scene-spec";
import { compileTimeline, STEP_HOLD, STEP_LEAD_IN } from "./compile";
import { TimelineController } from "./controller";

const layout: SceneLayout = {
  components: [
    { id: "a", kind: "client", label: "A", role: "Client", position: [0, 0, 0] },
    { id: "b", kind: "service", label: "B", role: "Service", position: [4, 0, 0] },
  ],
  connections: [{ id: "a-b", from: "a", to: "b" }],
};

const steps: { scene: StepScene }[] = [
  {
    scene: {
      focus: ["a"],
      beats: [{ type: "packet", connection: "a-b", flow: "request", duration: 2 }],
    },
  },
  { scene: { focus: ["b"], beats: [{ type: "process", component: "b", duration: 1.5 }] } },
  {
    scene: {
      focus: ["a", "b"],
      beats: [
        { type: "wait", duration: 0.5 },
        { type: "packet", connection: "a-b", flow: "response", reverse: true, duration: 1 },
      ],
    },
  },
];

const compile = (options?: { reducedMotion?: boolean }) => compileTimeline(layout, steps, options);

describe("compileTimeline", () => {
  it("lays steps out back to back with a lead-in and a hold", () => {
    const { steps: spans, timeline } = compile();
    const pad = STEP_LEAD_IN + STEP_HOLD;
    expect(spans[0]).toEqual({ start: 0, end: pad + 2 });
    expect(spans[1]?.start).toBeCloseTo(pad + 2);
    expect(spans[1]!.end - spans[1]!.start).toBeCloseTo(pad + 1.5);
    expect(spans[2]!.end - spans[2]!.start).toBeCloseTo(pad + 1.5);
    expect(timeline.duration()).toBeCloseTo(spans[2]!.end);
    expect(timeline.labels["step-1"]).toBeCloseTo(spans[1]!.start);
  });

  it("creates one packet channel per packet beat, hidden until its beat starts", () => {
    const { channels, timeline } = compile();
    expect(channels.packets.map((p) => [p.connection, p.flow, p.reverse])).toEqual([
      ["a-b", "request", false],
      ["a-b", "response", true],
    ]);
    timeline.seek(0);
    expect(channels.packets.every((p) => p.opacity === 0)).toBe(true);
  });

  it("moves a packet along its connection while its beat plays", () => {
    const { channels, timeline } = compile();
    const packet = channels.packets[0]!;

    timeline.seek(STEP_LEAD_IN + 1); // half-way through the 2 s beat
    expect(packet.opacity).toBe(1);
    expect(packet.progress).toBeCloseTo(0.5);

    timeline.seek(STEP_LEAD_IN + 2.1); // arrived
    expect(packet.opacity).toBe(0);
    expect(packet.progress).toBe(1);
  });

  it("restores earlier state when seeking backwards", () => {
    const { channels, steps: spans, timeline } = compile();
    timeline.seek(spans[1]!.start + STEP_LEAD_IN + 0.75); // b is busy
    expect(channels.components.b?.activity).toBe(1);

    timeline.seek(STEP_LEAD_IN + 1);
    expect(channels.components.b?.activity).toBe(0);
    expect(channels.packets[0]?.opacity).toBe(1);

    timeline.seek(0);
    expect(channels.packets[0]?.opacity).toBe(0);
    expect(channels.packets[0]?.progress).toBe(0);
  });

  it("jumps packets between stations with reduced motion", () => {
    const { channels, timeline } = compile({ reducedMotion: true });
    timeline.seek(STEP_LEAD_IN + 0.8); // first half of the beat: at the source
    expect(channels.packets[0]?.opacity).toBe(1);
    expect(channels.packets[0]?.progress).toBe(0);
    timeline.seek(STEP_LEAD_IN + 1.5); // second half: at the destination
    expect(channels.packets[0]?.progress).toBe(1);
  });

  it("rejects beats that reference unknown components", () => {
    expect(() =>
      compileTimeline(layout, [
        { scene: { focus: [], beats: [{ type: "process", component: "zzz" }] } },
      ]),
    ).toThrow(/Unknown component "zzz"/);
  });
});

describe("TimelineController", () => {
  it("seeks to the start of a step, clamped to the available steps", () => {
    const compiled = compile();
    const onUpdate = vi.fn();
    const controller = new TimelineController(compiled, { onUpdate });

    controller.seek(1);
    expect(controller.stepIndex).toBe(1);
    expect(compiled.timeline.time()).toBeCloseTo(compiled.steps[1]!.start);
    expect(onUpdate).toHaveBeenLastCalledWith(1, 0);

    controller.seek(99);
    expect(controller.stepIndex).toBe(2);
    controller.seek(-5);
    expect(controller.stepIndex).toBe(0);
  });

  it("plays the current step to its end, then stops and reports it", async () => {
    const compiled = compile();
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, { onStepEnd });
    controller.setSpeed(40);

    expect(controller.play()).toBe(true);
    expect(controller.isPlaying).toBe(true);
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledWith(0), { timeout: 2000 });

    expect(controller.isPlaying).toBe(false);
    expect(controller.stepProgress).toBe(1);
    expect(compiled.timeline.time()).toBeCloseTo(compiled.steps[0]!.end);
    expect(compiled.channels.packets[0]?.opacity).toBe(0);
    // A finished step does not play again until the caller seeks.
    expect(controller.play()).toBe(false);
    controller.dispose();
  });

  it("pauses mid-step and resumes from the same place", async () => {
    const compiled = compile();
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, { onStepEnd });
    controller.setSpeed(10);
    controller.play();
    await vi.waitFor(() => expect(controller.stepProgress).toBeGreaterThan(0.2));

    controller.pause();
    const paused = controller.stepProgress;
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(controller.stepProgress).toBe(paused);

    controller.setSpeed(40);
    expect(controller.play()).toBe(true);
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledOnce(), { timeout: 2000 });
    controller.dispose();
  });
});
