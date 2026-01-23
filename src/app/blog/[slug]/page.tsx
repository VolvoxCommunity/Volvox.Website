import { Metadata } from "next";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import rehypeHighlight from "rehype-highlight";
import { mdxComponents } from "@/lib/mdx-components";
import { BlogContentWrapper } from "@/components/blog/blog-content-wrapper";
import { BlogPostNavbar } from "@/components/blog/blog-post-navbar";
import { Footer } from "@/components/footer";
import { ViewTracker } from "@/components/blog/view-tracker";
import { generateArticleSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_NAME } from "@/lib/constants";

/**
 * Collects all blog post slugs to supply route parameters for static generation.
 *
 * @returns An array of objects each with a `slug` property for a post (e.g., `{ slug: 'my-post' }`)
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { frontmatter } = await getPostBySlug(slug);

    // The "| Volvox" suffix is automatically appended by the title template in layout.tsx
    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      authors: [{ name: frontmatter.author?.name || SITE_NAME }],
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        type: "article",
        publishedTime: frontmatter.date,
        authors: [frontmatter.author?.name || SITE_NAME],
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description: frontmatter.excerpt,
      },
    };
  } catch {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
}

/**
 * Render the blog post page for a given post slug.
 *
 * Fetches the post identified by `params.slug`, renders its header, author info, MDX content, and navigation.
 * Invokes `notFound()` if the post frontmatter is missing.
 *
 * @param params - Route parameters object that must include a `slug` string
 * @returns The rendered blog post page for the specified slug
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let frontmatter;
  let content;
  let views: number;
  let readingTime: number;

  try {
    const post = await getPostBySlug(slug);
    frontmatter = post.frontmatter;
    content = post.content;
    views = post.views;
    // Normalize to whole minutes, minimum 1
    readingTime = Math.max(1, Math.round(post.readingTime));
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      {/* View Tracker - fires on mount to increment view count */}
      <ViewTracker slug={slug} />

      {/* JSON-LD structured data for SEO - placed in head via Script component */}
      <Script
        id={`article-schema-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(generateArticleSchema(frontmatter, slug)),
        }}
      />

      {/* Site Navigation & Back Header */}
      <BlogPostNavbar />

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Blog Post Content with Reading Progress and TOC */}
        <main id="main-content">
          <BlogContentWrapper>
            {/* Post Header */}
            <header className="mb-12">
              <div className="flex flex-col-reverse md:flex-row md:items-start md:gap-8">
                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    {frontmatter.title}
                  </h1>

                  <p className="text-lg text-muted-foreground mb-6">
                    {frontmatter.excerpt}
                  </p>

                  {/* Author Info & Meta */}
                  <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground mb-4">
                    {frontmatter.author?.website ? (
                      <a
                        href={frontmatter.author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        {frontmatter.author?.avatar && (
                          <Image
                            src={frontmatter.author.avatar}
                            alt={frontmatter.author.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div data-testid="author-info">
                          <p className="font-medium text-foreground hover:text-secondary transition-colors">
                            {frontmatter.author?.name}
                          </p>
                          <p className="text-xs" data-testid="author-role">
                            {frontmatter.author?.role}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        {frontmatter.author?.avatar && (
                          <Image
                            src={frontmatter.author.avatar}
                            alt={frontmatter.author.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div data-testid="author-info">
                          <p className="font-medium text-foreground">
                            {frontmatter.author?.name}
                          </p>
                          <p className="text-xs" data-testid="author-role">
                            {frontmatter.author?.role}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-1"
                      data-testid="post-date"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{frontmatter.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>
                        {views.toLocaleString()}{" "}
                        {views === 1 ? "view" : "views"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>

                  {/* Categories */}
                  {frontmatter.tags && frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Banner Image - Top Right */}
                {frontmatter.banner && (
                  <div className="mb-6 md:mb-0 md:flex-shrink-0">
                    <Image
                      src={frontmatter.banner}
                      alt={frontmatter.title}
                      width={280}
                      height={280}
                      className="w-full md:w-64 lg:w-72 h-auto rounded-lg border border-border shadow-lg"
                      priority
                    />
                  </div>
                )}
              </div>
            </header>

            {/* MDX Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground
            prose-h2:text-4xl prose-h2:md:text-5xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
            prose-h3:text-2xl prose-h4:text-xl
            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-code:text-secondary prose-code:bg-muted
            prose-pre:bg-card prose-pre:border prose-pre:border-border
            prose-blockquote:border-l-secondary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
            prose-ul:list-disc prose-ol:list-decimal
            prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:shadow-sm
          "
            >
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    rehypePlugins: [rehypeHighlight],
                  },
                }}
              />
            </div>
          </BlogContentWrapper>
        </main>
      </div>

      {/* Site Footer - Same as homepage */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
