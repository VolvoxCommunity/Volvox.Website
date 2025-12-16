import { test, expect } from "../fixtures/base.fixture";

test.describe("Products List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Products|Volvox/i);
  });

  test("displays at least one product", async ({ page }) => {
    // Wait for products section to be visible
    const productsSection = page.locator('[data-testid="products-section"]');
    await expect(productsSection).toBeVisible();

    const products = page.locator('[data-testid="product-card"]');
    const count = await products.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("product cards have name and description", async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible();

    // Product cards have a title link to the product detail page
    const titleLink = firstProduct
      .locator('a[href^="/products/"]')
      .filter({ hasText: /.+/ })
      .first();
    await expect(titleLink).toBeVisible();

    // Product cards have a description paragraph with data-slot="card-description"
    const description = firstProduct.locator('[data-slot="card-description"]');
    await expect(description).toBeVisible();
  });

  test("product card links to product detail", async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const link = firstProduct.locator("a").first();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/products\/.+/);
  });

  test("displays navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("displays footer", async ({ page }) => {
    // Use consistent data-testid selector for footer
    const footer = page.locator('[data-testid="footer"]');
    await footer.waitFor({ state: "attached" });
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
