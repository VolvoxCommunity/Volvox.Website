import { expect, test } from "@playwright/test";

import { getAllExtendedProducts } from "../src/lib/content";
import { sortProductsByNewest } from "../src/lib/product-sorting";

function getExpectedNewestProductNames(): string[] {
  return getAllExtendedProducts()
    .sort(sortProductsByNewest)
    .map((product) => product.name);
}

test("products page defaults to newest products first", async ({ page }) => {
  await page.goto("/products");

  await expect(page).not.toHaveURL(/sort=/);
  await expect(
    page.locator('section[aria-label="Products list"] h3'),
  ).toHaveText(getExpectedNewestProductNames());
});
