import { test, expect } from "../fixtures";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility WCAG 2.2 AA Sweep", () => {
  // Give Axe-core enough time to run
  test.setTimeout(60000);

  test("Homepage passes accessibility checks", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22a",
        "wcag22aa",
      ])
      .disableRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Deals page passes accessibility checks", async ({ page }) => {
    await page.goto("/deals");

    // Wait for network/hydration
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22a",
        "wcag22aa",
      ])
      .disableRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
