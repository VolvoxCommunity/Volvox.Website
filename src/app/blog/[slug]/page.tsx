import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostViewTracker } from "@/components/post-view-tracker";
import rehypeHighlight from "rehype-highlight";

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
  const { frontmatter } = await getPostBySlug(slug);

  if (!frontmatter) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${frontmatter.title} - Volvox Blog`,
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
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { frontmatter, content, views } = await getPostBySlug(slug);

  if (!frontmatter) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PostViewTracker slug={slug} />
      {/* Header Navigation */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Link href="/" className="text-xl font-bold text-primary">
              Volvox
            </Link>
          </div>
        </div>
      </header>

      {/* Blog Post Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl">
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
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{views} views</span>
              </div>
            </div>
          </div>
        </header>

        {/* MDX Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-foreground
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-foreground/90 prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-secondary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-card prose-pre:border prose-pre:border-border
          prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-foreground/90
        "
        >
          <MDXRemote
            source={content}
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
      </article>
    </div>
  );
}
