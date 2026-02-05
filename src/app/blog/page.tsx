import { Suspense } from "react";
import { Metadata } from "next";
import Script from "next/script";
import { getAllPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog-list-client";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: `Insights, tutorials, and stories from the ${SITE_NAME} team.`,
  alternates: {
    canonical: "/blog",
  },
};

/**
 * Server component for the blog landing page.
 * Fetches all published posts and passes them to the client component for filtering.
 * Wrapped in Suspense because BlogListClient uses useSearchParams.
 */
export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => post.published);

  return (
    <>
      <Script
        id="blog-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Blog", url: `${SITE_URL}/blog` },
            ])
          ),
        }}
      />
      <Suspense fallback={null}>
        <BlogListClient posts={posts} />
      </Suspense>
    </>
  );
}
