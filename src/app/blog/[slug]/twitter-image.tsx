import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Volvox Blog Post";

/**
 * Creates a fallback image when post data cannot be loaded.
 * Displays generic Volvox Blog branding.
 */
function createFallbackImage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        backgroundImage: "linear-gradient(to bottom right, #0a0a0a, #1a1a2e)",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: "bold",
          color: "#3b82f6",
          marginBottom: 24,
        }}
      >
        VOLVOX
      </div>
      <div
        style={{
          fontSize: 36,
          color: "#a1a1aa",
        }}
      >
        Blog
      </div>
    </div>
  );
}

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

  try {
    const { frontmatter } = await getPostBySlug(slug);

    if (!frontmatter) {
      return new ImageResponse(createFallbackImage(), { ...size });
    }

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
            backgroundImage:
              "linear-gradient(to bottom right, #0a0a0a, #1a1a2e)",
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
  } catch {
    return new ImageResponse(createFallbackImage(), { ...size });
  }
}
