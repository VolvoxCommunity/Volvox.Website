import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Disable animated background for stable screenshots
    await page.addStyleTag({
      content:
        ".fixed.inset-0.pointer-events-none.z-0 { display: none !important; }",
    });
  });

  test("should display hero section and navigation", async ({ page }) => {
    await expect(page).toHaveTitle(/Volvox/);
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.getByText("Building a Better Developer Community")
    ).toBeVisible();

    // Visual check for Hero
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000); // Wait for fade-in animations
    await expect(page).toHaveScreenshot("hero.png", {
      timeout: 20000,
      maxDiffPixelRatio: 0.3,
    });
  });

  test("should navigate to sections", async ({ page, isMobile }) => {
    if (!isMobile) {
      const sections = ["products", "blog", "mentorship", "about"];

      for (const section of sections) {
        // Use precise selector to avoid strict mode violations (e.g. "Products" vs "Explore Products")
        await page
          .getByRole("button", {
            name: section.charAt(0).toUpperCase() + section.slice(1),
            exact: true,
          })
          .click();

        await expect(page).toHaveURL(new RegExp(`#${section}`));
        // Wait for scroll
        await page.waitForTimeout(500);
        await expect(page.locator(`#${section}`)).toBeInViewport();
      }
    }
  });

  test("should display products", async ({ page }) => {
    await page.goto("/#products");
    await expect(
      page.getByText("Sobriety Waypoint", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("A comprehensive accountability app")
    ).toBeVisible();

    // Visual check for Products
    const productsSection = page.locator("#products");
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
    await expect(productsSection).toHaveScreenshot("products-section.png", {
      timeout: 20000,
      maxDiffPixelRatio: 0.3,
    });
  });

  test("should display blog posts", async ({ page }) => {
    await page.goto("/#blog");
    await expect(
      page.getByText("Announcing Volvox: Building a Better Developer Community")
    ).toBeVisible();

    // Visual check for Blog
    const blogSection = page.locator("#blog");
    await page.mouse.move(0, 0);
    await page.waitForTimeout(2000); // Wait longer for images/content
    await expect(blogSection).toHaveScreenshot("blog-section.png", {
      timeout: 20000,
      maxDiffPixelRatio: 0.4,
    });
  });

  test("should display mentorship section", async ({ page }) => {
    await page.goto("/#mentorship");
    await expect(
      page.getByRole("heading", { name: "Mentorship Program" })
    ).toBeVisible();

    // Check for empty state messages since we saw the JSONs were empty
    await expect(
      page.getByText("Our mentor team is growing. Check back soon!")
    ).toBeVisible();

    // Click on Featured Mentees tab using tab role
    const menteesTab = page.getByRole("tab", { name: "Featured Mentees" });
    await menteesTab.click({ force: true });
    await page.waitForTimeout(1000);

    // If text not visible, try clicking again (sometimes first click focuses/hovers)
    if (
      !(await page
        .getByText("Be the first to join our mentorship program!")
        .isVisible())
    ) {
      await menteesTab.click({ force: true });
      await page.waitForTimeout(1000);
    }

    await expect(
      page.getByText("Be the first to join our mentorship program!")
    ).toBeVisible();

    // Visual check for Mentorship
    const mentorshipSection = page.locator("#mentorship");
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
    await expect(mentorshipSection).toHaveScreenshot("mentorship-section.png", {
      timeout: 20000,
      maxDiffPixelRatio: 0.3,
    });
  });

  test("should toggle theme", async ({ page }) => {
    const themeToggle = page.getByLabel("Toggle theme");
    await themeToggle.click();

    const html = page.locator("html");

    // Wait for class to be updated
    await expect(html).toHaveClass(/(light|dark)/);

    const newClass = await html.getAttribute("class");

    // Verify persistence (requires reload)
    await page.reload();
    await expect(html).toHaveClass(new RegExp(newClass || ""));
  });
});
