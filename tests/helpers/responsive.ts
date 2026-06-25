import { expect, type Page } from "@playwright/test";

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .slice(0, 10)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        text: element.textContent?.trim().slice(0, 80),
      })),
  }));

  expect(
    overflow.scrollWidth,
    JSON.stringify(overflow.offenders, null, 2),
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}
