import { readFileSync } from "node:fs";
import path from "node:path";

/*
 * Text contrast of the colour tokens in both themes (WCAG 2.x AA, 4.5:1 for normal text).
 * Reads globals.css directly, so a token edit that breaks contrast fails here.
 */

const css = readFileSync(path.resolve(process.cwd(), "src/app/globals.css"), "utf8");

/** The custom properties declared in the first block that starts with `selector {`. */
function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`No ${selector} block in globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, name, value]) => [
      name!,
      value!.toLowerCase(),
    ]),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

const THEMES = {
  dark: tokens(":root"),
  // Light overrides only some tokens; the rest come from the dark block.
  light: { ...tokens(":root"), ...tokens(':root[data-theme="light"]') },
};

const PAIRS = [
  ["--paper", "--hull"],
  ["--paper", "--hull-raised"],
  ["--paper", "--ink"],
  ["--graphite", "--hull"],
  ["--graphite", "--hull-raised"],
] as const;

describe("colour tokens", () => {
  it("parses both theme blocks", () => {
    for (const values of Object.values(THEMES)) {
      for (const [text, background] of PAIRS) {
        expect(values[text]).toMatch(/^#[0-9a-f]{6}$/);
        expect(values[background]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
    expect(THEMES.light["--paper"]).not.toBe(THEMES.dark["--paper"]);
  });

  for (const [theme, values] of Object.entries(THEMES)) {
    for (const [text, background] of PAIRS) {
      it(`keeps ${text} on ${background} readable in ${theme} (≥ 4.5:1)`, () => {
        expect(contrast(values[text]!, values[background]!)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
