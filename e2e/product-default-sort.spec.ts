import { expect, test } from "@playwright/test";

test("products page defaults to newest products first", async ({ page }) => {
  await page.goto("/products");

  await expect(page).not.toHaveURL(/sort=/);
  await expect(
    page.locator('section[aria-label="Products list"] h3'),
  ).toHaveText(["Volvox.Bot", "Decision Jar", "Sobers"]);
});
