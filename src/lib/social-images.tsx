import { ImageResponse } from "next/og";

/** Standard image size for social media images */
const IMAGE_SIZE = { width: 1200, height: 630 };

/** Shape of blog post frontmatter returned by the API */
interface BlogFrontmatter {
  title: string;
  excerpt?: string;
  date: string;
  author?: {
    name: string;
  };
  banner?: string;
}

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
 * Fetches JetBrains Mono font in TTF format from Google Fonts.
 * Uses a legacy user agent to request TTF instead of WOFF2.
 */
async function fetchJetBrainsMonoFont(): Promise<ArrayBuffer | null> {
  try {
    // Use a user agent that triggers TTF response from Google Fonts
    const fontCssResponse = await fetch(
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap",
      {
        headers: {
          // Safari 5 user agent to get TTF format
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      }
    );
    const fontCss = await fontCssResponse.text();

    // Extract the font URL from the CSS
    const fontUrlMatch = fontCss.match(/src: url\(([^)]+)\)/);
    if (fontUrlMatch?.[1]) {
      const fontUrl = fontUrlMatch[1];
      return await fetch(fontUrl).then((res) => res.arrayBuffer());
    }
  } catch (e) {
    console.error("Failed to fetch JetBrains Mono font", e);
  }
  return null;
}

/**
 * Creates a fallback image when post data cannot be loaded.
 * Displays generic Volvox Blog branding.
 */
function createFallbackImage(logoData?: ArrayBuffer) {
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
      }}
    >
      {logoData ? (
        <img
          src={logoData as unknown as string}
          width={120}
          height={120}
          style={{ marginBottom: 24 }}
        />
      ) : (
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#3b82f6",
          }}
        >
          VOLVOX
        </div>
      )}
      <div
        style={{
          fontSize: 36,
          color: "#a1a1aa",
          marginTop: logoData ? 0 : 24,
        }}
      >
        Blog
      </div>
    </div>
  );
}

/**
 * Generates a dynamic social image for a blog post.
 * Fetches post data and renders title, author, and date with logo and custom font.
 * Falls back to generic branding if post cannot be loaded.
 *
 * @param slug - The blog post slug
 * @returns ImageResponse with post-specific social preview image
 */
export async function generateBlogPostSocialImage(slug: string) {
  const baseUrl = getBaseUrl();

  // Fetch logo and font in parallel
  const [logoResponse, fontData] = await Promise.all([
    fetch(`${baseUrl}/logo.png`)
      .then((res) => res.arrayBuffer())
      .catch(() => null),
    fetchJetBrainsMonoFont(),
  ]);

  try {
    // Fetch post data from API to avoid fs usage in Edge runtime
    const response = await fetch(`${baseUrl}/api/blog/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const frontmatter = (await response.json()) as BlogFrontmatter;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "#0a0a0a",
          fontFamily: fontData ? '"JetBrains Mono"' : "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            {frontmatter.title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#d1d5db",
              lineHeight: 1.4,
              marginTop: 20,
            }}
          >
            {frontmatter.excerpt || "Read more on Volvox Blog"}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
              marginTop: 20,
            }}
          >
            {`By ${frontmatter.author?.name || "Volvox"} · ${frontmatter.date}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {logoResponse && (
            <img
              src={logoResponse as unknown as string}
              width={48}
              height={48}
              style={{ marginRight: 16 }}
            />
          )}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#3b82f6",
            }}
          >
            VOLVOX
          </div>
        </div>
      </div>,
      {
        ...IMAGE_SIZE,
        ...(fontData && {
          fonts: [
            {
              name: "JetBrains Mono",
              data: fontData,
              style: "normal" as const,
              weight: 700 as const,
            },
          ],
        }),
      }
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(createFallbackImage(logoResponse ?? undefined), {
      ...IMAGE_SIZE,
      ...(fontData && {
        fonts: [
          {
            name: "JetBrains Mono",
            data: fontData,
            style: "normal" as const,
            weight: 700 as const,
          },
        ],
      }),
    });
  }
}
