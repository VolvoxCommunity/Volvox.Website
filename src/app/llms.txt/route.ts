import { z } from "zod";
import { getAllPosts } from "@/lib/blog";
import { getAllProducts } from "@/lib/content";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DISCORD_URL,
  GITHUB_URL,
} from "@/lib/constants";
import { reportError } from "@/lib/logger";
import { ProductsArraySchema } from "@/lib/schemas";
import type { BlogPost, Product } from "@/lib/types";

const MAX_BLOG_POSTS_IN_LLM_TXT = 10;

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

/**
 * Schema for validating blog posts used in llms.txt generation.
 * Only validates the fields needed for content generation.
 */
const LlmsBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  published: z.boolean(),
});

const LlmsBlogPostsArraySchema = z.array(LlmsBlogPostSchema);

/**
 * Generates the products list section for llms.txt content.
 *
 * @param products - Array of validated Product objects
 * @returns Formatted markdown string of products, or fallback message if empty
 */
function generateProductsList(products: Product[]): string {
  if (products.length === 0) {
    return "_Products information temporarily unavailable._";
  }

  return products
    .map(
      (product) =>
        `- [${product.name}](${SITE_URL}/products/${product.id}): ${product.description}`
    )
    .join("\n");
}

/**
 * Generates the blog list section for llms.txt content.
 *
 * @param posts - Array of validated BlogPost objects (already filtered to published)
 * @returns Formatted markdown string of blog posts, or fallback message if empty
 */
function generateBlogList(posts: BlogPost[]): string {
  if (posts.length === 0) {
    return "_Blog posts temporarily unavailable._";
  }

  return posts
    .slice(0, MAX_BLOG_POSTS_IN_LLM_TXT)
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`
    )
    .join("\n");
}

/**
 * Generates the llms.txt content with product and blog information.
 *
 * @param productsList - Formatted products markdown section
 * @param blogList - Formatted blog posts markdown section
 * @returns Complete llms.txt content string
 */
function generateLlmsContent(productsList: string, blogList: string): string {
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} builds great software while fostering the next generation of developers. We pair experienced developers with aspiring programmers through real-world open source projects, providing learning opportunities through hands-on production codebases.

## What We Offer

- **Mentorship Program**: Seasoned developers mentor those starting their journey through real production projects
- **Open Source Development**: All projects are built in the open, providing learning opportunities
- **Developer Community**: Active Discord community for collaboration, code help, and career advice
- **Product Development**: Building useful applications that serve real user needs

## Products

${productsList}

## Blog

${blogList}

## Company

- [About](${SITE_URL}/#about): Learn about ${SITE_NAME}'s mission, story, and the team behind the community
- [Mentorship](${SITE_URL}/#mentorship): Our mentorship program connecting experienced developers with learners
- [Blog](${SITE_URL}/blog): Technical articles, announcements, and community insights
- [Products](${SITE_URL}/products): Software products built by the ${SITE_NAME} community

## Legal

- [Privacy Policy](${SITE_URL}/privacy): How we handle your data and privacy
- [Terms of Service](${SITE_URL}/terms): Terms and conditions for using ${SITE_NAME} services

## Connect

- [Discord Community](${DISCORD_URL}): Join our active developer community
- [GitHub](${GITHUB_URL}): Open source projects and contributions

## Technical Stack

${SITE_URL} is built with:
- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS v4
- MDX for blog content

## Contact

For inquiries about ${SITE_NAME}, mentorship opportunities, or collaboration:
- Visit our Discord community for real-time chat
- Explore our open source projects on GitHub
`;
}

/**
 * GET handler for /llms.txt route.
 *
 * Generates LLM-friendly plain text content about the site with resilient
 * data fetching. Uses Promise.allSettled() to tolerate partial failures
 * and provides fallback content if data sources are unavailable.
 *
 * @returns Plain text response with site information for LLM consumption
 */
export async function GET(): Promise<Response> {
  try {
    // Use Promise.allSettled for resilience against partial failures
    const [productsResult, postsResult] = await Promise.allSettled([
      Promise.resolve(getAllProducts()),
      getAllPosts(),
    ]);

    // Extract products with validation and error reporting
    let products: Product[] = [];
    if (productsResult.status === "fulfilled") {
      try {
        // Runtime validation of products data
        products = ProductsArraySchema.parse(productsResult.value);
      } catch (validationError) {
        reportError("llms.txt: Products validation failed", validationError);
        products = [];
      }
    } else {
      reportError("llms.txt: Failed to load products", productsResult.reason);
    }

    // Extract posts with validation and error reporting
    let posts: BlogPost[] = [];
    if (postsResult.status === "fulfilled") {
      try {
        // Runtime validation of blog posts (validate only fields needed for llms.txt)
        const validatedPosts = LlmsBlogPostsArraySchema.parse(
          postsResult.value
        );
        // Filter to published posts and cast back to BlogPost for type safety
        posts = postsResult.value.filter(
          (_: BlogPost, index: number) =>
            validatedPosts[index]?.published === true
        );
      } catch (validationError) {
        reportError("llms.txt: Blog posts validation failed", validationError);
        posts = [];
      }
    } else {
      reportError("llms.txt: Failed to load blog posts", postsResult.reason);
    }

    // Generate content sections with fallbacks for empty data
    const productsList = generateProductsList(products);
    const blogList = generateBlogList(posts);
    const content = generateLlmsContent(productsList, blogList);

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    // Catch any unexpected errors and return fallback content
    reportError("llms.txt: Unexpected error generating content", error);

    const fallbackContent = generateLlmsContent(
      "_Products information temporarily unavailable._",
      "_Blog posts temporarily unavailable._"
    );

    return new Response(fallbackContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Shorter cache for fallback
      },
    });
  }
}
