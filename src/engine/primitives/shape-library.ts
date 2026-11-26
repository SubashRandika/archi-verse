import type { ComponentKind, Vec3 } from "@/lib/scene-spec";
import type { PartRole } from "../scene/palette";
import type { ScreenPicture, ShapePart } from "./shapes";

/*
 * The component models, one list of parts per kind (see shapes.ts for the format). Sizes are
 * in world units; y = 0 is the ground. Every kind except the network hop stands on a tile of
 * height TILE. Parts are in painter's order: back to front, bottom to top.
 */

const TILE = 0.12;

const box = (role: PartRole, size: Vec3, at: Vec3, station?: number): ShapePart => ({
  geometry: "box",
  role,
  size,
  at,
  station,
});
const rounded = (role: PartRole, size: Vec3, at: Vec3, bevel = 0.05): ShapePart => ({
  geometry: "rounded",
  role,
  size,
  at,
  bevel,
});
const cylinder = (role: PartRole, radius: number, height: number, at: Vec3): ShapePart => ({
  geometry: "cylinder",
  role,
  radius,
  height,
  at,
});
const screen = (picture: ScreenPicture, size: [number, number], at: Vec3): ShapePart => ({
  geometry: "screen",
  role: "screen",
  size,
  picture,
  at,
});
/** The soft base a component stands on. */
const tile = (width: number, depth: number): ShapePart =>
  rounded("tile", [width, TILE, depth], [0, TILE / 2, 0], 0.05);

// ----- Laptop (client) -----------------------------------------------------------------------

const DECK_TOP = TILE + 0.1;

/** A keyboard: 13 keys a row, five rows, a space bar in the bottom row. */
function keyboard(): ShapePart[] {
  const [x0, z0, width, depth, cols, rows] = [-0.78, -0.43, 1.56, 0.62, 13, 5];
  const [kw, kd] = [width / cols, depth / rows];
  const keys: ShapePart[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === rows - 1 && col >= 4 && col <= 8) continue;
      keys.push(
        box(
          "key",
          [kw - 0.03, 0.02, kd - 0.03],
          [x0 + (col + 0.5) * kw, DECK_TOP + 0.022, z0 + (row + 0.5) * kd],
        ),
      );
    }
  }
  keys.push(
    box("key", [5 * kw - 0.03, 0.02, kd - 0.03], [x0 + 6.5 * kw, DECK_TOP + 0.022, z0 + 4.5 * kd]),
  );
  return keys;
}

const LID_CENTER = DECK_TOP + 0.575;

const laptop: ShapePart[] = [
  tile(2.4, 1.9),
  rounded("body", [1.8, 1.15, 0.07], [0, LID_CENTER, -0.62], 0.03),
  screen("web-page", [1.6, 0.98], [0, LID_CENTER + 0.02, -0.583]),
  box("dark", [0.05, 0.05, 0.01], [0, LID_CENTER + 0.54, -0.582]),
  rounded("body", [1.8, 0.1, 1.3], [0, TILE + 0.05, 0], 0.04),
  box("dark", [1.6, 0.012, 0.66], [0, DECK_TOP + 0.006, -0.12]),
  ...keyboard(),
  box("panel", [0.5, 0.008, 0.28], [0, DECK_TOP + 0.004, 0.4]),
];

// ----- Phone (mobile) ------------------------------------------------------------------------

const PHONE_CENTER = TILE + 0.12 + 0.725;

const phone: ShapePart[] = [
  tile(1.3, 1.05),
  rounded("trim", [0.95, 0.12, 0.7], [0, TILE + 0.06, 0], 0.04),
  rounded("body", [0.8, 1.45, 0.1], [0, PHONE_CENTER, -0.1], 0.05),
  screen("app", [0.68, 1.25], [0, PHONE_CENTER, -0.048]),
  box("dark", [0.2, 0.04, 0.01], [0, PHONE_CENTER + 0.66, -0.047]),
];

// ----- Rack (service) ------------------------------------------------------------------------

/** One rack unit: the box, four drive bays and two lights on the front, vents on the side. */
function rackUnit(index: number): ShapePart[] {
  const y = TILE + 0.21 + index * 0.48;
  return [
    rounded("body", [1.3, 0.42, 1.3], [0, y, 0]),
    ...[-0.5, -0.27, -0.04, 0.19].map((x) => box("dark", [0.18, 0.24, 0.02], [x, y, 0.655])),
    box("light", [0.07, 0.07, 0.02], [0.4, y, 0.657]),
    box("light", [0.07, 0.07, 0.02], [0.52, y, 0.657]),
    ...[-0.45, -0.25, -0.05, 0.15, 0.35].map((z) => box("trim", [0.02, 0.2, 0.08], [0.656, y, z])),
  ];
}

const RACK_TOP = TILE + 0.21 + 2 * 0.48 + 0.21;

const rack: ShapePart[] = [
  tile(1.9, 1.9),
  ...rackUnit(0),
  ...rackUnit(1),
  ...rackUnit(2),
  // A payment-card emblem on top.
  box("panel", [0.7, 0.01, 0.46], [0, RACK_TOP + 0.005, 0]),
  box("dark", [0.7, 0.012, 0.1], [0, RACK_TOP + 0.006, -0.1]),
  box("light", [0.14, 0.012, 0.1], [-0.2, RACK_TOP + 0.006, 0.1]),
];

// ----- Database ------------------------------------------------------------------------------

const DISC = 0.38;
const DISC_GAP = 0.44;

/** One disc: the cylinder, a lighter band near its top, a status light on the front. */
function disc(index: number): ShapePart[] {
  const y = TILE + DISC / 2 + index * DISC_GAP;
  const front = 0.75 * Math.SQRT1_2;
  return [
    cylinder("body", 0.75, DISC, [0, y, 0]),
    cylinder("panel", 0.755, 0.05, [0, y + DISC / 2 - 0.06, 0]),
    box("light", [0.08, 0.08, 0.08], [front, y - 0.04, front]),
  ];
}

const DB_TOP = TILE + DISC + 2 * DISC_GAP;

const database: ShapePart[] = [
  tile(1.9, 1.9),
  ...disc(0),
  ...disc(1),
  ...disc(2),
  cylinder("panel", 0.32, 0.012, [0, DB_TOP + 0.006, 0]),
  cylinder("dark", 0.16, 0.014, [0, DB_TOP + 0.007, 0]),
];

// ----- Gateway ------------------------------------------------------------------------------

const PLINTH_TOP = TILE + 0.5;
const TIER_TOP = PLINTH_TOP + 0.26;
const GATE_Z = -0.32;

/** The five checks: a dark pedestal and a lamp each, in a row along the front of the tier. */
const gatewayLamps: ShapePart[] = Array.from({ length: 5 }, (_, i) => {
  const x = -0.72 + i * 0.36;
  return [
    box("dark", [0.26, 0.06, 0.26], [x, TIER_TOP + 0.03, 0.32]),
    box("light", [0.18, 0.16, 0.18], [x, TIER_TOP + 0.14, 0.32], i),
  ];
}).flat();

const gateway: ShapePart[] = [
  tile(2.6, 2.2),
  rounded("body", [2.2, 0.5, 1.8], [0, TILE + 0.25, 0]),
  // Vents along the right side and a stripe across the front of the plinth.
  ...[-0.5, -0.2, 0.1, 0.4].map((z) => box("trim", [0.02, 0.22, 0.12], [1.105, TILE + 0.25, z])),
  box("trim", [1.9, 0.06, 0.02], [0, TILE + 0.3, 0.905]),
  rounded("panel", [1.9, 0.26, 1.3], [0, PLINTH_TOP + 0.13, 0]),
  // The gate: a dark threshold, two posts, a lintel with a sign.
  box("dark", [0.78, 0.012, 0.22], [0, TIER_TOP + 0.006, GATE_Z]),
  box("trim", [0.22, 0.55, 0.22], [-0.5, TIER_TOP + 0.275, GATE_Z]),
  box("trim", [0.22, 0.55, 0.22], [0.5, TIER_TOP + 0.275, GATE_Z]),
  box("trim", [1.22, 0.14, 0.22], [0, TIER_TOP + 0.62, GATE_Z]),
  box("dark", [0.8, 0.08, 0.01], [0, TIER_TOP + 0.62, GATE_Z + 0.115]),
  box("light", [0.5, 0.025, 0.01], [0, TIER_TOP + 0.62, GATE_Z + 0.121]),
  ...gatewayLamps,
];

// ----- Vault (identity) ----------------------------------------------------------------------

const TOWER_Y = TILE + 0.8;
const DOOR_Z = 0.4;

const vault: ShapePart[] = [
  tile(1.8, 1.8),
  rounded("trim", [1.4, 0.3, 1.4], [0, TILE + 0.15, 0]),
  rounded("body", [0.8, 1.0, 0.8], [0, TOWER_Y, 0]),
  // Bands around the right side of the tower.
  box("trim", [0.02, 0.05, 0.6], [0.405, TOWER_Y - 0.3, 0]),
  box("trim", [0.02, 0.05, 0.6], [0.405, TOWER_Y + 0.3, 0]),
  // The door: a frame, the door, a round dial with a wheel, a keyhole and a status light.
  box("panel", [0.62, 0.76, 0.02], [0, TOWER_Y, DOOR_Z + 0.01]),
  box("trim", [0.54, 0.68, 0.02], [0, TOWER_Y, DOOR_Z + 0.02]),
  rounded("dark", [0.3, 0.3, 0.3], [0, TOWER_Y + 0.08, DOOR_Z - 0.07], 0.15),
  box("panel", [0.42, 0.035, 0.03], [0, TOWER_Y + 0.08, DOOR_Z + 0.075]),
  box("panel", [0.035, 0.42, 0.03], [0, TOWER_Y + 0.08, DOOR_Z + 0.075]),
  box("dark", [0.05, 0.1, 0.01], [0, TOWER_Y - 0.22, DOOR_Z + 0.035]),
  box("light", [0.1, 0.035, 0.01], [0, TOWER_Y + 0.3, DOOR_Z + 0.035]),
  rounded("panel", [1.0, 0.12, 1.0], [0, TILE + 1.36, 0]),
  box("light", [0.14, 0.05, 0.14], [0, TILE + 1.445, 0]),
];

// ----- Circuit breaker -----------------------------------------------------------------------

const BREAKER_TOP = TILE + 0.74;
const BREAKER_FRONT = 0.3;

const breaker: ShapePart[] = [
  tile(1.7, 1.4),
  rounded("trim", [1.3, 0.24, 1.0], [0, TILE + 0.12, 0]),
  rounded("body", [1.0, 0.5, 0.7], [0, TILE + 0.49, -0.05]),
  // Vents on the right side.
  ...[-0.25, -0.05, 0.15].map((z) => box("trim", [0.02, 0.24, 0.08], [0.505, TILE + 0.49, z])),
  // The lever in its slot.
  box("dark", [0.2, 0.01, 0.4], [0.22, BREAKER_TOP + 0.005, -0.1]),
  box("dark", [0.12, 0.42, 0.12], [0.22, BREAKER_TOP + 0.21, -0.2]),
  rounded("panel", [0.36, 0.1, 0.14], [0.22, BREAKER_TOP + 0.46, -0.2], 0.04),
  // A dark face plate with the three state lamps, each in a bezel.
  box("dark", [0.9, 0.28, 0.02], [0, TILE + 0.6, BREAKER_FRONT + 0.01]),
  ...Array.from({ length: 3 }, (_, i) => {
    const x = -0.3 + i * 0.3;
    return [
      box("trim", [0.24, 0.2, 0.04], [x, TILE + 0.6, BREAKER_FRONT + 0.03]),
      box("light", [0.17, 0.13, 0.06], [x, TILE + 0.6, BREAKER_FRONT + 0.05], i),
    ];
  }).flat(),
];

// ----- Network hop ---------------------------------------------------------------------------

/** A small router puck with two lights on its front. */
const hopLight = (angle: number): ShapePart =>
  box("light", [0.05, 0.05, 0.05], [0.23 * Math.cos(angle), 0.15, 0.23 * Math.sin(angle)]);

const hop: ShapePart[] = [
  cylinder("trim", 0.26, 0.06, [0, 0.03, 0]),
  cylinder("body", 0.24, 0.2, [0, 0.16, 0]),
  cylinder("panel", 0.18, 0.02, [0, 0.27, 0]),
  hopLight(Math.PI / 6),
  hopLight(Math.PI / 3),
];

export const SHAPES: Readonly<Record<ComponentKind, readonly ShapePart[]>> = {
  client: laptop,
  mobile: phone,
  service: rack,
  database,
  gateway,
  identity: vault,
  breaker,
  hop,
};
