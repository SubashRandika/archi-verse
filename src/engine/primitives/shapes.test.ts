import { COMPONENT_KINDS } from "@/lib/scene-spec";
import { labelAnchor, partHalfSize, SHAPES, shapeBounds } from "./shapes";

describe("labelAnchor", () => {
  const service = { kind: "service" as const, position: [10, 0, 5] as const };
  const { min, max } = shapeBounds("service");

  it("sits above the back corner by default (the highest point on screen)", () => {
    expect(labelAnchor(service)).toEqual([10 + min[0], max[1], 5 + min[2]]);
  });

  it("sits halfway up the back-right edge when placed to the right", () => {
    expect(labelAnchor(service, "right")).toEqual([10 + max[0], max[1] / 2, 5 + min[2]]);
  });

  it("sits at the front corner on the ground when placed below", () => {
    expect(labelAnchor(service, "below")).toEqual([10 + max[0], 0, 5 + max[2]]);
  });
});

describe("SHAPES", () => {
  const kinds = COMPONENT_KINDS;
  const stations = (kind: (typeof kinds)[number]) =>
    new Set(SHAPES[kind].flatMap((part) => (part.station === undefined ? [] : [part.station])))
      .size;

  it("gives every part a role", () => {
    for (const kind of kinds) {
      for (const part of SHAPES[kind]) expect(part.role, kind).toBeTruthy();
    }
  });

  it("stands every kind except the network hop on a tile", () => {
    for (const kind of kinds.filter((k) => k !== "hop")) {
      expect(SHAPES[kind][0]?.role, kind).toBe("tile");
    }
  });

  it("draws screens only on the laptop and the phone", () => {
    const pictures = (kind: (typeof kinds)[number]) =>
      SHAPES[kind].flatMap((part) => (part.geometry === "screen" ? [part.picture] : []));
    expect(pictures("client")).toEqual(["web-page"]);
    expect(pictures("mobile")).toEqual(["app"]);
    for (const kind of kinds.filter((k) => k !== "client" && k !== "mobile")) {
      expect(pictures(kind), kind).toEqual([]);
    }
  });

  it("keeps the animated stations", () => {
    expect(stations("gateway")).toBe(5);
    expect(stations("breaker")).toBe(3);
  });

  it("gives the laptop and the service rich detail", () => {
    expect(SHAPES.client.length).toBeGreaterThanOrEqual(40);
    expect(SHAPES.service.length).toBeGreaterThanOrEqual(20);
  });

  it("details the gateway, the vault, the breaker and the network hop", () => {
    expect(SHAPES.gateway.length).toBeGreaterThanOrEqual(15);
    expect(SHAPES.identity.length).toBeGreaterThanOrEqual(10);
    expect(SHAPES.breaker.length).toBeGreaterThanOrEqual(10);
    expect(SHAPES.hop.length).toBeGreaterThanOrEqual(4);
  });

  it("puts a dark dial on the vault door, in front of the tower", () => {
    const tower = SHAPES.identity.find((part) => part.role === "body");
    const towerFront = tower ? tower.at[2] + partHalfSize(tower)[2] : Infinity;
    const dial = SHAPES.identity.filter(
      (part) => part.role === "dark" && part.at[2] + partHalfSize(part)[2] > towerFront,
    );
    expect(dial.length).toBeGreaterThanOrEqual(1);
  });

  it("gives the network hop two lights", () => {
    expect(SHAPES.hop.filter((part) => part.role === "light")).toHaveLength(2);
  });
});
