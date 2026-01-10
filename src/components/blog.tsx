"use client";

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
import { ArrowRight, Eye } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";

interface BlogProps {
  posts: BlogPost[];
}

const MAX_HOMEPAGE_POSTS = 3;

/**
 * Render the Blog section on the homepage with the 3 most recent posts.
 * Clicking the title or "View All" button navigates to the full blog listing.
 *
 * @param posts - Array of blog posts to display (will show only the 3 most recent)
 * @returns The Blog section JSX element
 */
export function Blog({ posts: allPosts }: BlogProps) {
  // Sort by date and take only the 3 most recent
  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_HOMEPAGE_POSTS);

  return (
    <section
      id="blog"
      className="py-16 md:py-24 px-4"
      data-testid="blog-section"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <Link href="/blog" className="inline-block group">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-secondary transition-colors">
              Blog
            </h2>
          </Link>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and stories from the {SITE_NAME} team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col"
                  data-testid="blog-card"
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
                          alt={post.author?.name || SITE_NAME}
                        />
                        <AvatarFallback>
                          {(post.author?.name || SITE_NAME).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {post.author?.name || SITE_NAME}
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
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
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
              </Link>
            </motion.div>
          ))}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts yet. Our team is working on great content!
            </p>
          </div>
        )}

        {/* View All Button */}
        {allPosts.length > 0 && (
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
