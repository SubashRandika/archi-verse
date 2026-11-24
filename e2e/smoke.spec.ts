import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads in dark mode without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/");

    await expect(page).toHaveTitle("Archiverse");
    await expect(page.getByRole("heading", { level: 1, name: "Archiverse" })).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    expect(errors).toEqual([]);
  });
});
