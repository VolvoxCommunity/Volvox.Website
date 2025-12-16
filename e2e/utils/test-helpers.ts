import type { Page } from "@playwright/test";

/**
 * Date format regex for matching dates like "Dec 15, 2024"
 */
export const DATE_FORMAT_REGEX = /\w{3}\s+\d{1,2},\s+\d{4}/;

/**
 * Wait for finite CSS animations to complete on the page.
 * Ignores infinite animations (like background canvas animations).
 * Has a built-in timeout to prevent hanging on complex pages.
 */
export async function waitForAnimations(
  page: Page,
  timeout = 5000
): Promise<void> {
  try {
    await page.waitForFunction(
      () => {
        const animations = document.getAnimations();
        // Filter to only finite animations (exclude infinite loops)
        const finiteAnimations = animations.filter((a) => {
          // Check if animation has finite iterations
          const effect = a.effect as KeyframeEffect | null;
          if (effect?.getComputedTiming) {
            const timing = effect.getComputedTiming();
            // Infinite iterations have Infinity value
            return timing.iterations !== Infinity;
          }
          return true;
        });
        return (
          finiteAnimations.length === 0 ||
          finiteAnimations.every((a) => a.playState === "finished")
        );
      },
      { timeout }
    );
  } catch {
    // If timeout is reached, continue anyway - infinite animations may be running
    // This is acceptable for visual tests as we use diff thresholds for animated areas
  }
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
      // Wait for the banner to be hidden after clicking accept
      await cookieBanner.waitFor({ state: "hidden", timeout: 5000 });
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
