import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllExtendedProducts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

// Force Node.js runtime since blog.ts uses fs/path APIs
export const runtime = "nodejs";

// Use a constant timestamp for static pages to prevent unnecessary re-crawling
const BUILD_TIME = new Date();

// Static routes that don't change often
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: BUILD_TIME,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/privacy`,
    lastModified: BUILD_TIME,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

/**
 * Generates a dynamic sitemap for search engine crawlers.
 * Includes homepage, privacy page, individual product pages, and all published blog posts.
 *
 * @returns Array of sitemap entries with URLs, modification dates, and priorities
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getAllPosts();
    const products = getAllExtendedProducts();

    const blogUrls = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Individual product pages
    const productUrls = products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...STATIC_ROUTES, ...productUrls, ...blogUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return minimal sitemap on error to avoid complete failure
    return STATIC_ROUTES;
  }
}
