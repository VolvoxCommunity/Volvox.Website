import {
  generateBlogPostSocialImage,
  getLogoData,
  getBlogBannerData,
} from "@/lib/social-images";
import { getPostBySlug } from "@/lib/blog";

// Use Node.js runtime to access file system
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Blog Post";

/**
 * Generates a dynamic OpenGraph image for each blog post.
 * Features post title, author name, date, optional banner image, and Volvox branding
 * with a gradient background and enhanced visual design.
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
  const post = await getPostBySlug(slug).catch(() => null);
  const logoData = getLogoData();

  // Get banner data if the post has a banner
  const bannerData = post?.frontmatter.banner
    ? getBlogBannerData(post.frontmatter.banner)
    : null;

  const frontmatter = post
    ? {
        ...post.frontmatter,
        author: post.frontmatter.author
          ? { name: post.frontmatter.author.name }
          : undefined,
        bannerData,
      }
    : null;

  return generateBlogPostSocialImage(frontmatter, logoData);
}
