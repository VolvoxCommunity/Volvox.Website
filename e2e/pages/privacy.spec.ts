import { test, expect } from "../fixtures/base.fixture";

test.describe("Privacy Policy Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Privacy|Volvox/i);
  });

  test("displays privacy policy heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Privacy/i);
  });

  test("displays policy content", async ({ page }) => {
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
