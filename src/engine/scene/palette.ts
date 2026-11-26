import type { ComponentKind } from "@/lib/scene-spec";

/**
 * Scene colours per theme: the "Glossy toy" look (ADR-0010). Each component kind has its own
 * saturated body colour; parts take shades of it by role. Flow colours (request, response,
 * warning, error, selection) carry meaning only: packets, glows, rings and badges, never a
 * body. They mirror the CSS flow tokens in globals.css.
 */

export type SceneTheme = "dark" | "light";

/** What a part of a component model is, which decides its colour. */
export type PartRole = "tile" | "body" | "trim" | "panel" | "dark" | "screen" | "key" | "light";

export interface ScenePalette {
  readonly grid: string;
  readonly gridMajor: string;
  readonly wire: string;
  readonly footprint: string;
  /** The soft base each component stands on. */
  readonly tile: string;
  readonly screen: string;
  readonly key: string;
  /** What dimmed components fade toward (the canvas background). */
  readonly fade: string;
  readonly request: string;
  readonly response: string;
  readonly warning: string;
  readonly error: string;
  readonly selection: string;
  /** Colours of the pictures drawn on screens. */
  readonly screenUi: { readonly text: string; readonly faint: string; readonly card: string };
  readonly kinds: Readonly<Record<ComponentKind, string>>;
  readonly hemisphere: {
    readonly sky: string;
    readonly ground: string;
    readonly intensity: number;
  };
  /** Intensity of the directional key light. */
  readonly keyLight: number;
  /** Glows add light (dark scenes); on a light background they blend normally instead. */
  readonly additiveGlow: boolean;
  /** How far dimmed (out of focus) components fade toward the background, 0–1. */
  readonly dimFade: number;
  /** Opacity of the soft shadow under each component. */
  readonly footprintOpacity: number;
}

const KINDS: Readonly<Record<ComponentKind, string>> = {
  client: "#ff8f45",
  mobile: "#8b5cf6",
  service: "#3b82f6",
  database: "#10b981",
  gateway: "#84cc16",
  identity: "#d946ef",
  breaker: "#64748b",
  hop: "#94a3b8",
};

export const SCENE_PALETTES: Readonly<Record<SceneTheme, ScenePalette>> = {
  dark: {
    grid: "#1d3150",
    gridMajor: "#2b4467",
    wire: "#34507a",
    footprint: "#04080f",
    tile: "#22304f",
    screen: "#070b16",
    key: "#e2e8f0",
    fade: "#0f1b2d",
    request: "#4cc9f0",
    response: "#3dd68c",
    warning: "#f5b83d",
    error: "#f2577a",
    selection: "#a78bfa",
    screenUi: { text: "#e2e8f0", faint: "#2a3a58", card: "#17223a" },
    kinds: KINDS,
    hemisphere: { sky: "#dbe7ff", ground: "#1a2540", intensity: 1.5 },
    keyLight: 2.6,
    additiveGlow: true,
    dimFade: 0.62,
    footprintOpacity: 0.45,
  },
  light: {
    grid: "#d5ddea",
    gridMajor: "#b8c4d8",
    wire: "#9aa9c2",
    footprint: "#475569",
    tile: "#ffffff",
    screen: "#0f172a",
    key: "#f8fafc",
    fade: "#f8fafd",
    request: "#0ea5e9",
    response: "#16a34a",
    warning: "#d97706",
    error: "#e11d48",
    selection: "#6d28d9",
    screenUi: { text: "#e2e8f0", faint: "#334766", card: "#1e293b" },
    kinds: KINDS,
    hemisphere: { sky: "#ffffff", ground: "#cbd5e1", intensity: 1.7 },
    keyLight: 2.4,
    additiveGlow: false,
    dimFade: 0.45,
    footprintOpacity: 0.7,
  },
};

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** `a` mixed toward `b` by `t` (0 = a, 1 = b), as `#rrggbb`. */
export function mixHex(a: string, b: string, t: number): string {
  const [from, to] = [channels(a), channels(b)];
  return `#${from
    .map((value, i) =>
      Math.round(value + (to[i]! - value) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** The colour of a part with `role` on a component of `kind`. */
export function roleColor(palette: ScenePalette, kind: ComponentKind, role: PartRole): string {
  const body = palette.kinds[kind];
  switch (role) {
    case "body":
      return body;
    case "trim":
      return mixHex(body, "#000000", 0.25);
    case "panel":
      return mixHex(body, "#ffffff", 0.35);
    case "dark":
      return mixHex(body, "#000000", 0.5);
    case "light":
      return mixHex(body, "#ffffff", 0.65);
    case "tile":
      return palette.tile;
    case "screen":
      return palette.screen;
    case "key":
      return palette.key;
  }
}
