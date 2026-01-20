import { test, expect } from "@playwright/test";

/**
 * Temporary verification test for semantic landmark roles.
 * This test verifies that proper ARIA landmark roles are implemented
 * for screen reader navigation.
 */
test.describe("Semantic Landmarks Verification", () => {
  test("homepage has proper landmark roles", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify banner role (header with navigation)
    const banner = page.locator('[role="banner"]');
    await expect(banner).toBeVisible();

    // Verify navigation with aria-label
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();

    // Verify main content area
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify contentinfo role (footer) - uses semantic <footer> element with implicit contentinfo role
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Verify hero section with aria-label
    const heroSection = page.locator('[aria-label="Hero"]');
    await expect(heroSection).toBeVisible();

    // Verify blog section with aria-label
    const blogSection = page.locator('[aria-label="Blog posts"]');
    await expect(blogSection).toBeVisible();

    // Verify community section with aria-label
    const communitySection = page.locator('[aria-label="Community"]');
    await expect(communitySection).toBeVisible();

    // Verify about section with aria-label
    const aboutSection = page.locator('[aria-label="About Volvox"]');
    await expect(aboutSection).toBeVisible();
  });

  test("blog page has proper landmark roles", async ({ page }) => {
    await page.goto("/blog");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify banner role
    const banner = page.locator('[role="banner"]');
    await expect(banner).toBeVisible();

    // Verify navigation
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();

    // Verify main content area
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify blog posts section with aria-label
    const blogPostsSection = page.locator('section[aria-label="Blog posts"]');
    await expect(blogPostsSection).toBeVisible();

    // Verify footer - uses semantic <footer> element with implicit contentinfo role
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("products page has proper landmark roles", async ({ page }) => {
    await page.goto("/products");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify banner role
    const banner = page.locator('[role="banner"]');
    await expect(banner).toBeVisible();

    // Verify navigation
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();

    // Verify main content area
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify products list section with aria-label
    const productsSection = page.locator('section[aria-label="Products list"]');
    await expect(productsSection).toBeVisible();

    // Verify footer - uses semantic <footer> element with implicit contentinfo role
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("team page has proper landmark roles", async ({ page }) => {
    await page.goto("/team");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify banner role
    const banner = page.locator('[role="banner"]');
    await expect(banner).toBeVisible();

    // Verify navigation
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();

    // Verify main content area
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify team members section with aria-labelledby (region for screen reader navigation)
    const teamSection = page.locator(
      'section[aria-labelledby="team-grid-heading"]'
    );
    await expect(teamSection).toBeVisible();

    // Verify footer - uses semantic <footer> element with implicit contentinfo role
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("screen reader can navigate by landmarks", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Get all landmarks by role and semantic elements
    const landmarks = await page.evaluate(() => {
      const roles = ["banner", "navigation", "contentinfo"];
      const results: { role: string; count: number; labels: string[] }[] = [];

      roles.forEach((role) => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        // For navigation, also count <nav> elements (implicit navigation role)
        const navElements =
          role === "navigation" ? document.querySelectorAll("nav") : [];
        // For contentinfo, also count <footer> elements (implicit contentinfo role)
        const footerElements =
          role === "contentinfo" ? document.querySelectorAll("footer") : [];

        const labels: string[] = [];
        elements.forEach((el) => {
          const label =
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby") ||
            "";
          if (label) labels.push(label);
        });
        navElements.forEach((el) => {
          const label =
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby") ||
            "";
          if (label) labels.push(label);
        });
        footerElements.forEach((el) => {
          const label =
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby") ||
            "";
          if (label) labels.push(label);
        });

        results.push({
          role,
          count: elements.length + navElements.length + footerElements.length,
          labels: [...new Set(labels)],
        });
      });

      // Check for <main> elements (implicit main role)
      const mainElements = document.querySelectorAll("main");
      results.push({
        role: "main",
        count: mainElements.length,
        labels: [],
      });

      // Also check for labeled sections (region role implied by section with aria-label)
      const labeledSections = document.querySelectorAll(
        "section[aria-label], section[aria-labelledby]"
      );
      const sectionLabels: string[] = [];
      labeledSections.forEach((el) => {
        const label =
          el.getAttribute("aria-label") ||
          el.getAttribute("aria-labelledby") ||
          "";
        if (label) sectionLabels.push(label);
      });

      results.push({
        role: "region (sections)",
        count: labeledSections.length,
        labels: sectionLabels,
      });

      return results;
    });

    // Verify we have at least one of each major landmark
    const bannerLandmark = landmarks.find((l) => l.role === "banner");
    expect(bannerLandmark?.count).toBeGreaterThanOrEqual(1);

    const navLandmark = landmarks.find((l) => l.role === "navigation");
    expect(navLandmark?.count).toBeGreaterThanOrEqual(1);

    const mainLandmark = landmarks.find((l) => l.role === "main");
    expect(mainLandmark?.count).toBe(1); // Should have exactly 1 main

    const footerLandmark = landmarks.find((l) => l.role === "contentinfo");
    expect(footerLandmark?.count).toBeGreaterThanOrEqual(1);

    // Verify we have labeled sections for navigation
    const sectionLandmarks = landmarks.find(
      (l) => l.role === "region (sections)"
    );
    expect(sectionLandmarks?.count).toBeGreaterThanOrEqual(4); // Hero, Blog, Community, About
  });
});
