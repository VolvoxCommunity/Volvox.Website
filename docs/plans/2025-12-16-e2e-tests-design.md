# Comprehensive E2E Test Suite Design

**Date:** 2025-12-16
**Status:** Approved
**Estimated Tests:** ~107

## Overview

A comprehensive Playwright E2E test suite covering all pages, features, accessibility, SEO, responsive design, visual regression, performance, and error states.

## Key Decisions

| Decision           | Choice                                           |
| ------------------ | ------------------------------------------------ |
| Coverage Level     | Full coverage including edge cases               |
| Browsers           | Chromium, Firefox, Safari + Mobile Chrome/Safari |
| File Organization  | Hybrid (pages + features)                        |
| Accessibility      | Automated with @axe-core/playwright              |
| Visual Regression  | Screenshot comparisons (Chromium only)           |
| Performance        | Load times, console errors, network failures     |
| Test Data Strategy | Structure-based, not content-specific            |
| CI/CD              | GitHub Actions with 4 parallel shards            |
| Error States       | 404s, error boundaries, resource failures        |

## Test Structure

```text
e2e/
├── fixtures/
│   └── base.fixture.ts         # Extended test fixture with axe, helpers
├── pages/
│   ├── homepage.spec.ts        # Hero, all sections, scroll behavior
│   ├── blog-list.spec.ts       # Blog section on homepage
│   ├── blog-post.spec.ts       # Individual post: MDX, TOC, reading progress
│   ├── products-list.spec.ts   # Products listing page
│   ├── product-detail.spec.ts  # Individual product pages
│   ├── privacy.spec.ts         # Privacy policy content
│   └── terms.spec.ts           # Terms of service content
├── features/
│   ├── navigation.spec.ts      # Desktop nav, mobile menu, active states
│   ├── theme.spec.ts           # Dark/light toggle, localStorage persistence
│   ├── cookie-consent.spec.ts  # Banner display, accept/reject, persistence
│   └── footer.spec.ts          # Links, social icons, confetti on Discord
├── accessibility.spec.ts       # axe-core scans on all pages
├── seo.spec.ts                 # Meta tags, OG images, canonical URLs
├── responsive.spec.ts          # Mobile/tablet/desktop layout checks
├── visual.spec.ts              # Screenshot comparisons
├── performance.spec.ts         # Load times, console errors, network failures
└── errors.spec.ts              # 404 pages, error boundaries, resource failures
```

## Test Count Breakdown

| Category          | Files        | Est. Tests     |
| ----------------- | ------------ | -------------- |
| Page tests        | 7 files      | ~25 tests      |
| Feature tests     | 4 files      | ~15 tests      |
| Accessibility     | 1 file       | ~8 tests       |
| SEO               | 1 file       | ~10 tests      |
| Responsive        | 1 file       | ~10 tests      |
| Visual regression | 1 file       | ~12 tests      |
| Performance       | 1 file       | ~15 tests      |
| Error states      | 1 file       | ~12 tests      |
| **Total**         | **17 files** | **~107 tests** |

## Playwright Configuration

```typescript
import { defineConfig, devices } from "@playwright/test";

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

## Base Test Fixture

```typescript
import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type TestFixtures = {
  axe: AxeBuilder;
  assertNoConsoleErrors: () => Promise<void>;
  assertNoFailedRequests: () => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  axe: async ({ page }, use) => {
    await use(new AxeBuilder({ page }));
  },

  assertNoConsoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await use(async () => {
      expect(errors, "Console errors found").toEqual([]);
    });
  },

  assertNoFailedRequests: async ({ page }, use) => {
    const failures: string[] = [];
    page.on("response", (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
    });
    await use(async () => {
      expect(failures, "Failed network requests").toEqual([]);
    });
  },
});

export { expect };
```

## GitHub Actions CI

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

## Required data-testid Attributes

### Navigation (`src/components/navigation.tsx`)

- `data-testid="desktop-nav"` - Desktop navigation container
- `data-testid="mobile-menu-button"` - Hamburger menu button
- `data-testid="mobile-menu"` - Mobile menu panel

### Theme (`src/components/theme-toggle.tsx`)

- `data-testid="theme-toggle"` - Theme toggle button

### Cookie Consent (`src/components/cookie-consent-banner.tsx`)

- `data-testid="cookie-consent-banner"` - Banner container

### Homepage Sections

- `data-testid="hero-section"` - Hero component
- `data-testid="products-section"` - Products component
- `data-testid="blog-section"` - Blog component
- `data-testid="mentorship-section"` - Mentorship component
- `data-testid="about-section"` - About component

### Blog (`src/components/blog/*.tsx`)

- `data-testid="blog-card"` - Each blog post card
- `data-testid="blog-post-header"` - Post header component
- `data-testid="blog-content"` - MDX content wrapper
- `data-testid="table-of-contents"` - TOC component
- `data-testid="reading-progress"` - Progress bar
- `data-testid="back-to-posts"` - Back button
- `data-testid="author-name"` - Author display

### Products

- `data-testid="product-card"` - Each product card

### Footer (`src/components/footer.tsx`)

- `data-testid="footer"` - Footer container

## Dependencies to Add

```bash
pnpm add -D @axe-core/playwright
```

## Implementation Order

1. Add `@axe-core/playwright` dependency
2. Update `playwright.config.ts`
3. Create `e2e/fixtures/base.fixture.ts`
4. Add `data-testid` attributes to components
5. Create page test files
6. Create feature test files
7. Create cross-cutting test files (a11y, SEO, responsive, visual, performance, errors)
8. Create `.github/workflows/e2e.yml`
9. Generate visual regression baselines
10. Run full test suite and fix any issues
