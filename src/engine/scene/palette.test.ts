import { COMPONENT_KINDS } from "@/lib/scene-spec";
import { mixHex, roleColor, SCENE_PALETTES, type SceneTheme } from "./palette";

const THEMES: readonly SceneTheme[] = ["dark", "light"];
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const distance = (a: string, b: string) => {
  const [x, y] = [rgb(a), rgb(b)];
  return Math.hypot(x[0]! - y[0]!, x[1]! - y[1]!, x[2]! - y[2]!);
};

describe("scene palettes", () => {
  it("colour every component kind in both themes", () => {
    for (const theme of THEMES) {
      for (const kind of COMPONENT_KINDS) {
        expect(SCENE_PALETTES[theme].kinds[kind], `${theme} ${kind}`).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("use the colours approved at checkpoint 1", () => {
    for (const theme of THEMES) {
      expect(SCENE_PALETTES[theme].kinds).toEqual({
        client: "#ff8f45",
        mobile: "#8b5cf6",
        service: "#3b82f6",
        database: "#10b981",
        gateway: "#84cc16",
        identity: "#d946ef",
        breaker: "#64748b",
        hop: "#94a3b8",
      });
    }
  });

  it("keep bodies away from the flow colours", () => {
    for (const theme of THEMES) {
      const palette = SCENE_PALETTES[theme];
      const flows = [
        palette.request,
        palette.response,
        palette.warning,
        palette.error,
        palette.selection,
      ];
      for (const kind of COMPONENT_KINDS) {
        for (const flow of flows) {
          expect(
            distance(palette.kinds[kind], flow),
            `${theme} ${kind} vs ${flow}`,
          ).toBeGreaterThan(40);
        }
      }
    }
  });

  it("keep the kinds apart", () => {
    for (const theme of THEMES) {
      const kinds = Object.entries(SCENE_PALETTES[theme].kinds);
      for (const [i, [a, colourA]] of kinds.entries()) {
        for (const [b, colourB] of kinds.slice(i + 1)) {
          expect(distance(colourA, colourB), `${theme} ${a} vs ${b}`).toBeGreaterThan(45);
        }
      }
    }
  });
});

describe("mixHex", () => {
  it("mixes two colours", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHex("#3b82f6", "#ffffff", 0)).toBe("#3b82f6");
  });
});

describe("roleColor", () => {
  const palette = SCENE_PALETTES.dark;

  it("uses the kind's colour for the body and shades of it for trim and panels", () => {
    expect(roleColor(palette, "service", "body")).toBe(palette.kinds.service);
    expect(roleColor(palette, "service", "trim")).toBe(
      mixHex(palette.kinds.service, "#000000", 0.25),
    );
    expect(roleColor(palette, "service", "panel")).toBe(
      mixHex(palette.kinds.service, "#ffffff", 0.35),
    );
  });

  it("uses the theme's colours for tiles, screens and keys", () => {
    expect(roleColor(palette, "client", "tile")).toBe(palette.tile);
    expect(roleColor(palette, "client", "screen")).toBe(palette.screen);
    expect(roleColor(palette, "client", "key")).toBe(palette.key);
  });
});
