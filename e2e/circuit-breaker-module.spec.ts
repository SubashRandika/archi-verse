import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { gotoReady } from "./support";

/**
 * The Circuit Breaker module end to end, in the built app. Every step and scenario step is
 * also opened by modules.spec.ts; this covers what is specific to this module.
 */

const explanation = (page: Page) => page.locator("aside[lang]");
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");
/** The scene's labels and badges (decorative DOM over the canvas). */
const sceneLabels = (page: Page) => page.locator("[data-scene-stage] [aria-hidden=true]").first();

async function openModule(page: Page) {
  await gotoReady(page, "/learn/circuit-breaker");
  await expect(page.getByRole("heading", { level: 1, name: "Circuit Breaker" })).toBeVisible();
  await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
}

test.describe("Circuit Breaker module", () => {
  test("walks the eight steps of the main path in three chapters", async ({ page }) => {
    await openModule(page);
    await expect(timeline(page).getByRole("button")).toHaveCount(8);
    await expect(timeline(page)).toContainText("When a service gets slow");
    await expect(timeline(page)).toContainText("Recovery");

    await timeline(page).getByRole("button", { name: "Step 5: The breaker trips" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "The breaker trips" }),
    ).toBeVisible();
  });

  test("shows the breaker's state as a badge, in the learner's language", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 5: The breaker trips" }).click();
    // Choosing a step plays it; the badge appears when the breaker trips.
    await expect(sceneLabels(page)).toContainText("open · 30 s", { timeout: 20_000 });
    await expect(currentStep(page)).toHaveAccessibleName("Step 5: The breaker trips");

    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await expect(sceneLabels(page)).toContainText("open · තත්. 30");
  });

  test("plays a scenario and returns to the step it branches from", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^The trial call fails/ }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: Payments is still sick");

    await timeline(page)
      .getByRole("button", { name: /^Step 2:/ })
      .click();
    await explanation(page)
      .getByRole("region", { name: "End of this scenario" })
      .getByRole("button", { name: "Back to the main path" })
      .click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 7: Half-open: one careful try");
  });

  test("explains the breaker as a part, at both levels", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 3: Meet the circuit breaker" }).click();
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "Circuit breaker" })
      .click();
    await expect(explanation(page)).toContainText("fuse box");

    await explanation(page).getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(explanation(page)).toContainText("resilience4j");
  });

  test("has no serious accessibility violations in Sinhala", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await timeline(page)
      .getByRole("button", { name: /^පියවර 6:/ })
      .click();
    await expect(explanation(page)).toHaveAttribute("lang", "si");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length}`)).toEqual([]);
  });
});
