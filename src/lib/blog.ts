import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { reportError } from "./logger";
import { BlogPostFrontmatterSchema } from "./schemas";
import { normalizeSlug } from "./validation";
import { getAuthorById } from "./content";
import {
  getPostViews,
  getPostViewsBatch,
  incrementPostViews as incrementViews,
} from "./views";
import type { BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Fetches all published blog posts ordered by date (newest first).
 *
 * @returns A list of published `BlogPost` objects.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Read all MDX files from content/blog
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    // Simulate async operation
    await Promise.resolve();

    const postsData: Array<{
      frontmatter: ReturnType<typeof BlogPostFrontmatterSchema.parse>;
      content: string;
      author: ReturnType<typeof getAuthorById>;
    }> = [];

    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter
      const { data, content } = matter(fileContents);

      // Validate frontmatter with Zod
      const frontmatter = BlogPostFrontmatterSchema.parse(data);

      // Only include published posts
      if (!frontmatter.published) {
        continue;
      }

      // Get author details
      const author = getAuthorById(frontmatter.authorId);

      postsData.push({ frontmatter, content, author });
    }

    // Fetch views for all posts in batch
    const slugs = postsData.map((p) => p.frontmatter.slug);
    const viewsMap = await getPostViewsBatch(slugs);

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
        published: frontmatter.published,
        banner: frontmatter.banner,
      })
    );

    // Sort by date (newest first)
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
      throw new Error(`Post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = BlogPostFrontmatterSchema.parse(data);

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
    };
  } catch (error) {
    reportError(`Failed to fetch post: ${slug}`, error);
    throw new Error(`Post not found: ${slug}`);
  }
}

/**
 * Retrieves all published blog slugs.
 *
 * @returns Array of slug strings.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    await Promise.resolve();
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    const slugs: string[] = [];

    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Validate frontmatter
      const frontmatter = BlogPostFrontmatterSchema.parse(data);

      // Only include published posts
      if (frontmatter.published) {
        slugs.push(frontmatter.slug);
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
