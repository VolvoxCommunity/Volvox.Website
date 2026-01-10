"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "@phosphor-icons/react";
import { BlogPost } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";

interface BlogCardListProps {
  post: BlogPost;
  index: number;
}

/**
 * Horizontal list view card component for blog posts.
 * Displays thumbnail on left with full content on right.
 */
export function BlogCardList({ post, index }: BlogCardListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <Card className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <div className="sm:w-48 md:w-56 lg:w-64 shrink-0">
                <div className="aspect-video sm:aspect-square md:aspect-[4/3] bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
                  {post.banner ? (
                    <Image
                      src={post.banner}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 256px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-foreground/5">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col">
                {/* Author Row */}
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
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                  {post.title}
                </h2>

                {/* Excerpt - Full on list view */}
                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
