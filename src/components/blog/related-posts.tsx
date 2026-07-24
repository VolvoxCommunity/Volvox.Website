"use client";

import { useMemo } from "react";
import { BlogCard } from "@/components/blog-card";
import type { BlogPost } from "@/lib/types";

interface RelatedPostsProps {
  currentSlug: string;
  posts: Pick<
    BlogPost,
    "slug" | "title" | "excerpt" | "banner" | "tags" | "date" | "author"
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
    <section className="mt-16 pt-12 border-t border-border/40">
      <h2 className="text-3xl md:text-4xl font-editorial italic font-medium mb-8 tracking-tight text-foreground">
        More from the blog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selected.map((post) => (
          <BlogCard key={post.slug} post={post as BlogPost} />
        ))}
      </div>
    </section>
  );
}
