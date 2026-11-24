import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/**
 * The API Gateway module end to end: scenarios, languages, resuming and completion, in the
 * built app (static export). The 3D rendering itself is covered by studio-3d.spec.ts.
 */

const explanation = (page: Page) =>
  page.getByRole("complementary", { name: /Explanation|පැහැදිලි කිරීම/ });
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");

async function openModule(page: Page) {
  await page.goto("/learn/api-gateway");
  await expect(page.getByRole("heading", { level: 1, name: "API Gateway" })).toBeVisible();
  await expect(page.locator("[data-scene-stage] canvas")).toBeVisible();
}

async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious.map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`)).toEqual(
    [],
  );
}

test.describe("API Gateway module", () => {
  test("walks the 12 steps of the main path in four chapters", async ({ page }) => {
    await openModule(page);
    await expect(timeline(page).getByRole("button")).toHaveCount(12);
    await expect(timeline(page)).toContainText("The request");
    await expect(timeline(page)).toContainText("The return trip");

    await timeline(page).getByRole("button", { name: "Step 12: The full lifecycle" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "The full lifecycle" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Next step" })).toBeDisabled();
  });

  test("plays a scenario and returns to the step it branches from", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^Timeout, then retry/ }).click();

    await expect(currentStep(page)).toHaveAccessibleName("Step 1: The service is slow");
    await expect(timeline(page).getByRole("button")).toHaveCount(3);
    await expect(explanation(page)).toContainText("Scenario: Timeout, then retry · Step 1 of 3");

    await timeline(page)
      .getByRole("button", { name: /^Step 3:/ })
      .click();
    const end = explanation(page).getByRole("region", { name: "End of this scenario" });
    await end.getByRole("button", { name: "Next scenario: 503, rerouted" }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: An instance goes down");

    await timeline(page)
      .getByRole("button", { name: /^Step 3:/ })
      .click();
    await end.getByRole("button", { name: "Back to the main path" }).click();
    await expect(currentStep(page)).toHaveAccessibleName("Step 7: Validation and routing");
  });

  test("opens a part and goes back to the step", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 5: Authentication" }).click();
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "Identity provider" })
      .click();

    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Identity provider" }),
    ).toBeVisible();
    await explanation(page).getByRole("button", { name: "Back to step 5" }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Authentication" }),
    ).toBeVisible();
  });

  test("switches to Sinhala and remembers it", async ({ page }) => {
    await openModule(page);
    await page.getByRole("button", { name: "සිංහල", exact: true }).click();

    await expect(explanation(page)).toHaveAttribute("lang", "si");
    await expect(explanation(page).getByRole("region", { name: "සරලව කිව්වොත්" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Playback පාලනය" })).toBeVisible();

    await page.reload();
    await expect(explanation(page)).toHaveAttribute("lang", "si");
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Client හඳුනාගනිමු" }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("resumes at the last step after a reload", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 6: Rate limiting" }).click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("archiverse:progress") ?? ""))
      .toContain("rate-limiting");

    await page.reload();
    await expect(currentStep(page)).toHaveAccessibleName("Step 6: Rate limiting");
  });

  test("marks the concept completed from the last step", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 12: The full lifecycle" }).click();
    const finish = explanation(page).getByRole("region", {
      name: "You’ve followed a request from start to finish",
    });
    await finish.getByRole("button", { name: /^Completed/ }).click();

    await expect(
      page
        .getByRole("navigation", { name: "Learning navigation" })
        .getByRole("link", { name: /^API Gateway\s?, Completed/ }),
    ).toBeVisible();
  });
});
