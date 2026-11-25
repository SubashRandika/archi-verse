import { badge, burst, send, stage, status, timed, wait } from "./beats";

describe("beat builders", () => {
  it("builds a packet from readable options", () => {
    expect(send("a-b", "response", { back: true, duration: 2, message: "reply" })).toEqual({
      type: "packet",
      connection: "a-b",
      flow: "response",
      reverse: true,
      stay: undefined,
      lost: undefined,
      duration: 2,
      next: undefined,
      message: "reply",
    });
  });

  it("builds stage and status beats", () => {
    expect(stage("gateway", "auth", 1, "error")).toEqual({
      type: "process",
      component: "gateway",
      duration: 1,
      stage: "auth",
      tone: "error",
    });
    expect(status("db", "down", badge("down"))).toEqual({
      type: "status",
      component: "db",
      status: { tone: "down", badge: { id: "down" } },
    });
    expect(badge("left", 0)).toEqual({ id: "left", count: 0 });
    expect(status("db", null)).toEqual({ type: "status", component: "db", status: null });
  });

  it("turns absolute times into beats separated by waits", () => {
    const a = status("x", "info", badge("a"));
    const b = status("x", "info", badge("b"));
    const c = status("x", "info", badge("c"));
    expect(
      timed([
        { at: 1.5, beat: c },
        { at: 0, beat: a },
        { at: 0, beat: b },
      ]),
    ).toEqual([a, b, wait(1.5), c]);
  });

  it("launches a burst of packets that overlap, with a beat as each arrives", () => {
    const beats = burst({
      connection: "a-b",
      count: 2,
      every: 0.5,
      travel: 1,
      onArrive: (index) => status("b", "info", badge("arrived", index + 1)),
    });
    expect(beats).toEqual([
      send("a-b", "request", { duration: 1, next: 0 }),
      wait(0.5),
      send("a-b", "request", { duration: 1, next: 0 }),
      wait(0.5),
      status("b", "info", badge("arrived", 1)),
      wait(0.5),
      status("b", "info", badge("arrived", 2)),
    ]);
  });
});
