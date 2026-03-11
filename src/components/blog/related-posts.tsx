"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";

interface RelatedPostsProps {
  currentSlug: string;
  posts: Pick<
    BlogPost,
    "slug" | "title" | "excerpt" | "banner" | "tags" | "date"
  >[];
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
  const selected = useMemo(() => {
    const others = posts.filter((p) => p.slug !== currentSlug);
    return shuffle(others).slice(0, 3);
  }, [currentSlug, posts]);

  if (selected.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">More from the blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selected.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-border/80 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] bg-muted/50 overflow-hidden">
              {post.banner ? (
                <Image
                  src={post.banner}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-muted-foreground/10 select-none">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5 overflow-hidden">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-lg text-[10px] px-2.5 py-0.5 whitespace-nowrap"
                    >
                      {tag}
                    </Badge>
                  ))}
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
          </Link>
        ))}
      </div>
    </section>
  );
}
