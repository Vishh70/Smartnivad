import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { configureAxe } from "../../axe.config";

const routes = ["/", "/deals", "/compare"];

for (const route of routes) {
  test(`has no WCAG AA violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const results = await configureAxe(new AxeBuilder({ page })).analyze();

    expect(results.violations).toEqual([]);
  });
}
