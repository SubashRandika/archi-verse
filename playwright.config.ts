import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * E2E tests run against the production static export (`out/`), which is exactly
 * what gets deployed. `npm run test:e2e` builds first.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Studio pages render WebGL in software (CPU). More parallel workers starve each other and
  // make timing-based assertions flaky.
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    colorScheme: "dark",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        // Headless Chromium has no GPU: render WebGL in software (SwiftShader). Real frame
        // rates are measured by hand on hardware (see docs/ARCHITECTURE.md, budgets).
        launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
      },
    },
  ],
  webServer: {
    command: `npx serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
