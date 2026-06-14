import { expect, test } from "@playwright/test";

import { getAllExtendedProducts } from "../src/lib/content";

function getProductTimestamp(product: { updatedAt?: string }): number {
  if (!product.updatedAt) return 0;

  const timestamp = Date.parse(product.updatedAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getExpectedNewestProductNames(): string[] {
  return getAllExtendedProducts()
    .sort(
      (a, b) =>
        getProductTimestamp(b) - getProductTimestamp(a) ||
        a.name.localeCompare(b.name),
    )
    .map((product) => product.name);
}

test("products page defaults to newest products first", async ({ page }) => {
  await page.goto("/products");

  await expect(page).not.toHaveURL(/sort=/);
  await expect(
    page.locator('section[aria-label="Products list"] h3'),
  ).toHaveText(getExpectedNewestProductNames());
});
