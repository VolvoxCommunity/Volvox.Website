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

type SortOption = "newest" | "oldest" | "views";
type ViewMode = "grid" | "list";

interface BlogListControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "views", label: "Most Viewed" },
];

/**
 * Controls component for the blog listing page.
 * Includes search input, tag filters, sort dropdown, and layout toggle.
 */
export function BlogListControls({
  searchQuery,
  onSearchChange,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
}: BlogListControlsProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
    SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || "Sort";

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search posts..."
          value={debouncedQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          aria-label="Search blog posts"
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
        {/* Tags */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <span className="text-sm text-muted-foreground shrink-0">Tags:</span>
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
                {SORT_OPTIONS.map((option) => (
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
    </div>
  );
}
