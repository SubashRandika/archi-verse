/**
 * PLACEHOLDER (Phase 2). A static isometric line drawing of the API Gateway scene so the
 * studio shell can be judged with realistic content. Replaced by the interactive 3D scene
 * (React Three Fiber) in Phase 4.
 */

type Point3 = readonly [x: number, y: number, z: number];
type Point2 = readonly [x: number, y: number];

const SCALE = 34;
const COS_30 = Math.cos(Math.PI / 6);

/** Isometric projection: +x runs down-right, +y runs down-left, +z is up. */
function iso([x, y, z]: Point3): Point2 {
  return [(x - y) * COS_30 * SCALE, (x + y) * 0.5 * SCALE - z * SCALE];
}

const toPoints = (points: readonly Point3[]) =>
  points
    .map(iso)
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

interface Box {
  id: string;
  label?: string;
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  tone?: "focus" | "normal" | "idle";
}

const boxes: readonly Box[] = [
  { id: "client-base", label: "Browser", x: 0, y: 0, w: 1.6, d: 1.2, h: 0.18, tone: "focus" },
  { id: "client-screen", x: 0.04, y: 0.08, z: 0.18, w: 0.1, d: 1.04, h: 0.95, tone: "focus" },
  { id: "gateway", label: "API Gateway", x: 4.2, y: -0.1, w: 1.6, d: 1.4, h: 1.1 },
  { id: "orders", label: "Orders service", x: 9, y: -2.6, w: 1.4, d: 1.2, h: 0.85 },
  { id: "users", label: "Users service", x: 9, y: 2.2, w: 1.4, d: 1.2, h: 0.85 },
  {
    id: "identity",
    label: "Identity provider",
    x: 4.4,
    y: -4.4,
    w: 1.2,
    d: 1,
    h: 0.55,
    tone: "idle",
  },
];

const database = { label: "PostgreSQL", cx: 13.6, cy: -2, r: 0.75, h: 0.95 } as const;

/** L-routed connections on the floor (z = 0), so every segment follows a grid axis. */
const connections: readonly { id: string; points: readonly Point3[]; idle?: boolean }[] = [
  {
    id: "client-gateway",
    points: [
      [1.6, 0.6, 0],
      [4.2, 0.6, 0],
    ],
  },
  {
    id: "gateway-orders",
    points: [
      [5.8, 0.2, 0],
      [7.4, 0.2, 0],
      [7.4, -2, 0],
      [9, -2, 0],
    ],
  },
  {
    id: "gateway-users",
    points: [
      [5.8, 1, 0],
      [7.4, 1, 0],
      [7.4, 2.8, 0],
      [9, 2.8, 0],
    ],
  },
  {
    id: "orders-db",
    points: [
      [10.4, -2, 0],
      [database.cx - database.r, -2, 0],
    ],
  },
  {
    id: "gateway-identity",
    points: [
      [5, -0.1, 0],
      [5, -3.4, 0],
    ],
    idle: true,
  },
];

const packet: Point3 = [2.9, 0.6, 0.12];

function faces({ x, y, z = 0, w, d, h }: Box) {
  const top = z + h;
  return {
    top: [
      [x, y, top],
      [x + w, y, top],
      [x + w, y + d, top],
      [x, y + d, top],
    ] as Point3[],
    right: [
      [x + w, y, z],
      [x + w, y + d, z],
      [x + w, y + d, top],
      [x + w, y, top],
    ] as Point3[],
    left: [
      [x, y + d, z],
      [x + w, y + d, z],
      [x + w, y + d, top],
      [x, y + d, top],
    ] as Point3[],
  };
}

const TONE = {
  focus: { stroke: "var(--paper)", strokeOpacity: 0.95 },
  normal: { stroke: "var(--paper)", strokeOpacity: 0.5 },
  idle: { stroke: "var(--graphite)", strokeOpacity: 0.45 },
} as const;

/* Fit the viewBox to the drawing. */
const DB_RX = database.r * Math.SQRT2 * COS_30 * SCALE;
const DB_RY = database.r * Math.SQRT1_2 * SCALE;
const allPoints: Point2[] = [
  ...boxes.flatMap((box) => Object.values(faces(box)).flat().map(iso)),
  iso([database.cx, database.cy, 0]),
  iso([database.cx, database.cy, database.h]),
];
const PAD = 48;
const minX = Math.min(...allPoints.map((p) => p[0])) - DB_RX - PAD;
const maxX = Math.max(...allPoints.map((p) => p[0])) + DB_RX + PAD;
const minY = Math.min(...allPoints.map((p) => p[1])) - PAD;
const maxY = Math.max(...allPoints.map((p) => p[1])) + DB_RY + PAD;
const VIEW_BOX = `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;

function Label({ at, children }: { at: Point3; children: string }) {
  const [x, y] = iso(at);
  return (
    <text x={x} y={y + 20} textAnchor="middle" className="fill-graphite font-condensed text-[12px]">
      {children}
    </text>
  );
}

export function PlaceholderScene() {
  const [dbX, dbBaseY] = iso([database.cx, database.cy, 0]);
  const [, dbTopY] = iso([database.cx, database.cy, database.h]);
  const [packetX, packetY] = iso(packet);

  return (
    <div className="absolute inset-x-0 top-0 bottom-36 flex items-center justify-center p-8 @3xl:bottom-24">
      <p className="absolute top-5 left-7 max-w-[60%] text-caption text-graphite">
        Preview drawing. The interactive 3D scene arrives in Phase 4.
      </p>
      <svg
        viewBox={VIEW_BOX}
        role="img"
        aria-label="Sketch of the API Gateway architecture: a browser sends a request to the API Gateway, which routes it to the Orders and Users services; the Orders service reads from PostgreSQL."
        className="h-full max-h-136 w-full max-w-240"
      >
        {connections.map((connection) => (
          <polyline
            key={connection.id}
            points={toPoints(connection.points)}
            fill="none"
            stroke={connection.idle ? "var(--graphite)" : "var(--paper)"}
            strokeOpacity={connection.idle ? 0.35 : 0.4}
            strokeWidth="1.25"
            strokeDasharray={connection.idle ? "3 4" : undefined}
          />
        ))}

        {boxes.map((box) => {
          const { top, right, left } = faces(box);
          const tone = TONE[box.tone ?? "normal"];
          return (
            <g key={box.id} {...tone} strokeWidth="1.1" strokeLinejoin="round">
              <polygon points={toPoints(left)} fill="#101c2e" />
              <polygon points={toPoints(right)} fill="#142338" />
              <polygon points={toPoints(top)} fill="#1a2b45" />
            </g>
          );
        })}

        <g stroke="var(--paper)" strokeOpacity="0.5" strokeWidth="1.1">
          <path
            d={`M${dbX - DB_RX} ${dbTopY}L${dbX - DB_RX} ${dbBaseY}A${DB_RX} ${DB_RY} 0 0 0 ${dbX + DB_RX} ${dbBaseY}L${dbX + DB_RX} ${dbTopY}`}
            fill="#132237"
          />
          <ellipse cx={dbX} cy={dbTopY} rx={DB_RX} ry={DB_RY} fill="#1a2b45" />
        </g>

        {boxes
          .filter((box): box is Box & { label: string } => Boolean(box.label))
          .map((box) => (
            <Label key={box.id} at={[box.x + box.w, box.y + box.d, 0]}>
              {box.label}
            </Label>
          ))}
        <Label at={[database.cx + database.r * 0.7, database.cy + database.r * 0.7, 0]}>
          {database.label}
        </Label>

        {/* The request packet for step 2, with its start line. */}
        <circle cx={packetX} cy={packetY} r="11" fill="var(--flow-request)" opacity="0.18" />
        <circle cx={packetX} cy={packetY} r="4.5" fill="var(--flow-request)" />
        <g transform={`translate(${packetX - 20} ${packetY - 44})`}>
          <rect
            width="108"
            height="20"
            rx="3"
            fill="var(--hull-raised)"
            stroke="var(--flow-request)"
            strokeOpacity="0.6"
          />
          <text
            x="54"
            y="13.5"
            textAnchor="middle"
            className="fill-flow-request font-mono text-[10.5px]"
          >
            GET /api/orders
          </text>
        </g>
      </svg>
    </div>
  );
}
