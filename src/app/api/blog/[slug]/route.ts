import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";

/**
 * GET handler for fetching blog post data by slug.
 * Used by social image generation to access post metadata.
 *
 * @param request - The incoming request
 * @param params - Route parameters containing the blog post slug
 * @returns JSON response with post frontmatter or 404 error
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    return NextResponse.json(post.frontmatter);
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
