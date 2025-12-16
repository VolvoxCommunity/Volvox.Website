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
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixtures use 'use' which is not a React hook
    await use(new AxeBuilder({ page }));
  },

  assertNoConsoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/require-await -- Playwright fixtures use 'use' which is not a React hook
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
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/require-await -- Playwright fixtures use 'use' which is not a React hook
    await use(async () => {
      expect(failures, "Failed network requests").toEqual([]);
    });
  },
});

export { expect };
