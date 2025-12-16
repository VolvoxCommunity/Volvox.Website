import { test, expect } from "@playwright/test";

test.describe("Blog View Tracking", () => {
  test("should open blog modal and display content", async ({
    page,
  }) => {
    // Clear sessionStorage and navigate
    await page.goto("/");
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();

    // Wait for blog section
    await page.waitForSelector("#blog", { state: "visible", timeout: 10000 });

    // Wait for blog posts
    const blogCards = page.locator('[id="blog"] .group.cursor-pointer');
    await blogCards.first().waitFor({ state: "visible", timeout: 10000 });

    // Click to open modal
    await blogCards.first().click();

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { state: "visible", timeout: 5000 });

    // Verify modal content is visible
    const modalDialog = page.locator('[role="dialog"]');
    await expect(modalDialog).toBeVisible();

    // Check for title presence (use first if multiple h2s exist)
    const title = modalDialog.locator('h2').first();
    await expect(title).toBeVisible();
  });
});
