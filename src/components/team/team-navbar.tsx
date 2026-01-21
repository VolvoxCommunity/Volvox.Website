"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterMode = "all" | "mentors";

interface TeamNavbarProps {
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  resultCount: number;
}

export function TeamNavbar({
  filterMode,
  onFilterChange,
  resultCount,
}: TeamNavbarProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 w-full bg-background border-b border-b-border/40">
      <div className="container mx-auto px-4 max-w-7xl py-2 md:py-3 flex items-center justify-between gap-4">
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

        {/* Center: Title & Count */}
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-muted-foreground">
            {resultCount} {resultCount === 1 ? "Member" : "Members"}
          </span>
        </div>

        {/* Right: Filter Controls */}
        <div className="flex bg-muted/30 p-1 rounded-full border border-border/30">
          {[
            { value: "all", label: "All" },
            { value: "mentors", label: "Mentors" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value as FilterMode)}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-all",
                filterMode === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
