"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import {
  type BlogSortOption,
  FilterControls,
  type ViewMode,
} from "@/components/ui/filter-controls";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogProps {
  posts: BlogPost[];
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  sortOption?: BlogSortOption;
  onSortChange?: (value: BlogSortOption | "a-z" | "z-a") => void;
  viewMode?: ViewMode;
  onViewModeChange?: (value: ViewMode) => void;
  enableFilters?: boolean;
}

const MAX_HOMEPAGE_POSTS = 3;

export function Blog({
  posts: allPosts,
  searchQuery = "",
  onSearchChange,
  sortOption = "newest",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  enableFilters = false,
}: BlogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const animationInitializedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const secondaryBlobY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3],
  );

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views":
          return b.views - a.views;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    if (!enableFilters) {
      return result.slice(0, MAX_HOMEPAGE_POSTS);
    }

    return result;
  }, [allPosts, searchQuery, sortOption, enableFilters]);

  // GSAP Animation Effect - only run on initial mount
  useEffect(() => {
    // Only initialize animation once to prevent re-triggering on filter changes
    if (animationInitializedRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animate cards when they come into view
      const cards =
        cardsContainerRef.current?.querySelectorAll(".blog-card-item");

      if (cards && cards.length > 0) {
        animationInitializedRef.current = true;

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              y: 100,
              opacity: 0,
              scale: 0.95,
              filter: "blur(10px)",
            },
            {
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 70%",
                scrub: 1,
              },
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              ease: "power2.out",
            },
          );
        });
      }
    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup
  }, []); // Dependencies kept for initial render timing

  return (
    <section
      id="blog"
      ref={containerRef}
      aria-label="Blog posts"
      className="py-24 md:py-32 px-4 relative overflow-hidden bg-background"
      data-testid="blog-section"
    >
      {/* Modern Background Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: backgroundOpacity }}
      >
        <div className="absolute inset-0" />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-1/4 -right-64 w-[500px] h-[500px] rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: secondaryBlobY }}
          className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] rounded-full blur-[140px]"
        />
      </motion.div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-editorial italic font-medium tracking-tight text-foreground text-balance leading-tight"
          >
            Blog Posts
          </motion.h2>

          {!enableFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Button variant="ghost" asChild className="group">
                <Link href="/blog">
                  View Blogs
                  <ChevronRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Filter Controls */}
        <AnimatePresence>
          {enableFilters &&
            onSearchChange &&
            onSortChange &&
            onViewModeChange && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12"
              >
                <FilterControls
                  variant="homepage-blog"
                  searchQuery={searchQuery}
                  onSearchChange={onSearchChange}
                  sortOption={sortOption}
                  onSortChange={onSortChange}
                  viewMode={viewMode}
                  onViewModeChange={onViewModeChange}
                  searchPlaceholder="Search articles..."
                  resultCount={filteredPosts.length}
                  totalCount={allPosts.length}
                />
              </motion.div>
            )}
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {enableFilters && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 bg-muted/20 rounded-[2rem] border border-dashed border-border"
            >
              <div className="max-w-md mx-auto space-y-3">
                <p className="text-lg font-medium">No results found</p>
                <Button
                  variant="link"
                  onClick={() => {
                    onSearchChange?.("");
                    onSortChange?.("newest");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={cardsContainerRef}
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                "blog-card-item gsap-will-animate",
                !enableFilters && index === 2 && "hidden lg:block", // Hide 3rd item on mobile/tablet, show on lg+
              )}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
