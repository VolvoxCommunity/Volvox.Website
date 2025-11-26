/**
 * Schema.org Organization structured data for Volvox.
 * Used on all pages to establish brand identity in search results.
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Volvox",
    url: "https://volvoxdev.com",
    logo: "https://volvoxdev.com/volvox-logo.png",
    description:
      "Building great software while fostering the next generation of developers through mentorship and open source.",
    sameAs: ["https://twitter.com/VolvoxLLC"],
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
  const articleUrl = `https://volvoxdev.com/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Volvox",
    },
    datePublished: post.date,
    dateModified: post.date, // Use publication date as modified date (no tracking of edits yet)
    publisher: {
      "@type": "Organization",
      name: "Volvox",
      logo: {
        "@type": "ImageObject",
        url: "https://volvoxdev.com/volvox-logo.png",
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
