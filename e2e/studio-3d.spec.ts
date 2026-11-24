import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

/*
 * The interactive 3D studio, in a real browser (software WebGL in CI). These tests check
 * behaviour and rendering activity; real frame rates are measured on hardware.
 */

const stage = (page: Page) => page.locator("[data-scene-stage]");
const frames = async (page: Page) => Number(await stage(page).getAttribute("data-frames"));
const currentStep = (page: Page) =>
  page.getByRole("list", { name: "Timeline" }).locator("button[aria-current=step]");

async function openStudio(page: Page) {
  await page.goto("/learn/api-gateway");
  await expect(stage(page).locator("canvas")).toBeVisible();
  await expect(stage(page)).toHaveAttribute("data-frames", /\d+/);
}

/**
 * Once settled, the frame count does not change over `ms`: nothing is rendering. (The render
 * loop may draw one trailing frame right after playback stops.)
 */
async function expectIdle(page: Page, ms = 1000) {
  await page.waitForTimeout(250);
  const before = await frames(page);
  await page.waitForTimeout(ms);
  expect(await frames(page)).toBe(before);
}

async function setSpeed(page: Page, speed: string) {
  await page.getByRole("button", { name: /^Playback speed/ }).click();
  await page.getByRole("menuitemradio", { name: speed }).click();
}

async function bottomCentreOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Element has no box.");
  return { x: box.x + box.width / 2, y: box.y + box.height };
}

test.describe("3D studio", () => {
  test("renders the scene with its labels and stays idle until something changes", async ({
    page,
  }) => {
    await openStudio(page);

    await expect(
      page.getByRole("img", { name: /Isometric 3D diagram of Browser, API gateway/ }),
    ).toBeVisible();
    await expect(stage(page).getByText("API gateway", { exact: true })).toBeVisible();
    expect(Number(await stage(page).getAttribute("data-draw-calls"))).toBeLessThan(80);
    await expectIdle(page);
  });

  test("plays a step to its end, then stops rendering", async ({ page }) => {
    await openStudio(page);
    await setSpeed(page, "2×");
    const before = await frames(page);

    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
    await expect.poll(() => frames(page)).toBeGreaterThan(before + 5);

    // The step ends by itself and playback stops on its final state.
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("step-progress")).toHaveAttribute("style", /scaleX\(1\)/);
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: Meet the client");
    await expectIdle(page);

    // Play again: on to the next step.
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
  });

  test("pauses mid-step and keeps its place", async ({ page }) => {
    await openStudio(page);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: "Pause" }).click();

    const progress = await page.getByTestId("step-progress").getAttribute("style");
    expect(progress).not.toMatch(/scaleX\((0|1)\)/);
    await expectIdle(page);
    await expect(page.getByTestId("step-progress")).toHaveAttribute("style", progress ?? "");
  });

  test("navigates with the keyboard", async ({ page }) => {
    await openStudio(page);
    await page.getByRole("heading", { level: 1, name: "API Gateway" }).click();

    await page.keyboard.press("ArrowRight");
    await expect(currentStep(page)).toHaveAccessibleName("Step 2: Anatomy of an HTTP request");
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();

    await page.keyboard.press(" ");
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();

    await page.keyboard.press("r");
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: Meet the client");
  });

  test("selects a component by clicking it in the scene", async ({ page }) => {
    await openStudio(page);
    const inspector = page.getByRole("complementary", { name: "Explanation" });

    // The label sits above the top back corner of the gateway; with the whole system in frame
    // (step 1), its body spans about 20 to 95 px below the label. Click the middle.
    const label = await bottomCentreOf(stage(page).getByText("API gateway", { exact: true }));
    await page.mouse.click(label.x, label.y + 55);

    await expect(inspector.getByRole("heading", { level: 2, name: "API Gateway" })).toBeVisible();
    await expect(inspector.getByRole("button", { name: "Back to step 1" })).toBeVisible();
    const outline = page.getByRole("navigation", { name: "Scene components" });
    await expect(outline.getByRole("button", { name: /API gateway/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // Clicking empty space clears the selection.
    const box = await stage(page).boundingBox();
    await page.mouse.click(box!.x + 40, box!.y + box!.height / 2);
    await expect(outline.getByRole("button", { name: /API gateway/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("offers keyboard access to scene components", async ({ page }) => {
    await openStudio(page);
    const outline = page.getByRole("navigation", { name: "Scene components" });
    const button = outline.getByRole("button", { name: /Orders service #1/ });

    await button.focus();
    await expect(outline).toBeVisible();
    await page.keyboard.press("Enter");

    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("complementary", { name: "Explanation" }).getByRole("heading", {
        level: 2,
        name: "Orders service",
      }),
    ).toBeVisible();
  });

  test("records the module as in progress", async ({ page }) => {
    await openStudio(page);
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Learning navigation" })
        .getByRole("link", { name: /^API Gateway\s?, In progress/ }),
    ).toBeVisible();
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openStudio(page);
    await setSpeed(page, "2×");
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expectIdle(page);
  });

  test("has no serious accessibility violations", async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole("separator", { name: "Resize navigation" })).toHaveAttribute(
      "aria-valuenow",
      /\d/,
    );
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length}`)).toEqual([]);
  });
});

test.describe("3D code splitting", () => {
  test("pages without a module never download the 3D engine", async ({ page }) => {
    const scripts: string[] = [];
    page.on("response", async (response) => {
      if (response.url().endsWith(".js")) scripts.push(await response.text());
    });

    await page.goto("/learn/cap-theorem");
    await expect(page.getByRole("heading", { level: 1, name: "CAP Theorem" })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts.some((source) => source.includes("WebGLRenderer"))).toBe(false);
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("module pages load it after the page is interactive", async ({ page }) => {
    await page.goto("/learn/api-gateway");
    const html = await (await page.request.get("/learn/api-gateway")).text();
    const initialScripts = [...html.matchAll(/_next\/static\/chunks\/[^"]+\.js/g)].map((m) => m[0]);
    const initialSources = await Promise.all(
      initialScripts.map(async (src) => (await page.request.get(`/${src}`)).text()),
    );
    expect(initialSources.some((source) => source.includes("WebGLRenderer"))).toBe(false);
    await expect(stage(page).locator("canvas")).toBeVisible();
  });
});
