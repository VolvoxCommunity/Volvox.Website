import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "ab7bdf8bb88fd5da9ec425b57d8f0394";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string };
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Verify the URL belongs to our domain
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://volvox.app";
    const urlObj = new URL(url);
    const siteObj = new URL(siteUrl);

    if (urlObj.hostname !== siteObj.hostname) {
      return NextResponse.json(
        { error: "URL must belong to this domain" },
        { status: 400 }
      );
    }

    // Submit to IndexNow
    const response = await fetch(
      `${INDEXNOW_ENDPOINT}?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "URL submitted to IndexNow",
        url,
      });
    }

    const errorText = await response.text();
    return NextResponse.json(
      {
        error: "IndexNow submission failed",
        status: response.status,
        details: errorText,
      },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: String(error) },
      { status: 500 }
    );
  }
}
