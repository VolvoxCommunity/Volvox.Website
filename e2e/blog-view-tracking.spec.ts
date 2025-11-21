import { test, expect } from "@playwright/test";

test.describe("Blog View Tracking", () => {
  test("should increment view count when opening blog modal for the first time", async ({
    page,
  }) => {
    // Track API calls
    const apiCalls: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/blog/views")) {
        apiCalls.push(request.method());
      }
    });

    // Clear sessionStorage and navigate
    await page.goto("/");
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();

    // Wait for blog section
    await page.waitForSelector("#blog", { timeout: 10000 });
    await page.locator("#blog").scrollIntoViewIfNeeded();

    // Wait for blog posts
    const blogCards = page.locator('[id="blog"] .group.cursor-pointer');
    await blogCards.first().waitFor({ timeout: 10000 });

    // Get initial view count from first card (if it exists)
    const firstCard = blogCards.first();
    const cardText = await firstCard.textContent();
    const viewMatch = cardText?.match(/(\d+)/);
    const initialViews = viewMatch ? parseInt(viewMatch[1]) : 0;

    console.log("Initial view count from card:", initialViews);

    // Click to open modal
    await firstCard.click();

    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Wait for API call to complete
    await page.waitForTimeout(1500);

    // Get view count from modal
    const modalDialog = page.locator('[role="dialog"]');
    const modalText = await modalDialog.textContent();
    const modalViewMatch = modalText?.match(/(\d+)\s+views/);
    const modalViews = modalViewMatch ? parseInt(modalViewMatch[1]) : 0;

    console.log("View count in modal:", modalViews);
    console.log("Expected view count:", initialViews + 1);

    // Verify API was called
    expect(apiCalls.length).toBeGreaterThanOrEqual(1);

    // Verify view count incremented
    expect(
      modalViews,
      `Modal should show ${initialViews + 1} views (initial ${initialViews} + 1)`
    ).toBe(initialViews + 1);
  });

  test("should not increment view count on subsequent opens in same session", async ({
    page,
  }) => {
    const apiCalls: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/blog/views")) {
        apiCalls.push(request.method());
      }
    });

    // Clear sessionStorage and navigate
    await page.goto("/");
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload();

    await page.waitForSelector("#blog", { timeout: 10000 });
    await page.locator("#blog").scrollIntoViewIfNeeded();

    const firstCard = page.locator('[id="blog"] .group.cursor-pointer').first();
    await firstCard.waitFor({ timeout: 10000 });

    // First click
    await firstCard.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    await page.waitForTimeout(1500);

    const firstModalText = await page.locator('[role="dialog"]').textContent();
    const firstViewMatch = firstModalText?.match(/(\d+)\s+views/);
    const firstModalViews = firstViewMatch ? parseInt(firstViewMatch[1]) : 0;

    // Close modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Second click
    await firstCard.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    await page.waitForTimeout(500);

    const secondModalText = await page.locator('[role="dialog"]').textContent();
    const secondViewMatch = secondModalText?.match(/(\d+)\s+views/);
    const secondModalViews = secondViewMatch ? parseInt(secondViewMatch[1]) : 0;

    console.log("First modal views:", firstModalViews);
    console.log("Second modal views:", secondModalViews);
    console.log("Total API calls:", apiCalls.length);

    // Should only call API once (session deduplication)
    expect(apiCalls.length).toBe(1);

    // View count should be the same on second open
    expect(secondModalViews).toBe(firstModalViews);
  });
});
