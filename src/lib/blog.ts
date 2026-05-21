import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { isBlogPostPublishable, parseBlogPublishDate } from "./blog-dates";
import { getAuthorById } from "./content";
import { reportError } from "./logger";
import { BlogPostFrontmatterSchema } from "./schemas";
import type { BlogPost } from "./types";
import { normalizeSlug } from "./validation";
import {
  getPostViews,
  getPostViewsBatch,
  incrementPostViews as incrementViews,
} from "./views";

export { isBlogPostPublishable } from "./blog-dates";

type BlogPostFrontmatter = ReturnType<typeof BlogPostFrontmatterSchema.parse>;
type GetAllPostsOptions = {
  includeViews?: boolean;
};

class PostUnavailableError extends Error {
  constructor(slug: string) {
    super(`Post not found: ${slug}`);
    this.name = "PostUnavailableError";
  }
}

/**
 * Calculates estimated reading time based on word count.
 * Returns a whole number of minutes, minimum 1.
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

function isContentPostPublishable(
  frontmatter: BlogPostFrontmatter,
  now = new Date(),
): boolean {
  try {
    return isBlogPostPublishable(frontmatter, now);
  } catch (error) {
    reportError(`Invalid blog post date: ${frontmatter.slug}`, error);
    return false;
  }
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Fetches all available blog posts ordered by date (newest first).
 *
 * @returns A list of published posts whose scheduled date has been met.
 */
export async function getAllPosts(
  options: GetAllPostsOptions = {},
): Promise<BlogPost[]> {
  try {
    const includeViews = options.includeViews ?? true;

    // Read all MDX files from content/blog
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
    const now = new Date();

    // Simulate async operation
    await Promise.resolve();

    const postsData: Array<{
      frontmatter: BlogPostFrontmatter;
      content: string;
      author: ReturnType<typeof getAuthorById>;
    }> = [];

    for (const file of files) {
      try {
        const filePath = path.join(BLOG_DIR, file);
        const fileContents = fs.readFileSync(filePath, "utf8");

        // Parse frontmatter
        const { data, content } = matter(fileContents);

        // Validate frontmatter with Zod
        const frontmatter = BlogPostFrontmatterSchema.parse(data);

        // Only include posts that are published and past their scheduled date
        if (!isContentPostPublishable(frontmatter, now)) {
          continue;
        }

        // Get author details
        const author = getAuthorById(frontmatter.authorId);

        postsData.push({ frontmatter, content, author });
      } catch (error) {
        reportError(`Failed to load blog post file: ${file}`, error);
      }
    }

    // Fetch views for all posts in batch
    const slugs = postsData.map((p) => p.frontmatter.slug);
    const viewsMap = includeViews ? await getPostViewsBatch(slugs) : new Map();

    const posts: BlogPost[] = postsData.map(
      ({ frontmatter, content, author }) => ({
        id: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
        slug: frontmatter.slug,
        views: viewsMap.get(frontmatter.slug) ?? 0,
        readingTime: calculateReadingTime(content),
        published: frontmatter.published,
        banner: frontmatter.banner,
      }),
    );

    // Sort by date (newest first)
    posts.sort(
      (a, b) =>
        parseBlogPublishDate(b.date).timestamp -
        parseBlogPublishDate(a.date).timestamp,
    );

    return posts;
  } catch (error) {
    reportError("Failed to fetch blog posts", error);
    return [];
  }
}

/**
 * Retrieves a single blog post by its slug.
 *
 * @param slug - The URL slug of the post to retrieve.
 * @returns An object containing the post's frontmatter, content, slug, and view count.
 * @throws If the slug is invalid or the post does not exist.
 */
export async function getPostBySlug(slug: string) {
  // Validate slug first - fail fast without logging as system error
  const validSlug = normalizeSlug(slug);
  if (!validSlug) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  try {
    await Promise.resolve();

    const filePath = path.join(BLOG_DIR, `${validSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
      throw new PostUnavailableError(slug);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = BlogPostFrontmatterSchema.parse(data);

    if (!isBlogPostPublishable(frontmatter)) {
      throw new PostUnavailableError(slug);
    }

    // Get author details
    const author = getAuthorById(frontmatter.authorId);

    // Fetch view count for this post
    const views = await getPostViews(validSlug);

    return {
      frontmatter: {
        id: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
        banner: frontmatter.banner,
      },
      content,
      slug: frontmatter.slug,
      views,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    if (error instanceof PostUnavailableError) {
      throw error;
    }

    reportError(`Failed to fetch post: ${slug}`, error);
    throw new Error(`Post not found: ${slug}`);
  }
}

/**
 * Retrieves all available blog slugs.
 *
 * @returns Slugs for published posts whose scheduled date has been met.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    await Promise.resolve();
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
    const now = new Date();

    const slugs: string[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(BLOG_DIR, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);

        // Validate frontmatter
        const frontmatter = BlogPostFrontmatterSchema.parse(data);

        // Only include posts that are published and past their scheduled date
        if (isContentPostPublishable(frontmatter, now)) {
          slugs.push(frontmatter.slug);
        }
      } catch (error) {
        reportError(`Failed to load blog post slug from file: ${file}`, error);
      }
    }

    return slugs;
  } catch (error) {
    reportError("Error fetching post slugs", error);
    return [];
  }
}

/**
 * Increments the view counter for a given blog slug.
 *
 * @param slug - Slug to increment.
 * @returns The new view count, or -1 if the operation failed.
 */
export async function incrementPostViews(slug: string): Promise<number> {
  return incrementViews(slug);
}
