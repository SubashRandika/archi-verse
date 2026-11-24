import { labelAnchor, shapeBounds } from "./shapes";

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
