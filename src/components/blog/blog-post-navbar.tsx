"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

export function BlogPostNavbar() {
  const router = useRouter();

  return (
    <header
      data-testid="blog-post-navbar"
      className="sticky top-0 z-[1001] w-full bg-background/80 backdrop-blur-md border-b border-border/40"
    >
      <div className="container mx-auto px-4 max-w-7xl py-2 md:py-3 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-8 grow-0 shrink-0">
          {/* Mobile Back Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/#blog")}
              aria-label="Back to Blog"
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
              const isActive = item.id === "blog";
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

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/#blog")}
            className="hidden md:flex rounded-full gap-2 border-border/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Articles</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
