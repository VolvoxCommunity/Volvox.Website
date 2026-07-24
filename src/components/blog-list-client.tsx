"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { BlogNavbar } from "@/components/blog/blog-navbar";
import { BlogCard } from "@/components/blog-card";
import { Footer } from "@/components/footer";
import type { BlogSortOption } from "@/components/ui/filter-controls";
import { SITE_NAME } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";

interface BlogListClientProps {
  posts: BlogPost[];
}

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

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    });
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
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Tag filter (OR logic)
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag)),
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
    (params: { q?: string; tags?: string[]; sort?: BlogSortOption }) => {
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

      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : "/blog", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  // Handlers
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updateUrl({ q: query });
    },
    [updateUrl],
  );

  const handleSortChange = useCallback(
    (sort: BlogSortOption) => {
      setSortOption(sort);
      updateUrl({ sort });
    },
    [updateUrl],
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
    [updateUrl],
  );

  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
    updateUrl({ tags: [] });
  }, [updateUrl]);

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
              className="text-5xl md:text-7xl font-editorial italic font-medium mb-4 text-balance"
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

          {/* Posts Grid */}
          <section aria-label="Blog posts">
            {filteredPosts.length > 0 ? (
              <div className="relative z-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
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
