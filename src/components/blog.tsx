"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CaretRight } from "@phosphor-icons/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { BlogPost } from "@/lib/types";
import { BlogCard } from "@/components/blog-card";

import {
  FilterControls,
  type BlogSortOption,
  type ViewMode,
} from "@/components/ui/filter-controls";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
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
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views":
          return b.views - a.views;
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    if (!enableFilters) {
      return result.slice(0, MAX_HOMEPAGE_POSTS);
    }

    return result;
  }, [allPosts, searchQuery, sortOption, enableFilters]);

  const displayPosts = filteredPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      id="blog"
      ref={containerRef}
      className="py-24 md:py-32 px-4 relative overflow-hidden bg-background"
      data-testid="blog-section"
    >
      {/* Modern Background Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: backgroundOpacity }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]) }}
          className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px]"
        />
      </motion.div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div className="space-y-2 md:space-y-4">
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Engineering & Design
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Deep dives into modern web development, design systems, and open
              source culture.
            </motion.p>
          </div>

          {!enableFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                onClick={() => router.push("/blog")}
                className="rounded-full hover:bg-muted transition-colors flex items-center gap-2 group"
              >
                View Archive
                <CaretRight
                  weight="bold"
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                />
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
                  resultCount={displayPosts.length}
                  totalCount={allPosts.length}
                />
              </motion.div>
            )}
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {enableFilters && displayPosts.length === 0 && (
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
                    onSortChange?.("newest" as BlogSortOption);
                  }}
                  className="text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {displayPosts.map((post) => (
              <BlogCard key={post.id} post={post} viewMode={viewMode} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
