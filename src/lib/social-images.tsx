import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

/** Standard image size for social media images */
const IMAGE_SIZE = { width: 1200, height: 630 };

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
 * Generates a dynamic social image for a blog post.
 * Fetches post data and renders title, author, and date.
 * Falls back to generic branding if post cannot be loaded.
 *
 * @param slug - The blog post slug
 * @returns ImageResponse with post-specific social preview image
 */
export async function generateBlogPostSocialImage(slug: string) {
  try {
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
      IMAGE_SIZE
    );
  } catch {
    return new ImageResponse(createFallbackImage(), IMAGE_SIZE);
  }
}
