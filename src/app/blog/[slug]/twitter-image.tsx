import { generateBlogPostSocialImage } from "@/lib/social-images";

// These must be static literals for Next.js static analysis
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Blog Post";

/**
 * Generates a dynamic Twitter card image for each blog post.
 * Identical to OpenGraph image for consistent social sharing.
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
  return generateBlogPostSocialImage(slug);
}
