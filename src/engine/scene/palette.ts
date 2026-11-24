/**
 * Scene colours: the "hybrid" look approved in the Phase 4 look-dev spike (ADR-0006).
 * Lit solid bodies with paper outlines (legible form), plus a glow in a flow colour on whatever
 * is active, selected or in trouble. Flow colours mirror the CSS tokens in globals.css and
 * carry meaning only.
 */
export const SCENE_COLORS = {
  ink: "#0f1b2d",
  paper: "#e3e9f2",
  graphite: "#8a97ac",
  grid: "#1d3150",
  gridMajor: "#2b4467",
  wire: "#2b4467",
  footprint: "#04080f",

  body: "#25395a",
  bodyDimmed: "#172338",
  bodyActive: "#1f4f78",
  bodyDown: "#3a1f2c",

  request: "#4cc9f0",
  response: "#3dd68c",
  warning: "#f5b83d",
  error: "#f2577a",
  selection: "#a78bfa",
} as const;

/** Outline opacity for each emphasis level. */
export const EDGE_OPACITY = { dimmed: 0.22, normal: 0.55, hovered: 0.9, glowing: 1 } as const;
