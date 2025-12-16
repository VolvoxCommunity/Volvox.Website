import { test, expect } from "../fixtures/base.fixture";

test.describe("Blog Post Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/announcing-volvox");
  });

  test("renders post header with title and date", async ({ page }) => {
    // The post header is a <header> element inside the article
    const header = page.locator("article header").first();
    await expect(header).toBeVisible();
    await expect(header.locator("h1")).toBeVisible();
    await expect(header.locator("h1")).toContainText("Announcing Volvox");

    // Check that the date element exists (Calendar icon + date text)
    const dateElement = page
      .locator('article header div:has([class*="lucide-calendar"])')
      .last();
    await expect(dateElement).toBeVisible();
    await expect(dateElement).toContainText("2025-11-28");
  });

  test("renders author information", async ({ page }) => {
    const author = page.locator('[data-testid="author-name"]');
    await expect(author).toBeVisible();
    await expect(author).toContainText(/.+/); // Has some author name
  });

  test("renders MDX content correctly", async ({ page }) => {
    const content = page.locator('[data-testid="blog-content"]');
    await expect(content).toBeVisible();

    // Verify actual blog content is present
    await expect(content.locator("p").first()).toBeVisible();

    // Check for specific headings from the "Announcing Volvox" post
    await expect(
      content.locator("h2").filter({ hasText: /More Than a Dev Shop/i })
    ).toBeVisible();
  });

  test("displays table of contents with clickable items", async ({ page }) => {
    const toc = page.locator('[data-testid="table-of-contents"]');

    // TOC is hidden on mobile (< 1024px), visible on desktop
    const tocCount = await toc.count();
    if (tocCount > 0 && (await toc.isVisible())) {
      // TOC uses button elements, not anchor links
      const tocButtons = toc.locator("button");
      const buttonCount = await tocButtons.count();
      expect(buttonCount).toBeGreaterThanOrEqual(1);

      // Verify the "On This Page" heading
      await expect(toc.getByText("On This Page")).toBeVisible();
    }
  });

  test("clicking TOC button scrolls to heading", async ({ page }) => {
    const toc = page.locator('[data-testid="table-of-contents"]');
    const tocCount = await toc.count();

    if (tocCount > 0 && (await toc.isVisible())) {
      // Find a specific heading button in the TOC
      const firstButton = toc.locator("button").first();
      const buttonText = await firstButton.textContent();

      if (buttonText) {
        await firstButton.click();
        await page.waitForTimeout(500); // Wait for smooth scroll

        // Find the heading with matching text
        const targetHeading = page
          .locator(`h2, h3`)
          .filter({ hasText: buttonText.trim() });
        await expect(targetHeading).toBeInViewport();
      }
    }
  });

  test("reading progress bar is present", async ({ page }) => {
    const progressBar = page.locator('[data-testid="reading-progress"]');
    await expect(progressBar).toBeAttached();
  });

  test("back to posts button navigates correctly", async ({ page }) => {
    // The blog post page has a sticky "Back to All Posts" link in the navigation area
    const backButton = page.getByRole("link", { name: /back to all posts/i });

    await expect(backButton).toBeVisible();

    // Click and wait for navigation to complete
    await Promise.all([page.waitForURL(/\/#blog$/), backButton.click()]);

    // Verify we're on the homepage with the blog section hash
    expect(page.url()).toContain("/#blog");
  });

  test("has correct page title", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain("announcing");
  });
});
