import { generateBlogPostSocialImage, getLogoData } from "@/lib/social-images";
import { getPostBySlug } from "@/lib/blog";

// Use Node.js runtime to access file system
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Blog Post";

/**
 * Generates a dynamic OpenGraph image for each blog post.
 * Displays post title, author name, date, and Volvox branding.
 * Falls back to generic branding if post data cannot be loaded.
 *
 * @param params - Route parameters containing the blog post slug
 * @returns ImageResponse with post-specific social preview image
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
  ]);
  const logoData = getLogoData();

  const frontmatter = post
    ? {
        ...post.frontmatter,
        author: post.frontmatter.author
          ? { name: post.frontmatter.author.name }
          : undefined,
      }
    : null;

  return generateBlogPostSocialImage(frontmatter, logoData);
}
