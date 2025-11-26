import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import rehypeHighlight from "rehype-highlight";
import { mdxComponents } from "@/lib/mdx-components";
import { BlogContentWrapper } from "@/components/blog/blog-content-wrapper";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { AnimatedBackground } from "@/components/animated-background";
import { generateArticleSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize } from "@/lib/constants";

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
      authors: [{ name: frontmatter.author?.name || "Volvox" }],
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        type: "article",
        publishedTime: frontmatter.date,
        authors: [frontmatter.author?.name || "Volvox"],
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

  try {
    const post = await getPostBySlug(slug);
    frontmatter = post.frontmatter;
    content = post.content;
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(generateArticleSchema(frontmatter, slug)),
        }}
      />
      {/* Animated Background - Same as homepage */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <BlogPostHeader />

        {/* Blog Post Content with Reading Progress and TOC */}
        <main>
          <BlogContentWrapper>
            {/* Post Header */}
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {frontmatter.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {frontmatter.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {frontmatter.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
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
                  <div>
                    <p className="font-medium text-foreground">
                      {frontmatter.author?.name}
                    </p>
                    <p className="text-xs">{frontmatter.author?.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{frontmatter.date}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* MDX Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground
            prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
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

            {/* Footer Navigation */}
            <footer className="mt-16 pt-8 border-t border-border">
              <Button variant="outline" asChild>
                <Link href="/#blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Posts
                </Link>
              </Button>
            </footer>
          </BlogContentWrapper>
        </main>
      </div>
    </div>
  );
}
