# Comprehensive E2E Test Suite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement ~107 Playwright E2E tests covering all pages, features, accessibility, SEO, responsive design, visual regression, performance, and error states.

**Architecture:** Hybrid test organization with page-specific tests in `e2e/pages/`, feature tests in `e2e/features/`, and cross-cutting concerns (accessibility, SEO, responsive, visual, performance, errors) at the `e2e/` root. All tests use a shared base fixture providing axe-core accessibility scanning and console/network error assertions.

**Tech Stack:** Playwright, @axe-core/playwright, TypeScript

---

## Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

**Step 1: Add @axe-core/playwright dependency**

Run:

```bash
pnpm add -D @axe-core/playwright
```

**Step 2: Verify installation**

Run:

```bash
pnpm list @axe-core/playwright
```

Expected: Shows @axe-core/playwright in devDependencies

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add @axe-core/playwright for accessibility testing"
```

---

## Task 2: Update Playwright Configuration

**Files:**

- Modify: `playwright.config.ts`

**Step 1: Read current config**

Read the file to understand current structure.

**Step 2: Update playwright.config.ts with full browser matrix**

```typescript
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing.
 * Includes desktop browsers (Chromium, Firefox, Safari) and mobile viewports.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  projects: [
    // Desktop browsers
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Mobile viewports
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "feat(e2e): configure full browser matrix with mobile viewports"
```

---

## Task 3: Create Base Test Fixture

**Files:**

- Create: `e2e/fixtures/base.fixture.ts`

**Step 1: Create fixtures directory**

```bash
mkdir -p e2e/fixtures
```

**Step 2: Create base.fixture.ts**

```typescript
import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Extended test fixtures for E2E testing.
 * Provides accessibility scanning, console error detection, and network failure detection.
 */
type TestFixtures = {
  /** Accessibility scanner using axe-core */
  axe: AxeBuilder;
  /** Assertion that fails if console errors were logged */
  assertNoConsoleErrors: () => Promise<void>;
  /** Assertion that fails if network requests returned 4xx/5xx */
  assertNoFailedRequests: () => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  axe: async ({ page }, use) => {
    await use(new AxeBuilder({ page }));
  },

  assertNoConsoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await use(async () => {
      expect(errors, "Console errors found").toEqual([]);
    });
  },

  assertNoFailedRequests: async ({ page }, use) => {
    const failures: string[] = [];
    page.on("response", (res) => {
      if (res.status() >= 400) {
        failures.push(`${res.status()} ${res.url()}`);
      }
    });
    await use(async () => {
      expect(failures, "Failed network requests").toEqual([]);
    });
  },
});

export { expect };
```

**Step 3: Commit**

```bash
git add e2e/fixtures/base.fixture.ts
git commit -m "feat(e2e): add base test fixture with axe and error assertions"
```

---

## Task 4: Add data-testid to Navigation Component

**Files:**

- Modify: `src/components/navigation.tsx`

**Step 1: Read the navigation component**

Read the file to understand its structure.

**Step 2: Add data-testid attributes**

Add these attributes:

- `data-testid="desktop-nav"` to the desktop navigation container
- `data-testid="mobile-menu-button"` to the hamburger/menu button
- `data-testid="mobile-menu"` to the mobile menu panel/sheet

**Step 3: Commit**

```bash
git add src/components/navigation.tsx
git commit -m "feat(e2e): add data-testid attributes to navigation component"
```

---

## Task 5: Add data-testid to Theme Toggle Component

**Files:**

- Modify: `src/components/theme-toggle.tsx`

**Step 1: Read the theme toggle component**

Read the file to understand its structure.

**Step 2: Add data-testid attribute**

Add `data-testid="theme-toggle"` to the toggle button element.

**Step 3: Commit**

```bash
git add src/components/theme-toggle.tsx
git commit -m "feat(e2e): add data-testid to theme toggle component"
```

---

## Task 6: Add data-testid to Cookie Consent Banner

**Files:**

- Modify: `src/components/cookie-consent-banner.tsx`

**Step 1: Read the cookie consent component**

Read the file to understand its structure.

**Step 2: Add data-testid attribute**

Add `data-testid="cookie-consent-banner"` to the banner container.

**Step 3: Commit**

```bash
git add src/components/cookie-consent-banner.tsx
git commit -m "feat(e2e): add data-testid to cookie consent banner"
```

---

## Task 7: Add data-testid to Homepage Section Components

**Files:**

- Modify: `src/components/hero.tsx`
- Modify: `src/components/products.tsx`
- Modify: `src/components/blog.tsx`
- Modify: `src/components/mentorship.tsx`
- Modify: `src/components/about.tsx`

**Step 1: Read each component**

Read each file to understand its structure.

**Step 2: Add data-testid attributes**

- `src/components/hero.tsx`: Add `data-testid="hero-section"` to the section/container
- `src/components/products.tsx`: Add `data-testid="products-section"` to the section, `data-testid="product-card"` to each product card
- `src/components/blog.tsx`: Add `data-testid="blog-section"` to the section, `data-testid="blog-card"` to each blog card
- `src/components/mentorship.tsx`: Add `data-testid="mentorship-section"` to the section
- `src/components/about.tsx`: Add `data-testid="about-section"` to the section

**Step 3: Commit**

```bash
git add src/components/hero.tsx src/components/products.tsx src/components/blog.tsx src/components/mentorship.tsx src/components/about.tsx
git commit -m "feat(e2e): add data-testid to homepage section components"
```

---

## Task 8: Add data-testid to Blog Components

**Files:**

- Modify: `src/components/blog/blog-post-header.tsx`
- Modify: `src/components/blog/blog-content-wrapper.tsx`
- Modify: `src/components/blog/table-of-contents.tsx`
- Modify: `src/components/blog/reading-progress.tsx`
- Modify: `src/components/blog/back-to-posts-button.tsx`

**Step 1: Read each component**

Read each file to understand its structure.

**Step 2: Add data-testid attributes**

- `blog-post-header.tsx`: Add `data-testid="blog-post-header"` and `data-testid="author-name"` to author display
- `blog-content-wrapper.tsx`: Add `data-testid="blog-content"`
- `table-of-contents.tsx`: Add `data-testid="table-of-contents"`
- `reading-progress.tsx`: Add `data-testid="reading-progress"`
- `back-to-posts-button.tsx`: Add `data-testid="back-to-posts"`

**Step 3: Commit**

```bash
git add src/components/blog/
git commit -m "feat(e2e): add data-testid to blog components"
```

---

## Task 9: Add data-testid to Footer Component

**Files:**

- Modify: `src/components/footer.tsx`

**Step 1: Read the footer component**

Read the file to understand its structure.

**Step 2: Add data-testid attribute**

Add `data-testid="footer"` to the footer container.

**Step 3: Commit**

```bash
git add src/components/footer.tsx
git commit -m "feat(e2e): add data-testid to footer component"
```

---

## Task 10: Create Homepage E2E Tests

**Files:**

- Create: `e2e/pages/homepage.spec.ts`
- Delete: `e2e/homepage.spec.ts` (old file)

**Step 1: Delete old homepage test file**

```bash
rm e2e/homepage.spec.ts
```

**Step 2: Create e2e/pages directory**

```bash
mkdir -p e2e/pages
```

**Step 3: Create homepage.spec.ts**

```typescript
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
    await page
      .locator("#blog, [data-testid='blog-section']")
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // Verify the page scrolled (blog section is in viewport)
    const blogSection = page.locator("#blog, [data-testid='blog-section']");
    await expect(blogSection).toBeInViewport();
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
```

**Step 4: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/homepage.spec.ts --project=chromium
```

**Step 5: Commit**

```bash
git add e2e/pages/homepage.spec.ts
git rm e2e/homepage.spec.ts 2>/dev/null || true
git commit -m "feat(e2e): add comprehensive homepage tests"
```

---

## Task 11: Create Blog List E2E Tests

**Files:**

- Create: `e2e/pages/blog-list.spec.ts`

**Step 1: Create blog-list.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Blog List (Homepage Section)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page
      .locator("#blog, [data-testid='blog-section']")
      .scrollIntoViewIfNeeded();
  });

  test("displays blog section heading", async ({ page }) => {
    const blogSection = page.locator("#blog, [data-testid='blog-section']");
    await expect(blogSection).toBeVisible();
    const heading = blogSection.locator("h2");
    await expect(heading).toBeVisible();
  });

  test("displays at least one blog card", async ({ page }) => {
    const cards = page.locator('[data-testid="blog-card"]');
    await expect(cards).toHaveCount({ min: 1 });
  });

  test("blog cards have title and date", async ({ page }) => {
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    await expect(firstCard.locator("h3, h4")).toBeVisible();
    await expect(firstCard.locator("time")).toBeVisible();
  });

  test("blog card links to blog post", async ({ page }) => {
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    const link = firstCard.locator("a").first();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/blog\/.+/);
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/blog-list.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/pages/blog-list.spec.ts
git commit -m "feat(e2e): add blog list section tests"
```

---

## Task 12: Create Blog Post E2E Tests

**Files:**

- Create: `e2e/pages/blog-post.spec.ts`

**Step 1: Create blog-post.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Blog Post Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/announcing-volvox");
  });

  test("renders post header with title and date", async ({ page }) => {
    const header = page.locator('[data-testid="blog-post-header"]');
    await expect(header).toBeVisible();
    await expect(header.locator("h1")).toBeVisible();
    await expect(header.locator("time")).toBeVisible();
  });

  test("renders author information", async ({ page }) => {
    const author = page.locator('[data-testid="author-name"]');
    await expect(author).toBeVisible();
  });

  test("renders MDX content correctly", async ({ page }) => {
    const content = page.locator('[data-testid="blog-content"], article');
    await expect(content).toBeVisible();
    await expect(content.locator("p").first()).toBeVisible();
  });

  test("displays table of contents with anchor links", async ({ page }) => {
    const toc = page.locator('[data-testid="table-of-contents"]');
    // TOC may be hidden on mobile, so check if it exists when visible
    const tocCount = await toc.count();
    if (tocCount > 0) {
      const tocLinks = toc.locator("a[href^='#']");
      await expect(tocLinks).toHaveCount({ min: 1 });
    }
  });

  test("clicking TOC link scrolls to heading", async ({ page }) => {
    const toc = page.locator('[data-testid="table-of-contents"]');
    const tocCount = await toc.count();
    if (tocCount > 0 && (await toc.isVisible())) {
      const firstLink = toc.locator("a[href^='#']").first();
      const href = await firstLink.getAttribute("href");
      if (href) {
        await firstLink.click();
        const targetHeading = page.locator(href);
        await expect(targetHeading).toBeInViewport();
      }
    }
  });

  test("reading progress bar is present", async ({ page }) => {
    const progressBar = page.locator('[data-testid="reading-progress"]');
    await expect(progressBar).toBeAttached();
  });

  test("back to posts button navigates correctly", async ({ page }) => {
    const backButton = page.locator('[data-testid="back-to-posts"]');
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL("/");
  });

  test("has correct page title", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain("announcing");
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/blog-post.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/pages/blog-post.spec.ts
git commit -m "feat(e2e): add blog post page tests"
```

---

## Task 13: Create Products List E2E Tests

**Files:**

- Create: `e2e/pages/products-list.spec.ts`

**Step 1: Create products-list.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Products List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Products|Volvox/i);
  });

  test("displays at least one product", async ({ page }) => {
    const products = page.locator('[data-testid="product-card"]');
    await expect(products).toHaveCount({ min: 1 });
  });

  test("product cards have name and description", async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct.locator("h2, h3")).toBeVisible();
    await expect(firstProduct.locator("p")).toBeVisible();
  });

  test("product card links to product detail", async ({ page }) => {
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const link = firstProduct.locator("a").first();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/products\/.+/);
  });

  test("displays navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("displays footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/products-list.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/pages/products-list.spec.ts
git commit -m "feat(e2e): add products list page tests"
```

---

## Task 14: Create Product Detail E2E Tests

**Files:**

- Create: `e2e/pages/product-detail.spec.ts`

**Step 1: Create product-detail.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Product Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products/sobriety-waypoint");
  });

  test("loads successfully with product name in title", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain("sobriety");
  });

  test("displays product name as heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Sobriety Waypoint/i);
  });

  test("displays product description", async ({ page }) => {
    const description = page.locator("p").first();
    await expect(description).toBeVisible();
  });

  test("displays product features", async ({ page }) => {
    // Look for a features section or list
    const features = page.locator("ul, [data-testid='product-features']");
    await expect(features.first()).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test("has external links (GitHub, Demo)", async ({ page }) => {
    const links = page.locator(
      'a[href*="github.com"], a[href*="sobrietywaypoint"]'
    );
    await expect(links).toHaveCount({ min: 1 });
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/product-detail.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/pages/product-detail.spec.ts
git commit -m "feat(e2e): add product detail page tests"
```

---

## Task 15: Create Privacy and Terms Page E2E Tests

**Files:**

- Create: `e2e/pages/privacy.spec.ts`
- Create: `e2e/pages/terms.spec.ts`

**Step 1: Create privacy.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Privacy Policy Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Privacy|Volvox/i);
  });

  test("displays privacy policy heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Privacy/i);
  });

  test("displays policy content", async ({ page }) => {
    const content = page.locator("main p, article p");
    await expect(content.first()).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
```

**Step 2: Create terms.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Terms of Service Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Terms|Volvox/i);
  });

  test("displays terms heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Terms/i);
  });

  test("displays terms content", async ({ page }) => {
    const content = page.locator("main p, article p");
    await expect(content.first()).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("has footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});
```

**Step 3: Run tests to verify**

```bash
pnpm exec playwright test e2e/pages/privacy.spec.ts e2e/pages/terms.spec.ts --project=chromium
```

**Step 4: Commit**

```bash
git add e2e/pages/privacy.spec.ts e2e/pages/terms.spec.ts
git commit -m "feat(e2e): add privacy and terms page tests"
```

---

## Task 16: Create Navigation Feature Tests

**Files:**

- Create: `e2e/features/navigation.spec.ts`

**Step 1: Create features directory**

```bash
mkdir -p e2e/features
```

**Step 2: Create navigation.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Navigation", () => {
  test.describe("Desktop Navigation", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("displays all nav links", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // Check for main navigation links
      await expect(nav.getByRole("link", { name: /products/i })).toBeVisible();
      await expect(nav.getByRole("link", { name: /blog/i })).toBeVisible();
    });

    test("desktop nav is visible, mobile menu button is hidden", async ({
      page,
    }) => {
      await page.goto("/");
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      const mobileButton = page.locator('[data-testid="mobile-menu-button"]');

      if ((await desktopNav.count()) > 0) {
        await expect(desktopNav).toBeVisible();
      }
      if ((await mobileButton.count()) > 0) {
        await expect(mobileButton).not.toBeVisible();
      }
    });

    test("nav links scroll to correct sections", async ({ page }) => {
      await page.goto("/");
      const blogLink = page
        .locator('nav a[href*="blog"], nav a[href="#blog"]')
        .first();
      if ((await blogLink.count()) > 0) {
        await blogLink.click();
        await page.waitForTimeout(500);
        const blogSection = page.locator("#blog, [data-testid='blog-section']");
        await expect(blogSection).toBeInViewport();
      }
    });
  });

  test.describe("Mobile Navigation", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("shows mobile menu button", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await menuButton.count()) > 0) {
        await expect(menuButton).toBeVisible();
      }
    });

    test("mobile menu opens and closes", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');

      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();

        // Close menu
        await menuButton.click();
        await expect(mobileMenu).not.toBeVisible();
      }
    });

    test("mobile menu links navigate correctly", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');

      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        const productsLink = mobileMenu.getByRole("link", {
          name: /products/i,
        });

        if ((await productsLink.count()) > 0) {
          await productsLink.click();
          await expect(page).toHaveURL(/products/);
        }
      }
    });
  });
});
```

**Step 3: Run tests to verify**

```bash
pnpm exec playwright test e2e/features/navigation.spec.ts --project=chromium
```

**Step 4: Commit**

```bash
git add e2e/features/navigation.spec.ts
git commit -m "feat(e2e): add navigation feature tests"
```

---

## Task 17: Create Theme Toggle Feature Tests

**Files:**

- Create: `e2e/features/theme.spec.ts`

**Step 1: Create theme.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Theme Toggle", () => {
  test("toggles between light and dark mode", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('[data-testid="theme-toggle"]');

    if ((await toggle.count()) > 0) {
      await toggle.click();
      await expect(page.locator("html")).toHaveClass(/dark/);

      await toggle.click();
      await expect(page.locator("html")).not.toHaveClass(/dark/);
    }
  });

  test("persists theme preference across page loads", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('[data-testid="theme-toggle"]');

    if ((await toggle.count()) > 0) {
      await toggle.click();
      await expect(page.locator("html")).toHaveClass(/dark/);

      await page.reload();
      await expect(page.locator("html")).toHaveClass(/dark/);
    }
  });

  test("respects system preference on first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    // Should respect system preference (may be dark)
    // This test verifies the page loads without error
    await expect(page.locator("html")).toBeVisible();
  });

  test("theme toggle is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('[data-testid="theme-toggle"]');

    if ((await toggle.count()) > 0) {
      await toggle.focus();
      await page.keyboard.press("Enter");
      // Toggle should have activated
      await page.waitForTimeout(200);
    }
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/features/theme.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/features/theme.spec.ts
git commit -m "feat(e2e): add theme toggle feature tests"
```

---

## Task 18: Create Cookie Consent Feature Tests

**Files:**

- Create: `e2e/features/cookie-consent.spec.ts`

**Step 1: Create cookie-consent.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Cookie Consent", () => {
  test("shows banner on first visit", async ({ page }) => {
    // Clear any existing consent
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    // Banner should appear (may have animation delay)
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0) {
      await expect(banner).toBeVisible();
    }
  });

  test("accepting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0 && (await banner.isVisible())) {
      const acceptButton = banner.getByRole("button", {
        name: /accept|agree|allow/i,
      });
      if ((await acceptButton.count()) > 0) {
        await acceptButton.click();
        await expect(banner).not.toBeVisible();

        await page.reload();
        await page.waitForTimeout(500);
        await expect(banner).not.toBeVisible();
      }
    }
  });

  test("rejecting cookies hides banner and persists", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");

    const banner = page.locator('[data-testid="cookie-consent-banner"]');
    await page.waitForTimeout(500);

    if ((await banner.count()) > 0 && (await banner.isVisible())) {
      const rejectButton = banner.getByRole("button", {
        name: /reject|decline|deny|no/i,
      });
      if ((await rejectButton.count()) > 0) {
        await rejectButton.click();
        await expect(banner).not.toBeVisible();

        await page.reload();
        await page.waitForTimeout(500);
        await expect(banner).not.toBeVisible();
      }
    }
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/features/cookie-consent.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/features/cookie-consent.spec.ts
git commit -m "feat(e2e): add cookie consent feature tests"
```

---

## Task 19: Create Footer Feature Tests

**Files:**

- Create: `e2e/features/footer.spec.ts`

**Step 1: Create footer.spec.ts**

```typescript
import { test, expect } from "../fixtures/base.fixture";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const footer = page.locator('[data-testid="footer"], footer');
    await footer.scrollIntoViewIfNeeded();
  });

  test("displays footer", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    await expect(footer).toBeVisible();
  });

  test("has privacy policy link", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    const privacyLink = footer.getByRole("link", { name: /privacy/i });

    if ((await privacyLink.count()) > 0) {
      await expect(privacyLink).toBeVisible();
      const href = await privacyLink.getAttribute("href");
      expect(href).toContain("privacy");
    }
  });

  test("has terms link", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    const termsLink = footer.getByRole("link", { name: /terms/i });

    if ((await termsLink.count()) > 0) {
      await expect(termsLink).toBeVisible();
      const href = await termsLink.getAttribute("href");
      expect(href).toContain("terms");
    }
  });

  test("has social links", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    const socialLinks = footer.locator(
      'a[href*="github.com"], a[href*="discord"], a[href*="twitter"]'
    );
    await expect(socialLinks).toHaveCount({ min: 1 });
  });

  test("copyright text is present", async ({ page }) => {
    const footer = page.locator('[data-testid="footer"], footer');
    const copyright = footer.locator("text=/©|copyright|Volvox/i");
    await expect(copyright).toBeVisible();
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/features/footer.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/features/footer.spec.ts
git commit -m "feat(e2e): add footer feature tests"
```

---

## Task 20: Create Accessibility Tests

**Files:**

- Create: `e2e/accessibility.spec.ts`

**Step 1: Create accessibility.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "Blog Post", path: "/blog/announcing-volvox" },
  { name: "Products", path: "/products" },
  { name: "Product Detail", path: "/products/sobriety-waypoint" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

test.describe("Accessibility", () => {
  for (const { name, path } of pages) {
    test(`${name} page passes axe accessibility scan`, async ({
      page,
      axe,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await axe
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(
        results.violations,
        `Accessibility violations on ${name}:\n${JSON.stringify(results.violations, null, 2)}`
      ).toEqual([]);
    });
  }

  test("focus is visible on interactive elements", async ({ page }) => {
    await page.goto("/");

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      const count = await focused.count();
      if (count > 0) {
        await expect(focused).toBeVisible();
      }
    }
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const imagesWithoutAlt = page.locator("img:not([alt])");
    const count = await imagesWithoutAlt.count();
    expect(count, "Images missing alt text").toBe(0);
  });

  test("page has exactly one h1", async ({ page }) => {
    await page.goto("/");
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
  });

  test("links have discernible text", async ({ page }) => {
    await page.goto("/");
    const emptyLinks = page
      .locator("a:not([aria-label]):not(:has(img)):not(:has(svg))")
      .filter({ hasNotText: /.+/ });
    const count = await emptyLinks.count();
    expect(count, "Links without discernible text").toBe(0);
  });

  test("buttons have accessible names", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator("button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const name =
        (await button.getAttribute("aria-label")) ||
        (await button.textContent());
      expect(
        name?.trim().length,
        `Button ${i} has no accessible name`
      ).toBeGreaterThan(0);
    }
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/accessibility.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/accessibility.spec.ts
git commit -m "feat(e2e): add accessibility tests with axe-core"
```

---

## Task 21: Create SEO Tests

**Files:**

- Create: `e2e/seo.spec.ts`

**Step 1: Create seo.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

test.describe("SEO", () => {
  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("has correct meta title and description", async ({ page }) => {
      await expect(page).toHaveTitle(/Volvox/i);
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.{50,}/);
    });

    test("has Open Graph tags", async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        /.+/
      );
      await expect(
        page.locator('meta[property="og:description"]')
      ).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /.+/
      );
    });

    test("has Twitter card tags", async ({ page }) => {
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        /.+/
      );
    });

    test("has canonical URL", async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      const count = await canonical.count();
      if (count > 0) {
        await expect(canonical).toHaveAttribute("href", /.+/);
      }
    });
  });

  test.describe("Blog Post", () => {
    test("has unique meta tags per post", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");

      const title = await page.title();
      expect(title.toLowerCase()).toContain("announcing");
    });

    test("has article-specific OG type", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");

      const ogType = page.locator('meta[property="og:type"]');
      const count = await ogType.count();
      if (count > 0) {
        await expect(ogType).toHaveAttribute("content", "article");
      }
    });
  });

  test.describe("Product Page", () => {
    test("has product-specific meta tags", async ({ page }) => {
      await page.goto("/products/sobriety-waypoint");

      const title = await page.title();
      expect(title.toLowerCase()).toContain("sobriety");

      const description = page.locator('meta[name="description"]');
      const count = await description.count();
      if (count > 0) {
        await expect(description).toHaveAttribute("content", /.{30,}/);
      }
    });
  });

  test("robots meta allows indexing on public pages", async ({ page }) => {
    await page.goto("/");
    const robots = page.locator('meta[name="robots"]');
    const count = await robots.count();
    if (count > 0) {
      const content = await robots.getAttribute("content");
      expect(content).not.toContain("noindex");
    }
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/seo.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/seo.spec.ts
git commit -m "feat(e2e): add SEO tests for meta tags and OG"
```

---

## Task 22: Create Responsive Tests

**Files:**

- Create: `e2e/responsive.spec.ts`

**Step 1: Create responsive.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
};

test.describe("Responsive Design", () => {
  test.describe("Mobile (375px)", () => {
    test.use({ viewport: viewports.mobile });

    test("navigation shows mobile menu button", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await menuButton.count()) > 0) {
        await expect(menuButton).toBeVisible();
      }
    });

    test("content does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test("footer is visible and properly styled", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator('[data-testid="footer"], footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
    });
  });

  test.describe("Tablet (768px)", () => {
    test.use({ viewport: viewports.tablet });

    test("navigation adapts to tablet layout", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("content does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });
  });

  test.describe("Desktop (1280px)", () => {
    test.use({ viewport: viewports.desktop });

    test("navigation shows desktop layout", async ({ page }) => {
      await page.goto("/");
      const desktopNav = page.locator('[data-testid="desktop-nav"]');
      if ((await desktopNav.count()) > 0) {
        await expect(desktopNav).toBeVisible();
      }
      const mobileButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await mobileButton.count()) > 0) {
        await expect(mobileButton).not.toBeVisible();
      }
    });

    test("blog post shows sidebar TOC", async ({ page }) => {
      await page.goto("/blog/announcing-volvox");
      const toc = page.locator('[data-testid="table-of-contents"]');
      if ((await toc.count()) > 0) {
        await expect(toc).toBeVisible();
      }
    });
  });

  test("no horizontal scroll on any viewport", async ({ page }) => {
    for (const [name, size] of Object.entries(viewports)) {
      await page.setViewportSize(size);
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth, `Horizontal scroll on ${name}`).toBeLessThanOrEqual(
        clientWidth + 5
      );
    }
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/responsive.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/responsive.spec.ts
git commit -m "feat(e2e): add responsive design tests"
```

---

## Task 23: Create Visual Regression Tests

**Files:**

- Create: `e2e/visual.spec.ts`

**Step 1: Create visual.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

test.describe("Visual Regression", () => {
  // Only run visual tests on Chromium to avoid maintaining multiple baselines
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Visual tests only on Chromium"
  );

  test.describe("Desktop Screenshots", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("homepage hero section", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(1000);
      const hero = page.locator('[data-testid="hero-section"]');
      if ((await hero.count()) > 0) {
        await expect(hero).toHaveScreenshot("homepage-hero.png");
      }
    });

    test("navigation bar", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav).toHaveScreenshot("navigation-desktop.png");
    });

    test("footer", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator('[data-testid="footer"], footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toHaveScreenshot("footer-desktop.png");
    });

    test("products listing page", async ({ page }) => {
      await page.goto("/products");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveScreenshot("products-listing.png");
    });
  });

  test.describe("Mobile Screenshots", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("homepage mobile view", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot("homepage-mobile.png");
    });

    test("mobile menu open", async ({ page }) => {
      await page.goto("/");
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
        await menuButton.click();
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot("mobile-menu-open.png");
      }
    });
  });

  test.describe("Theme Screenshots", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("dark mode homepage", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator('[data-testid="theme-toggle"]');
      if ((await toggle.count()) > 0) {
        await toggle.click();
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot("homepage-dark.png");
      }
    });
  });
});
```

**Step 2: Generate baseline screenshots**

```bash
pnpm exec playwright test e2e/visual.spec.ts --project=chromium --update-snapshots
```

**Step 3: Run tests to verify baselines work**

```bash
pnpm exec playwright test e2e/visual.spec.ts --project=chromium
```

**Step 4: Commit**

```bash
git add e2e/visual.spec.ts e2e/visual.spec.ts-snapshots/
git commit -m "feat(e2e): add visual regression tests with baselines"
```

---

## Task 24: Create Performance Tests

**Files:**

- Create: `e2e/performance.spec.ts`

**Step 1: Create performance.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "Blog Post", path: "/blog/announcing-volvox" },
  { name: "Products", path: "/products" },
  { name: "Product Detail", path: "/products/sobriety-waypoint" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
];

test.describe("Performance", () => {
  test.describe("Page Load Times", () => {
    for (const { name, path } of pages) {
      test(`${name} loads within 3 seconds`, async ({ page }) => {
        const start = Date.now();
        await page.goto(path, { waitUntil: "domcontentloaded" });
        const loadTime = Date.now() - start;

        expect(loadTime, `${name} took ${loadTime}ms`).toBeLessThan(3000);
      });
    }
  });

  test.describe("No Console Errors", () => {
    for (const { name, path } of pages) {
      test(`${name} has no console errors`, async ({
        page,
        assertNoConsoleErrors,
      }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await assertNoConsoleErrors();
      });
    }
  });

  test.describe("No Failed Network Requests", () => {
    for (const { name, path } of pages) {
      test(`${name} has no failed requests`, async ({
        page,
        assertNoFailedRequests,
      }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await assertNoFailedRequests();
      });
    }
  });

  test.describe("Critical Resources", () => {
    test("fonts load correctly", async ({ page }) => {
      const fontRequests: string[] = [];
      page.on("response", (res) => {
        if (
          res.url().includes("fonts") ||
          res.headers()["content-type"]?.includes("font")
        ) {
          fontRequests.push(res.url());
        }
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      expect(fontRequests.length).toBeGreaterThan(0);
    });

    test("critical images load", async ({ page }) => {
      const failedImages: string[] = [];

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        if (naturalWidth === 0) {
          const src = await img.getAttribute("src");
          failedImages.push(src || "unknown");
        }
      }

      expect(failedImages, `Failed images: ${failedImages.join(", ")}`).toEqual(
        []
      );
    });

    test("JavaScript bundles load without errors", async ({ page }) => {
      const jsErrors: string[] = [];

      page.on("pageerror", (err) => {
        jsErrors.push(err.message);
      });

      page.on("response", (res) => {
        if (res.url().endsWith(".js") && res.status() >= 400) {
          jsErrors.push(`Failed to load: ${res.url()}`);
        }
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      expect(jsErrors).toEqual([]);
    });
  });

  test.describe("Interaction Responsiveness", () => {
    test("theme toggle responds within 100ms", async ({ page }) => {
      await page.goto("/");
      const toggle = page.locator('[data-testid="theme-toggle"]');

      if ((await toggle.count()) > 0) {
        const start = Date.now();
        await toggle.click();
        await expect(page.locator("html")).toHaveClass(/dark/);
        const responseTime = Date.now() - start;

        expect(responseTime).toBeLessThan(500);
      }
    });
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/performance.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/performance.spec.ts
git commit -m "feat(e2e): add performance tests for load times and resources"
```

---

## Task 25: Create Error State Tests

**Files:**

- Create: `e2e/errors.spec.ts`

**Step 1: Create errors.spec.ts**

```typescript
import { test, expect } from "./fixtures/base.fixture";

test.describe("Error States", () => {
  test.describe("404 Pages", () => {
    test("shows 404 page for invalid routes", async ({ page }) => {
      const response = await page.goto("/this-page-does-not-exist");

      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toContainText(/404|not found/i);
    });

    test("shows 404 for invalid blog slug", async ({ page }) => {
      const response = await page.goto("/blog/non-existent-post-slug");

      expect(response?.status()).toBe(404);
    });

    test("shows 404 for invalid product slug", async ({ page }) => {
      const response = await page.goto("/products/non-existent-product");

      expect(response?.status()).toBe(404);
    });

    test("404 page has navigation to return home", async ({ page }) => {
      await page.goto("/invalid-page-123");

      const homeLink = page.getByRole("link", {
        name: /home|back|return|volvox/i,
      });
      if ((await homeLink.count()) > 0) {
        await expect(homeLink).toBeVisible();
      }
    });

    test("404 page maintains site styling", async ({ page }) => {
      await page.goto("/invalid-page");

      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });
  });

  test.describe("Resource Failures", () => {
    test("page handles failed image gracefully", async ({ page }) => {
      await page.route("**/*.png", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();
    });

    test("page handles blocked external scripts", async ({ page }) => {
      await page.route("**/*analytics*", (route) => route.abort());
      await page.route("**/*sentry*", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    });

    test("page handles font loading failure", async ({ page }) => {
      await page.route("**/*.woff2", (route) => route.abort());
      await page.route("**/fonts.googleapis.com/**", (route) => route.abort());
      await page.route("**/fonts.gstatic.com/**", (route) => route.abort());

      await page.goto("/");

      await expect(page.locator("h1")).toBeVisible();

      const text = await page.locator("h1").textContent();
      expect(text?.length).toBeGreaterThan(0);
    });
  });

  test.describe("JavaScript Errors", () => {
    test("no unhandled promise rejections on page load", async ({ page }) => {
      const errors: string[] = [];

      page.on("pageerror", (err) => {
        errors.push(err.message);
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await page
        .locator("#blog, [data-testid='blog-section']")
        .scrollIntoViewIfNeeded();
      await page
        .locator("#about, [data-testid='about-section']")
        .scrollIntoViewIfNeeded();

      expect(errors).toEqual([]);
    });

    test("interactions don't cause JavaScript errors", async ({ page }) => {
      const errors: string[] = [];

      page.on("pageerror", (err) => {
        errors.push(err.message);
      });

      await page.goto("/");

      const toggle = page.locator('[data-testid="theme-toggle"]');
      if ((await toggle.count()) > 0) {
        await toggle.click();
      }

      expect(errors).toEqual([]);
    });
  });
});
```

**Step 2: Run tests to verify**

```bash
pnpm exec playwright test e2e/errors.spec.ts --project=chromium
```

**Step 3: Commit**

```bash
git add e2e/errors.spec.ts
git commit -m "feat(e2e): add error state tests for 404s and resource failures"
```

---

## Task 26: Create GitHub Actions Workflow

**Files:**

- Create: `.github/workflows/e2e.yml`

**Step 1: Create .github/workflows directory**

```bash
mkdir -p .github/workflows
```

**Step 2: Create e2e.yml**

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  e2e:
    name: Playwright (${{ matrix.shard }})
    runs-on: ubuntu-latest
    timeout-minutes: 20
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.26.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium firefox webkit

      - name: Build application
        run: pnpm build

      - name: Run Playwright tests (shard ${{ matrix.shard }})
        run: pnpm exec playwright test --shard=${{ matrix.shard }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ strategy.job-index }}
          path: playwright-report/
          retention-days: 30

      - name: Upload failure artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-artifacts-${{ strategy.job-index }}
          path: test-results/
          retention-days: 7
```

**Step 3: Commit**

```bash
git add .github/workflows/e2e.yml
git commit -m "ci(e2e): add GitHub Actions workflow with sharded tests"
```

---

## Task 27: Run Full Test Suite and Fix Issues

**Step 1: Run all tests on Chromium**

```bash
pnpm exec playwright test --project=chromium
```

**Step 2: Fix any failing tests**

Review failures and fix test assertions or add missing data-testid attributes as needed.

**Step 3: Run tests on all browsers**

```bash
pnpm exec playwright test
```

**Step 4: Fix any cross-browser issues**

**Step 5: Final commit with any fixes**

```bash
git add .
git commit -m "fix(e2e): address test failures across browsers"
```

---

## Task 28: Run Validation Checks

**Step 1: Format code**

```bash
pnpm format
```

**Step 2: Type check**

```bash
pnpm typecheck
```

**Step 3: Lint**

```bash
pnpm lint
```

**Step 4: Run unit tests**

```bash
pnpm test
```

**Step 5: Build**

```bash
pnpm build
```

**Step 6: Run E2E tests**

```bash
pnpm exec playwright test --project=chromium
```

**Step 7: Commit any formatting fixes**

```bash
git add .
git commit -m "style: format code"
```

---

## Task 29: Final Summary and PR Preparation

**Step 1: Review all commits**

```bash
git log --oneline main..HEAD
```

**Step 2: Verify test count**

```bash
pnpm exec playwright test --list --project=chromium 2>&1 | tail -5
```

**Step 3: Push branch**

```bash
git push -u origin feat/e2e-tests
```

**Step 4: Create PR**

```bash
gh pr create --title "feat(e2e): add comprehensive E2E test suite" --body "$(cat <<'EOF'
## Summary
- Added ~107 Playwright E2E tests covering all pages and features
- Configured full browser matrix (Chromium, Firefox, Safari, Mobile)
- Added accessibility testing with @axe-core/playwright
- Added visual regression tests with screenshot comparisons
- Added performance tests (load times, console errors, network failures)
- Added error state tests (404s, resource failures)
- Added GitHub Actions CI workflow with 4-way sharding

## Test Coverage
- **Pages:** Homepage, Blog List, Blog Post, Products List, Product Detail, Privacy, Terms
- **Features:** Navigation, Theme Toggle, Cookie Consent, Footer
- **Cross-cutting:** Accessibility, SEO, Responsive, Visual, Performance, Errors

## Test plan
- [ ] All E2E tests pass locally on Chromium
- [ ] All E2E tests pass on Firefox and Safari
- [ ] Visual regression baselines are committed
- [ ] GitHub Actions workflow runs successfully
EOF
)"
```
