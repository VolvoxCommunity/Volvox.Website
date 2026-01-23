"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/types";
import { ViewMode } from "@/components/ui/filter-controls";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  viewMode: ViewMode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function BlogCard({ post, viewMode }: BlogCardProps) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover="hover"
      className="group h-full"
      data-testid={`blog-card-${post.slug}`}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full outline-none">
        {/* Card Container */}
        <div
          className={cn(
            "h-full bg-card backdrop-blur-sm rounded-[2rem] p-4 transition-all duration-300",
            "border border-border/40 hover:border-border/80 shadow-sm hover:shadow-xl hover:shadow-primary/5",
            viewMode === "list" &&
              "p-6 flex flex-col md:flex-row gap-6 items-center"
          )}
        >
          {/* Inset Image Container */}
          <div
            className={cn(
              "relative overflow-hidden bg-muted/50 mb-4",
              "transition-[border-radius] duration-[800ms] ease-[cubic-bezier(0.25,0.4,0.25,1)]", // Custom bezier
              viewMode === "grid"
                ? "aspect-[4/3] w-full"
                : "w-full md:w-64 aspect-video md:aspect-[4/3] flex-shrink-0 mb-0",
              "rounded-lg md:rounded-[2rem] group-hover:rounded-lg" // Responsive + Hover logic
            )}
          >
            <div className="w-full h-full relative overflow-hidden">
              {post.banner ? (
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={post.banner}
                    alt={post.title}
                    fill
                    sizes={
                      viewMode === "grid"
                        ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        : "(max-width: 768px) 100vw, 300px"
                    }
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                  <span className="text-6xl font-bold text-muted-foreground/10 select-none">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div
            className={cn(
              "px-1 flex flex-col flex-1",
              viewMode === "list" && "px-0"
            )}
          >
            {/* Author & Read Time */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6 border border-border/50">
                <AvatarImage
                  src={post.author?.avatar}
                  alt={post.author?.name || "Editor"}
                />
                <AvatarFallback className="text-[10px] bg-primary/5">
                  {(post.author?.name || "E").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="text-foreground/80">
                  {post.author?.name || "Editor"}
                </span>
                <span className="text-[10px] opacity-40">•</span>
                <span>{post.readingTime} min read</span>
                <span className="text-[10px] opacity-40">•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Title with Arrow */}
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 mt-1">
                <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>

            <p className="text-muted-foreground/80 text-sm line-clamp-2 leading-relaxed mb-6 flex-1">
              {post.excerpt}
            </p>

            {/* Footer - Tags & Date */}
            <div className="flex items-center justify-between mt-auto gap-4">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground font-medium border-none px-2.5 py-0.5 text-[10px] whitespace-nowrap"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="rounded-lg border-border/50 text-muted-foreground font-medium px-2 py-0.5 text-[10px] whitespace-nowrap"
                  >
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>

              <span className="text-[10px] font-medium text-muted-foreground flex-shrink-0">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
