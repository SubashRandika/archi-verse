"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * Development aid (`?perf` in the URL): frames per second, draw calls and rendered frames,
 * read from the stats a `SceneCanvas` writes onto `statsRef`. FPS is 0 while idle: the scene
 * renders on demand.
 */
export function PerfOverlay({ statsRef }: { statsRef: RefObject<HTMLElement | null> }) {
  const [stats, setStats] = useState({ fps: 0, frames: 0, drawCalls: 0 });

  useEffect(() => {
    let lastFrames = 0;
    let lastTime = performance.now();
    const timer = window.setInterval(() => {
      const element = statsRef.current;
      if (!element) return;
      const frames = Number(element.dataset.frames ?? 0);
      const now = performance.now();
      const fps = Math.round(((frames - lastFrames) * 1000) / (now - lastTime));
      lastFrames = frames;
      lastTime = now;
      setStats({ fps, frames, drawCalls: Number(element.dataset.drawCalls ?? 0) });
    }, 500);
    return () => window.clearInterval(timer);
  }, [statsRef]);

  return (
    <output
      aria-label="Rendering statistics"
      className="absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-sm border border-rule-strong bg-hull/90 px-2 py-1 font-mono text-label text-paper tabular-nums"
    >
      {`${stats.fps} fps · ${stats.drawCalls} draw calls · ${stats.frames} frames`}
    </output>
  );
}
