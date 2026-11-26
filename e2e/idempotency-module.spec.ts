import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { gotoReady } from "./support";

/**
 * The Idempotency module end to end, in the built app. Every step and scenario step is also
 * opened by modules.spec.ts; this covers what is specific to this module.
 */

const explanation = (page: Page) => page.locator("aside[lang]");
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");
/** The scene's labels and badges (decorative DOM over the canvas). */
const sceneLabels = (page: Page) => page.locator("[data-scene-stage] [aria-hidden=true]").first();

async function openModule(page: Page) {
  await gotoReady(page, "/learn/idempotency");
  await expect(page.getByRole("heading", { level: 1, name: "Idempotency" })).toBeVisible();
  await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
}

test.describe("Idempotency module", () => {
  test("walks the eight steps of the main path in three chapters", async ({ page }) => {
    await openModule(page);
    await expect(timeline(page).getByRole("button")).toHaveCount(8);
    await expect(timeline(page)).toContainText("Safe to repeat?");
    await expect(timeline(page)).toContainText("The hard cases");

    await timeline(page).getByRole("button", { name: "Step 3: One key per payment" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "One key per payment" }),
    ).toBeVisible();
  });

  test("replays the saved answer without a second charge", async ({ page }) => {
    await openModule(page);
    await timeline(page)
      .getByRole("button", { name: "Step 5: A repeat gets the saved answer" })
      .click();
    await expect(sceneLabels(page)).toContainText("1 charge · 2 requests", { timeout: 20_000 });
    await expect(sceneLabels(page)).toContainText("replayed");
    await expect(currentStep(page)).toHaveAccessibleName("Step 5: A repeat gets the saved answer");

    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await expect(sceneLabels(page)).toContainText("charge 1 · requests 2");
  });

  test("answers 409 to a second request with the same key, and charges once", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 6: Two at once" }).click();
    await expect(sceneLabels(page)).toContainText("409 · try again shortly", { timeout: 20_000 });
    await expect(sceneLabels(page)).toContainText("charged once");
    await expect(sceneLabels(page)).toContainText("paid", { timeout: 20_000 });
    await expect(sceneLabels(page)).not.toContainText("charged twice");
  });

  test("refuses a key reused for a different request with 422", async ({ page }) => {
    await openModule(page);
    await timeline(page)
      .getByRole("button", { name: "Step 7: Same key, different request" })
      .click();
    await expect(sceneLabels(page)).toContainText("422 · key reused", { timeout: 20_000 });
    await expect(sceneLabels(page)).toContainText("different body");
  });

  test("recovers from a crash halfway without a second charge", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^Crash halfway/ }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: The crash");
    await expect(sceneLabels(page)).toContainText("crashed", { timeout: 20_000 });

    await timeline(page)
      .getByRole("button", { name: /^Step 2:/ })
      .click();
    await expect(sceneLabels(page)).toContainText("charged once · replayed", {
      timeout: 20_000,
    });
    await explanation(page)
      .getByRole("region", { name: "End of this scenario" })
      .getByRole("button", { name: "Back to the main path" })
      .click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 4: The server writes it down first");
  });

  test("explains the Payments DB as a part, at both levels", async ({ page }) => {
    await openModule(page);
    await timeline(page)
      .getByRole("button", { name: "Step 4: The server writes it down first" })
      .click();
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "Payments DB" })
      .click();
    await expect(explanation(page)).toContainText("notebook");

    await explanation(page).getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(explanation(page)).toContainText("one transaction");
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
