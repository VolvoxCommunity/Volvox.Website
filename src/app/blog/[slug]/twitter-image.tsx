import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generates dynamic alt text for blog post Twitter card image.
 * Includes the actual post title for better accessibility and SEO.
 *
 * @param paramsPromise - Route parameters containing the blog post slug
 * @returns Alt text string with post title
 */
export async function alt(paramsPromise: Promise<{ slug: string }>) {
  const { slug } = await paramsPromise;
  const { frontmatter } = await getPostBySlug(slug);
  return `${frontmatter.title} - Volvox Blog`;
}

/**
 * Generates a dynamic Twitter card image for each blog post.
 * Identical to OpenGraph image for consistent social sharing.
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
  const { frontmatter } = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "#0a0a0a",
          backgroundImage: "linear-gradient(to bottom right, #0a0a0a, #1a1a2e)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: "bold",
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: 1000,
            }}
          >
            {frontmatter.title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
            }}
          >
            By {frontmatter.author?.name || "Volvox"} · {frontmatter.date}
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#3b82f6",
          }}
        >
          VOLVOX
        </div>
      </div>
    ),
    { ...size }
  );
}
