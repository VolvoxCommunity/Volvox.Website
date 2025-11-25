import { BlogPost } from "./types";

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
 * Schema.org Article structured data for blog posts.
 * Enables rich snippets in search results with author, date, and description.
 *
 * @param post - Blog post data including frontmatter with author info
 * @returns Article schema object for JSON-LD injection
 */
export function generateArticleSchema(
  post: BlogPost & { author?: { name: string } }
) {
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
    publisher: {
      "@type": "Organization",
      name: "Volvox",
      logo: {
        "@type": "ImageObject",
        url: "https://volvoxdev.com/volvox-logo.png",
      },
    },
    url: `https://volvoxdev.com/blog/${post.slug}`,
    image: `https://volvoxdev.com/blog/${post.slug}/opengraph-image`,
  };
}
