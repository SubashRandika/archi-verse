import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const nav = (page: Page) => page.getByRole("navigation", { name: "Learning navigation" });

test.describe("concept navigation", () => {
  test("opens any concept directly by URL", async ({ page }) => {
    await page.goto("/learn/cap-theorem");

    await expect(page).toHaveTitle("CAP Theorem · Archiverse");
    await expect(page.getByRole("heading", { level: 1, name: "CAP Theorem" })).toBeVisible();
    await expect(page.getByText(/visualization for this concept is planned/)).toBeVisible();
    await expect(nav(page).getByRole("link", { name: /^CAP Theorem/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("navigates between concepts from the sidebar without losing sidebar state", async ({
    page,
  }) => {
    await page.goto("/learn/api-gateway");
    await nav(page)
      .getByRole("button", { name: /^Caching Architecture/ })
      .click();
    await nav(page).getByRole("link", { name: /^ETag/ }).click();

    await expect(page).toHaveURL(/\/learn\/etag$/);
    await expect(page.getByRole("heading", { level: 1, name: "ETag" })).toBeVisible();
    // The previously expanded API category is still open: the layout persisted.
    await expect(nav(page).getByRole("button", { name: /^API Integration/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  test("shows the category the learner navigated from for shared concepts", async ({ page }) => {
    await page.goto("/learn/cap-theorem");
    const resilience = nav(page).getByRole("button", { name: /^Resilience, Reliability/ });
    await resilience.click();
    await nav(page)
      .getByRole("list")
      .filter({ has: page.getByRole("link", { name: /^Fault Tolerance/ }) })
      .getByRole("link", { name: /^Circuit Breaker/ })
      .click();

    await expect(page.getByRole("heading", { level: 1, name: "Circuit Breaker" })).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Resilience, Reliability & Fault Tolerance").first(),
    ).toBeVisible();
  });

  test("reopens the last concept from the home page", async ({ page }) => {
    await page.goto("/learn/jwt");
    await expect(page.getByRole("heading", { level: 1, name: "JWT" })).toBeVisible();
    // The last concept is saved after hydration (never before saved preferences have loaded).
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("archiverse:preferences") ?? ""))
      .toContain('"lastConceptId":"jwt"');

    await page.goto("/");
    await expect(page).toHaveURL(/\/learn\/jwt$/);
  });

  test("returns a not-found page for unknown concepts", async ({ page }) => {
    const response = await page.goto("/learn/not-a-real-concept");
    expect(response?.status()).toBe(404);
  });

  test("searches with the / shortcut", async ({ page }) => {
    await page.goto("/learn/api-gateway");
    await expect(nav(page).getByRole("searchbox")).toBeVisible();
    await page.locator("main").click({ position: { x: 20, y: 120 } });
    await page.keyboard.press("/");
    await expect(nav(page).getByRole("searchbox")).toBeFocused();

    await page.keyboard.type("kafka");
    await expect(nav(page).getByRole("link")).toHaveCount(1);
    await nav(page)
      .getByRole("link", { name: /^Apache Kafka/ })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Apache Kafka" })).toBeVisible();
  });

  test("planned concept page has no serious accessibility violations", async ({ page }) => {
    await page.goto("/learn/cap-theorem");
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
    expect(serious.map((violation) => violation.id)).toEqual([]);
  });
});
