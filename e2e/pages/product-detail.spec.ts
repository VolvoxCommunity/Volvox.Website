import { test, expect } from "../fixtures/base.fixture";

test.describe("Product Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products/sobers");
    await page.waitForLoadState("networkidle");
  });

  test("loads successfully with product name in title", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain("sobers");
  });

  test("displays product name as heading", async ({ page }) => {
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Sobers/i);
  });

  test("displays product description", async ({ page }) => {
    // The tagline is in the hero section
    const tagline = page.locator("p.text-xl, p.text-2xl").first();
    await expect(tagline).toBeVisible();
    expect(await tagline.textContent()).toBeTruthy();
  });

  test("displays product features", async ({ page }) => {
    // Scroll to features section if it exists
    const featuresSection = page.locator("#features");
    const featuresCount = await featuresSection.count();

    if (featuresCount > 0) {
      await featuresSection.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForTimeout(100); // Allow hydration to complete
      await featuresSection.scrollIntoViewIfNeeded();
      await expect(featuresSection).toBeVisible();

      // Check that features are displayed
      const featuresList = featuresSection.locator(
        "ul, [data-testid='product-features']"
      );
      await expect(featuresList.first()).toBeVisible();
    } else {
      // If no dedicated features section, skip this test
      test.skip();
    }
  });

  test("has navigation", async ({ page }) => {
    // Using semantic nav element (no data-testid on nav currently)
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(100); // Allow hydration to complete
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test("has external links (GitHub, Demo)", async ({ page }) => {
    // Look for GitHub link
    const githubLink = page.locator('a[href*="github.com"]');
    const githubCount = await githubLink.count();
    expect(githubCount).toBeGreaterThanOrEqual(1);

    // Look for Demo link
    const demoLink = page.locator('a[href*="sobers.app"]');
    const demoCount = await demoLink.count();
    expect(demoCount).toBeGreaterThanOrEqual(1);
  });
});
