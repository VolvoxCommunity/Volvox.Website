import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Generates robots.txt configuration for search engine crawlers.
 * Allows legitimate pages and explicitly blocks spam/invalid paths.
 *
 * @returns Robots.txt configuration object
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Block known spam paths and patterns that have been indexed
      disallow: [
        "/join/", // Spam URLs like /join/69349
        "/api/", // API routes should not be indexed
        "/_next/", // Next.js internal routes
        "/monitoring", // Sentry tunnel route
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
