"use client";

import { ArrowSquareOut, Clock } from "@phosphor-icons/react";
import Link from "next/link";

interface ChatBlogCardProps {
  slug: string;
  reason: string;
  title?: string;
  excerpt?: string;
  authorName?: string;
  readingTime?: number;
  url?: string;
}

export function ChatBlogCard({
  slug,
  reason,
  title,
  excerpt,
  authorName,
  readingTime,
  url,
}: ChatBlogCardProps) {
  const link = url ?? `/blog/${slug}`;
  const displayTitle = title ?? slug;

  return (
    <div className="group relative my-2 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-3 backdrop-blur-sm">
      <div className="space-y-1.5">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {displayTitle}
        </h4>
        <p className="line-clamp-2 text-xs leading-relaxed text-foreground/70">
          {reason || excerpt}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {authorName && <span>{authorName}</span>}
          {authorName && readingTime && <span>·</span>}
          {readingTime && readingTime > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {readingTime} min
            </span>
          )}
        </div>
      </div>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Read post
        <ArrowSquareOut className="h-3 w-3" weight="bold" />
      </Link>
    </div>
  );
}
