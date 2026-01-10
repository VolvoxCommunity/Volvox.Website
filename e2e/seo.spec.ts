import { test, expect } from "./fixtures/base.fixture";

test.describe("SEO", () => {
  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("has correct meta title and description", async ({ page }) => {
      await expect(page).toHaveTitle(/Volvox/i);
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.{50,}/);
    });

    test("has Open Graph tags", async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        /.+/
      );
      await expect(
        page.locator('meta[property="og:description"]')
      ).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /.+/
      );
    });

    test("has Twitter card tags", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        /.+/
      );
    });

    test("has canonical URL if implemented", async ({ page }) => {
      // Canonical URLs help with SEO but are optional
      const canonical = page.locator('link[rel="canonical"]');
      const count = await canonical.count();

      if (count === 0) {
        // Skip test if canonical is not implemented
        test.skip();
        return;
      }

      // Verify canonical URL has a valid href
      await expect(canonical).toHaveAttribute("href", /.+/);
    });
  });

  test.describe("Blog Post", () => {
    test("has unique meta tags per post", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");

      const title = await page.title();
      expect(title.toLowerCase()).toContain("announcing");
    });

    test("has article-specific OG type", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");

      // Blog posts require article OG type for proper social sharing
      const ogType = page.locator('meta[property="og:type"]');
      await expect(ogType).toHaveAttribute("content", "article");
    });
  });

  test.describe("Product Page", () => {
    test("has product-specific meta tags", async ({ page }) => {
      await page.goto("/products/sobers");

      const title = await page.title();
      expect(title.toLowerCase()).toContain("sobers");

      // Product pages should have a meta description
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.{10,}/);
    });
  });

  test("robots meta allows indexing on public pages", async ({ page }) => {
    await page.goto("/");
    const robots = page.locator('meta[name="robots"]');
    const count = await robots.count();
    if (count > 0) {
      const content = await robots.getAttribute("content");
      expect(content).not.toContain("noindex");
    }
  });

  test.describe("Blog Landing Page", () => {
    test("has correct meta tags", async ({ page }) => {
      await page.goto("/blog");

      await expect(page).toHaveTitle(/blog/i);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.{20,}/);
    });
  });

  test.describe("404 Page", () => {
    test("has noindex meta tag", async ({ page }) => {
      await page.goto("/non-existent-page-12345");

      // Use .first() as there may be multiple robots meta tags
      const robots = page.locator('meta[name="robots"]').first();
      await expect(robots).toHaveAttribute("content", /noindex/);
    });

    test("has appropriate title", async ({ page }) => {
      await page.goto("/non-existent-page-12345");

      await expect(page).toHaveTitle(/not found/i);
    });
  });
});
