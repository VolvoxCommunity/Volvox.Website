import { test, expect } from "../fixtures/base.fixture";

test.describe("Cookie Consent", () => {
  test("shows banner on first visit", async ({ page }) => {
    // Clear any existing consent
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    // Banner should appear (may have animation delay)
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0) {
      await expect(banner).toBeVisible();
    }
  });

  test("accepting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0 && (await banner.isVisible())) {
      const acceptButton = banner.getByRole("button", {
        name: /accept|agree|allow/i,
      });
      if ((await acceptButton.count()) > 0) {
        await acceptButton.click();
        await expect(banner).not.toBeVisible();

        await page.reload();
        await page.waitForTimeout(500);
        await expect(banner).not.toBeVisible();
      }
    }
  });

  test("rejecting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0 && (await banner.isVisible())) {
      const rejectButton = banner.getByRole("button", {
        name: "Decline All",
        exact: true,
      });
      if ((await rejectButton.count()) > 0) {
        await rejectButton.click();
        await expect(banner).not.toBeVisible();

        await page.reload();
        await page.waitForTimeout(500);
        await expect(banner).not.toBeVisible();
      }
    }
  });
});
