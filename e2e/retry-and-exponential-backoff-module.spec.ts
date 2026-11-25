import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { gotoReady } from "./support";

/**
 * The Retry and Exponential Backoff module end to end, in the built app. Every step and scenario
 * step is also opened by modules.spec.ts; this covers what is specific to this module.
 */

const explanation = (page: Page) => page.locator("aside[lang]");
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");
/** The scene's labels and badges (decorative DOM over the canvas). */
const sceneLabels = (page: Page) => page.locator("[data-scene-stage] [aria-hidden=true]").first();

async function openModule(page: Page) {
  await gotoReady(page, "/learn/retry-and-exponential-backoff");
  await expect(
    page.getByRole("heading", { level: 1, name: "Retry and Exponential Backoff" }),
  ).toBeVisible();
  await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
}

test.describe("Retry and Exponential Backoff module", () => {
  test("walks the eight steps of the main path in three chapters", async ({ page }) => {
    await openModule(page);
    await expect(timeline(page).getByRole("button")).toHaveCount(8);
    await expect(timeline(page)).toContainText("Things fail for a moment");
    await expect(timeline(page)).toContainText("Is it safe to repeat?");

    await timeline(page).getByRole("button", { name: "Step 5: Add jitter" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Add jitter" }),
    ).toBeVisible();
  });

  test("counts the attempts with backoff, in the learner's language", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 4: Exponential backoff" }).click();
    // Choosing a step plays it; the badge appears when the fourth attempts succeed.
    await expect(sceneLabels(page)).toContainText("attempt 4 · paid", { timeout: 20_000 });
    await expect(currentStep(page)).toHaveAccessibleName("Step 4: Exponential backoff");

    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await expect(sceneLabels(page)).toContainText("attempt 4 · ගෙව්වා");
  });

  test("shows the double charge when a lost answer is retried", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 7: The double charge" }).click();
    await expect(sceneLabels(page)).toContainText("charged twice", { timeout: 20_000 });
    await expect(currentStep(page)).toHaveAccessibleName("Step 7: The double charge");
  });

  test("plays a scenario and returns to the step it branches from", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^The server says when/ }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: A 503 with Retry-After");

    await timeline(page)
      .getByRole("button", { name: /^Step 2:/ })
      .click();
    await explanation(page)
      .getByRole("region", { name: "End of this scenario" })
      .getByRole("button", { name: "Back to the main path" })
      .click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 4: Exponential backoff");
  });

  test("explains the Payments DB as a part, at both levels", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 8: Idempotency keys" }).click();
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "Payments DB" })
      .click();
    await expect(explanation(page)).toContainText("receipt book");

    await explanation(page).getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(explanation(page)).toContainText("unique constraint");
  });

  test("has no serious accessibility violations in Sinhala", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await timeline(page)
      .getByRole("button", { name: /^පියවර 7:/ })
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
