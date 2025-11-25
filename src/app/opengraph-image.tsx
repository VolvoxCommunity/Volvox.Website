import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Volvox - Software Development & Learning Community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generates a static OpenGraph image for the homepage.
 * Features Volvox branding with gradient background.
 *
 * @returns ImageResponse with branded social preview image
 */
export default function Image() {
  return new ImageResponse(
    (
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
            letterSpacing: "-0.02em",
          }}
        >
          VOLVOX
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Software Development & Learning Community
        </div>
      </div>
    ),
    { ...size }
  );
}
