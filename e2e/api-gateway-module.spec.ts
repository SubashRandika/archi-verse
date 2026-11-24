import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { gotoReady } from "./support";

/**
 * The API Gateway module end to end: scenarios, languages, resuming and completion, in the
 * built app (static export). The 3D rendering itself is covered by studio-3d.spec.ts.
 */

const explanation = (page: Page) =>
  page.getByRole("complementary", { name: /Explanation|පැහැදිලි කිරීම/ });
const timeline = (page: Page) => page.getByRole("list", { name: /Timeline|කාලරේඛාව/ });
const currentStep = (page: Page) => timeline(page).locator("button[aria-current=step]");

async function openModule(page: Page) {
  await gotoReady(page, "/learn/api-gateway");
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
      name: "You’ve reached the end of the main path",
    });
    await finish.getByRole("button", { name: /^Completed/ }).click();

    await expect(
      page
        .getByRole("navigation", { name: "Learning navigation" })
        .getByRole("link", { name: /^API Gateway\s?, Completed/ }),
    ).toBeVisible();
  });

  test("can be used with the keyboard alone", async ({ page }) => {
    await openModule(page);
    const main = page.getByRole("main");

    // Arrow keys move through the steps, and each change is announced.
    await main.focus();
    for (let i = 0; i < 4; i += 1) await page.keyboard.press("ArrowRight");
    await expect(currentStep(page)).toHaveAccessibleName("Step 5: Authentication");
    await expect(page.getByText("Step 5 of 12: Authentication")).toBeAttached();

    // Open a part, then go back: focus follows, and returns to the part's button.
    const parts = explanation(page).getByRole("region", { name: "Parts in this step" });
    await parts.getByRole("button", { name: "Identity provider" }).focus();
    await page.keyboard.press("Enter");
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "Identity provider" }),
    ).toBeFocused();
    await explanation(page).getByRole("button", { name: "Back to step 5" }).focus();
    await page.keyboard.press("Enter");
    await expect(parts.getByRole("button", { name: "Identity provider" })).toBeFocused();

    // Menus open, move and choose with the keyboard; focus returns to their button.
    const speed = page.getByRole("button", { name: /^Playback speed/ });
    await speed.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /^Playback speed/ })).toContainText("1×");
    await page.keyboard.press("Escape");

    const scenario = page.getByRole("button", { name: /^Scenario, / });
    await scenario.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("menuitemradio", { name: /^401 Unauthorized/ }).focus();
    await page.keyboard.press("Enter");
    await expect(currentStep(page)).toHaveAccessibleName("Step 1: An expired token arrives");
    await expect(page.getByRole("button", { name: /^Scenario, / })).toBeFocused();

    // Space plays or pauses the step.
    const transport = page.getByRole("button", { name: /^(Play|Pause|Replay step)$/ });
    const before = await transport.getAttribute("aria-label");
    await main.focus();
    await page.keyboard.press(" ");
    await expect(transport).not.toHaveAttribute("aria-label", before ?? "");
  });

  test("has no serious accessibility violations in its other views", async ({ page }) => {
    await openModule(page);
    await timeline(page).getByRole("button", { name: "Step 5: Authentication" }).click();

    // A part, in Advanced.
    await explanation(page)
      .getByRole("region", { name: "Parts in this step" })
      .getByRole("button", { name: "API gateway" })
      .click();
    await explanation(page).getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(
      explanation(page).getByRole("heading", { level: 2, name: "API gateway" }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // A scenario's last step, in Sinhala, with the message open.
    await explanation(page).getByRole("button", { name: "Back to step 5" }).click();
    await page.getByRole("button", { name: /^Scenario, / }).click();
    await page.getByRole("menuitemradio", { name: /^503, rerouted/ }).click();
    await timeline(page)
      .getByRole("button", { name: /^Step 3:/ })
      .click();
    await page.getByRole("button", { name: "සිංහල", exact: true }).click();
    await expect(explanation(page)).toHaveAttribute("lang", "si");
    await expectNoSeriousA11yViolations(page);
  });
});
