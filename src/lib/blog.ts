import { reportError } from "./logger";
import { supabase } from "./supabase";
import { BlogPost } from "./types";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Fetches all published blog posts ordered by date (newest first).
 *
 * @returns A list of published `BlogPost` objects.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        date,
        tags,
        read_time,
        views,
        published,
        author:authors (
          id,
          name,
          role,
          avatar
        )
      `
      )
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(
      (post) =>
        ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          date: post.date,
          tags: post.tags || [],
          readTime: post.read_time,
          slug: post.slug,
          views: post.views || 0,
          published: post.published || false,
        }) satisfies BlogPost
    );
  } catch (error) {
    reportError("Failed to fetch blog posts", error);

    if (!isProduction) {
      throw error instanceof Error ? error : new Error(String(error));
    }

    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      date,
      tags,
      read_time,
      views,
      published,
      author:authors (
        id,
        name,
        role,
        avatar
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new Error(`Post not found: ${slug}`);
  }

  return {
    frontmatter: {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      date: data.date,
      tags: data.tags || [],
      readTime: data.read_time,
    },
    content: data.content,
    slug: data.slug,
    views: data.views || 0,
  };
}

/**
 * Retrieves all published blog slugs.
 *
 * @returns Array of slug strings.
 */
export async function getPostSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);

  if (error) {
    reportError("Error fetching post slugs", error);
    return [];
  }

  return data?.map((post) => post.slug) || [];
}

/**
 * Increments the view counter for a given blog slug.
 *
 * @param slug - Slug to increment.
 */
export async function incrementPostViews(slug: string): Promise<boolean> {
  const { error } = await supabase.rpc("increment_post_views", {
    post_slug: slug,
  });

  if (error) {
    reportError("Error incrementing post views", error);
    return false;
  }

  return true;
}
