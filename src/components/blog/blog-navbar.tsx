"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  ArrowLeft,
  List,
  SquaresFour,
  CaretDown,
  X,
  Funnel,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BlogSortOption, ViewMode } from "@/components/ui/filter-controls";

interface BlogNavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  allTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  sortOption: BlogSortOption;
  onSortChange: (value: BlogSortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  resultCount: number;
}

export function BlogNavbar({
  searchQuery,
  onSearchChange,
  selectedTags,
  allTags,
  onTagToggle,
  onClearTags,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: BlogNavbarProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 w-full bg-background border-b border-border/40">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl py-2 md:py-3 flex items-center gap-1.5 sm:gap-4">
        {/* Left: Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          aria-label="Back to Home"
          className="shrink-0 rounded-full hover:bg-muted/50 w-9 h-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Center: Search Bar */}
        <div
          className={cn(
            "flex-1 max-w-md relative transition-all duration-300",
            isSearchFocused
              ? "max-w-xl shadow-lg ring-2 ring-primary/10 rounded-full"
              : ""
          )}
        >
          <div className="relative group">
            <MagnifyingGlass
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                isSearchFocused ? "text-primary" : "text-muted-foreground"
              )}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-full h-10 sm:h-11 pl-11 sm:pl-12 pr-10 bg-muted/30 border border-transparent rounded-full text-sm",
                "focus:outline-none focus:bg-background focus:border-border transition-all",
                "placeholder:text-muted-foreground/50",
                !isSearchFocused && "hover:bg-muted/50 hover:border-border/30"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Desktop Controls */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* Tags Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 gap-2 rounded-full border-border/60",
                  selectedTags.length > 0 &&
                    "bg-secondary/10 border-secondary/50 text-primary"
                )}
              >
                <span>Tags</span>
                {selectedTags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 rounded-full text-[10px]"
                  >
                    {selectedTags.length}
                  </Badge>
                )}
                <CaretDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filter by Tags</h4>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={onClearTags}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => onTagToggle(tag)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs transition-all border",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />

          {/* Sort Buttons */}
          <div className="flex bg-muted/30 p-1 rounded-full border border-border/30">
            {[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "views", label: "Views" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value as BlogSortOption)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                  sortOption === opt.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex bg-muted/30 p-1 rounded-full border border-border/30">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 rounded-full transition-all",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <SquaresFour className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 rounded-full transition-all",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-9 h-9 p-0"
              >
                <Funnel
                  className={cn(
                    "h-4 w-4",
                    (selectedTags.length > 0 || sortOption !== "newest") &&
                      "text-primary"
                  )}
                  weight={selectedTags.length > 0 ? "fill" : "regular"}
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[400px] rounded-[2rem] p-6 gap-6 border-border/60 shadow-2xl">
              <DialogHeader className="mb-2 text-left space-y-0">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Filters & Sort
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                {/* Sort */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                    Sort by
                  </span>
                  <div className="flex bg-muted/30 p-1.5 rounded-[2rem] border border-border/30 w-full overflow-hidden">
                    {[
                      { value: "newest", label: "Newest First" },
                      { value: "oldest", label: "Oldest First" },
                      { value: "views", label: "Most Viewed" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          onSortChange(opt.value as BlogSortOption)
                        }
                        className={cn(
                          "flex-1 px-3 py-2.5 text-[11px] font-semibold rounded-[2rem] transition-all duration-300",
                          sortOption === opt.value
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {opt.label === "Newest First"
                          ? "Newest"
                          : opt.label === "Oldest First"
                            ? "Oldest"
                            : "Most Viewed"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tags ({selectedTags.length})
                    </span>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={onClearTags}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 -mr-2">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => onTagToggle(tag)}
                          className={cn(
                            "px-3.5 py-2 rounded-[2rem] text-xs font-medium border transition-all duration-200 active:scale-95",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background border-border/60 text-muted-foreground hover:border-border hover:bg-muted/20 hover:text-foreground"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center flex flex-col items-center">
                <Button
                  size="lg"
                  className="w-full rounded-[2rem] h-12 text-base font-semibold shadow-lg shadow-primary/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Filters ({resultCount})
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
