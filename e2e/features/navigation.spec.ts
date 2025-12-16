import { test, expect } from "../fixtures/base.fixture";

test.describe("Navigation", () => {
  test.describe("Desktop Navigation", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("displays all nav links", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // Check for main navigation items (buttons on homepage in scroll mode)
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      await expect(desktopNav).toBeVisible();
      await expect(
        desktopNav.getByRole("button", { name: /products/i })
      ).toBeVisible();
      await expect(
        desktopNav.getByRole("button", { name: /blog/i })
      ).toBeVisible();
    });

    test("desktop nav is visible, mobile menu button is hidden", async ({
      page,
    }) => {
      await page.goto("/");
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      const mobileButton = page.locator('[data-testid="mobile-menu-button"]');

      // Desktop nav must be visible at this viewport
      await expect(desktopNav).toBeVisible();
      // Mobile menu button must not be visible at desktop viewport
      await expect(mobileButton).not.toBeVisible();
    });

    test("nav links scroll to correct sections", async ({ page }) => {
      await page.goto("/");
      // Find blog button in navigation (uses buttons for scroll navigation)
      const blogButton = page
        .locator('[data-testid="desktop-nav"]')
        .getByRole("button", { name: /blog/i });
      await blogButton.click();

      // Prefer single data-testid selector for stability
      const blogSection = page.locator('[data-testid="blog-section"]');
      // Timeout accounts for scroll animation (adjust if CI is slower)
      await expect(blogSection).toBeInViewport({ timeout: 3000 });
    });
  });

  test.describe("Mobile Navigation", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("shows mobile menu button", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      // Mobile menu button must be visible at mobile viewport
      await expect(menuButton).toBeVisible();
    });

    test("mobile menu opens and closes", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();

      await menuButton.click();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();

      // Close menu by pressing Escape
      await page.keyboard.press("Escape");
      await expect(mobileMenu).not.toBeVisible();
    });

    test("mobile menu links navigate correctly", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();

      await menuButton.click();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();

      // On homepage, nav items are buttons that scroll to sections
      const productsButton = mobileMenu.getByRole("button", {
        name: /products/i,
      });
      await expect(productsButton).toBeVisible();
      await productsButton.click();

      // Menu should close after clicking
      await expect(mobileMenu).not.toBeVisible();

      // Should scroll to products section
      const productsSection = page.locator(
        '[data-testid="products-section"], #products'
      );
      await expect(productsSection).toBeInViewport();
    });
  });
});
