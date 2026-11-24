import { expect, type Page, test } from "@playwright/test";

const nav = (page: Page) => page.getByRole("navigation", { name: "Learning navigation" });
const completedToggle = (page: Page) =>
  page.getByRole("button", { name: "Completed", exact: true });

test.describe("local progress", () => {
  test("marking a concept complete updates the sidebar and survives a reload", async ({ page }) => {
    await page.goto("/learn/api-gateway");
    await expect(nav(page).getByText("0 of 291")).toBeVisible();

    await completedToggle(page).click();

    await expect(completedToggle(page)).toHaveAttribute("aria-pressed", "true");
    await expect(nav(page).getByText("1 of 291")).toBeVisible();
    await expect(nav(page).getByRole("button", { name: /^API Integration/ })).toContainText("1/17");
    // Shared concept: also counts in the backend category.
    await expect(nav(page).getByRole("button", { name: /^Backend & Distributed/ })).toContainText(
      "1/26",
    );

    await page.reload();
    await expect(completedToggle(page)).toHaveAttribute("aria-pressed", "true");
    await expect(nav(page).getByText("1 of 291")).toBeVisible();
  });

  test("resetting progress asks for confirmation and clears everything", async ({ page }) => {
    await page.goto("/learn/jwt");
    await completedToggle(page).click();
    await expect(nav(page).getByText("1 of 291")).toBeVisible();

    await nav(page).getByRole("button", { name: "Progress options" }).click();
    await page.getByRole("menuitem", { name: "Reset progress…" }).click();
    const dialog = page.getByRole("alertdialog", { name: "Reset all progress?" });
    await dialog.getByRole("button", { name: "Keep progress" }).click();
    await expect(nav(page).getByText("1 of 291")).toBeVisible();

    await nav(page).getByRole("button", { name: "Progress options" }).click();
    await page.getByRole("menuitem", { name: "Reset progress…" }).click();
    await dialog.getByRole("button", { name: "Reset progress" }).click();

    await expect(nav(page).getByText("0 of 291")).toBeVisible();
    await page.reload();
    await expect(nav(page).getByText("0 of 291")).toBeVisible();
  });

  test("filters the sidebar to completed concepts", async ({ page }) => {
    await page.goto("/learn/jwt");
    await completedToggle(page).click();

    await nav(page).getByRole("button", { name: "Filter concepts" }).click();
    await page.getByRole("menuitemradio", { name: "Completed" }).click();
    await page.keyboard.press("Escape");

    await expect(nav(page).getByRole("link")).toHaveCount(1);
    // Chrome joins the flex children of the link with a space: "JWT , Completed".
    await expect(nav(page).getByRole("link", { name: /^JWT\s?, Completed/ })).toBeVisible();
  });

  test("loads cleanly when saved data is corrupted", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem("archiverse:progress", "{definitely not json");
      localStorage.setItem(
        "archiverse:preferences",
        JSON.stringify({ state: { explanationLevel: "wizard", playbackSpeed: 99 }, version: 1 }),
      );
    });

    await page.goto("/learn/api-gateway");

    await expect(page.getByRole("heading", { level: 1, name: "API Gateway" })).toBeVisible();
    await expect(nav(page).getByText("0 of 291")).toBeVisible();
    await expect(page.getByRole("button", { name: "Beginner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(errors).toEqual([]);
  });

  test("remembers the explanation level and panel layout", async ({ page }) => {
    await page.goto("/learn/api-gateway");
    await page.getByRole("button", { name: "Advanced", exact: true }).click();
    await page.getByRole("button", { name: "Hide explanation" }).click();
    await expect(page.getByRole("complementary", { name: "Explanation" })).toBeHidden();

    await page.reload();

    await expect(page.getByRole("button", { name: "Show explanation" })).toBeVisible();
    await page.getByRole("button", { name: "Show explanation" }).click();
    await expect(page.getByRole("button", { name: "Advanced", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
