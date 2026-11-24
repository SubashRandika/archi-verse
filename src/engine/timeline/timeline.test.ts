import type { SceneLayout, StepScene } from "@/lib/scene-spec";
import { badgeOf, compileTimeline, STEP_HOLD, STEP_LEAD_IN } from "./compile";
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

describe("compileTimeline: states, stages and signals", () => {
  const richLayout: SceneLayout = {
    components: [
      { id: "a", kind: "client", label: "A", role: "Client", position: [0, 0, 0] },
      {
        id: "g",
        kind: "gateway",
        label: "G",
        role: "Gateway",
        position: [4, 0, 0],
        stages: [{ id: "auth", label: "Authentication" }],
      },
    ],
    connections: [{ id: "a-g", from: "a", to: "g" }],
  };
  const richSteps: { scene: StepScene }[] = [
    {
      scene: {
        focus: ["g"],
        beats: [
          { type: "process", component: "g", stage: "auth", tone: "error", duration: 1 },
          { type: "status", component: "g", status: { tone: "error", badge: { id: "401" } } },
          { type: "signal", connection: "a-g", duration: 1 },
        ],
      },
    },
    {
      scene: {
        focus: ["a"],
        initial: { status: { a: { tone: "warning", badge: { id: "slow" } } } },
        beats: [{ type: "packet", connection: "a-g", flow: "error", stay: true, duration: 1 }],
      },
    },
  ];

  it("lights a stage with its tone and shows its label while busy", () => {
    const { channels, timeline } = compileTimeline(richLayout, richSteps);
    timeline.seek(STEP_LEAD_IN + 0.5);
    const g = channels.components.g!;
    expect(g.stages.auth).toMatchObject({ activity: 1, tone: "error" });
    expect(g.stageLabel).toBe("Authentication");
    expect(g.activity).toBe(0);
  });

  it("sets statuses and badges, and resets them at the next step", () => {
    const { channels, steps: spans, timeline } = compileTimeline(richLayout, richSteps);
    timeline.seek(STEP_LEAD_IN + 1.5);
    const g = channels.components.g!;
    expect(g).toMatchObject({ status: "error", stageLabel: "" });
    expect(badgeOf(g)).toEqual({ id: "401" });
    expect(channels.wires["a-g"]?.activity).toBe(1);

    timeline.seek(spans[1]!.start + 0.1);
    expect(g.status).toBe("none");
    expect(badgeOf(g)).toBeUndefined();
    // The next step's declared initial state applies from its start.
    const a = channels.components.a!;
    expect(a.status).toBe("warning");
    expect(badgeOf(a)).toEqual({ id: "slow" });

    timeline.seek(0.1); // and seeking back restores the first step's clean start
    expect(a.status).toBe("none");
    expect(badgeOf(a)).toBeUndefined();
  });

  it("keeps a staying packet at the start of its route", () => {
    const { channels, steps: spans, timeline } = compileTimeline(richLayout, richSteps);
    timeline.seek(spans[1]!.start + STEP_LEAD_IN + 0.6);
    expect(channels.packets[0]).toMatchObject({ opacity: 1, progress: 0, flow: "error" });
  });

  it("rejects unknown stages and connections", () => {
    const step = (beat: StepScene["beats"][number]) => [{ scene: { focus: ["g"], beats: [beat] } }];
    expect(() =>
      compileTimeline(richLayout, step({ type: "process", component: "g", stage: "nope" })),
    ).toThrow(/Unknown stage "nope"/);
    expect(() => compileTimeline(richLayout, step({ type: "signal", connection: "x" }))).toThrow(
      /Unknown connection "x"/,
    );
  });
});

describe("overlapping packets", () => {
  it("starts the next beat early and lasts until the last packet arrives", () => {
    const compiled = compileTimeline(layout, [
      {
        scene: {
          focus: ["a"],
          beats: [
            { type: "packet", connection: "a-b", flow: "request", duration: 1, next: 0.25 },
            { type: "packet", connection: "a-b", flow: "request", duration: 1, next: 0 },
            { type: "status", component: "b", status: { tone: "info", badge: { id: "x" } } },
          ],
        },
      },
    ]);
    const [first, second] = compiled.channels.packets;
    const span = compiled.steps[0]!;
    expect(span.end - span.start).toBeCloseTo(STEP_LEAD_IN + 1.25 + STEP_HOLD);

    // Halfway through the first packet's trip, the second is already travelling.
    compiled.timeline.seek(span.start + STEP_LEAD_IN + 0.5, false);
    expect(first?.opacity).toBe(1);
    expect(second?.opacity).toBe(1);
    expect(second!.progress).toBeGreaterThan(0);
    expect(second!.progress).toBeLessThan(first!.progress);
    // The status beat ran when the second packet was launched.
    expect(compiled.channels.components.b?.status).toBe("info");
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

  it("stops before the next step's starting state shows", async () => {
    const compiled = compileTimeline(layout, [
      steps[0]!,
      {
        scene: {
          ...steps[1]!.scene,
          initial: { status: { b: { tone: "info", badge: { id: "58" } } } },
        },
      },
    ]);
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, { onStepEnd });
    controller.setSpeed(40);
    controller.play();
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledWith(0), { timeout: 2000 });

    expect(compiled.channels.components.b?.status).toBe("none");
    controller.seek(1);
    expect(compiled.channels.components.b?.status).toBe("info");
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

describe("timing edge cases", () => {
  /** One step with a burst: three packets in flight at once, and a badge as the last arrives. */
  const burstSteps: { scene: StepScene }[] = [
    {
      scene: {
        focus: ["a", "b"],
        beats: [
          { type: "packet", connection: "a-b", flow: "request", duration: 1, next: 0 },
          { type: "wait", duration: 0.3 },
          { type: "packet", connection: "a-b", flow: "request", duration: 1, next: 0 },
          { type: "wait", duration: 0.3 },
          { type: "packet", connection: "a-b", flow: "request", duration: 1, next: 0 },
          { type: "wait", duration: 1 },
          { type: "status", component: "b", status: { tone: "warning", badge: { id: "left" } } },
        ],
      },
    },
    steps[1]!,
  ];

  it("changes speed mid-step without jumping the playhead", async () => {
    const compiled = compile();
    const progress: number[] = [];
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, {
      onUpdate: (stepIndex, value) => stepIndex === 0 && progress.push(value),
      onStepEnd,
    });
    controller.setSpeed(4);
    controller.play();
    await vi.waitFor(() => expect(controller.stepProgress).toBeGreaterThan(0.1));

    controller.setSpeed(40);
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledOnce(), { timeout: 2000 });
    // Progress only ever moved forwards, and ended exactly at the end of the step.
    expect(progress).toEqual([...progress].sort((a, b) => a - b));
    expect(controller.stepProgress).toBe(1);
    controller.dispose();
  });

  it("applies a speed chosen while paused to the next play", async () => {
    const compiled = compile();
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, { onStepEnd });
    controller.setSpeed(40);
    const started = performance.now();
    controller.play();
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledOnce(), { timeout: 2000 });
    // Step 1 lasts several seconds at normal speed.
    expect(performance.now() - started).toBeLessThan(1000);
    controller.dispose();
  });

  it("clears packets in flight when jumping away mid-burst, and restores them when jumping back", async () => {
    const compiled = compileTimeline(layout, burstSteps);
    const controller = new TimelineController(compiled);
    const visible = () => compiled.channels.packets.filter((packet) => packet.opacity > 0).length;
    controller.setSpeed(4);
    controller.play();
    await vi.waitFor(() => expect(visible()).toBeGreaterThanOrEqual(2));

    controller.seek(1);
    expect(controller.isPlaying).toBe(false);
    expect(visible()).toBe(0);
    expect(compiled.channels.components.b?.status).toBe("none");

    controller.seek(0);
    expect(visible()).toBe(0);
    controller.dispose();
  });

  it("ends a burst with every packet delivered and the final state shown", async () => {
    const compiled = compileTimeline(layout, burstSteps);
    const onStepEnd = vi.fn();
    const controller = new TimelineController(compiled, { onStepEnd });
    controller.setSpeed(40);
    controller.play();
    await vi.waitFor(() => expect(onStepEnd).toHaveBeenCalledWith(0), { timeout: 2000 });

    expect(compiled.channels.packets.every((packet) => packet.opacity === 0)).toBe(true);
    expect(compiled.channels.components.b?.status).toBe("warning");
    controller.dispose();
  });

  it("keeps the same step timing and end state with reduced motion", () => {
    const normal = compileTimeline(layout, burstSteps);
    const reduced = compileTimeline(layout, burstSteps, { reducedMotion: true });
    expect(reduced.steps).toEqual(normal.steps);

    for (const compiled of [normal, reduced]) {
      compiled.timeline.seek(compiled.steps[0]!.end - 0.01, false);
      expect(compiled.channels.components.b?.status).toBe("warning");
      expect(compiled.channels.packets.every((packet) => packet.opacity === 0)).toBe(true);
    }
  });
});
