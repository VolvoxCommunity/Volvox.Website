import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import test, { after } from "node:test";

const ORIGINAL_NEXT_RUNTIME = process.env.NEXT_RUNTIME;

process.env.NEXT_RUNTIME = "";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const AVAILABLE_SLUG = "codex-test-scheduled-available";
const FUTURE_SLUG = "codex-test-scheduled-future";
const TEST_SLUGS = [AVAILABLE_SLUG, FUTURE_SLUG];
const AVAILABLE_DATE = new Date().toISOString().slice(0, 10);
const FUTURE_DATE = "9999-01-01";

function removeTemporaryPosts(): void {
  for (const slug of TEST_SLUGS) {
    fs.rmSync(path.join(BLOG_DIR, `${slug}.mdx`), { force: true });
  }
}

function restoreNextRuntime(): void {
  if (ORIGINAL_NEXT_RUNTIME === undefined) {
    delete process.env.NEXT_RUNTIME;
    return;
  }

  process.env.NEXT_RUNTIME = ORIGINAL_NEXT_RUNTIME;
}

function writeTemporaryPost(slug: string, date: string): void {
  const title = `Scheduling Test ${slug}`;
  const content = `---
title: "${title}"
slug: "${slug}"
excerpt: "Temporary scheduling test post."
authorId: "1"
date: "${date}"
banner: "/images/blog/announcing-volvox.png"
tags: ["Scheduling", "Test"]
published: true
---

This temporary post exists only while the blog scheduling tests run.
`;

  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.mdx`), content, "utf8");
}

async function loadBlogModule(): Promise<typeof import("../src/lib/blog")> {
  return import("../src/lib/blog");
}

removeTemporaryPosts();
writeTemporaryPost(AVAILABLE_SLUG, AVAILABLE_DATE);
writeTemporaryPost(FUTURE_SLUG, FUTURE_DATE);

after(() => {
  removeTemporaryPosts();
  restoreNextRuntime();
});

test("should show a published blog post once its frontmatter date has been met", async () => {
  const { getPostBySlug } = await loadBlogModule();
  const post = await getPostBySlug(AVAILABLE_SLUG);

  assert.equal(post.slug, AVAILABLE_SLUG);
});

test("should hide published blog posts with future frontmatter dates from listings", async () => {
  const { getAllPosts } = await loadBlogModule();
  const posts = await getAllPosts();
  const slugs = posts.map((post) => post.slug);

  assert.equal(slugs.includes(AVAILABLE_SLUG), true);
  assert.equal(slugs.includes(FUTURE_SLUG), false);
});

test("should exclude published blog posts with future frontmatter dates from static slugs", async () => {
  const { getPostSlugs } = await loadBlogModule();
  const slugs = await getPostSlugs();

  assert.equal(slugs.includes(AVAILABLE_SLUG), true);
  assert.equal(slugs.includes(FUTURE_SLUG), false);
});

test("should reject direct access to published blog posts with future frontmatter dates", async () => {
  const { getPostBySlug } = await loadBlogModule();
  await assert.rejects(() => getPostBySlug(FUTURE_SLUG), /Post not found/);
});
