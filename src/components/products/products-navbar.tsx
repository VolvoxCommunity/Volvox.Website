"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { motion } from "framer-motion";
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
import { NAV_ITEMS } from "@/lib/constants";
import { ProductSortOption, ViewMode } from "@/components/ui/filter-controls";

interface ProductsNavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTech: string[];
  allTech: string[];
  onTechToggle: (tech: string) => void;
  onClearTech: () => void;
  sortOption: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  resultCount: number;
}

export function ProductsNavbar({
  searchQuery,
  onSearchChange,
  selectedTech,
  allTech,
  onTechToggle,
  onClearTech,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: ProductsNavbarProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1001] w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl py-2 md:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-8 grow-0 shrink-0">
          {/* Mobile Back Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              aria-label="Back to Home"
              className="shrink-0 rounded-full hover:bg-muted/50 w-8 h-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Logo & Name */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 shrink-0 no-underline"
          >
            <Image
              src="/logo.png"
              alt="Volvox Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain rounded-md"
              priority
            />
            <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-base text-foreground">
              Volvox
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === "products";
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium py-2 px-3 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-foreground/5 text-foreground"
                      : "opacity-60 text-foreground hover:opacity-100 hover:bg-foreground/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center/Right Section: Search */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 overflow-hidden">
          <motion.div
            layout
            className={cn(
              "relative transition-all duration-300 flex-1",
              isSearchFocused
                ? "shadow-lg rounded-full"
                : "max-w-[256px] md:max-w-none"
            )}
          >
            <div className="relative group w-full">
              <MagnifyingGlass
                className={cn(
                  "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors z-10",
                  isSearchFocused ? "text-primary" : "text-muted-foreground"
                )}
              />
              <input
                type="text"
                placeholder={`Search ${resultCount}...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "w-full h-8 sm:h-9 md:h-11 pl-8 sm:pl-10 md:pl-12 pr-8 bg-muted/40 backdrop-blur-sm border border-border/20 rounded-full text-[10px] sm:text-xs md:text-sm",
                  "focus:outline-none focus:bg-background focus:border-border transition-all",
                  "placeholder:text-muted-foreground/50 focus:ring-0 focus:ring-offset-0 ring-0 outline-none",
                  !isSearchFocused &&
                    "hover:bg-muted/60 hover:border-border/30 ring-0 focus:ring-0 focus:ring-offset-0 ring-offset-0"
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors transition-opacity"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Controls & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Tech Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 gap-2 rounded-full border-border/60",
                    selectedTech.length > 0 &&
                      "bg-secondary/10 border-secondary/50 text-primary"
                  )}
                >
                  <span>Tech Stack</span>
                  {selectedTech.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 rounded-full text-[10px]"
                    >
                      {selectedTech.length}
                    </Badge>
                  )}
                  <CaretDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Filter by Tech</h4>
                    {selectedTech.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearTech}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {allTech.map((tech) => {
                      const isSelected = selectedTech.includes(tech);
                      return (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => onTechToggle(tech)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs transition-all border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="w-px h-6 bg-border/50" />

            {/* Sort Dropdown (Desktop) */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-full border-border/60"
                >
                  <span className="text-muted-foreground">Sort:</span>
                  <span className="font-medium">
                    {sortOption === "a-z" ? "A-Z" : "Z-A"}
                  </span>
                  <CaretDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[180px] p-1.5 rounded-2xl"
                align="end"
              >
                <div className="flex flex-col gap-1">
                  {[
                    { value: "a-z", label: "A-Z" },
                    { value: "z-a", label: "Z-A" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() =>
                        onSortChange(opt.value as ProductSortOption)
                      }
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left rounded-xl transition-all",
                        sortOption === opt.value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* View Mode Toggle */}
            <fieldset className="flex bg-muted/30 p-1 rounded-full border border-border/30 m-0">
              <legend className="sr-only">View mode</legend>
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
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
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
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
            </fieldset>
          </div>

          {/* Mobile Filter Trigger */}
          <div className="md:hidden">
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Open filters"
                  className="rounded-full w-8 h-8 sm:w-9 sm:h-9 p-0"
                >
                  <Funnel
                    className={cn(
                      "h-4 w-4",
                      (selectedTech.length > 0 || sortOption !== "a-z") &&
                        "text-primary"
                    )}
                    weight={selectedTech.length > 0 ? "fill" : "regular"}
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[400px] rounded-[2rem] p-6 gap-6 border-border/60 shadow-2xl z-[3000]">
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
                        { value: "a-z", label: "Name (A-Z)" },
                        { value: "z-a", label: "Name (Z-A)" },
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() =>
                            onSortChange(opt.value as ProductSortOption)
                          }
                          className={cn(
                            "flex-1 px-3 py-2.5 text-[11px] font-semibold rounded-[2rem] transition-all duration-300",
                            sortOption === opt.value
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tech Stack ({selectedTech.length})
                      </span>
                      {selectedTech.length > 0 && (
                        <button
                          type="button"
                          onClick={onClearTech}
                          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 -mr-2">
                      {allTech.map((tech) => {
                        const isSelected = selectedTech.includes(tech);
                        return (
                          <button
                            type="button"
                            key={tech}
                            onClick={() => onTechToggle(tech)}
                            className={cn(
                              "px-3.5 py-2 rounded-[2rem] text-xs font-medium border transition-all duration-200 active:scale-95",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background border-border/60 text-muted-foreground hover:border-border hover:bg-muted/20 hover:text-foreground"
                            )}
                          >
                            {tech}
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
    </header>
  );
}
