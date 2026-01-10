import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllExtendedProducts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

// Force Node.js runtime since blog.ts uses fs/path APIs
export const runtime = "nodejs";

/**
 * Generates a dynamic sitemap for search engine crawlers.
 * Includes all pages with proper priorities, change frequencies, and images for SEO.
 *
 * Priority hierarchy:
 * - Homepage: 1.0 (most important)
 * - Products listing: 0.9
 * - Individual products: 0.8
 * - Blog posts: 0.7
 * - Legal pages: 0.3
 *
 * @returns Array of sitemap entries with URLs, modification dates, priorities, and images
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const posts = await getAllPosts();
    const products = getAllExtendedProducts();

    // Blog posts with banner images for image sitemap
    const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
      // Include banner image if available (helps with Google Image Search)
      ...(post.banner && {
        images: [`${SITE_URL}${post.banner}`],
      }),
    }));

    // Product pages with hero images
    const productUrls: MetadataRoute.Sitemap = products.map((product) => {
      const heroImage = product.screenshots?.[0];
      return {
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        // Include hero image if available
        ...(heroImage && {
          images: [`${SITE_URL}/images/product/${product.slug}/${heroImage}`],
        }),
      };
    });

    return [...staticRoutes, ...productUrls, ...blogUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes on error to avoid complete failure
    return staticRoutes;
  }
}
