"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

type FilterMode = "all" | "mentors";

interface TeamNavbarProps {
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  allCount: number;
  mentorsCount: number;
}

export function TeamNavbar({
  filterMode,
  onFilterChange,
  allCount,
  mentorsCount,
}: TeamNavbarProps) {
  const router = useRouter();

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "blog", label: "Blog", href: "/#blog" },
    { id: "mentorship", label: "Community", href: "/#mentorship" },
    { id: "team", label: "Team", href: "/team" },
    { id: "about", label: "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-[1001] w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 max-w-7xl py-2 md:py-3 flex items-center justify-between gap-4">
        {/* Left: Desktop Logo / Mobile Back Button & Desktop Links */}
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

          {/* Desktop Logo */}
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

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navItems.map((item) => {
              const isActive = item.id === "team";
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

        {/* Right: Filter Controls & Mobile Burger */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/30 p-1 rounded-full border border-border/30">
            {[
              { value: "all", label: "All", count: allCount },
              { value: "mentors", label: "Mentors", count: mentorsCount },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => onFilterChange(opt.value as FilterMode)}
                className={cn(
                  "px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
                  filterMode === opt.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px]",
                    filterMode === opt.value
                      ? "bg-primary/10 text-primary"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
