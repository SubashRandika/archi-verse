import type { ComponentKind, SceneLayout, Vec3 } from "@/lib/scene-spec";
import { labelAnchor, partHalfSize, type ShapePart, SHAPES } from "../primitives/shapes";
import {
  mixHex,
  roleColor,
  SCENE_PALETTES,
  type ScenePalette,
  type SceneTheme,
} from "../scene/palette";

/**
 * A static isometric drawing of any scene layout, from the same shapes, colours and view
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

/** Opacity of components outside the step's focus. */
const DIMMED = 0.35;

/** The three shades of a part: lit top, the front in its own colour, the shaded right side. */
function shades(colour: string) {
  return {
    top: mixHex(colour, "#ffffff", 0.2),
    front: colour,
    right: mixHex(colour, "#000000", 0.2),
  };
}

function Part({
  part,
  origin,
  kind,
  palette,
}: {
  part: ShapePart;
  origin: Vec3;
  kind: ComponentKind;
  palette: ScenePalette;
}) {
  const center = add(origin, part.at);
  const fill = shades(roleColor(palette, kind, part.role));
  if (part.geometry === "screen") {
    const faces = boxFaces(center, [part.size[0], part.size[1], 0]);
    return <polygon points={points(faces.front)} fill={palette.screen} />;
  }
  if (part.geometry !== "cylinder") {
    // Rounded boxes are drawn as boxes.
    const half = partHalfSize(part);
    const faces = boxFaces(center, [half[0] * 2, half[1] * 2, half[2] * 2]);
    return (
      <>
        <polygon points={points(faces.front)} fill={fill.front} />
        <polygon points={points(faces.right)} fill={fill.right} />
        <polygon points={points(faces.top)} fill={fill.top} />
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
        fill={fill.front}
      />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={fill.top} />
    </>
  );
}

/** Painter's order between components: further from the camera first, then lower first. */
const depth = (position: Vec3) => position[0] + position[2] + position[1] * 0.01;

/** Keys are too small to read here; the dark key well under them stands in for the keyboard. */
const drawn = (part: ShapePart) => part.role !== "key";

export interface IsometricDrawingProps {
  layout: SceneLayout;
  /** The page theme, which picks the scene palette. */
  theme: SceneTheme;
  /** Components the current step is about; the others are drawn dimmed. */
  focus?: readonly string[];
  /** Accessible description of the drawing. */
  label: string;
  className?: string;
}

export function IsometricDrawing({
  layout,
  theme,
  focus,
  label,
  className,
}: IsometricDrawingProps) {
  const palette = SCENE_PALETTES[theme];
  const byId = new Map(layout.components.map((component) => [component.id, component]));
  const focused = (id: string) => !focus || focus.length === 0 || focus.includes(id);

  // Components back to front; each one's parts in declaration order, which is painter's order.
  const components = [...layout.components].sort((a, b) => depth(a.position) - depth(b.position));
  const parts = components.flatMap((component) =>
    SHAPES[component.kind].filter(drawn).map((part) => ({ component, part })),
  );

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
    const half = partHalfSize(part);
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
            stroke={palette.wire}
            strokeOpacity={lit ? 1 : 0.4}
            strokeWidth="1.5"
            strokeDasharray={connection.style === "dashed" ? "3 4" : undefined}
          />
        );
      })}

      {components.map((component) => (
        <g
          key={component.id}
          data-component={component.id}
          opacity={focused(component.id) ? undefined : DIMMED}
        >
          {SHAPES[component.kind].filter(drawn).map((part, index) => (
            <Part
              key={index}
              part={part}
              origin={component.position}
              kind={component.kind}
              palette={palette}
            />
          ))}
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
