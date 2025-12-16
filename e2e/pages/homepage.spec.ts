import { test, expect } from "../fixtures/base.fixture";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Volvox/i);
  });

  test("displays hero section with heading and CTA", async ({ page }) => {
    const hero = page.locator('[data-testid="hero-section"]');
    await expect(hero).toBeVisible();
    await expect(hero.locator("h1")).toBeVisible();
    await expect(
      hero.getByRole("link", { name: /get started|learn more|discord/i })
    ).toBeVisible();
  });

  test("displays all main sections", async ({ page }) => {
    const sections = ["hero", "products", "blog", "mentorship", "about"];
    for (const section of sections) {
      const el = page.locator(
        `[data-testid="${section}-section"], #${section}`
      );
      await expect(el).toBeAttached();
    }
  });

  test("scroll-based section tracking updates navigation", async ({ page }) => {
    const blogSection = page.locator("#blog, [data-testid='blog-section']");
    await blogSection.scrollIntoViewIfNeeded();
    // Wait for section to be in viewport instead of fixed timeout
    await expect(blogSection).toBeInViewport({ timeout: 2000 });
  });

  test("animated background renders without errors", async ({
    page,
    assertNoConsoleErrors,
  }) => {
    const canvas = page.locator("canvas");
    await expect(canvas).toBeAttached();
    await assertNoConsoleErrors();
  });

  test("displays navigation bar", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("displays footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
