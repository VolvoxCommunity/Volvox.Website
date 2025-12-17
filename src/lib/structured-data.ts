import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_URL,
} from "./constants";

/**
 * Schema.org Organization structured data for Volvox.
 * Used on all pages to establish brand identity in search results.
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/volvox-logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [TWITTER_URL],
  };
}

/**
 * Minimal blog post data needed for article schema generation.
 * Uses only the fields actually needed for the JSON-LD output.
 */
interface ArticleSchemaInput {
  title: string;
  excerpt: string;
  date: string;
  author?: { name: string } | null;
}

/**
 * Schema.org Article structured data for blog posts.
 * Enables rich snippets in search results with author, date, and description.
 *
 * @param post - Blog post frontmatter with required fields for schema
 * @param slug - The URL slug for the blog post
 * @returns Article schema object for JSON-LD injection
 */
export function generateArticleSchema(post: ArticleSchemaInput, slug: string) {
  const articleUrl = `${SITE_URL}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": post.author ? "Person" : "Organization",
      name: post.author?.name || SITE_NAME,
    },
    datePublished: post.date,
    dateModified: post.date, // Use publication date as modified date (no tracking of edits yet)
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/volvox-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    image: `${articleUrl}/opengraph-image`,
    inLanguage: "en-US",
  };
}

/**
 * Schema.org WebPage structured data for generic pages.
 *
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path (e.g., "/privacy")
 * @param datePublished - Optional publication date
 * @param dateModified - Optional modification date
 * @returns WebPage schema object for JSON-LD injection
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  path: string,
  datePublished?: string,
  dateModified?: string
) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/volvox-logo.png`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
