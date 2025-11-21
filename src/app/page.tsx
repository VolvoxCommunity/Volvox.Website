import { HomepageClient } from "@/components/homepage-client";
import { getAllPosts } from "@/lib/blog";
import { getAllProducts } from "@/lib/data";
import { getAllMentors, getAllMentees } from "@/lib/content";
import { reportError } from "@/lib/logger";

/**
 * Renders the homepage server component with resilient data fetching.
 */
export default async function HomePage() {
  const [blogPostsResult, productsResult, mentorsResult, menteesResult] =
    await Promise.allSettled([
      getAllPosts(),
      getAllProducts(),
      Promise.resolve(getAllMentors()),
      Promise.resolve(getAllMentees()),
    ]);

  const blogPosts =
    blogPostsResult.status === "fulfilled" ? blogPostsResult.value : [];
  if (blogPostsResult.status === "rejected") {
    reportError(
      "Failed to load blog posts for HomePage",
      blogPostsResult.reason
    );
  }

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  if (productsResult.status === "rejected") {
    reportError("Failed to load products for HomePage", productsResult.reason);
  }

  const mentors =
    mentorsResult.status === "fulfilled" ? mentorsResult.value : [];
  if (mentorsResult.status === "rejected") {
    reportError("Failed to load mentors for HomePage", mentorsResult.reason);
  }

  const mentees =
    menteesResult.status === "fulfilled" ? menteesResult.value : [];
  if (menteesResult.status === "rejected") {
    reportError("Failed to load mentees for HomePage", menteesResult.reason);
  }

  return (
    <HomepageClient
      blogPosts={blogPosts}
      products={products}
      mentors={mentors}
      mentees={mentees}
    />
  );
}
