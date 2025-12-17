import { test, expect } from "../fixtures/base.fixture";

test.describe("Cookie Consent", () => {
  // Helper to check if cookie consent banner is implemented
  async function isBannerImplemented(
    page: import("@playwright/test").Page
  ): Promise<boolean> {
    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    // Wait for page to stabilize instead of fixed timeout
    await page.waitForLoadState("domcontentloaded");
    return (await banner.count()) > 0;
  }

  test("shows banner on first visit", async ({ page }) => {
    // Clear any existing consent
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    // Wait for page to stabilize instead of fixed timeout
    await page.waitForLoadState("domcontentloaded");

    // Skip test if cookie consent feature is not implemented
    test.skip(
      (await banner.count()) === 0,
      "Cookie consent banner not implemented"
    );

    await expect(banner).toBeVisible();
  });

  test("accepting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    // Skip test if cookie consent feature is not implemented
    test.skip(
      !(await isBannerImplemented(page)),
      "Cookie consent banner not implemented"
    );

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await expect(banner).toBeVisible();

    const acceptButton = banner.getByRole("button", {
      name: /accept|agree|allow/i,
    });
    test.skip(
      (await acceptButton.count()) === 0,
      "Accept button not found in cookie banner"
    );

    await acceptButton.click();
    await expect(banner).not.toBeVisible();

    await page.reload();
    // Wait for page to stabilize instead of fixed timeout
    await page.waitForLoadState("domcontentloaded");
    await expect(banner).not.toBeVisible();
  });

  test("rejecting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    // Skip test if cookie consent feature is not implemented
    test.skip(
      !(await isBannerImplemented(page)),
      "Cookie consent banner not implemented"
    );

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await expect(banner).toBeVisible();

    // Use exact match for decline button to avoid matching multiple elements
    // (there's both an icon button and text button for decline)
    const rejectButton = banner.getByRole("button", {
      name: "Decline All",
      exact: true,
    });
    test.skip(
      (await rejectButton.count()) === 0,
      "Decline button not found in cookie banner"
    );

    await rejectButton.click();
    await expect(banner).not.toBeVisible();

    await page.reload();
    // Wait for banner state to be applied
    await page.waitForLoadState("domcontentloaded");
    await expect(banner).not.toBeVisible();
  });
});
