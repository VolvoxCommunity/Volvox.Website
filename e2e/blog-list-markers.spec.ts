import { expect, test } from "@playwright/test";

test("blog lists render a single marker per item", async ({ page }) => {
  await page.goto("/blog/runs-on-glm");

  const prose = page.getByTestId("blog-content").locator(".prose");
  const numberedItem = prose.locator("ol > li").first();
  const bulletedItem = prose
    .locator("ul > li")
    .filter({ hasText: "Price for performance." });

  await expect(numberedItem).toHaveCSS("list-style-type", "decimal");
  await expect(bulletedItem).toHaveCSS("list-style-type", "disc");
  await expect(numberedItem).toHaveText(/^Build a test set/);
  await expect(bulletedItem).toHaveText(/^Price for performance\./);
});
