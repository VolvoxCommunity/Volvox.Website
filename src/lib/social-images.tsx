import { ImageResponse } from "next/og";

/** Standard image size for social media images */
const IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Determines the base URL for the current environment.
 * Prefers VERCEL_URL in production/preview, falls back to localhost.
 */
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Creates a fallback image when post data cannot be loaded.
 * Displays generic Volvox Blog branding.
 */
function createFallbackImage(bannerImageData?: ArrayBuffer) {
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
        position: "relative",
      }}
    >
      {/* Background Image */}
      {bannerImageData && (
        <img
          src={bannerImageData as any}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.3,
          }}
        />
      )}

      <div
        style={{
          fontSize: 80,
          fontWeight: "bold",
          color: "#3b82f6",
          marginBottom: 24,
          zIndex: 10,
        }}
      >
        VOLVOX
      </div>
      <div
        style={{
          fontSize: 36,
          color: "#a1a1aa",
          zIndex: 10,
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
  const baseUrl = getBaseUrl();
  let bannerImageData: ArrayBuffer | undefined;

  try {
    // Fetch banner image independently so it can be used in fallback
    try {
      bannerImageData = await fetch(
        new URL(`${baseUrl}/banner.jpg`)
      ).then((res) => res.arrayBuffer());
    } catch (e) {
      console.error("Failed to fetch banner image", e);
    }

    // Fetch post data from API to avoid fs usage in Edge runtime
    const response = await fetch(`${baseUrl}/api/blog/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const frontmatter = await response.json();

    // Fetch Inter font
    const fontData = await fetch(
      new URL("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.woff", import.meta.url)
    ).then((res) => res.arrayBuffer());

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
            fontFamily: '"Inter"',
            position: "relative",
          }}
        >
          {/* Background Image */}
          {bannerImageData && (
            <img
              src={bannerImageData as any}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.3, // Darken it a bit so text pops
              }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16, zIndex: 10 }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.1,
                maxWidth: 1000,
              }}
            >
              {frontmatter.title}
            </div>
            {frontmatter.excerpt && (
              <div
                style={{
                  fontSize: 32,
                  color: "#d1d5db",
                  lineHeight: 1.4,
                  maxWidth: 1000,
                }}
              >
                {frontmatter.excerpt}
              </div>
            )}
            <div
              style={{
                fontSize: 24,
                color: "#a1a1aa",
                marginTop: 8,
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
              zIndex: 10,
            }}
          >
            VOLVOX
          </div>
        </div>
      ),
      {
        ...IMAGE_SIZE,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(createFallbackImage(bannerImageData), IMAGE_SIZE);
  }
}
