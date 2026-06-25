import type { AxeBuilder } from "@axe-core/playwright";

export const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export function configureAxe(builder: AxeBuilder) {
  return builder.withTags(axeTags);
}
