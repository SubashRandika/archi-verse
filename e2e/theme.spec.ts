import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { modules } from "../src/content/modules";
import { gotoReady } from "./support";

/** Light and dark themes: default, choosing one, remembering it, following the system. */

const MODULE = "/learn/retry-and-exponential-backoff";
const html = (page: Page) => page.locator("html");
const timeline = (page: Page) => page.getByRole("list", { name: "Timeline" });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");
/** The scene's labels and badges (decorative DOM over the canvas). */
const sceneLabels = (page: Page) => page.locator("[data-scene-stage] [aria-hidden=true]").first();

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
  expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length}`)).toEqual([]);
}

async function chooseTheme(page: Page, name: "Dark" | "Light" | "System") {
  await page.getByRole("button", { name: /^Theme, / }).click();
  await page.getByRole("menuitemradio", { name }).click();
}

async function saveTheme(page: Page, theme: "dark" | "light" | "system") {
  await page.addInitScript((value) => {
    localStorage.setItem(
      "archiverse:preferences",
      JSON.stringify({ state: { theme: value }, version: 1 }),
    );
  }, theme);
}

test.describe("Themes", () => {
  test("opens in dark on a first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await gotoReady(page, MODULE);
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
  });

  test("switches to light and remembers it", async ({ page }) => {
    await gotoReady(page, MODULE);
    await chooseTheme(page, "Light");
    await expect(html(page)).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(page.locator("[data-shell]")).toHaveAttribute("data-ready", "true");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Theme, Light" })).toBeVisible();
  });

  test("applies the saved theme before the app loads", async ({ page }) => {
    await saveTheme(page, "light");
    await page.goto(MODULE, { waitUntil: "domcontentloaded" });
    // Read at DOMContentLoaded, before React hydrates the page.
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
  });

  test("follows the system when set to System", async ({ page }) => {
    await saveTheme(page, "system");
    await page.emulateMedia({ colorScheme: "light" });
    await gotoReady(page, MODULE);
    await expect(html(page)).toHaveAttribute("data-theme", "light");

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
  });

  test("switches theme mid-playback without losing the step", async ({ page }) => {
    await gotoReady(page, MODULE);
    await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
    await timeline(page).getByRole("button", { name: "Step 4: Exponential backoff" }).click();
    await chooseTheme(page, "Light");
    await expect(html(page)).toHaveAttribute("data-theme", "light");

    await expect(sceneLabels(page)).toContainText("attempt 4 · paid", { timeout: 20_000 });
    await expect(currentStep(page)).toHaveAccessibleName("Step 4: Exponential backoff");
    await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
  });

  test("follows a change made in another tab", async ({ context }) => {
    const first = await context.newPage();
    const second = await context.newPage();
    await gotoReady(first, MODULE);
    await gotoReady(second, "/");
    await expect(html(second)).toHaveAttribute("data-theme", "dark");

    await chooseTheme(first, "Light");
    await expect(html(second)).toHaveAttribute("data-theme", "light");
  });

  test("walks a module in light", async ({ page }) => {
    const errors = collectErrors(page);
    await saveTheme(page, "light");
    await gotoReady(page, MODULE);
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();

    const visitAll = async () => {
      const count = await timeline(page).getByRole("button").count();
      for (let n = 1; n <= count; n += 1) {
        await timeline(page)
          .getByRole("button")
          .nth(n - 1)
          .click();
        await expect(currentStep(page)).toHaveAccessibleName(new RegExp(`^Step ${n}: .+`));
      }
    };
    await visitAll();
    const scenarios = modules["retry-and-exponential-backoff"]!.scenarios;
    for (let index = 0; index < scenarios.length; index += 1) {
      await page.getByRole("button", { name: /^Scenario, / }).click();
      await page
        .getByRole("menuitemradio")
        .nth(index + 1)
        .click();
      await expect(timeline(page).getByRole("button")).toHaveCount(scenarios[index]!.steps.length);
      await visitAll();
    }
    expect(errors).toEqual([]);
  });

  test("has no serious accessibility violations in light", async ({ page }) => {
    await saveTheme(page, "light");
    await gotoReady(page, MODULE);
    await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await gotoReady(page, "/");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await expectNoSeriousA11yViolations(page);
  });
});
