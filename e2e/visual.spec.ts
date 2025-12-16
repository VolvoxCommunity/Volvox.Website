import { test, expect } from "./fixtures/base.fixture";

test.describe("Visual Regression", () => {
  // Only run visual tests on Chromium to avoid maintaining multiple baselines
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Visual tests only on Chromium"
  );

  test.describe("Desktop Screenshots", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("homepage hero section", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      // Wait for animations to settle
      await page.waitForTimeout(2000);
      const hero = page.locator('[data-testid="hero-section"]');
      if ((await hero.count()) > 0) {
        await expect(hero).toHaveScreenshot("homepage-hero.png", {
          maxDiffPixels: 500,
        });
      }
    });

    test("navigation bar", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toHaveScreenshot("navigation-desktop.png");
    });

    test("footer", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);
      const footer = page.locator('[data-testid="footer"]');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toHaveScreenshot("footer-desktop.png");
    });

    test("products listing page", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot("products-listing.png", {
        maxDiffPixels: 500,
      });
    });
  });

  test.describe("Mobile Screenshots", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("homepage mobile view", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot("homepage-mobile.png", {
        maxDiffPixels: 500,
      });
    });

    test("mobile menu open", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot("mobile-menu-open.png", {
          maxDiffPixels: 500,
        });
      }
    });
  });

  test.describe("Theme Screenshots", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("dark mode homepage", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const toggle = page.locator('[data-testid="theme-toggle"]');
      if ((await toggle.count()) > 0) {
        await toggle.click();
        await page.waitForTimeout(2000);
        await expect(page).toHaveScreenshot("homepage-dark.png", {
          maxDiffPixels: 500,
        });
      }
    });
  });
});
