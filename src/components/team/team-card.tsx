"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "group relative rounded-[32px] bg-card overflow-hidden",
        "h-[420px] md:h-[480px] p-2 transition-all duration-300",
        "hover:shadow-lg"
      )}
    >
      {/* Full-bleed Image */}
      <div className="absolute top-2 left-2 right-2 bottom-2 md:bottom-1/3 group-hover:bottom-2 transition-all duration-300 rounded-[24px] overflow-hidden">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500"
        />
      </div>

      {/* Progressive Blur + Gradient Overlay (Bottom 1/3) */}
      <div className="absolute bottom-0 right-0 left-0 rounded-[24px] overflow-hidden pointer-events-none z-[5] h-1/2">
        {/* Layer 1 - Base blur that fades */}
        <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]" />
        {/* Layer 2 - Medium blur fading at 60% */}
        <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_0%,transparent_60%)]" />
        {/* Layer 3 - Strong blur fading at 30% */}
        <div className="absolute inset-0 backdrop-blur-[16px] [mask-image:linear-gradient(to_top,black_0%,transparent_30%)]" />
        {/* Gradient tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/15 to-transparent" />
      </div>

      {/* Content at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col gap-1">
        {/* Name & Mentor Tag */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-foreground truncate max-w-[70%]">
            {member.name.split(" ").slice(0, 2).join(" ")}
          </h3>
          {member.type === "mentor" && (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground border-none text-[10px] px-2 h-5 font-bold"
            >
              MENTOR
            </Badge>
          )}
        </div>

        {/* Tagline (Bio) - Truncated to one line */}
        <p className="text-sm text-foreground/80 line-clamp-1 mb-4">
          {member.tagline}
        </p>

        {/* Bottom Actions: Member Tag & View Details Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 rounded-full h-8 text-xs font-bold"
            onClick={() => router.push(`/team/${member.slug}`)}
            data-testid={`profile-button-${member.slug}`}
          >
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
