import { test, expect } from "../fixtures/base.fixture";

test.describe("Theme Toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any stored theme preferences from localStorage
    // Theme is stored as 'volvox-theme' key, not in cookies
    await page.addInitScript(() => {
      localStorage.removeItem("volvox-theme");
    });
  });

  test("toggles between light and dark mode", async ({ page }) => {
    // Start with light theme explicitly set
    await page.addInitScript(() => {
      localStorage.setItem("volvox-theme", "light");
    });

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
    // Create a new page without any init scripts
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

  test("respects system preference on first visit", async ({ page }) => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    // Wait for theme to initialize by waiting for the dark class
    await page.waitForSelector("html.dark");

    // Should respect system preference (dark mode)
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Clear and test with light preference
    await page.evaluate(() => {
      localStorage.removeItem("volvox-theme");
    });
    await page.emulateMedia({ colorScheme: "light" });
    await page.reload();
    await page.waitForSelector("html:not(.dark)");

    // Should respect system preference (light mode)
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    // Start with light theme
    await page.addInitScript(() => {
      localStorage.setItem("volvox-theme", "light");
    });

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

  test("theme toggle has accessible label", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /toggle theme/i });

    // Button should be accessible via its sr-only span text
    // The component uses <span className="sr-only">Toggle theme</span>
    await expect(toggle).toBeVisible();
    const accessibleName = await toggle.evaluate(
      (el) => el.textContent?.trim() || el.getAttribute("aria-label") || ""
    );
    expect(accessibleName.toLowerCase()).toContain("theme");
  });

  test("theme toggle shows correct icon for current theme", async ({
    page,
  }) => {
    // Start with light theme
    await page.addInitScript(() => {
      localStorage.setItem("volvox-theme", "light");
    });

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

  test("theme preference overrides system preference", async ({ page }) => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForSelector("html.dark");

    const toggle = page.getByRole("button", { name: /toggle theme/i });

    // Initially should be dark (following system)
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Toggle to light mode (user preference)
    await toggle.click();
    await page.waitForSelector("html:not(.dark)");
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Reload - should use user preference (light) not system (dark)
    await page.reload();
    await page.waitForSelector("html:not(.dark)");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("theme transitions work smoothly without flash", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
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

    // Wait for theme transition to complete
    await page.waitForFunction(() => {
      const animations = document.getAnimations();
      return animations.every((anim) => anim.playState === "finished");
    });

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
