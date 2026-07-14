import type { Metadata } from "next";
import { HomepageClient } from "@/components/homepage-client";
import { getAllPosts } from "@/lib/blog";
import {
  getAllExtendedProducts,
  getAllTeamMembers,
  getReviewsContent,
} from "@/lib/content";
import { reportError } from "@/lib/logger";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 3600;

/**
 * Renders the homepage server component with resilient data fetching.
 */
export default async function HomePage() {
  const [blogPostsResult, teamResult, productsResult, reviewsResult] =
    await Promise.allSettled([
      getAllPosts(),
      Promise.resolve(getAllTeamMembers()),
      Promise.resolve(getAllExtendedProducts()),
      Promise.resolve(getReviewsContent()),
    ]);

  const blogPosts =
    blogPostsResult.status === "fulfilled" ? blogPostsResult.value : [];
  if (blogPostsResult.status === "rejected") {
    reportError(
      "Failed to load blog posts for HomePage",
      blogPostsResult.reason,
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

  const reviewsContent =
    reviewsResult.status === "fulfilled" ? reviewsResult.value : null;
  if (reviewsResult.status === "rejected") {
    reportError("Failed to load reviews for HomePage", reviewsResult.reason);
  }

  return (
    <HomepageClient
      blogPosts={blogPosts}
      teamMembers={teamMembers}
      products={products}
      reviewsContent={reviewsContent}
    />
  );
}
