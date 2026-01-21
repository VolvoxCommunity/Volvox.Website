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

  const handleCardClick = () => {
    router.push(`/team/${member.slug}`);
  };

  const displayText = member.type === "mentee" ? member.goals : member.tagline;

  return (
    <div
      className={cn(
        "group relative rounded-[32px] bg-card overflow-hidden",
        "h-[440px] md:h-[500px] p-2 transition-all duration-300",
        "hover:shadow-lg cursor-pointer"
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View ${member.name}'s profile`}
    >
      {/* Full-bleed Image */}
      <div className="absolute top-2 left-2 right-2 bottom-2 md:bottom-[160px] group-hover:bottom-2 transition-all duration-300 rounded-[24px] overflow-hidden">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Progressive Blur + Gradient Overlay (Bottom ~35%) */}
      <div className="absolute bottom-0 right-0 left-0 rounded-[24px] overflow-hidden pointer-events-none z-[5] h-[160px]">
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
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col h-[160px]">
        {/* Name & Mentor Tag */}
        <div className="relative h-[28px] mb-2 pr-[70px] flex items-center">
          <h3 className="text-lg md:text-xl font-bold text-foreground truncate leading-tight">
            {member.name.split(" ").slice(0, 2).join(" ")}
          </h3>
          {member.type === "mentor" && (
            <Badge
              variant="default"
              className="absolute top-0 right-0 bg-primary text-primary-foreground border-none text-[10px] px-2 h-5 font-bold"
            >
              MENTOR
            </Badge>
          )}
        </div>

        {/* Tagline */}
        <div className="h-[52px] mb-4 flex items-start">
          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
            {displayText}
          </p>
        </div>

        {/* Bottom Actions: Member Tag & View Details Button */}
        <div className="flex items-center gap-3 h-8 mt-auto">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 rounded-full h-8 text-xs font-bold"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/team/${member.slug}`);
            }}
            data-testid={`profile-button-${member.slug}`}
          >
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
