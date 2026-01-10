import { test, expect } from "../fixtures/base.fixture";

test.describe("404 Not Found Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto("/this-page-definitely-does-not-exist-12345");
    await page.waitForLoadState("networkidle");
  });

  test("displays 404 heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("404");
  });

  test("displays 'Page Not Found' message", async ({ page }) => {
    const message = page.locator("h2");
    await expect(message).toBeVisible();
    await expect(message).toHaveText("Page Not Found");
  });

  test("displays helpful description", async ({ page }) => {
    const description = page.getByText(/doesn't exist|has been moved/i);
    await expect(description).toBeVisible();
  });

  test("has 'Back to Home' link", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to home/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("'Back to Home' link navigates to homepage", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to home/i });
    await backLink.click();

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("has noindex meta tag", async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/page not found/i);
  });

  test("has navigation visible", async ({ page }) => {
    // Navigation should still be present on 404 page
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("has footer visible", async ({ page }) => {
    // Footer should still be present on 404 page
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();
  });

  test("displays animated background", async ({ page }) => {
    // The animated background canvas should be present
    const canvas = page.locator("canvas");
    // Either canvas is visible or the animated background container exists
    const animatedBg = page.locator(".fixed.inset-0");
    const hasCanvas = (await canvas.count()) > 0;
    const hasAnimatedBg = (await animatedBg.count()) > 0;
    expect(hasCanvas || hasAnimatedBg).toBe(true);
  });
});

test.describe("404 Page - Various Invalid URLs", () => {
  const invalidUrls = [
    "/non-existent-page",
    "/blog/non-existent-post",
    "/products/non-existent-product",
    "/random/path/that/does/not/exist",
  ];

  for (const url of invalidUrls) {
    test(`shows 404 for ${url}`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      const heading = page.locator("h1");
      await expect(heading).toHaveText("404");
    });
  }
});
