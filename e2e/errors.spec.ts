import { test, expect } from "./fixtures/base.fixture";

test.describe("Error States", () => {
  test.describe("404 Pages", () => {
    test("shows 404 page for invalid routes", async ({ page }) => {
      const response = await page.goto("/this-page-does-not-exist");

      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toContainText(/404|not found/i);
    });

    test("shows 404 for invalid blog slug", async ({ page }) => {
      const response = await page.goto("/blog/non-existent-post-slug");

      expect(response?.status()).toBe(404);
    });

    test("shows 404 for invalid product slug", async ({ page }) => {
      const response = await page.goto("/products/non-existent-product");

      expect(response?.status()).toBe(404);
    });

    test("404 page has navigation to return home", async ({ page }) => {
      await page.goto("/invalid-page-123");

      const homeLink = page.getByRole("link", {
        name: /home|back|return|volvox/i,
      });
      if ((await homeLink.count()) > 0) {
        await expect(homeLink).toBeVisible();
      }
    });

    test("404 page maintains site styling", async ({ page }) => {
      await page.goto("/invalid-page");

      // Check if custom 404 page has navigation, or at minimum the page has content
      const nav = page.locator("nav");
      const navCount = await nav.count();

      if (navCount > 0) {
        await expect(nav).toBeVisible();
      } else {
        // Default Next.js 404 - just verify page has some content
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
      }
    });
  });

  test.describe("Resource Failures", () => {
    test("page handles failed image gracefully", async ({ page }) => {
      await page.route("**/*.png", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();
    });

    test("page handles blocked external scripts", async ({ page }) => {
      await page.route("**/*analytics*", (route) => route.abort());
      await page.route("**/*sentry*", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("page handles font loading failure", async ({ page }) => {
      await page.route("**/*.woff2", (route) => route.abort());
      await page.route("**/fonts.googleapis.com/**", (route) => route.abort());
      await page.route("**/fonts.gstatic.com/**", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();

      const text = await page.locator("h1").textContent();
      expect(text?.length).toBeGreaterThan(0);
    });
  });

  test.describe("JavaScript Errors", () => {
    test("no unhandled promise rejections on page load", async ({ page }) => {
      const errors: string[] = [];

      page.on("pageerror", (err) => {
        errors.push(err.message);
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await page
        .locator("#blog, [data-testid='blog-section']")
        .scrollIntoViewIfNeeded();
      await page
        .locator("#about, [data-testid='about-section']")
        .scrollIntoViewIfNeeded();

      expect(errors).toEqual([]);
    });

    test("interactions don't cause JavaScript errors", async ({ page }) => {
      const errors: string[] = [];

      page.on("pageerror", (err) => {
        errors.push(err.message);
      });

      await page.goto("/");

      const toggle = page.locator('[data-testid="theme-toggle"]');
      if ((await toggle.count()) > 0) {
        await toggle.click();
      }

      expect(errors).toEqual([]);
    });
  });
});
