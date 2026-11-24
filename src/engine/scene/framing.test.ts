import * as THREE from "three";
import { CAMERA_DISTANCE, computeFraming, ISO_DIRECTION } from "./framing";

const viewport = { width: 800, height: 600 };
const none = { top: 0, right: 0, bottom: 0, left: 0 };
const cube = { min: [-1, -1, -1], max: [1, 1, 1] } as const;

/** Projects a world point to CSS pixels for the computed camera. */
function project(point: readonly number[], framing: ReturnType<typeof computeFraming>) {
  const camera = new THREE.OrthographicCamera(
    -viewport.width / 2,
    viewport.width / 2,
    viewport.height / 2,
    -viewport.height / 2,
    0.1,
    200,
  );
  camera.zoom = framing.zoom;
  camera.position.set(...framing.position);
  camera.lookAt(...framing.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const ndc = new THREE.Vector3(point[0], point[1], point[2]).project(camera);
  return { x: ((ndc.x + 1) / 2) * viewport.width, y: ((1 - ndc.y) / 2) * viewport.height };
}

describe("computeFraming", () => {
  it("looks at the box from the isometric direction", () => {
    const framing = computeFraming(cube, viewport, none, [1, 1000]);
    const offset = new THREE.Vector3(...framing.position).sub(new THREE.Vector3(...framing.target));
    expect(offset.length()).toBeCloseTo(CAMERA_DISTANCE);
    expect(offset.normalize().dot(ISO_DIRECTION)).toBeCloseTo(1);
  });

  it("centres the box and fits it inside the viewport", () => {
    const framing = computeFraming(cube, viewport, none, [1, 1000]);
    const centre = project([0, 0, 0], framing);
    expect(centre.x).toBeCloseTo(400, 0);
    expect(centre.y).toBeCloseTo(300, 0);

    const corners = [-1, 1].flatMap((x) =>
      [-1, 1].flatMap((y) => [-1, 1].map((z) => project([x, y, z], framing))),
    );
    const xs = corners.map((c) => c.x);
    const ys = corners.map((c) => c.y);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(-0.5);
    expect(Math.max(...xs)).toBeLessThanOrEqual(800.5);
    // The tighter axis touches the viewport edges.
    expect(Math.min(...ys)).toBeCloseTo(0, 0);
    expect(Math.max(...ys)).toBeCloseTo(600, 0);
  });

  it("keeps the box inside asymmetric padding", () => {
    const padding = { top: 40, right: 20, bottom: 160, left: 20 };
    const framing = computeFraming(cube, viewport, padding, [1, 1000]);
    const centre = project([0, 0, 0], framing);
    // Centre of the padded area: x = 400, y = 40 + (600 - 200) / 2 = 240.
    expect(centre.x).toBeCloseTo(400, 0);
    expect(centre.y).toBeCloseTo(240, 0);
  });

  it("respects the zoom range", () => {
    expect(computeFraming(cube, viewport, none, [10, 50]).zoom).toBe(50);
    const huge = { min: [-500, 0, -500], max: [500, 1, 500] } as const;
    expect(computeFraming(huge, viewport, none, [10, 50]).zoom).toBe(10);
  });
});
