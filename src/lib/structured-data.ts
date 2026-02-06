import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_URL,
  GITHUB_URL,
  DISCORD_URL,
  LINKEDIN_URL,
  YOUTUBE_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
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
    sameAs: [
      TWITTER_URL,
      GITHUB_URL,
      DISCORD_URL,
      LINKEDIN_URL,
      YOUTUBE_URL,
      INSTAGRAM_URL,
      TIKTOK_URL,
    ],
  };
}

/**
 * Schema.org WebSite structured data with SearchAction.
 * Enables the Google sitelinks search box in search results.
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema.org BreadcrumbList structured data for navigation hierarchy.
 * Helps search engines understand the site structure and display breadcrumbs in results.
 *
 * @param items - Ordered array of breadcrumb items with name and URL
 * @returns BreadcrumbList schema object for JSON-LD injection
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Minimal product data needed for SoftwareApplication schema generation.
 */
interface SoftwareApplicationSchemaInput {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  screenshots: string[];
  links: {
    appStore?: string;
    playStore?: string;
    github?: string;
    demo?: string;
  };
}

/**
 * Schema.org SoftwareApplication structured data for product pages.
 * Enables rich product snippets in search results with application details.
 *
 * @param product - Extended product data with links and screenshots
 * @returns SoftwareApplication schema object for JSON-LD injection
 */
export function generateSoftwareApplicationSchema(
  product: SoftwareApplicationSchemaInput
) {
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const operatingSystems: string[] = [];

  if (product.links.appStore) operatingSystems.push("iOS");
  if (product.links.playStore) operatingSystems.push("Android");
  if (product.links.demo || product.links.github) operatingSystems.push("Web");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: productUrl,
    applicationCategory: "DeveloperApplication",
    ...(operatingSystems.length > 0 && {
      operatingSystem: operatingSystems.join(", "),
    }),
    ...(product.screenshots.length > 0 && {
      screenshot: product.screenshots.map((s) =>
        s.startsWith("http") ? s : `${SITE_URL}${s}`
      ),
    }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/**
 * Minimal team member data needed for Person schema generation.
 */
interface PersonSchemaInput {
  name: string;
  slug: string;
  tagline: string;
  avatar: string;
  role?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

/**
 * Schema.org Person structured data for team member pages.
 * Enables rich person snippets in search results with profile details.
 *
 * @param member - Team member data with name, role, and social links
 * @returns Person schema object for JSON-LD injection
 */
export function generatePersonSchema(member: PersonSchemaInput) {
  const memberUrl = `${SITE_URL}/team/${member.slug}`;
  const sameAs: string[] = [];

  if (member.githubUrl) sameAs.push(member.githubUrl);
  if (member.linkedinUrl) sameAs.push(member.linkedinUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    description: member.tagline,
    url: memberUrl,
    image: member.avatar.startsWith("http")
      ? member.avatar
      : `${SITE_URL}${member.avatar}`,
    ...(member.role && { jobTitle: member.role }),
    ...(sameAs.length > 0 && { sameAs }),
    memberOf: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
