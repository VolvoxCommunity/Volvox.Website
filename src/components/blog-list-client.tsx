"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, ArrowLeft } from "@phosphor-icons/react";
import { BlogPost } from "@/lib/types";
import {
  FilterControls,
  type BlogSortOption,
  type ProductSortOption,
  type ViewMode,
} from "@/components/ui/filter-controls";
import { BlogCardList } from "@/components/blog-card-list";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { SITE_NAME, NAV_HEIGHT } from "@/lib/constants";

interface BlogListClientProps {
  posts: BlogPost[];
}

const STORAGE_KEY = "volvox-blog-view";

/**
 * Client component for the blog landing page.
 * Handles search, filtering, sorting, and layout switching with URL persistence.
 */
export function BlogListClient({ posts }: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get("tags");
    return tags ? tags.split(",").filter(Boolean) : [];
  });
  const [sortOption, setSortOption] = useState<BlogSortOption>(() => {
    const sort = searchParams.get("sort");
    return (sort as BlogSortOption) || "newest";
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const view = searchParams.get("view");
    if (view === "grid" || view === "list") return view;
    // Check localStorage only on client
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "grid" || stored === "list") return stored;
    }
    return "grid";
  });

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter (title, excerpt, tags)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter (OR logic)
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchQuery, selectedTags, sortOption]);

  // Update URL params (debounced for search)
  const updateUrl = useCallback(
    (params: {
      q?: string;
      tags?: string[];
      sort?: BlogSortOption;
      view?: ViewMode;
    }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.q !== undefined) {
        if (params.q) newParams.set("q", params.q);
        else newParams.delete("q");
      }

      if (params.tags !== undefined) {
        if (params.tags.length > 0)
          newParams.set("tags", params.tags.join(","));
        else newParams.delete("tags");
      }

      if (params.sort !== undefined) {
        if (params.sort !== "newest") newParams.set("sort", params.sort);
        else newParams.delete("sort");
      }

      if (params.view !== undefined) {
        if (params.view !== "grid") newParams.set("view", params.view);
        else newParams.delete("view");
      }

      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : "/blog", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  // Handlers
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      updateUrl({ q: value });
    },
    [updateUrl]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        const newTags = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        updateUrl({ tags: newTags });
        return newTags;
      });
    },
    [updateUrl]
  );

  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
    updateUrl({ tags: [] });
  }, [updateUrl]);

  const handleSortChange = useCallback(
    (value: BlogSortOption | ProductSortOption) => {
      setSortOption(value as BlogSortOption);
      updateUrl({ sort: value as BlogSortOption });
    },
    [updateUrl]
  );

  const handleViewModeChange = useCallback(
    (value: ViewMode) => {
      setViewMode(value);
      localStorage.setItem(STORAGE_KEY, value);
      updateUrl({ view: value });
    },
    [updateUrl]
  );

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortOption("newest");
    router.replace("/blog", { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || sortOption !== "newest";

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Header Navigation */}
        <BlogNavigation />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        {/* Back Navigation */}
        <div
          className="sticky z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3"
          style={{ top: NAV_HEIGHT }}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        </div>

        <main
          id="main-content"
          className="container mx-auto px-4 max-w-7xl py-8 isolate"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and stories from the {SITE_NAME} team.
            </p>
          </div>

          {/* Controls */}
          <FilterControls
            variant="blog"
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search posts..."
            showResultsCount={false}
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearTags={handleClearTags}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          {/* Results Count & Clear */}
          {hasActiveFilters && (
            <div className="relative z-50 flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "post" : "posts"} found
              </p>
              <button
                onClick={handleClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Posts Grid/List */}
          {filteredPosts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, idx) => (
                  <BlogCardGrid key={post.id} post={post} index={idx} />
                ))}
              </div>
            ) : (
              <div className="relative z-0 flex flex-col gap-4">
                {filteredPosts.map((post, idx) => (
                  <BlogCardList key={post.id} post={post} index={idx} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No posts found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

/**
 * Grid view card component for blog posts.
 */
function BlogCardGrid({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <Card className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
          <motion.div className="aspect-video bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden border-b border-border">
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
            <CardDescription className="mb-4 flex-1 line-clamp-2">
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
      </Link>
    </motion.div>
  );
}
