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

/** Product data shape for OG image generation. */
export interface ProductOgData {
  name: string;
  tagline: string;
  techStack?: string[];
}

/** Configuration for the unified social image generator. */
export interface SocialImageConfig {
  title: string;
  subtitle?: string;
  metadata?: string;
  badges?: string[];
  badgePrefix?: string;
  titleSize?: number;
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
 * Converts an ArrayBuffer to a base64 data URL for use in img src.
 */
function toBase64DataUrl(data: ArrayBuffer): string {
  return `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
}

/**
 * Creates ImageResponse options with font configuration.
 */
function createImageResponseOptions(fontData: ArrayBuffer | null) {
  return {
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
  };
}

/**
 * Creates a fallback image when data cannot be loaded.
 * Displays generic Volvox branding.
 */
export function createFallbackImage(logoData?: ArrayBuffer | null) {
  const logoSrc = logoData ? toBase64DataUrl(logoData) : null;

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
        // eslint-disable-next-line @next/next/no-img-element
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
 * Generates a dynamic social image with configurable content.
 *
 * @param config - The image configuration (title, subtitle, metadata, badges)
 * @param logoData - The logo image data
 * @returns ImageResponse with the social preview image
 */
export async function generateSocialImage(
  config: SocialImageConfig | null | undefined,
  logoData: ArrayBuffer | null
): Promise<ImageResponse> {
  const fontData = await fetchJetBrainsMonoFont();
  const logoSrc = logoData ? toBase64DataUrl(logoData) : null;
  const options = createImageResponseOptions(fontData);

  try {
    if (!config) {
      throw new Error("No config provided");
    }

    const {
      title,
      subtitle,
      metadata,
      badges,
      badgePrefix = "",
      titleSize = 60,
    } = config;

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
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: 30,
                color: "#d1d5db",
                lineHeight: 1.4,
                marginBottom: 32,
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Metadata */}
          {metadata && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                color: "#a1a1aa",
                marginBottom: 32,
              }}
            >
              {metadata}
            </div>
          )}

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {badges.map((badge) => (
                <div
                  key={badge}
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#60a5fa",
                    padding: "8px 16px",
                    borderRadius: badgePrefix ? 999 : 8,
                    fontSize: 20,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {`${badgePrefix}${badge}`}
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
            // eslint-disable-next-line @next/next/no-img-element
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
      </div>,
      options
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(createFallbackImage(logoData), options);
  }
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
): Promise<ImageResponse> {
  if (!frontmatter) {
    return generateSocialImage(null, logoData);
  }

  const authorName = frontmatter.author?.name || "Volvox";

  return generateSocialImage(
    {
      title: frontmatter.title,
      subtitle: frontmatter.excerpt || "Read more on Volvox Blog",
      metadata: `${authorName} · ${frontmatter.date}`,
      badges: frontmatter.tags?.slice(0, 3),
      badgePrefix: "#",
      titleSize: 60,
    },
    logoData
  );
}

/**
 * Generates a dynamic social image for a product page.
 *
 * @param product - The product data
 * @param logoData - The logo image data
 * @returns ImageResponse with product-specific social preview image
 */
export async function generateProductSocialImage(
  product: ProductOgData | null | undefined,
  logoData: ArrayBuffer | null
): Promise<ImageResponse> {
  if (!product) {
    return generateSocialImage(null, logoData);
  }

  return generateSocialImage(
    {
      title: product.name,
      subtitle: product.tagline,
      badges: product.techStack?.slice(0, 4),
      titleSize: 72,
    },
    logoData
  );
}
