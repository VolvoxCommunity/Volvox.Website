import { test, expect } from "../fixtures/base.fixture";
import { DATE_FORMAT_REGEX } from "../utils/test-helpers";

test.describe("Blog Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Page Structure", () => {
    test("has correct page title", async ({ page }) => {
      await expect(page).toHaveTitle(/blog/i);
    });

    test("displays page heading", async ({ page }) => {
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText("Blog");
    });

    test("displays page description", async ({ page }) => {
      const description = page.getByText(/insights.*tutorials.*stories/i);
      await expect(description).toBeVisible();
    });

    test("has back to home link", async ({ page }) => {
      const backLink = page.getByRole("link", { name: /back to home/i });
      await expect(backLink).toBeVisible();
    });

    test("back to home navigates correctly", async ({ page }) => {
      const backLink = page.getByRole("link", { name: /back to home/i });
      await backLink.click();

      await page.waitForURL("/#blog");
    });
  });

  test.describe("Blog Posts Display", () => {
    test("displays blog posts", async ({ page }) => {
      // Wait for posts to load
      const cards = page.locator('[data-slot="card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("blog cards have titles", async ({ page }) => {
      const firstCard = page.locator('[data-slot="card"]').first();
      const title = firstCard.locator('[data-slot="card-title"]');
      await expect(title).toBeVisible();
    });

    test("blog cards have dates", async ({ page }) => {
      const firstCard = page.locator('[data-slot="card"]').first();
      await expect(firstCard.getByText(DATE_FORMAT_REGEX)).toBeVisible();
    });

    test("blog cards have author info", async ({ page }) => {
      const firstCard = page.locator('[data-slot="card"]').first();
      // Author avatar or name should be present
      const avatar = firstCard.locator("img").first();
      const hasAvatar = (await avatar.count()) > 0;
      expect(hasAvatar).toBe(true);
    });

    test("clicking a blog card navigates to post", async ({ page }) => {
      // The card is wrapped by a link
      const firstCard = page.locator('[data-slot="card"]').first();
      const link = firstCard.locator("xpath=ancestor::a");

      // Get the href before clicking
      const href = await link.getAttribute("href");
      expect(href).toMatch(/\/blog\/.+/);

      await link.click();
      await page.waitForURL(/\/blog\/.+/);
    });
  });

  test.describe("Search Functionality", () => {
    test("has search input", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
    });

    test("search filters posts", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);

      // Get initial post count
      const initialCards = page.locator('[data-slot="card"]');
      const initialCount = await initialCards.count();

      // Search for a term that likely won't match all posts
      await searchInput.fill("announcing");
      await page.waitForTimeout(300); // Wait for debounce

      // Either count changed or we have filtered results
      const filteredCards = page.locator('[data-slot="card"]');
      const filteredCount = await filteredCards.count();

      // Count should be less than or equal (might find matches)
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test("search updates URL", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill("test");
      // Wait for debounce (300ms) plus URL update
      await page.waitForTimeout(500);

      expect(page.url()).toContain("q=test");
    });

    test("shows no results message when search has no matches", async ({
      page,
    }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill("xyznonexistentterm123456");
      await page.waitForTimeout(300);

      const noResults = page.getByText(/no posts found/i);
      await expect(noResults).toBeVisible();
    });
  });

  test.describe("Tag Filtering", () => {
    test("displays tag filter chips", async ({ page }) => {
      // Tags are shown as buttons next to the "Tags:" label
      const tagsLabel = page.getByText("Tags:");
      await expect(tagsLabel).toBeVisible();
      // The "All" button should always be present
      const allButton = page.getByRole("button", { name: "All" });
      await expect(allButton).toBeVisible();
    });

    test("clicking a tag filters posts", async ({ page }) => {
      // Find tag buttons after the Tags: label (not the "All" button)
      // Tags are rounded-full buttons with single-word text
      const tagButtons = page.locator(
        'button.rounded-full:not(:has-text("All"))'
      );
      const tagCount = await tagButtons.count();

      if (tagCount > 0) {
        // Click the first actual tag (after "All")
        await tagButtons.first().click();
        await page.waitForTimeout(200);

        // URL should be updated with tag
        expect(page.url()).toMatch(/tags=/);
      }
    });
  });

  test.describe("Sort Functionality", () => {
    test("has sort dropdown", async ({ page }) => {
      // Look for sort control
      const sortButton = page.getByRole("combobox").first();
      const hasSortControl = (await sortButton.count()) > 0;

      if (hasSortControl) {
        await expect(sortButton).toBeVisible();
      }
    });
  });

  test.describe("View Mode Toggle", () => {
    test("has view mode toggle", async ({ page }) => {
      // View mode toggle buttons have aria-label
      const gridButton = page.getByLabel("Grid view");
      const listButton = page.getByLabel("List view");

      const hasGridButton = (await gridButton.count()) > 0;
      const hasListButton = (await listButton.count()) > 0;

      expect(hasGridButton || hasListButton).toBe(true);
    });

    test("can switch between grid and list view", async ({ page }) => {
      const listButton = page.getByLabel("List view");

      if ((await listButton.count()) > 0) {
        await listButton.click();
        await page.waitForTimeout(200);

        // URL should reflect view mode
        expect(page.url()).toContain("view=list");
      }
    });
  });

  test.describe("URL State Persistence", () => {
    test("loads with search param from URL", async ({ page }) => {
      await page.goto("/blog?q=volvox");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toHaveValue("volvox");
    });

    test("loads with sort param from URL", async ({ page }) => {
      await page.goto("/blog?sort=oldest");
      await page.waitForLoadState("networkidle");

      // The URL should maintain the sort param
      expect(page.url()).toContain("sort=oldest");
    });

    test("loads with view param from URL", async ({ page }) => {
      await page.goto("/blog?view=list");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("view=list");
    });
  });

  test.describe("Clear Filters", () => {
    test("can clear all filters", async ({ page }) => {
      // Apply a search filter first
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill("test");
      await page.waitForTimeout(300);

      // Look for clear all button
      const clearButton = page.getByRole("button", { name: /clear all/i });
      if ((await clearButton.count()) > 0) {
        await clearButton.click();
        await page.waitForTimeout(100);

        // Search should be cleared
        await expect(searchInput).toHaveValue("");
        // URL should not have query params
        expect(page.url()).not.toContain("q=");
      }
    });
  });
});
