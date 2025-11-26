import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

/**
 * Generates a dynamic sitemap for search engine crawlers.
 * Includes homepage, privacy page, and all published blog posts.
 *
 * @returns Array of sitemap entries with URLs, modification dates, and priorities
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getAllPosts();

    const blogUrls = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
      ...blogUrls,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return minimal sitemap on error to avoid complete failure
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];
  }
}
