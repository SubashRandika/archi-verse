import { createProgressChannel, createStudioSession, MAIN_TRACK } from "./session-store";

const session = (initialStepIndex = 0) =>
  createStudioSession({ tracks: { [MAIN_TRACK]: 3, outage: 2 }, initialStepIndex });

describe("studio session store", () => {
  it("starts paused on the main path, at the initial step, clamped to the module", () => {
    expect(session(1).getState()).toMatchObject({
      trackId: MAIN_TRACK,
      stepIndex: 1,
      stepCount: 3,
      playing: false,
      mode: "guided",
    });
    expect(session(9).getState().stepIndex).toBe(2);
    expect(session(-3).getState().stepIndex).toBe(0);
  });

  it("plays a step when navigating to it, and counts every navigation", () => {
    const store = session();
    store.getState().nextStep();
    expect(store.getState()).toMatchObject({ stepIndex: 1, playing: true, seekCount: 1 });

    store.getState().goToStep(1); // replaying the same step still seeks
    expect(store.getState().seekCount).toBe(2);

    store.getState().nextStep();
    store.getState().nextStep(); // clamped at the last step
    expect(store.getState().stepIndex).toBe(2);

    store.getState().restart();
    expect(store.getState()).toMatchObject({ stepIndex: 0, playing: true });
  });

  it("stops at the end of a step, then moves on when played again", () => {
    const store = session();
    store.getState().play();
    store.getState().completeStep(0);
    expect(store.getState()).toMatchObject({ playing: false, stepComplete: true, stepIndex: 0 });

    store.getState().togglePlaying();
    expect(store.getState()).toMatchObject({ stepIndex: 1, playing: true, stepComplete: false });
  });

  it("replays the last step instead of running past the end", () => {
    const store = session(2);
    store.getState().play();
    store.getState().completeStep(2);
    const seeks = store.getState().seekCount;

    store.getState().play();
    expect(store.getState()).toMatchObject({ stepIndex: 2, playing: true });
    expect(store.getState().seekCount).toBe(seeks + 1);
  });

  it("ignores completion of a step the learner already left", () => {
    const store = session();
    store.getState().play();
    store.getState().nextStep();
    store.getState().completeStep(0);
    expect(store.getState()).toMatchObject({ stepIndex: 1, playing: true, stepComplete: false });
  });

  it("switches to a scenario and back to the main path", () => {
    const store = session(2);
    store.getState().switchTrack("outage");
    expect(store.getState()).toMatchObject({
      trackId: "outage",
      stepIndex: 0,
      stepCount: 2,
      playing: true,
      seekCount: 1,
    });

    store.getState().nextStep();
    store.getState().nextStep(); // clamped to the scenario's length
    expect(store.getState().stepIndex).toBe(1);

    store.getState().switchTrack(MAIN_TRACK, 1);
    expect(store.getState()).toMatchObject({ trackId: MAIN_TRACK, stepIndex: 1, stepCount: 3 });

    store.getState().switchTrack("unknown");
    expect(store.getState().trackId).toBe(MAIN_TRACK);
  });

  it("resumes at a step without playing, but only before the learner navigates", () => {
    const store = session();
    store.getState().resume(2);
    expect(store.getState()).toMatchObject({ stepIndex: 2, playing: false, seekCount: 1 });

    store.getState().resume(0);
    expect(store.getState().stepIndex).toBe(2);
  });

  it("pauses when switching to explore, and returns to guided on play", () => {
    const store = session();
    store.getState().play();
    store.getState().setMode("explore");
    expect(store.getState()).toMatchObject({ mode: "explore", playing: false });
    store.getState().play();
    expect(store.getState()).toMatchObject({ mode: "guided", playing: true });
  });

  it("selects either a component or an inspected message", () => {
    const store = session();
    store.getState().select("gateway");
    store.getState().hover("browser");
    expect(store.getState()).toMatchObject({ selectedId: "gateway", hoveredId: "browser" });

    store.getState().inspectMessage("request");
    expect(store.getState()).toMatchObject({ selectedId: null, inspectedMessage: "request" });

    store.getState().select("gateway");
    expect(store.getState().inspectedMessage).toBeNull();
  });
});

describe("progress channel", () => {
  it("notifies subscribers of changes only", () => {
    const channel = createProgressChannel();
    const listener = vi.fn();
    const unsubscribe = channel.subscribe(listener);

    channel.set(0.5);
    channel.set(0.5);
    expect(listener).toHaveBeenCalledOnce();
    expect(channel.get()).toBe(0.5);

    unsubscribe();
    channel.set(1);
    expect(listener).toHaveBeenCalledOnce();
  });
});
