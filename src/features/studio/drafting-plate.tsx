import type { ReactNode } from "react";

/*
 * Isometric grid geometry. Lines run at ±30°, so a tile of width W has height W·tan(30°).
 * The major grid is exactly 5×5 minor tiles, so both patterns share intersections.
 */
const TAN_30 = Math.tan(Math.PI / 6);
const MINOR_W = 40;
const MINOR_H = MINOR_W * TAN_30;
const MAJOR_W = MINOR_W * 5;
const MAJOR_H = MINOR_H * 5;

function GridPattern({ id, w, h, stroke }: { id: string; w: number; h: number; stroke: string }) {
  return (
    <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
      <path d={`M0 0L${w} ${h}M0 ${h}L${w} 0`} fill="none" stroke={stroke} strokeWidth="1" />
    </pattern>
  );
}

/** Registration mark in one corner of the plate (marks the drawable area). */
function CornerMark({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className={`pointer-events-none absolute size-3.5 text-rule-strong ${className}`}
    >
      <path d="M0.5 14V0.5H14" fill="none" stroke="currentColor" />
    </svg>
  );
}

/**
 * The "drafting plate": the ink surface the learning scene is drawn on. Renders the
 * isometric grid (seen when the 3D scene is unavailable; the 3D scene draws its own), a soft
 * vignette and corner registration marks around the children (scene, overlays, dock).
 *
 * It is also a CSS container (`@container`) so overlays can adapt to the plate's own width,
 * which depends on panel sizes rather than the viewport.
 */
export function DraftingPlate({ children }: { children: ReactNode }) {
  return (
    <div className="@container relative min-h-0 flex-1 overflow-hidden bg-ink">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <GridPattern id="plate-grid-minor" w={MINOR_W} h={MINOR_H} stroke="var(--rule)" />
          <GridPattern id="plate-grid-major" w={MAJOR_W} h={MAJOR_H} stroke="var(--rule-strong)" />
        </defs>
        <rect width="100%" height="100%" fill="url(#plate-grid-minor)" opacity="0.5" />
        <rect width="100%" height="100%" fill="url(#plate-grid-major)" opacity="0.35" />
      </svg>

      {children}

      {/* Drawn over the scene (and under positioned overlays such as the dock): the vignette
          keeps the centre of the plate brightest, the corner marks frame the drawing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, color-mix(in oklab, var(--hull) 70%, transparent) 100%)",
        }}
      />

      <CornerMark className="top-3 left-3" />
      <CornerMark className="top-3 right-3 rotate-90" />
      <CornerMark className="right-3 bottom-3 rotate-180" />
      <CornerMark className="bottom-3 left-3 -rotate-90" />
    </div>
  );
}
