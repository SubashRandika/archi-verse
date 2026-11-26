import * as THREE from "three";
import { COMPONENT_KINDS } from "@/lib/scene-spec";
import { SCENE_PALETTES } from "../scene/palette";
import { buildKindModel } from "./model-builder";
import { SCREEN_REGIONS } from "./screen-atlas";
import { shapeBounds } from "./shapes";

const palette = SCENE_PALETTES.dark;

describe("buildKindModel", () => {
  it("merges each kind into a coloured solid inside its shape bounds", () => {
    for (const kind of COMPONENT_KINDS) {
      const model = buildKindModel(kind, palette);
      const { solid } = model;
      for (const name of ["position", "normal", "color"]) {
        expect(solid.getAttribute(name), `${kind} ${name}`).toBeDefined();
      }
      solid.computeBoundingBox();
      const box = solid.boundingBox!;
      const { min, max } = shapeBounds(kind);
      expect(box.min.x, kind).toBeGreaterThanOrEqual(min[0] - 0.01);
      expect(box.min.y, kind).toBeGreaterThanOrEqual(min[1] - 0.01);
      expect(box.min.z, kind).toBeGreaterThanOrEqual(min[2] - 0.01);
      expect(box.max.x, kind).toBeLessThanOrEqual(max[0] + 0.01);
      expect(box.max.y, kind).toBeLessThanOrEqual(max[1] + 0.01);
      expect(box.max.z, kind).toBeLessThanOrEqual(max[2] + 0.01);
      model.dispose();
    }
  });

  it("maps the laptop's and the phone's screens into their pictures", () => {
    for (const [kind, picture] of [
      ["client", "web-page"],
      ["mobile", "app"],
    ] as const) {
      const { screens } = buildKindModel(kind, palette);
      const uv = screens?.getAttribute("uv");
      expect(uv, kind).toBeDefined();
      const region = SCREEN_REGIONS[picture];
      for (let i = 0; i < uv!.count; i++) {
        expect(uv!.getX(i)).toBeGreaterThanOrEqual(region.u0 - 1e-6);
        expect(uv!.getX(i)).toBeLessThanOrEqual(region.u1 + 1e-6);
        expect(uv!.getY(i)).toBeGreaterThanOrEqual(region.v0 - 1e-6);
        expect(uv!.getY(i)).toBeLessThanOrEqual(region.v1 + 1e-6);
      }
    }
  });

  it("has no screens on kinds without one", () => {
    for (const kind of COMPONENT_KINDS.filter((k) => k !== "client" && k !== "mobile")) {
      expect(buildKindModel(kind, palette).screens, kind).toBeNull();
    }
  });

  it("keeps stations as separate geometries", () => {
    expect(buildKindModel("gateway", palette).stations.map((s) => s.index)).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(buildKindModel("service", palette).stations).toEqual([]);
  });

  it("colours the service's body with the service colour", () => {
    const colour = new THREE.Color(palette.kinds.service);
    const attribute = buildKindModel("service", palette).solid.getAttribute("color");
    let found = false;
    for (let i = 0; i < attribute.count && !found; i++) {
      found =
        Math.abs(attribute.getX(i) - colour.r) < 1e-4 &&
        Math.abs(attribute.getY(i) - colour.g) < 1e-4 &&
        Math.abs(attribute.getZ(i) - colour.b) < 1e-4;
    }
    expect(found).toBe(true);
  });

  it("puts status lights in their own geometry", () => {
    expect(buildKindModel("service", palette).lights).not.toBeNull();
    expect(buildKindModel("client", palette).lights).toBeNull();
  });
});
