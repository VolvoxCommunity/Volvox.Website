import { test, expect } from "./fixtures/base.fixture";
import { waitForAnimations, setInitialTheme } from "./utils/test-helpers";

test.describe("Visual Regression", () => {
  // Skip visual tests in CI - snapshots are platform-specific (macOS vs Linux)
  // Run locally to update baselines when needed
  test.skip(() => !!process.env.CI, "Visual tests skipped in CI");

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
      // Wait for fonts and animations to complete
      await page.evaluate(() => document.fonts.ready);
      await waitForAnimations(page);
      const hero = page.locator('[data-testid="hero-section"]');
      await expect(hero).toBeVisible();
      // NOTE: Very high threshold (5000px vs global 100px) because the hero section
      // contains an animated background canvas with randomized particle positions.
      // Each test run produces different particle layouts, causing legitimate pixel
      // differences that aren't visual regressions. Consider mask option in future.
      await expect(hero).toHaveScreenshot("homepage-hero.png", {
        maxDiffPixels: 5000,
      });
    });

    test("navigation bar", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toHaveScreenshot("navigation-desktop.png", {
        maxDiffPixels: 100,
      });
    });

    test("footer", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const footer = page.locator('[data-testid="footer"]');
      await footer.waitFor({ state: "visible", timeout: 10000 });
      // Small delay to ensure hydration is complete
      await page.waitForTimeout(100);
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer).toHaveScreenshot("footer-desktop.png", {
        maxDiffPixels: 100,
      });
    });

    test("products listing page", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await waitForAnimations(page);
      // Very high threshold: full-page screenshots include animated background
      // with randomized particles that create significant variance
      await expect(page).toHaveScreenshot("products-listing.png", {
        maxDiffPixels: 5000,
      });
    });
  });

  test.describe("Mobile Screenshots", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("homepage mobile view", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await waitForAnimations(page);
      // Very high threshold: full-page screenshots include animated background
      // with randomized particles that create significant variance
      await expect(page).toHaveScreenshot("homepage-mobile.png", {
        maxDiffPixels: 5000,
      });
    });

    test("mobile menu open", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      // Wait for menu animation to complete
      await waitForAnimations(page);
      // Very high threshold: menu overlay covers animated background which has
      // randomized particles creating significant variance
      await expect(page).toHaveScreenshot("mobile-menu-open.png", {
        maxDiffPixels: 5000,
      });
    });
  });

  test.describe("Theme Screenshots", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("dark mode homepage", async ({ page }) => {
      // Set initial theme to light so clicking toggle produces dark mode
      await setInitialTheme(page, "light");
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForSelector("html.light");
      const toggle = page.locator('[data-testid="theme-toggle"]');
      await expect(toggle).toBeVisible();
      await toggle.click();
      await page.waitForSelector("html.dark");
      await page.evaluate(() => document.fonts.ready);
      await waitForAnimations(page);
      // Very high threshold: full-page screenshots include animated background
      // with randomized particles that create significant variance
      await expect(page).toHaveScreenshot("homepage-dark.png", {
        maxDiffPixels: 5000,
      });
    });
  });
});
