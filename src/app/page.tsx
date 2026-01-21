import { Metadata } from "next";
import { HomepageClient } from "@/components/homepage-client";
import { getAllPosts } from "@/lib/blog";
import { getAllTeamMembers } from "@/lib/content";
import { reportError } from "@/lib/logger";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

/**
 * Renders the homepage server component with resilient data fetching.
 */
export default async function HomePage() {
  const [blogPostsResult, teamResult] = await Promise.allSettled([
    getAllPosts(),
    Promise.resolve(getAllTeamMembers()),
  ]);

  const blogPosts =
    blogPostsResult.status === "fulfilled" ? blogPostsResult.value : [];
  if (blogPostsResult.status === "rejected") {
    reportError(
      "Failed to load blog posts for HomePage",
      blogPostsResult.reason
    );
  }

  const teamMembers = teamResult.status === "fulfilled" ? teamResult.value : [];
  if (teamResult.status === "rejected") {
    reportError("Failed to load team members for HomePage", teamResult.reason);
  }

  return <HomepageClient blogPosts={blogPosts} teamMembers={teamMembers} />;
}
