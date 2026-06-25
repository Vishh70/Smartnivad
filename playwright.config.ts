import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "e2e/**/*.spec.ts",
    "accessibility/**/*.spec.ts",
    "visual/**/*.spec.ts",
  ],
  snapshotDir: "./tests/visual/__snapshots__",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["html", { outputFolder: "reports/playwright", open: "never" }],
        ["github"],
        ["line"],
      ]
    : [["html", { outputFolder: "reports/playwright" }], ["list"]],
  outputDir: "artifacts/playwright",
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "desktop-edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 15"] },
    },
    {
      name: "iphone-se",
      use: { ...devices["iPhone SE"] },
    },
    {
      name: "iphone-12",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "galaxy-s24",
      use: { ...devices["Galaxy S24"] },
    },
    {
      name: "ipad",
      use: { ...devices["iPad (gen 11)"] },
    },
    {
      name: "responsive-320",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 900 },
      },
    },
    {
      name: "responsive-360",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 900 },
      },
    },
    {
      name: "responsive-375",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 900 },
      },
    },
    {
      name: "responsive-390",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 900 },
      },
    },
    {
      name: "responsive-414",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 414, height: 900 },
      },
    },
    {
      name: "responsive-430",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 430, height: 900 },
      },
    },
    {
      name: "responsive-768",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "responsive-820",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: "responsive-1024",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 900 },
      },
    },
    {
      name: "responsive-1280",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "responsive-1440",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "responsive-1920",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
