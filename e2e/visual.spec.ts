import { test, expect } from "./fixtures/base.fixture";
import { waitForAnimations, setInitialTheme } from "./utils/test-helpers";

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
      // Wait for fonts and animations to complete
      await page.evaluate(() => document.fonts.ready);
      await waitForAnimations(page);
      const hero = page.locator('[data-testid="hero-section"]');
      await expect(hero).toBeVisible();
      // Higher threshold for hero: animated background canvas has subtle randomness
      await expect(hero).toHaveScreenshot("homepage-hero.png", {
        maxDiffPixels: 300,
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
      await page.waitForLoadState("domcontentloaded");
      const footer = page.locator('[data-testid="footer"]');
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
      // Higher threshold: full-page screenshots include animated background
      await expect(page).toHaveScreenshot("products-listing.png", {
        maxDiffPixels: 300,
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
      // Higher threshold: full-page screenshots include animated background
      await expect(page).toHaveScreenshot("homepage-mobile.png", {
        maxDiffPixels: 300,
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
      // Higher threshold: menu overlay may have slight animation timing variance
      await expect(page).toHaveScreenshot("mobile-menu-open.png", {
        maxDiffPixels: 300,
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
      // Higher threshold: full-page screenshots include animated background
      await expect(page).toHaveScreenshot("homepage-dark.png", {
        maxDiffPixels: 300,
      });
    });
  });
});
