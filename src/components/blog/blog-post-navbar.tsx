"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function BlogPostNavbar() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full bg-background border-b border-border/40"
    >
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl py-2 md:py-3 flex items-center gap-1.5 sm:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/#blog", { scroll: false })}
          aria-label="Back to Blog"
          data-testid="blog-post-navbar-back"
          className="shrink-0 rounded-full hover:bg-muted/50 w-9 h-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground ml-2">
          Back to Articles
        </span>
      </div>
    </motion.div>
  );
}
