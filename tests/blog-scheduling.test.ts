import assert from "node:assert/strict";
import test from "node:test";

import { isBlogPostPublishable } from "../src/lib/blog";
import { BlogPostFrontmatterSchema } from "../src/lib/schemas";

const BASE_FRONTMATTER = {
  title: "Scheduling Test",
  slug: "scheduling-test",
  excerpt: "Temporary scheduling test post.",
  authorId: "1",
  tags: ["Scheduling", "Test"],
  published: true,
};

test("should accept date-only and timezone-aware frontmatter dates", () => {
  assert.doesNotThrow(() =>
    BlogPostFrontmatterSchema.parse({
      ...BASE_FRONTMATTER,
      date: "2026-05-21",
    }),
  );

  assert.doesNotThrow(() =>
    BlogPostFrontmatterSchema.parse({
      ...BASE_FRONTMATTER,
      date: "2026-05-21T09:00:00-05:00",
    }),
  );

  assert.doesNotThrow(() =>
    BlogPostFrontmatterSchema.parse({
      ...BASE_FRONTMATTER,
      date: "2026-05-21T14:00:00Z",
    }),
  );
});

test("should reject timezone-less datetime frontmatter dates", () => {
  assert.throws(
    () =>
      BlogPostFrontmatterSchema.parse({
        ...BASE_FRONTMATTER,
        date: "2026-05-21T09:00:00",
      }),
    /date/,
  );
});

test("should show a published blog post once its date-only frontmatter date has been met", () => {
  const isPublishable = isBlogPostPublishable(
    { ...BASE_FRONTMATTER, date: "2026-05-21" },
    new Date("2026-05-21T00:00:00Z"),
  );

  assert.equal(isPublishable, true);
});

test("should hide published blog posts with future frontmatter dates", () => {
  const isPublishable = isBlogPostPublishable(
    { ...BASE_FRONTMATTER, date: "9999-01-01" },
    new Date("2026-05-21T00:00:00Z"),
  );

  assert.equal(isPublishable, false);
});

test("should use explicit timezone offsets for datetime scheduling", () => {
  const frontmatter = {
    ...BASE_FRONTMATTER,
    date: "2026-05-21T09:00:00-05:00",
  };

  assert.equal(
    isBlogPostPublishable(frontmatter, new Date("2026-05-21T13:59:59Z")),
    false,
  );
  assert.equal(
    isBlogPostPublishable(frontmatter, new Date("2026-05-21T14:00:00Z")),
    true,
  );
});
