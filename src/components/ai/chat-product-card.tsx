"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface ChatProductCardProps {
  slug: string;
  reason: string;
  name?: string;
  tagline?: string;
  pageUrl?: string;
  image?: string;
}

export function ChatProductCard({
  slug,
  reason,
  name,
  tagline,
  pageUrl,
  image,
}: ChatProductCardProps) {
  const url = pageUrl ?? `/products/${slug}`;
  const displayName = name ?? slug;
  const displayTagline = tagline ?? "Volvox product";

  return (
    <div className="group relative my-2 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-3 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-muted">
          {image ? (
            <Image
              src={image}
              alt={displayName}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </h4>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {displayTagline}
          </p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/70">
            {reason}
          </p>
        </div>
      </div>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        View product
        <ArrowSquareOut className="h-3 w-3" weight="bold" />
      </Link>
    </div>
  );
}
