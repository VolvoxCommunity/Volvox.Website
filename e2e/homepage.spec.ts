import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Verify the page title contains Volvox
    await expect(page).toHaveTitle(/Volvox/i);

    // Verify the main heading is visible (Hero section)
    const mainHeading = page.locator("h1", { hasText: "Volvox" });
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
  });

  test("should display navigation", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForSelector("nav", { timeout: 10000 });

    // Verify navigation is visible
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("should have working blog section", async ({ page }) => {
    await page.goto("/");

    // Wait for blog section
    await page.waitForSelector("#blog", { timeout: 10000 });
    const blogSection = page.locator("#blog");
    await blogSection.scrollIntoViewIfNeeded();

    // Verify blog section is visible
    await expect(blogSection).toBeVisible();

    // Verify section heading
    const heading = blogSection.locator("h2");
    await expect(heading).toContainText("Blog");
  });
});
