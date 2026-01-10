import { test, expect } from "../fixtures/base.fixture";
import { DATE_FORMAT_REGEX } from "../utils/test-helpers";

test.describe("Blog List (Homepage Section)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Wait for the blog section to be visible and scroll it into view
    const blogSection = page.locator("[data-testid='blog-section']");
    await blogSection.waitFor({ state: "visible", timeout: 10000 });
    // Small delay to ensure hydration is complete
    await page.waitForTimeout(100);
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
    // The link wraps the card, so find links that contain blog-card
    const cardWrapper = page.locator('[data-testid="blog-card"]').first();
    // Get the parent link element
    const link = cardWrapper.locator("xpath=ancestor::a");
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/blog\/.+/);
  });

  test("clicking blog card navigates to post", async ({ page }) => {
    // The link wraps the card
    const cardWrapper = page.locator('[data-testid="blog-card"]').first();
    const link = cardWrapper.locator("xpath=ancestor::a");

    await link.click();
    await page.waitForURL(/\/blog\/.+/);

    // Verify we're on a blog post page by checking for the article and h1
    const article = page.locator("article");
    await expect(article).toBeVisible();
    const heading = article.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("View All Posts button links to blog page", async ({ page }) => {
    const viewAllButton = page.getByRole("link", { name: /view all posts/i });
    await expect(viewAllButton).toBeVisible();
    await expect(viewAllButton).toHaveAttribute("href", "/blog");
  });

  test("Blog heading links to blog page", async ({ page }) => {
    const blogSection = page.locator("[data-testid='blog-section']");
    const headingLink = blogSection.locator("a").filter({ hasText: "Blog" });

    if ((await headingLink.count()) > 0) {
      await expect(headingLink).toHaveAttribute("href", "/blog");
    }
  });
});
