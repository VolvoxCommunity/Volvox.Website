import { test, expect } from "../fixtures/base.fixture";
import { DATE_FORMAT_REGEX } from "../utils/test-helpers";

test.describe("Blog List (Homepage Section)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the blog section to be visible and scroll it into view
    const blogSection = page.locator("[data-testid='blog-section']");
    await blogSection.waitFor({ state: "visible" });
    await blogSection.scrollIntoViewIfNeeded();
  });

  test("displays blog section heading", async ({ page }) => {
    const blogSection = page.locator("[data-testid='blog-section']");
    await expect(blogSection).toBeVisible();
    const heading = blogSection.locator("h2");
    await expect(heading).toBeVisible();
  });

  test("displays at least one blog card", async ({ page }) => {
    const cards = page.locator('[data-testid="blog-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("blog cards have title and date", async ({ page }) => {
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    // CardTitle is a div with data-slot="card-title"
    await expect(firstCard.locator('[data-slot="card-title"]')).toBeVisible();
    // Date format: "Dec 15, 2024"
    await expect(firstCard.getByText(DATE_FORMAT_REGEX)).toBeVisible();
  });

  test("blog card links to blog post", async ({ page }) => {
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    // Click the card to open the dialog
    await firstCard.click();
    // Wait for the dialog to open and find the "Read Full Article" link
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    const link = dialog.getByRole("link", { name: /read full article/i });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/blog\/.+/);
  });
});
