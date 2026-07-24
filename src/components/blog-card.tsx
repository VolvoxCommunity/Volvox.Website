"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
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

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover="hover"
      className="group h-full"
      data-testid={`blog-card-${post.slug}`}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full outline-none">
        {/* Double-Bezel Card Container */}
        <div className="h-full rounded-[2rem] bg-card-deep/20 border border-border/30 p-1.5 transition-all duration-300 hover:border-border/60 hover:shadow-2xl hover:shadow-primary/5">
          <div className="w-full h-full rounded-[calc(2rem-0.375rem)] bg-card border border-border/10 p-3 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {/* Image Container with Overlaid Pills */}
            <div className="relative overflow-hidden bg-muted/30 mb-3 rounded-2xl aspect-[16/10] w-full shrink-0">
              <div className="w-full h-full relative overflow-hidden">
                {post.banner ? (
                  <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Image
                      src={post.banner}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                    <span className="text-6xl font-editorial font-medium text-muted-foreground/10 select-none">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom-left: Author PFP & Name Pill */}
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <div className="flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border/40 px-2.5 py-1 shadow-sm">
                  <Avatar className="h-4 w-4 border border-border/50">
                    <AvatarImage
                      src={post.author?.avatar}
                      alt={post.author?.name || "Editor"}
                    />
                    <AvatarFallback className="text-[8px] bg-primary/5">
                      {(post.author?.name || "E").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-foreground">
                    {post.author?.name || "Editor"}
                  </span>
                </div>
              </div>

              {/* Bottom-right: Date Pill */}
              <div className="absolute bottom-2.5 right-2.5 z-10">
                <div className="rounded-full bg-background/90 backdrop-blur-md border border-border/40 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 min-w-0 px-1 py-1">
              {/* Title with Arrow */}
              <div className="flex justify-between items-center gap-2 mb-1.5">
                <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                  {post.title}
                </h3>
                <div className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-muted-foreground text-xs leading-relaxed text-pretty line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
