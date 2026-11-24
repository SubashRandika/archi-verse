import { parsePersistedProgress, PROGRESS_STORAGE_KEY, useProgressStore } from "./progress-store";

const saved = () => JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");

describe("progress store", () => {
  beforeEach(() => {
    useProgressStore.setState({ concepts: {} });
    localStorage.clear();
  });

  it("marks a concept completed and persists it", () => {
    useProgressStore.getState().markCompleted("cap-theorem");

    const record = useProgressStore.getState().concepts["cap-theorem"];
    expect(record?.status).toBe("completed");
    expect(record?.completedAt).toBeDefined();
    expect(saved()).toMatchObject({
      version: 1,
      state: { concepts: { "cap-theorem": { status: "completed" } } },
    });
  });

  it("marks a concept not started by removing its record", () => {
    const store = useProgressStore.getState();
    store.markCompleted("jwt");
    store.markNotStarted("jwt");
    expect(useProgressStore.getState().concepts).toEqual({});
  });

  it("records a step as in progress, without downgrading a completed concept", () => {
    const store = useProgressStore.getState();
    store.recordStep("api-gateway", "authentication");
    expect(useProgressStore.getState().concepts["api-gateway"]).toMatchObject({
      status: "in-progress",
      lastStepId: "authentication",
    });

    store.markCompleted("api-gateway");
    store.recordStep("api-gateway", "rate-limiting");
    expect(useProgressStore.getState().concepts["api-gateway"]).toMatchObject({
      status: "completed",
      lastStepId: "rate-limiting",
    });
  });

  it("resets all progress", () => {
    const store = useProgressStore.getState();
    store.markCompleted("jwt");
    store.markCompleted("cors");
    store.reset();
    expect(useProgressStore.getState().concepts).toEqual({});
    expect(saved().state.concepts).toEqual({});
  });

  it("restores saved progress on rehydration", async () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: { concepts: { vite: { status: "completed", updatedAt: "2026-11-24T10:00:00Z" } } },
      }),
    );
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState().concepts.vite?.status).toBe("completed");
  });

  it("survives corrupted storage", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(PROGRESS_STORAGE_KEY, "{not json");
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState().concepts).toEqual({});
    warn.mockRestore();
  });
});

describe("parsePersistedProgress", () => {
  it("keeps valid records and drops invalid ones", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const records = parsePersistedProgress({
      concepts: {
        good: { status: "completed", updatedAt: "2026-11-24T10:00:00Z" },
        bad: { status: "finished" },
        worse: 42,
      },
    });
    expect(Object.keys(records)).toEqual(["good"]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Dropped 2"));
  });

  it("returns no progress for unreadable data", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parsePersistedProgress("nonsense")).toEqual({});
    expect(parsePersistedProgress(undefined)).toEqual({});
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
