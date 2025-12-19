import { test, expect } from "../fixtures/base.fixture";
import { dismissCookieBanner } from "../utils/test-helpers";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Wait for hydration to complete before interacting with footer
    const footer = page.locator('[data-testid="footer"]');
    await footer.waitFor({ state: "attached", timeout: 10000 });
    await footer.waitFor({ state: "visible", timeout: 10000 });
    // Retry scroll if it fails due to detachment (hydration)
    await expect(async () => {
      await footer.scrollIntoViewIfNeeded();
    }).toPass({ timeout: 5000 });
  });

  test("displays footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();
  });

  test("has privacy policy link", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    const privacyLink = footer.getByRole("link", { name: /privacy policy/i });

    await expect(privacyLink).toBeVisible();
    const href = await privacyLink.getAttribute("href");
    expect(href).toBe("/privacy");
  });

  test("has terms link", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    const termsLink = footer.getByRole("link", {
      name: /terms of service/i,
    });

    await expect(termsLink).toBeVisible();
    const href = await termsLink.getAttribute("href");
    expect(href).toBe("/terms");
  });

  test("has proper container structure", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();

    // Verify footer has the main container structure
    const container = footer.locator(".container");
    await expect(container).toBeVisible();
  });

  test("copyright text is present", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    const currentYear = new Date().getFullYear();

    // Look for copyright text with current year and "Volvox"
    const copyrightText = footer.locator(`text=/© ${currentYear} Volvox/i`);
    await expect(copyrightText).toBeVisible();

    // Verify the full copyright message
    const copyrightParagraph = footer.locator("p", {
      hasText: /All rights reserved/i,
    });
    await expect(copyrightParagraph).toBeVisible();
  });

  test("displays version number", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');

    // Footer should show version number (v1.x.x format)
    const versionText = footer.locator("text=/v\\d+\\.\\d+\\.\\d+/");
    await expect(versionText).toBeVisible();
  });

  test("has cookie settings button", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');

    // Check for Cookie Settings button
    const cookieButton = footer.getByRole("button", {
      name: /cookie settings|manage cookies/i,
    });

    await expect(cookieButton).toBeVisible();
  });

  test("footer links are keyboard accessible", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    const privacyLink = footer.getByRole("link", { name: /privacy policy/i });

    // Focus the privacy link using keyboard
    await privacyLink.focus();
    await expect(privacyLink).toBeFocused();

    // Tab to terms link
    await page.keyboard.press("Tab");
    const termsLink = footer.getByRole("link", {
      name: /terms of service/i,
    });
    await expect(termsLink).toBeFocused();
  });

  test("footer links navigate correctly", async ({ page }) => {
    await dismissCookieBanner(page);

    const footer = page.locator('[data-testid="footer"]');

    // Click privacy link
    const privacyLink = footer.getByRole("link", { name: /privacy policy/i });
    await privacyLink.click();
    await expect(page).toHaveURL("/privacy");

    // Go back and wait for page to fully reload
    await page.goBack();
    await page.waitForLoadState("networkidle");

    // Re-locate footer after navigation (page has re-rendered)
    const footerAfterBack = page.locator('[data-testid="footer"]');
    await footerAfterBack.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(100);
    await footerAfterBack.scrollIntoViewIfNeeded();

    const termsLink = footerAfterBack.getByRole("link", {
      name: /terms of service/i,
    });
    await termsLink.click();
    await expect(page).toHaveURL("/terms");
  });

  test("footer has proper semantic HTML structure", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');

    // Footer should use <footer> element
    const footerElement = page.locator("footer");
    await expect(footerElement).toHaveAttribute("data-testid", "footer");

    // Verify footer has proper ARIA structure
    const links = footer.locator("a");
    const linkCount = await links.count();

    // All links should have accessible text
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test("footer is visible on all pages", async ({ page, context }) => {
    // Clear cookies to avoid cookie banner issues
    await context.clearCookies();

    const pages = ["/", "/privacy", "/terms", "/products"];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await dismissCookieBanner(page);

      const footer = page.locator('[data-testid="footer"]');
      await footer.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForTimeout(100);
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
    }
  });

  test("footer maintains consistent styling across themes", async ({
    page,
  }) => {
    // Set initial theme to light so clicking toggle produces dark mode
    await page.addInitScript(() => {
      localStorage.setItem("volvox-theme", "light");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("html.light");

    // Check initial state
    const footer = page.locator('[data-testid="footer"]');
    await footer.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(100);
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toHaveCSS("border-top-width", "1px");

    // Toggle to dark mode
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await themeToggle.click();
    await page.waitForSelector("html.dark");

    // Re-locate footer after theme change (page may have re-rendered)
    const footerAfterToggle = page.locator('[data-testid="footer"]');
    await footerAfterToggle.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(100);
    await footerAfterToggle.scrollIntoViewIfNeeded();

    // Footer should still be visible and have border
    await expect(footerAfterToggle).toBeVisible();
    await expect(footerAfterToggle).toHaveCSS("border-top-width", "1px");
  });
});
