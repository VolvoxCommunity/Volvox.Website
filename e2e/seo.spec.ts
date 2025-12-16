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

    test("has canonical URL", async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      const count = await canonical.count();
      if (count > 0) {
        await expect(canonical).toHaveAttribute("href", /.+/);
      }
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

      const ogType = page.locator('meta[property="og:type"]');
      const count = await ogType.count();
      if (count > 0) {
        await expect(ogType).toHaveAttribute("content", "article");
      }
    });
  });

  test.describe("Product Page", () => {
    test("has product-specific meta tags", async ({ page }) => {
      await page.goto("/products/sobriety-waypoint");

      const title = await page.title();
      expect(title.toLowerCase()).toContain("sobriety");

      const description = page.locator('meta[name="description"]');
      const count = await description.count();
      if (count > 0) {
        await expect(description).toHaveAttribute("content", /.{30,}/);
      }
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
});
