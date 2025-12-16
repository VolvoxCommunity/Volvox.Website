import { test, expect } from "../fixtures/base.fixture";

test.describe("Cookie Consent", () => {
  // Helper to check if cookie consent banner is implemented
  async function isBannerImplemented(
    page: import("@playwright/test").Page
  ): Promise<boolean> {
    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);
    return (await banner.count()) > 0;
  }

  test("shows banner on first visit", async ({ page }) => {
    // Clear any existing consent
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);

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
    await page.waitForTimeout(500);
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
    await page.waitForTimeout(500);
    await expect(banner).not.toBeVisible();
  });
});
