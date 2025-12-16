import { test, expect } from "./fixtures/base.fixture";

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
};

test.describe("Responsive Design", () => {
  test.describe("Mobile (375px)", () => {
    test.use({ viewport: viewports.mobile });

    test("navigation shows mobile menu button", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      // Mobile menu button is expected on mobile viewports
      await expect(menuButton).toBeVisible();
    });

    test("content does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("footer is visible and properly styled", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const footer = page.locator('[data-testid="footer"], footer');
      await footer.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForTimeout(100);
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
    });
  });

  test.describe("Tablet (768px)", () => {
    test.use({ viewport: viewports.tablet });

    test("navigation adapts to tablet layout", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("content does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });
  });

  test.describe("Desktop (1280px)", () => {
    test.use({ viewport: viewports.desktop });

    test("navigation shows desktop layout", async ({ page }) => {
      await page.goto("/");
      // Desktop navigation should be visible and mobile menu hidden
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      await expect(desktopNav).toBeVisible();
      const mobileButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(mobileButton).not.toBeVisible();
    });

    test("blog post shows sidebar TOC", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");
      // Table of contents should be visible on desktop blog posts
      const toc = page.locator('[data-testid="table-of-contents"]');
      await expect(toc).toBeVisible();
    });
  });

  test("no horizontal scroll on any viewport", async ({ page }) => {
    for (const [name, size] of Object.entries(viewports)) {
      await page.setViewportSize(size);
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth, `Horizontal scroll on ${name}`).toBeLessThanOrEqual(
        clientWidth + 5
      );
    }
  });
});
