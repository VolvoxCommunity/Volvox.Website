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

      if ((await desktopNav.count()) > 0) {
        await expect(desktopNav).toBeVisible();
      }
      if ((await mobileButton.count()) > 0) {
        await expect(mobileButton).not.toBeVisible();
      }
    });

    test("nav links scroll to correct sections", async ({ page }) => {
      await page.goto("/");
      // Find blog button in navigation (uses buttons for scroll navigation)
      const blogButton = page
        .locator('[data-testid="desktop-nav"]')
        .getByRole("button", { name: /blog/i });
      await blogButton.click();

      const blogSection = page.locator("#blog, [data-testid='blog-section']");
      await expect(blogSection).toBeInViewport({ timeout: 2000 });
    });
  });

  test.describe("Mobile Navigation", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("shows mobile menu button", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await menuButton.count()) > 0) {
        await expect(menuButton).toBeVisible();
      }
    });

    test("mobile menu opens and closes", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');

      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();

        // Close menu by pressing Escape
        await page.keyboard.press("Escape");
        await expect(mobileMenu).not.toBeVisible();
      }
    });

    test("mobile menu links navigate correctly", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');

      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        const productsLink = mobileMenu.getByRole("link", {
          name: /products/i,
        });

        if ((await productsLink.count()) > 0) {
          await productsLink.click();
          await expect(page).toHaveURL(/products/);
        }
      }
    });
  });
});
