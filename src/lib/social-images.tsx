/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import * as fs from "fs";
import * as path from "path";

/** Standard image size for social media images */
const IMAGE_SIZE = { width: 1200, height: 630 };

/** Shape of blog post frontmatter returned by the API */
export interface BlogFrontmatter {
  title: string;
  excerpt?: string;
  date: string;
  author?: {
    name: string;
  };
  banner?: string;
  tags?: string[];
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
 * Reads the logo file from the public directory.
 */
export function getLogoData(): ArrayBuffer | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      return fs.readFileSync(logoPath).buffer;
    }
  } catch (e) {
    console.error("Failed to read logo file", e);
  }
  return null;
}

/**
 * Creates a fallback image when post data cannot be loaded.
 * Displays generic Volvox Blog branding.
 */
export function createFallbackImage(logoData?: ArrayBuffer | null) {
  // Convert ArrayBuffer to base64 string for img src if present
  const logoSrc = logoData
    ? `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`
    : null;

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
      {logoSrc ? (
        <img
          src={logoSrc}
          width={120}
          height={120}
          style={{ marginBottom: 24 }}
          alt="Volvox logo"
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
          marginTop: logoSrc ? 0 : 24,
        }}
      >
        Blog
      </div>
    </div>
  );
}

/**
 * Generates a dynamic social image for a blog post.
 *
 * @param frontmatter - The blog post frontmatter
 * @param logoData - The logo image data
 * @returns ImageResponse with post-specific social preview image
 */
export async function generateBlogPostSocialImage(
  frontmatter: BlogFrontmatter | null | undefined,
  logoData: ArrayBuffer | null
) {
  const fontData = await fetchJetBrainsMonoFont();

  // Convert ArrayBuffer to base64 string for img src if present
  const logoSrc = logoData
    ? `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`
    : null;

  try {
    if (!frontmatter) {
      throw new Error("No frontmatter provided");
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
            fontFamily: fontData ? '"JetBrains Mono"' : "monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              {frontmatter.title}
            </div>

            {/* Excerpt */}
            <div
              style={{
                fontSize: 30,
                color: "#d1d5db",
                lineHeight: 1.4,
                marginBottom: 32,
                display: "flex",
              }}
            >
              {frontmatter.excerpt || "Read more on Volvox Blog"}
            </div>

            {/* Author & Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                color: "#a1a1aa",
                marginBottom: 32,
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                {frontmatter.author?.name || "Volvox"}
              </span>
              <span style={{ margin: "0 12px" }}>·</span>
              <span>{frontmatter.date}</span>
            </div>

            {/* Tags */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {frontmatter.tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      backgroundColor: "#1f2937",
                      color: "#60a5fa",
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 20,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {`#${tag}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {logoSrc && (
              <img
                src={logoSrc}
                width={48}
                height={48}
                style={{ marginRight: 16 }}
                alt="Volvox logo"
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
        </div>
      ),
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
    return new ImageResponse(createFallbackImage(logoData), {
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
