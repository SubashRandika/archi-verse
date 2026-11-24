import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { gotoReady } from "./support";

/**
 * The Backend for Frontend module end to end, in the built app. Every step and scenario step is
 * also opened by modules.spec.ts; this covers what is specific to this module.
 */

const explanation = (page: Page) => page.locator("aside[lang]");
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");
/** The scene's labels and badges (decorative DOM over the canvas). */
const sceneLabels = (page: Page) => page.locator("[data-scene-stage] [aria-hidden=true]").first();

async function openModule(page: Page) {
  await gotoReady(page, "/learn/backend-for-frontend");
  await expect(
    page.getByRole("heading", { level: 1, name: "Backend for Frontend (BFF)" }),
  ).toBeVisible();
  await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
}

test.describe("Backend for Frontend module", () => {
  test("walks the eight steps of the main path in three chapters", async ({ page }) => {
    await openModule(page);
    await expect(timeline(page).getByRole("button")).toHaveCount(8);
    await expect(timeline(page)).toContainText("One API for everyone");
    await expect(timeline(page)).toContainText("Trade-offs");

    await timeline(page).getByRole("button", { name: "Step 4: Meet the BFFs" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Meet the BFFs" }),
    ).toBeVisible();
  });

  test("counts the mobile round trips, in the learner's language", async ({ page }) => {
    await openModule(page);
    await timeline(page)
      .getByRole("button", { name: "Step 5: One call in, three calls out" })
      .click();
    // Choosing a step plays it; the badge appears when the answer reaches the phone.
    await expect(sceneLabels(page)).toContainText("1 call · 380 ms", { timeout: 20_000 });
    await expect(currentStep(page)).toHaveAccessibleName("Step 5: One call in, three calls out");

    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await expect(sceneLabels(page)).toContainText("call 1 · 380 ms");
  });

  test("plays a scenario and returns to the step it branches from", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^One service is slow/ }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: Recommendations slows down");

    await timeline(page)
      .getByRole("button", { name: /^Step 2:/ })
      .click();
    await explanation(page)
      .getByRole("region", { name: "End of this scenario" })
      .getByRole("button", { name: "Back to the main path" })
      .click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 5: One call in, three calls out");
  });

  test("explains a BFF as a part, at both levels", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 4: Meet the BFFs" }).click();
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "Mobile BFF" })
      .click();
    await expect(explanation(page)).toContainText("lunch box");

    await explanation(page).getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(explanation(page)).toContainText("partial answer");
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
