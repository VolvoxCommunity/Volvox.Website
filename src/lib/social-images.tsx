/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import * as fs from "fs";
import * as path from "path";
import { reportError } from "./logger";

/**
 * Converts a Node.js Buffer to an ArrayBuffer.
 * This is necessary because Buffer.buffer can return a shared ArrayBuffer
 * with incorrect offsets.
 */
function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  // Create a new Uint8Array copy to ensure we have a proper ArrayBuffer
  const copy = new Uint8Array(buffer);
  return copy.buffer;
}

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
  bannerData?: ArrayBuffer | null;
}

/** Product data shape for OG image generation. */
export interface ProductOgData {
  name: string;
  tagline: string;
  techStack?: string[];
  screenshotData?: ArrayBuffer | null;
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

/** Brand colors for OG images. */
const BRAND_COLORS = {
  primary: "#007aff",
  secondary: "#af58da",
  accent: "#ff9500",
  background: "#0a0a0a",
  backgroundLight: "#1a1a2e",
  text: "#ffffff",
  textMuted: "#a1a1aa",
  textSubtitle: "#d1d5db",
  badgeBackground: "#1f2937",
  badgeText: "#60a5fa",
  brandBlue: "#3b82f6",
};

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
    reportError("Failed to fetch JetBrains Mono font", e);
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
      return bufferToArrayBuffer(fs.readFileSync(logoPath));
    }
  } catch (e) {
    reportError("Failed to read logo file", e);
  }
  return null;
}

/**
 * Reads a product screenshot from the content directory.
 *
 * @param slug - The product slug
 * @param filename - The screenshot filename (e.g., "hero.png")
 * @returns ArrayBuffer of the screenshot data or null if not found
 */
export function getProductScreenshotData(
  slug: string,
  filename: string
): ArrayBuffer | null {
  try {
    const screenshotPath = path.join(
      process.cwd(),
      "content",
      "products",
      slug,
      "screenshots",
      filename
    );
    if (fs.existsSync(screenshotPath)) {
      return bufferToArrayBuffer(fs.readFileSync(screenshotPath));
    }
  } catch (e) {
    reportError(`Failed to read product screenshot: ${slug}/${filename}`, e);
  }
  return null;
}

/**
 * Reads a blog banner image from the public directory.
 *
 * @param bannerPath - The banner path (e.g., "/images/blog/banner.png")
 * @returns ArrayBuffer of the banner data or null if not found
 */
export function getBlogBannerData(bannerPath: string): ArrayBuffer | null {
  try {
    // Remove leading slash if present and resolve from public directory
    const cleanPath = bannerPath.startsWith("/")
      ? bannerPath.slice(1)
      : bannerPath;
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(fullPath)) {
      return bufferToArrayBuffer(fs.readFileSync(fullPath));
    }
  } catch (e) {
    reportError(`Failed to read blog banner: ${bannerPath}`, e);
  }
  return null;
}

/**
 * Detects the MIME type of an image from its magic bytes.
 */
function detectImageMimeType(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);

  // Check for JPEG (starts with FF D8 FF)
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // Check for PNG (starts with 89 50 4E 47)
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  // Check for WebP (starts with RIFF....WEBP)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // Check for GIF (starts with GIF87a or GIF89a)
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return "image/gif";
  }

  // Default to PNG
  return "image/png";
}

/**
 * Converts an ArrayBuffer to a base64 data URL for use in img src.
 * Automatically detects the image MIME type from magic bytes.
 */
function toBase64DataUrl(data: ArrayBuffer): string {
  const mimeType = detectImageMimeType(data);
  return `data:${mimeType};base64,${Buffer.from(data).toString("base64")}`;
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
        backgroundColor: BRAND_COLORS.background,
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
            color: BRAND_COLORS.brandBlue,
          }}
        >
          VOLVOX
        </div>
      )}
      <div
        style={{
          fontSize: 36,
          color: BRAND_COLORS.textMuted,
          marginTop: logoSrc ? 0 : 24,
        }}
      >
        Volvox Community
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
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 60,
            backgroundColor: BRAND_COLORS.background,
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
                color: BRAND_COLORS.text,
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
                  color: BRAND_COLORS.textSubtitle,
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
                  color: BRAND_COLORS.textMuted,
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
                      backgroundColor: BRAND_COLORS.badgeBackground,
                      color: BRAND_COLORS.badgeText,
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
                color: BRAND_COLORS.brandBlue,
              }}
            >
              VOLVOX
            </div>
          </div>
        </div>
      ),
      options
    );
  } catch (e) {
    reportError("Social image generation failed", e);
    return new ImageResponse(createFallbackImage(logoData), options);
  }
}

/**
 * Generates a dynamic social image for a blog post.
 * Features a gradient background, optional banner image, and enhanced visual design
 * matching the product OG images.
 *
 * @param frontmatter - The blog post frontmatter including optional bannerData
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

  const fontData = await fetchJetBrainsMonoFont();
  const logoSrc = logoData ? toBase64DataUrl(logoData) : null;
  const bannerSrc = frontmatter.bannerData
    ? toBase64DataUrl(frontmatter.bannerData)
    : null;
  const options = createImageResponseOptions(fontData);

  try {
    const authorName = frontmatter.author?.name || "Volvox";
    const tagBadges = frontmatter.tags?.slice(0, 4) || [];

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            fontFamily: fontData ? '"JetBrains Mono"' : "monospace",
          }}
        >
          {/* Gradient background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${BRAND_COLORS.background} 0%, ${BRAND_COLORS.backgroundLight} 50%, ${BRAND_COLORS.background} 100%)`,
              display: "flex",
            }}
          />

          {/* Subtle accent gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 100% 0%, ${BRAND_COLORS.secondary}15 0%, transparent 50%)`,
              display: "flex",
            }}
          />

          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100%",
              padding: 48,
              position: "relative",
            }}
          >
            {/* Left side - Text content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: bannerSrc ? "0 0 55%" : "1",
                paddingRight: bannerSrc ? 32 : 0,
              }}
            >
              {/* Top section */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Blog badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: BRAND_COLORS.secondary,
                      color: BRAND_COLORS.text,
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "flex",
                    }}
                  >
                    Blog
                  </div>
                </div>

                {/* Post title */}
                <div
                  style={{
                    fontSize: bannerSrc ? 48 : 56,
                    fontWeight: 700,
                    color: BRAND_COLORS.text,
                    lineHeight: 1.1,
                    marginBottom: 16,
                    display: "flex",
                  }}
                >
                  {frontmatter.title}
                </div>

                {/* Excerpt - only show if no banner to save space */}
                {frontmatter.excerpt && !bannerSrc && (
                  <div
                    style={{
                      fontSize: 24,
                      color: BRAND_COLORS.textSubtitle,
                      lineHeight: 1.4,
                      marginBottom: 20,
                      display: "flex",
                    }}
                  >
                    {frontmatter.excerpt}
                  </div>
                )}

                {/* Author and date */}
                <div
                  style={{
                    fontSize: 20,
                    color: BRAND_COLORS.textMuted,
                    marginBottom: 24,
                    display: "flex",
                  }}
                >
                  {authorName} · {frontmatter.date}
                </div>

                {/* Tag badges */}
                {tagBadges.length > 0 && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {tagBadges.map((tag) => (
                      <div
                        key={tag}
                        style={{
                          backgroundColor: `${BRAND_COLORS.secondary}20`,
                          border: `1px solid ${BRAND_COLORS.secondary}40`,
                          color: BRAND_COLORS.secondary,
                          padding: "8px 14px",
                          borderRadius: 999,
                          fontSize: 16,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Volvox branding */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    width={56}
                    height={56}
                    style={{ marginRight: 16, display: "flex" }}
                    alt="Volvox logo"
                  />
                ) : null}
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: BRAND_COLORS.primary,
                    display: "flex",
                  }}
                >
                  VOLVOX
                </div>
              </div>
            </div>

            {/* Right side - Banner image */}
            {bannerSrc && (
              <div
                style={{
                  display: "flex",
                  flex: "0 0 45%",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Banner container with subtle shadow effect */}
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: `0 25px 50px -12px ${BRAND_COLORS.secondary}30`,
                  }}
                >
                  <img
                    src={bannerSrc}
                    width={480}
                    height={520}
                    style={{
                      objectFit: "contain",
                      borderRadius: 16,
                      display: "flex",
                    }}
                    alt="Blog post banner"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      options
    );
  } catch (e) {
    reportError("Blog social image generation failed", e);
    return new ImageResponse(createFallbackImage(logoData), options);
  }
}

/**
 * Generates a dynamic social image for a product page.
 * Features a gradient background, product screenshot, and enhanced visual design.
 *
 * @param product - The product data including optional screenshot
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

  const fontData = await fetchJetBrainsMonoFont();
  const logoSrc = logoData ? toBase64DataUrl(logoData) : null;
  const screenshotSrc = product.screenshotData
    ? toBase64DataUrl(product.screenshotData)
    : null;
  const options = createImageResponseOptions(fontData);

  try {
    const techBadges = product.techStack || [];

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            fontFamily: fontData ? '"JetBrains Mono"' : "monospace",
          }}
        >
          {/* Gradient background */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${BRAND_COLORS.background} 0%, ${BRAND_COLORS.backgroundLight} 50%, ${BRAND_COLORS.background} 100%)`,
              display: "flex",
            }}
          />

          {/* Subtle accent gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 0% 0%, ${BRAND_COLORS.primary}15 0%, transparent 50%)`,
              display: "flex",
            }}
          />

          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100%",
              padding: 48,
              position: "relative",
            }}
          >
            {/* Left side - Text content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: screenshotSrc ? "0 0 55%" : "1",
                paddingRight: screenshotSrc ? 32 : 0,
              }}
            >
              {/* Top section */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Product name */}
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 700,
                    color: BRAND_COLORS.text,
                    lineHeight: 1.1,
                    marginBottom: 16,
                    display: "flex",
                  }}
                >
                  {product.name}
                </div>

                {/* Tagline */}
                <div
                  style={{
                    fontSize: 26,
                    color: BRAND_COLORS.textSubtitle,
                    lineHeight: 1.4,
                    marginBottom: 24,
                    display: "flex",
                  }}
                >
                  {product.tagline}
                </div>

                {/* Tech stack badges */}
                {techBadges.length > 0 && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {techBadges.map((tech) => (
                      <div
                        key={tech}
                        style={{
                          backgroundColor: `${BRAND_COLORS.accent}20`,
                          border: `1px solid ${BRAND_COLORS.accent}40`,
                          color: BRAND_COLORS.accent,
                          padding: "8px 14px",
                          borderRadius: 6,
                          fontSize: 16,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Volvox branding */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    width={56}
                    height={56}
                    style={{ marginRight: 16, display: "flex" }}
                    alt="Volvox logo"
                  />
                ) : null}
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: BRAND_COLORS.primary,
                    display: "flex",
                  }}
                >
                  VOLVOX
                </div>
              </div>
            </div>

            {/* Right side - Screenshot */}
            {screenshotSrc && (
              <div
                style={{
                  display: "flex",
                  flex: "0 0 45%",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Screenshot container with subtle shadow effect */}
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: `0 25px 50px -12px ${BRAND_COLORS.primary}30`,
                  }}
                >
                  <img
                    src={screenshotSrc}
                    width={480}
                    height={520}
                    style={{
                      objectFit: "contain",
                      borderRadius: 16,
                      display: "flex",
                    }}
                    alt="Product screenshot"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      options
    );
  } catch (e) {
    reportError("Product social image generation failed", e);
    return new ImageResponse(createFallbackImage(logoData), options);
  }
}
