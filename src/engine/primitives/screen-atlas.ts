import * as THREE from "three";
import type { ScenePalette } from "../scene/palette";
import type { ScreenPicture } from "./shapes";

/**
 * One texture holding every screen picture, so all screens of a scene share one material.
 * Pictures are drawn once per theme on a canvas: a shop web page (laptop) and a payment app
 * (phone), each with a Pay button in its device's colour.
 */

const WIDTH = 1024;
const HEIGHT = 512;

/** Pixel rectangles of each picture in the atlas (origin top-left). */
const RECTS: Record<ScreenPicture, { x: number; y: number; w: number; h: number }> = {
  // Laptop screen: 1.6 × 0.98 world units.
  "web-page": { x: 0, y: 0, w: 640, h: 392 },
  // Phone screen: 0.68 × 1.25 world units.
  app: { x: 700, y: 0, w: 278, h: 512 },
};

/** Texture coordinates of each picture (v = 0 at the bottom, as three.js samples it). */
export const SCREEN_REGIONS: Record<
  ScreenPicture,
  { u0: number; v0: number; u1: number; v1: number }
> = Object.fromEntries(
  Object.entries(RECTS).map(([picture, { x, y, w, h }]) => [
    picture,
    { u0: x / WIDTH, u1: (x + w) / WIDTH, v0: 1 - (y + h) / HEIGHT, v1: 1 - y / HEIGHT },
  ]),
) as Record<ScreenPicture, { u0: number; v0: number; u1: number; v1: number }>;

type Context = CanvasRenderingContext2D;

function roundRect(ctx: Context, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function payButton(ctx: Context, x: number, y: number, w: number, h: number, colour: string) {
  ctx.fillStyle = colour;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${Math.round(h * 0.5)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Pay", x + w / 2, y + h / 2 + 1);
}

function drawWebPage(ctx: Context, palette: ScenePalette) {
  const { x, y, w, h } = RECTS["web-page"];
  const ui = palette.screenUi;
  ctx.fillStyle = palette.screen;
  ctx.fillRect(x, y, w, h);
  // Browser bar: three dots and an address bar.
  ctx.fillStyle = ui.card;
  ctx.fillRect(x, y, w, 44);
  ["#ff6b6b", "#ffc145", "#4fd18b"].forEach((colour, i) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x + 24 + i * 22, y + 22, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = ui.faint;
  roundRect(ctx, x + 110, y + 12, 420, 20, 10);
  // Heading, text lines, a product card and the Pay button.
  ctx.fillStyle = ui.text;
  roundRect(ctx, x + 40, y + 78, 260, 26, 6);
  ctx.fillStyle = ui.faint;
  roundRect(ctx, x + 40, y + 124, 380, 12, 6);
  roundRect(ctx, x + 40, y + 148, 300, 12, 6);
  ctx.fillStyle = ui.card;
  roundRect(ctx, x + 40, y + 190, 300, 150, 14);
  ctx.fillStyle = ui.faint;
  roundRect(ctx, x + 60, y + 210, 90, 90, 10);
  roundRect(ctx, x + 170, y + 220, 140, 12, 6);
  roundRect(ctx, x + 170, y + 244, 100, 12, 6);
  payButton(ctx, x + 400, y + 280, 200, 60, palette.kinds.client);
}

function drawApp(ctx: Context, palette: ScenePalette) {
  const { x, y, w, h } = RECTS.app;
  const ui = palette.screenUi;
  ctx.fillStyle = palette.screen;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = ui.faint;
  roundRect(ctx, x + 24, y + 48, 120, 14, 7);
  ctx.fillStyle = ui.text;
  roundRect(ctx, x + 24, y + 96, 200, 34, 8);
  ctx.fillStyle = ui.card;
  roundRect(ctx, x + 20, y + 170, w - 40, 160, 16);
  ctx.fillStyle = ui.faint;
  roundRect(ctx, x + 40, y + 196, 150, 12, 6);
  roundRect(ctx, x + 40, y + 220, 110, 12, 6);
  payButton(ctx, x + 24, y + 400, w - 48, 58, palette.kinds.mobile);
}

/** The screen texture for a theme. Without a 2D canvas (tests), it is blank. */
export function createScreenAtlas(palette: ScenePalette): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    drawWebPage(ctx, palette);
    drawApp(ctx, palette);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
