import type { SceneLayout, Vec3 } from "@/lib/scene-spec";
import { labelAnchor, type ShapePart, SHAPES } from "../primitives/shapes";

/**
 * A static isometric line drawing of any scene layout, from the same shapes and the same view
 * direction as the 3D scene. It is the studio's fallback when WebGL is unavailable or lost,
 * so every module gets one without extra work. No three.js: plain SVG.
 */

type Point2 = readonly [x: number, y: number];

/** Pixels per world unit. */
const SCALE = 34;
const COS_30 = Math.cos(Math.PI / 6);
const PAD = 56;

/**
 * True isometric projection matching the 3D camera (looking from +x, +y, +z): x runs
 * down-right, z runs down-left, y is up.
 */
function project([x, y, z]: Vec3): Point2 {
  return [(x - z) * COS_30 * SCALE, ((x + z) * 0.5 - y) * SCALE];
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const points = (list: readonly Vec3[]) =>
  list
    .map(project)
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

/** The three faces of a box the camera sees: top (+y), right (+x) and front (+z). */
function boxFaces(center: Vec3, [w, h, d]: Vec3) {
  const [x0, y0, z0] = [center[0] - w / 2, center[1] - h / 2, center[2] - d / 2];
  const [x1, y1, z1] = [x0 + w, y0 + h, z0 + d];
  return {
    top: [
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y1, z1],
      [x0, y1, z1],
    ] as Vec3[],
    right: [
      [x1, y0, z0],
      [x1, y0, z1],
      [x1, y1, z1],
      [x1, y1, z0],
    ] as Vec3[],
    front: [
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ] as Vec3[],
  };
}

const FILL = { top: "#1a2b45", right: "#142338", front: "#101c2e" } as const;

function Part({ part, origin }: { part: ShapePart; origin: Vec3 }) {
  const center = add(origin, part.at);
  if (part.geometry === "box") {
    const faces = boxFaces(center, part.size);
    return (
      <>
        <polygon points={points(faces.front)} fill={FILL.front} />
        <polygon points={points(faces.right)} fill={FILL.right} />
        <polygon points={points(faces.top)} fill={FILL.top} />
      </>
    );
  }
  // A vertical cylinder: its outline is a side band and an elliptical top.
  const rx = part.radius * Math.SQRT2 * COS_30 * SCALE;
  const ry = part.radius * Math.SQRT1_2 * SCALE;
  const [cx, bottom] = project(add(center, [0, -part.height / 2, 0]));
  const [, top] = project(add(center, [0, part.height / 2, 0]));
  return (
    <>
      <path
        d={`M${cx - rx} ${top}L${cx - rx} ${bottom}A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom}L${cx + rx} ${top}Z`}
        fill={FILL.right}
      />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={FILL.top} />
    </>
  );
}

/** Painter's order: parts further from the camera first, then lower parts first. */
const depth = (center: Vec3) => center[0] + center[2] + center[1] * 0.01;

export interface IsometricDrawingProps {
  layout: SceneLayout;
  /** Components the current step is about; the others are drawn dimmed. */
  focus?: readonly string[];
  /** Accessible description of the drawing. */
  label: string;
  className?: string;
}

export function IsometricDrawing({ layout, focus, label, className }: IsometricDrawingProps) {
  const byId = new Map(layout.components.map((component) => [component.id, component]));
  const focused = (id: string) => !focus || focus.length === 0 || focus.includes(id);

  const parts = layout.components
    .flatMap((component) =>
      SHAPES[component.kind].map((part) => ({
        component,
        part,
        depth: depth(add(component.position, part.at)),
      })),
    )
    .sort((a, b) => a.depth - b.depth);

  const wires = layout.connections
    .filter((connection) => !connection.hidden)
    .flatMap((connection) => {
      const from = byId.get(connection.from);
      const to = byId.get(connection.to);
      if (!from || !to) return [];
      return [{ connection, route: [from.position, ...(connection.via ?? []), to.position] }];
    });

  const labels = layout.components
    .filter((component) => !component.decorative)
    .map((component) => {
      const placement = component.labelPlacement ?? "above";
      const [x, y] = project(labelAnchor(component, placement));
      return placement === "right"
        ? { component, x: x + 8, y: y + 4, anchor: "start" as const }
        : { component, x, y: placement === "below" ? y + 16 : y - 10, anchor: "middle" as const };
    });

  // Fit the view box to every part and label.
  const extent = parts.flatMap(({ component, part }) => {
    const center = add(component.position, part.at);
    const half: Vec3 =
      part.geometry === "box"
        ? [part.size[0] / 2, part.size[1] / 2, part.size[2] / 2]
        : [part.radius, part.height / 2, part.radius];
    return [add(center, half), add(center, [-half[0], -half[1], -half[2]])].map(project);
  });
  // Labels count with an estimated width (12px condensed text, about 6.5px per character).
  const labelWidth = (text: string) => text.length * 6.5;
  const xs = [
    ...extent.map((p) => p[0]),
    ...labels.flatMap(({ component, x, anchor }) =>
      anchor === "start"
        ? [x, x + labelWidth(component.label)]
        : [x - labelWidth(component.label) / 2, x + labelWidth(component.label) / 2],
    ),
  ];
  const ys = [...extent.map((p) => p[1]), ...labels.map((l) => l.y)];
  const minX = Math.min(...xs) - PAD;
  const minY = Math.min(...ys) - PAD;
  const viewBox = [minX, minY, Math.max(...xs) + PAD - minX, Math.max(...ys) + PAD - minY]
    .map((value) => value.toFixed(0))
    .join(" ");

  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={className}>
      {wires.map(({ connection, route }) => {
        const lit = focused(connection.from) && focused(connection.to);
        return (
          <polyline
            key={connection.id}
            points={points(route)}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity={lit ? 0.45 : 0.15}
            strokeWidth="1.25"
            strokeDasharray={connection.style === "dashed" ? "3 4" : undefined}
          />
        );
      })}

      {parts.map(({ component, part }, index) => (
        <g
          key={`${component.id}-${index}`}
          stroke="var(--paper)"
          strokeOpacity={focused(component.id) ? 0.9 : 0.3}
          strokeWidth="1.1"
          strokeLinejoin="round"
        >
          <Part part={part} origin={component.position} />
        </g>
      ))}

      {labels.map(({ component, x, y, anchor }) => (
        <text
          key={component.id}
          x={x}
          y={y}
          textAnchor={anchor}
          stroke="var(--hull)"
          strokeWidth="4"
          strokeLinejoin="round"
          paintOrder="stroke"
          className={
            focused(component.id)
              ? "fill-paper font-condensed text-[12px]"
              : "fill-graphite font-condensed text-[12px]"
          }
        >
          {component.label}
        </text>
      ))}
    </svg>
  );
}
