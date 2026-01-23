"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogPost } from "@/lib/types";
import {
  type BlogSortOption,
  type ProductSortOption,
  type ViewMode,
} from "@/components/ui/filter-controls";
import { BlogNavbar } from "@/components/blog/blog-navbar";
import { BlogCard } from "@/components/blog-card";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { SITE_NAME } from "@/lib/constants";

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
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        <BlogNavbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedTags={selectedTags}
          allTags={allTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          resultCount={filteredPosts.length}
        />

        <main
          id="main-content"
          className="container mx-auto px-4 max-w-7xl pt-16 pb-8 isolate"
          aria-labelledby="blog-page-heading"
        >
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1
              id="blog-page-heading"
              className="text-4xl md:text-6xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-4"
            >
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and stories from the {SITE_NAME} team.
            </p>
          </header>

          {/* Results Count & Clear (Only show clear all here if filters active, count passed to navbar for mobile) */}
          {hasActiveFilters && (
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-muted-foreground"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Posts Grid/List */}
          <section aria-label="Blog posts">
            {filteredPosts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "relative z-0 flex flex-col gap-4"
                }
              >
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No posts found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
