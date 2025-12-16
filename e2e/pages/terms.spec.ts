import { test, expect } from "../fixtures/base.fixture";

test.describe("Terms of Service Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Terms|Volvox/i);
  });

  test("displays terms heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Terms/i);
  });

  test("displays terms content", async ({ page }) => {
    const content = page.locator("main p, article p");
    await expect(content.first()).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const footer = page.locator('[data-testid="footer"], footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
  });
});
