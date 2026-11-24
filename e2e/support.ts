import { expect, type Page } from "@playwright/test";

/**
 * Opens a page and waits until React has hydrated it. The static HTML is interactive-looking
 * before hydration, and a click that lands before it is lost. The shell sets
 * `data-ready="true"` on the client.
 */
export async function gotoReady(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator("[data-shell]")).toHaveAttribute("data-ready", "true");
}
