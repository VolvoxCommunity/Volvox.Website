"use client";

import { ArrowSquareOut, Briefcase } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface ChatTeamCardProps {
  slug: string;
  reason: string;
  name?: string;
  role?: string;
  avatar?: string;
  profileUrl?: string;
  isHireable?: boolean;
}

export function ChatTeamCard({
  slug,
  reason,
  name,
  role,
  avatar,
  profileUrl,
  isHireable,
}: ChatTeamCardProps) {
  const url = profileUrl ?? `/team/${slug}`;
  const displayName = name ?? slug;
  const displayRole = role ?? "Volvox team member";

  return (
    <div className="group relative my-2 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-3 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-muted">
          {avatar ? (
            <Image
              src={avatar}
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
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </h4>
            {isHireable && (
              <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                Hireable
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {displayRole}
          </p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/70">
            {reason}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          View profile
          <ArrowSquareOut className="h-3 w-3" weight="bold" />
        </Link>
        {isHireable && (
          <Link
            href={`/team/${slug}#hire`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            <Briefcase className="h-3 w-3" weight="bold" />
            Hire
          </Link>
        )}
      </div>
    </div>
  );
}
