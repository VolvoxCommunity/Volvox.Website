import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog-list-client";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: `Insights, tutorials, and stories from the ${SITE_NAME} team.`,
};

/**
 * Server component for the blog landing page.
 * Fetches all published posts and passes them to the client component for filtering.
 */
export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => post.published);

  return <BlogListClient posts={posts} />;
}
