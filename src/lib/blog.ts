import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { reportError } from "./logger";
import { BlogPostFrontmatterSchema } from "./schemas";
import { getAuthorById } from "./content";
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

    const posts: BlogPost[] = [];

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

      posts.push({
        id: frontmatter.slug, // Use slug as ID
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
        slug: frontmatter.slug,
        views: 0, // No longer tracking views
        published: frontmatter.published,
      });
    }

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

export async function getPostBySlug(slug: string) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = BlogPostFrontmatterSchema.parse(data);

    // Get author details
    const author = getAuthorById(frontmatter.authorId);

    return {
      frontmatter: {
        id: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
      },
      content,
      slug: frontmatter.slug,
      views: 0, // No longer tracking views
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
 * @deprecated View tracking removed - this is a no-op stub for backward compatibility
 * @param slug - Slug to increment.
 */
export async function incrementPostViews(slug: string): Promise<boolean> {
  // No-op: View tracking has been removed
  // This stub remains temporarily for backward compatibility
  // Will be removed in Task 7
  return true;
}
