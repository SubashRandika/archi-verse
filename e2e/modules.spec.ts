import { expect, type Page, test } from "@playwright/test";
import { modules } from "../src/content/modules";
import { gotoReady } from "./support";

/**
 * Every learning module, generically: each step of the main path and of every scenario opens
 * with its explanation and without console errors. A new module is covered by adding it to
 * the registry. (Module-specific behaviour lives in its own spec.)
 */

const timeline = (page: Page) => page.getByRole("list", { name: "Timeline" });
const explanation = (page: Page) => page.getByRole("complementary", { name: "Explanation" });

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

/** Visits every step of the current track and checks the panel follows. */
async function visitSteps(page: Page, count: number, label: (n: number) => RegExp) {
  await expect(timeline(page).getByRole("button")).toHaveCount(count);
  for (let n = 1; n <= count; n += 1) {
    await timeline(page)
      .getByRole("button")
      .nth(n - 1)
      .click();
    await expect(timeline(page).locator("button[aria-current=step]")).toHaveAccessibleName(
      new RegExp(`^Step ${n}: .+`),
    );
    await expect(explanation(page)).toContainText(label(n));
    await expect(explanation(page).getByRole("heading", { level: 2 })).not.toBeEmpty();
  }
}

for (const learningModule of Object.values(modules)) {
  test.describe(`module ${learningModule.id}`, () => {
    test("opens every step of the main path", async ({ page }) => {
      const errors = collectErrors(page);
      await gotoReady(page, `/learn/${learningModule.id}`);
      await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();

      const count = learningModule.steps.length;
      await visitSteps(page, count, (n) => new RegExp(`Step ${n} of ${count}`));
      expect(errors).toEqual([]);
    });

    for (const [index, scenario] of learningModule.scenarios.entries()) {
      test(`opens every step of scenario ${scenario.id}`, async ({ page }) => {
        const errors = collectErrors(page);
        await gotoReady(page, `/learn/${learningModule.id}`);

        await page.getByRole("button", { name: /^Scenario, / }).click();
        // Item 0 is the main path; scenarios follow in module order.
        await page
          .getByRole("menuitemradio")
          .nth(index + 1)
          .click();
        const count = scenario.steps.length;
        await visitSteps(page, count, (n) => new RegExp(`· Step ${n} of ${count}`));
        expect(errors).toEqual([]);
      });
    }
  });
}
