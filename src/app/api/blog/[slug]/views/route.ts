import { NextResponse } from "next/server";
import { incrementPostViews } from "@/lib/blog";
import { normalizeSlug } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * POST handler for incrementing blog post views.
 * Called when a user views a blog post to track engagement.
 *
 * @param request - The incoming request
 * @param params - Route parameters containing the blog post slug
 * @returns JSON response with the new view count or error
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate slug
  const validSlug = normalizeSlug(slug);
  if (!validSlug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const newCount = await incrementPostViews(validSlug);

    if (newCount === -1) {
      return NextResponse.json(
        { error: "Failed to increment views" },
        { status: 500 }
      );
    }

    return NextResponse.json({ views: newCount });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
