import { expect, test } from "@playwright/test";

const PRODUCT_OVERVIEW_LINKS = [
  { name: "Volvox.Bot", path: "/products/volvox-bot" },
  { name: "Decision Jar", path: "/products/decision-jar" },
  { name: "Sobers", path: "/products/sobers" },
];

test("homepage product overview controls link to product detail pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 680, height: 743 });
  await page.goto("/");

  for (const product of PRODUCT_OVERVIEW_LINKS) {
    const productCard = page
      .locator("#products .group.relative")
      .filter({ hasText: product.name });
    const overviewLink = productCard.getByRole("link", {
      exact: true,
      name: "Overview",
    });

    await expect(overviewLink).toHaveAttribute("href", product.path);
  }
});
