import { Metadata } from "next";
import { HomepageClient } from "@/components/homepage-client";
import { getAllPosts } from "@/lib/blog";
import { getAllTeamMembers, getAllExtendedProducts } from "@/lib/content";
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
  const [blogPostsResult, teamResult, productsResult] =
    await Promise.allSettled([
      getAllPosts(),
      Promise.resolve(getAllTeamMembers()),
      Promise.resolve(getAllExtendedProducts()),
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

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  if (productsResult.status === "rejected") {
    reportError("Failed to load products for HomePage", productsResult.reason);
  }

  return (
    <HomepageClient
      blogPosts={blogPosts}
      teamMembers={teamMembers}
      products={products}
    />
  );
}
