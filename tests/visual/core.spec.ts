import { expect, test } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "deals", path: "/deals" },
  { name: "compare", path: "/compare" },
];

for (const route of routes) {
  test(`${route.name} visual baseline`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot(
      `${route.name}-${testInfo.project.name}.png`,
      {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      },
    );
  });
}
