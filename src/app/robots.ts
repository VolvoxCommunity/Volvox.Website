import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Generates robots.txt configuration for search engine crawlers.
 * Allows all user agents to crawl all pages and points to sitemap.
 *
 * @returns Robots.txt configuration object
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
