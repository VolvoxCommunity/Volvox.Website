"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MagnifyingGlass,
  X,
  List,
  SquaresFour,
  CaretDown,
  SortAscending,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Shared types
export type ViewMode = "grid" | "list";

// Blog-specific types
export type BlogSortOption = "newest" | "oldest" | "views";
const BLOG_SORT_OPTIONS: { value: BlogSortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "views", label: "Most Viewed" },
];

// Product-specific types
export type ProductSortOption = "a-z" | "z-a";
const PRODUCT_SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "a-z", label: "Name A-Z" },
  { value: "z-a", label: "Name Z-A" },
];

/**
 * Unified filter controls component for blog/products listings.
 * Supports search, optional tag filtering, sort dropdown, and grid/list view toggle.
 *
 * @param variant - The type of controls: "blog", "product", "homepage-blog", or "homepage-product"
 * @param searchQuery - Current search query value
 * @param onSearchChange - Callback when search query changes (debounced by 300ms)
 * @param searchPlaceholder - Placeholder text for search input
 * @param showResultsCount - Whether to show results count (default: true)
 * @param resultCount - Number of filtered results
 * @param totalCount - Total number of items
 * @param sortOption - Current sort option
 * @param onSortChange - Callback when sort option changes
 * @param viewMode - Current view mode (grid or list)
 * @param onViewModeChange - Callback when view mode changes
 * @param allTags - Array of all available tags for filtering (blog/product only)
 * @param selectedTags - Array of currently selected tags
 * @param onTagToggle - Callback when a tag is toggled
 * @param onClearTags - Callback to clear all tag selections
 */
export interface FilterControlsProps {
  variant: "blog" | "product" | "homepage-blog" | "homepage-product";
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  showResultsCount?: boolean;
  resultCount?: number;
  totalCount?: number;
  sortOption: BlogSortOption | ProductSortOption;
  onSortChange: (value: BlogSortOption | ProductSortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  // Tag filtering (only used by blog/product variants)
  allTags?: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  onClearTags?: () => void;
}

export function FilterControls({
  variant,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  showResultsCount = true,
  resultCount = 0,
  totalCount = 0,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  // Tag filtering props (optional, only for blog/product variants)
  allTags = [],
  selectedTags = [],
  onTagToggle = () => {},
  onClearTags = () => {},
}: FilterControlsProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Determine sort options based on variant
  const sortOptions =
    variant === "homepage-product" || variant === "product"
      ? PRODUCT_SORT_OPTIONS
      : BLOG_SORT_OPTIONS;

  // Determine if tag filtering should be shown
  const showTagFilters =
    (variant === "blog" || variant === "product") && allTags.length > 0;

  const tagLabel = variant === "product" ? "Tech:" : "Tags:";

  // Debounce search input
  const handleSearchInput = useCallback(
    (value: string) => {
      setDebouncedQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange]
  );

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync debounced query with external changes
  useEffect(() => {
    setDebouncedQuery(searchQuery);
  }, [searchQuery]);

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortOption)?.label || "Sort";

  const hasActiveFilters = debouncedQuery.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={debouncedQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          aria-label="Search"
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
        />
        {debouncedQuery && (
          <button
            onClick={() => {
              setDebouncedQuery("");
              onSearchChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tags and Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Tag Filters (optional) */}
        {showTagFilters && (
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <span className="text-sm text-muted-foreground shrink-0">
              {tagLabel}
            </span>
            <button
              onClick={onClearTags}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors shrink-0",
                selectedTags.length === 0
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-transparent text-muted-foreground border-border hover:border-secondary/50"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors shrink-0",
                  selectedTags.includes(tag)
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-transparent text-muted-foreground border-border hover:border-secondary/50"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort and View Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:border-secondary/50 transition-colors bg-background"
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
            >
              <SortAscending className="h-4 w-4" />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <CaretDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  sortOpen && "rotate-180"
                )}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[150px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg",
                      sortOption === option.value &&
                        "bg-secondary/10 text-secondary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <SquaresFour className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {showResultsCount && (
        <div className="text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">{resultCount}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalCount}</span>
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              total
            </>
          )}
        </div>
      )}
    </div>
  );
}
