import type { Page } from "@playwright/test";

/**
 * Date format regex for matching dates like "Dec 15, 2024"
 */
export const DATE_FORMAT_REGEX = /\w{3}\s+\d{1,2},\s+\d{4}/;

/**
 * Wait for all CSS animations to complete on the page.
 * Useful for visual regression tests to ensure consistent screenshots.
 */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const animations = document.getAnimations();
    return (
      animations.length === 0 ||
      animations.every((a) => a.playState === "finished")
    );
  });
}

/**
 * Dismiss the cookie consent banner if present.
 * Used across multiple tests to clear the banner before testing other functionality.
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
  const cookieBanner = page.locator('[data-testid="cookie-consent-banner"]');
  if ((await cookieBanner.count()) > 0 && (await cookieBanner.isVisible())) {
    const acceptButton = cookieBanner.getByRole("button", {
      name: /accept|agree/i,
    });
    if ((await acceptButton.count()) > 0) {
      await acceptButton.click();
      await page.waitForTimeout(300);
    }
  }
}

/**
 * Set the initial theme state via localStorage.
 * Should be called before navigation to ensure consistent starting state.
 */
export async function setInitialTheme(
  page: Page,
  theme: "light" | "dark"
): Promise<void> {
  await page.addInitScript((t) => {
    localStorage.setItem("volvox-theme", t);
  }, theme);
}
