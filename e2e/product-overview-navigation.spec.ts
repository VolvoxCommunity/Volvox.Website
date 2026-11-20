import { expect, test } from "@playwright/test";

const PRODUCT_OVERVIEW_LINKS = [
  { name: "Volvox.Quest", path: "/products/volvox-quest" },
  { name: "Volvox.Bot", path: "/products/volvox-bot" },
  { name: "Decision Jar", path: "/products/decision-jar" },
  { name: "Sobers", path: "/products/sobers" },
];

test("homepage product cards link to product detail pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 680, height: 743 });
  await page.goto("/");

  for (const product of PRODUCT_OVERVIEW_LINKS) {
    const productLink = page.locator("#products").getByRole("link", {
      name: product.name,
    });

    await expect(productLink).toHaveAttribute("href", product.path);
  }
});
