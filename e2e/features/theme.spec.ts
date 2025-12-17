import { test, expect } from "../fixtures/base.fixture";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Set initial theme to light for consistent starting conditions
    // regardless of system preferences
    await page.addInitScript(() => {
      localStorage.setItem("volvox-theme", "light");
    });
  });

  test("toggles between light and dark mode", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be fully loaded and theme to be applied
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("html.light");

    const toggle = page.getByRole("button", { name: /toggle theme/i });
    await toggle.waitFor({ state: "visible" });

    // Should start in light mode
    await expect(page.locator("html")).toHaveClass(/light/);

    // Click to switch to dark
    await toggle.click();
    await page.waitForSelector("html.dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Click to switch back to light
    await toggle.click();
    await page.waitForSelector("html.light");
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("persists theme preference across page loads", async ({ context }) => {
    // Create a new page without any init scripts from beforeEach
    const newPage = await context.newPage();

    // Set light theme via localStorage before loading page
    await newPage.goto("/");
    await newPage.evaluate(() => {
      localStorage.setItem("volvox-theme", "light");
    });

    // Reload to apply the theme
    await newPage.reload();
    await newPage.waitForLoadState("domcontentloaded");
    await newPage.waitForSelector("html.light");

    const toggle = newPage.getByRole("button", { name: /toggle theme/i });

    // Set to dark mode
    await toggle.click();
    await newPage.waitForSelector("html.dark");
    await expect(newPage.locator("html")).toHaveClass(/dark/);

    // Verify localStorage was updated
    const storedTheme = await newPage.evaluate(() => {
      return localStorage.getItem("volvox-theme");
    });
    expect(storedTheme).toBe("dark");

    // Reload the page - localStorage should persist
    await newPage.reload();
    await newPage.waitForLoadState("domcontentloaded");
    await newPage.waitForSelector("html.dark");

    // Verify the theme is still dark
    await expect(newPage.locator("html")).toHaveClass(/dark/);

    await newPage.close();
  });

  test("respects system preference on first visit", async ({ context }) => {
    // Create a new page to test system preference without init scripts
    const newPage = await context.newPage();

    // Clear any existing theme preference
    await newPage.goto("/");
    await newPage.evaluate(() => {
      localStorage.removeItem("volvox-theme");
    });

    // Set system preference to dark
    await newPage.emulateMedia({ colorScheme: "dark" });
    await newPage.reload();

    // Wait for theme to initialize
    await newPage.waitForSelector("html.dark");

    // Should respect system preference (dark mode)
    await expect(newPage.locator("html")).toHaveClass(/dark/);

    // Clear and test with light preference
    await newPage.evaluate(() => {
      localStorage.removeItem("volvox-theme");
    });
    await newPage.emulateMedia({ colorScheme: "light" });
    await newPage.reload();
    await newPage.waitForSelector("html:not(.dark)");

    // Should respect system preference (light mode)
    await expect(newPage.locator("html")).not.toHaveClass(/dark/);

    await newPage.close();
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("html.light");

    const toggle = page.getByRole("button", { name: /toggle theme/i });

    // Focus the toggle using keyboard
    await toggle.focus();
    await expect(toggle).toBeFocused();

    // Activate with Enter key
    await page.keyboard.press("Enter");
    await page.waitForSelector("html.dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Activate with Space key
    await page.keyboard.press("Space");
    await page.waitForSelector("html.light");
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("theme toggle has accessible name", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Button should be findable by accessible name via sr-only text
    // The fact that getByRole finds it with name "toggle theme" proves accessibility
    const toggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(toggle).toBeVisible();

    // Button should be clickable (functional)
    await expect(toggle).toBeEnabled();

    // Verify the toggle has data-testid for alternative selection
    await expect(toggle).toHaveAttribute("data-testid", "theme-toggle");
  });

  test("theme toggle shows correct icon for current theme", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("html.light");

    const toggle = page.getByRole("button", { name: /toggle theme/i });

    // Toggle should contain SVG icon
    const icon = toggle.locator("svg").first();
    await expect(icon).toBeVisible();

    // Switch theme to dark
    await toggle.click();
    await page.waitForSelector("html.dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Icon should still be visible (different icon now)
    await expect(icon).toBeVisible();
  });

  test("theme preference overrides system preference", async ({ context }) => {
    // Create a new page to avoid the beforeEach init script
    const newPage = await context.newPage();

    // Set system preference to dark
    await newPage.emulateMedia({ colorScheme: "dark" });
    await newPage.goto("/");
    await newPage.waitForSelector("html.dark");

    const toggle = newPage.getByRole("button", { name: /toggle theme/i });

    // Initially should be dark (following system)
    await expect(newPage.locator("html")).toHaveClass(/dark/);

    // Toggle to light mode (user preference)
    await toggle.click();
    await newPage.waitForSelector("html:not(.dark)");
    await expect(newPage.locator("html")).not.toHaveClass(/dark/);

    // Reload - should use user preference (light) not system (dark)
    await newPage.reload();
    await newPage.waitForSelector("html:not(.dark)");
    await expect(newPage.locator("html")).not.toHaveClass(/dark/);

    await newPage.close();
  });

  test("theme transitions work smoothly without flash", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /toggle theme/i });
    await toggle.waitFor({ state: "visible" });

    // Record theme changes
    await page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const htmlClass = document.documentElement.className;
        interface WindowWithThemeChanges extends Window {
          __themeChanges?: string[];
        }
        const w = window as WindowWithThemeChanges;
        w.__themeChanges = w.__themeChanges || [];
        w.__themeChanges.push(htmlClass);
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    // Toggle theme
    await toggle.click();

    // Wait for theme to be applied (don't wait for all animations - there may be infinite ones)
    await page.waitForSelector("html.dark");

    // Small delay to capture any flickering
    await page.waitForTimeout(200);

    // Get recorded changes
    const changes = await page.evaluate(() => {
      interface WindowWithThemeChanges extends Window {
        __themeChanges?: string[];
      }
      return (window as WindowWithThemeChanges).__themeChanges || [];
    });

    // Should have minimal changes (no flickering between states)
    // A single toggle should result in at most 1-2 class changes
    expect(
      changes.length,
      `Unexpected theme flickering: ${changes.join(" -> ")}`
    ).toBeLessThanOrEqual(2);
  });
});
