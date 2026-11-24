import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

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

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("application shell — desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/learn/api-gateway");
  });

  test("renders navigation, studio, inspector and playback controls", async ({ page }) => {
    await expect(page.getByRole("navigation", { name: "Learning navigation" })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Learning inspector" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Playback controls" })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });

  test("collapses the navigation to a rail and expands it again", async ({ page }) => {
    await page.getByRole("button", { name: "Collapse navigation" }).click();
    await expect(page.getByRole("searchbox")).toBeHidden();
    const rail = page.getByRole("navigation", { name: "Learning navigation" });
    expect((await rail.boundingBox())?.width).toBeLessThan(80);

    await page.getByRole("button", { name: "Expand navigation" }).click();
    await expect(page.getByRole("searchbox")).toBeVisible();
  });

  test("hides and shows the inspector", async ({ page }) => {
    await page.getByRole("button", { name: "Hide inspector" }).click();
    await expect(page.getByRole("complementary", { name: "Learning inspector" })).toBeHidden();

    await page.getByRole("button", { name: "Show inspector" }).click();
    await expect(page.getByRole("complementary", { name: "Learning inspector" })).toBeVisible();
  });

  test("resizes the navigation with the keyboard", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Learning navigation" });
    const before = (await nav.boundingBox())?.width ?? 0;

    const handle = page.getByRole("separator", { name: "Resize navigation" });
    await handle.focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");

    await expect.poll(async () => (await nav.boundingBox())?.width ?? 0).toBeGreaterThan(before);
  });

  test("keeps the explanation level and step in sync with playback", async ({ page }) => {
    const inspector = page.getByRole("complementary", { name: "Learning inspector" });
    await page.getByRole("button", { name: "Advanced", exact: true }).click();
    await expect(inspector.getByText(/pseudo-headers/)).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(
      inspector.getByRole("heading", { level: 2, name: "Across the network" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Advanced", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("has no serious accessibility violations", async ({ page }) => {
    // Wait for hydration: the panel library sets aria-valuenow on separators client-side.
    await expect(page.getByRole("separator", { name: "Resize navigation" })).toHaveAttribute(
      "aria-valuenow",
      /\d/,
    );
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("application shell — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/learn/api-gateway");
  });

  test("fits the viewport without horizontal scrolling", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "API Gateway" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Learning navigation" })).toBeHidden();
    await expectNoHorizontalScroll(page);
  });

  test("opens navigation in a drawer", async ({ page }) => {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const drawer = page.getByRole("dialog", { name: "Learning navigation" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("searchbox")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("opens the explanation in a bottom sheet", async ({ page }) => {
    await page.getByRole("button", { name: "Open explanation" }).click();
    const sheet = page.getByRole("dialog", { name: "Learning inspector" });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("tab", { name: "Step" })).toBeInViewport();
    await expect(sheet.getByRole("button", { name: "Advanced", exact: true })).toBeInViewport();

    await sheet.getByRole("button", { name: "Close explanation" }).click();
    await expect(sheet).toBeHidden();
  });

  test("has no serious accessibility violations", async ({ page }) => {
    // Wait for hydration: static HTML is rendered for desktop, then switches to mobile.
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("has no serious accessibility violations with the explanation open", async ({ page }) => {
    await page.getByRole("button", { name: "Open explanation" }).click();
    await expect(page.getByRole("dialog", { name: "Learning inspector" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
