import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile only tests");
    await page.goto("/");
  });

  test("should open mobile menu", async ({ page }) => {
    const menuTrigger = page.getByLabel("Open menu");
    await expect(menuTrigger).toBeVisible();

    // Ensure we are at top
    await page.evaluate(() => window.scrollTo(0, 0));

    await menuTrigger.click({ force: true });
    await page.waitForTimeout(1000); // Wait for sheet animation

    // Check if menu content is visible
    const sheetContent = page.getByRole("dialog");
    await expect(sheetContent).toBeVisible({ timeout: 10000 });

    await expect(sheetContent.getByText("Home")).toBeVisible();
    await expect(sheetContent.getByText("Products")).toBeVisible();

    // Visual check for mobile menu
    await expect(sheetContent).toHaveScreenshot("mobile-menu.png");

    // Close menu (click link or close button)
    // Clicking a link should close it
    await sheetContent.getByText("Products").click();
    await expect(sheetContent).not.toBeVisible();
    await expect(page).toHaveURL(/#products/);
  });
});
