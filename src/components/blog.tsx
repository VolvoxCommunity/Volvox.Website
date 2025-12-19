"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, Eye } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CustomLink } from "@/components/mdx";

interface BlogProps {
  posts: BlogPost[];
}

/**
 * Render the Blog section with a responsive grid of post cards and an in-place reader modal.
 *
 * Displays the provided posts as interactive cards; clicking a card opens a dialog that shows
 * the selected post's author, metadata, tags, and rendered Markdown content with a scroll progress bar
 * and controls to close the dialog or navigate to the full article page.
 *
 * @param posts - Array of blog posts to display in the grid
 * @returns The Blog section JSX element containing the posts grid and the post dialog
 */
export function Blog({ posts: initialPosts }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;

    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    }

    setIsScrolled(scrollTop > 10);
  };

  return (
    <section
      id="blog"
      className="py-16 md:py-24 px-4"
      data-testid="blog-section"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and stories from the Volvox team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Card
                className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                data-testid="blog-card"
                onClick={() => handlePostClick(post)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePostClick(post);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Read post: ${post.title}`}
              >
                <motion.div
                  className="aspect-video bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden border-b border-border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {post.banner ? (
                    <Image
                      src={post.banner}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl font-bold text-foreground/5">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </motion.div>

                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={post.author?.avatar}
                        alt={post.author?.name || "Volvox"}
                      />
                      <AvatarFallback>
                        {(post.author?.name || "Volvox").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {post.author?.name || "Volvox"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {post.author?.role || "Team"}
                      </p>
                    </div>
                  </div>

                  <CardTitle className="text-lg line-clamp-2 group-hover:text-secondary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="mb-4 flex-1">
                    {post.excerpt}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" weight="bold" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {initialPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts yet. Our team is working on great content!
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedPost}
        onOpenChange={() => {
          setSelectedPost(null);
          setScrollProgress(0);
          setIsScrolled(false);
        }}
      >
        <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[80vh] p-0 gap-0 overflow-hidden flex flex-col">
          {selectedPost && (
            <>
              <DialogHeader
                className={`sticky top-0 z-10 transition-[box-shadow,background-color] duration-200 ${
                  isScrolled
                    ? "shadow-md bg-background/95 backdrop-blur-sm"
                    : "bg-background"
                }`}
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-[width] duration-150 ease-out will-change-[width]"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>

                <div className="pt-5 px-6 pb-0 text-left flex flex-col gap-1.5">
                  {/* Title */}
                  <DialogTitle className="text-3xl md:text-4xl font-bold leading-none">
                    {selectedPost.title}
                  </DialogTitle>

                  {/* Excerpt */}
                  <DialogDescription className="text-lg text-muted-foreground">
                    {selectedPost.excerpt}
                  </DialogDescription>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author Info & Date */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={selectedPost.author?.avatar}
                          alt={selectedPost.author?.name || "Volvox"}
                        />
                        <AvatarFallback>
                          {(selectedPost.author?.name || "Volvox").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {selectedPost.author?.name || "Volvox"}
                        </p>
                        <p className="text-xs">
                          {selectedPost.author?.role || "Team"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border-l pl-4 border-border/50">
                      <span>
                        {new Date(selectedPost.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 border-l pl-4 border-border/50">
                      <Eye className="h-4 w-4" weight="bold" />
                      <span>
                        {selectedPost.views.toLocaleString()}{" "}
                        {selectedPost.views === 1 ? "view" : "views"}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                className="prose prose-slate dark:prose-invert max-w-none px-6 pt-2 pb-8 overflow-y-auto scroll-smooth flex-1 min-h-0"
                onScroll={handleScroll}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    a: CustomLink,
                  }}
                >
                  {selectedPost.content}
                </ReactMarkdown>
              </motion.div>

              {/* Footer CTA */}
              <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm p-4 flex items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPost(null)}
                  className="text-muted-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back
                </Button>

                <Button
                  asChild
                  className="flex-1 sm:flex-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href={`/blog/${selectedPost.slug}`}>
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
