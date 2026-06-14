import assert from "node:assert/strict";
import test from "node:test";

import {
  generateArticleSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
} from "../src/lib/structured-data";

const LOGO_PATH = "/logo.png";

test("structured data references the logo asset that exists in public", () => {
  const organizationSchema = generateOrganizationSchema();
  const articleSchema = generateArticleSchema(
    {
      title: "Test Article",
      excerpt: "Test excerpt",
      date: "2026-01-01",
      author: { name: "Bill Chirico" },
    },
    "test-article",
  );
  const webPageSchema = generateWebPageSchema(
    "Privacy",
    "Privacy policy",
    "/privacy",
  );

  assert.ok(organizationSchema.logo.endsWith(LOGO_PATH));
  assert.ok(articleSchema.publisher.logo.url.endsWith(LOGO_PATH));
  assert.ok(webPageSchema.publisher.logo.url.endsWith(LOGO_PATH));
});
