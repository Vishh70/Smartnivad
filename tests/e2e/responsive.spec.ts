import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "../helpers/responsive";

const routes = ["/", "/deals", "/compare"];

for (const route of routes) {
  test(`does not horizontally overflow on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
