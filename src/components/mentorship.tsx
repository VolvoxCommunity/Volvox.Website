"use client";

// Framework imports
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Third-party imports
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
  useAnimationFrame,
  useMotionValue,
  useVelocity,
} from "framer-motion";
import { DiscordLogo, Users } from "@phosphor-icons/react";
import confettiLib from "canvas-confetti";

// Local imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TeamMember } from "@/lib/types";
import { DISCORD_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
// Custom wrap function to replace @motionone/utils dependency
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

/**
 * Converts pixel drag distance to percentage movement in the marquee coordinate space.
 * The marquee uses percentage-based positioning (0-25% range for seamless looping),
 * so this factor maps raw pixel deltas to that coordinate system.
 */
const DRAG_PIXEL_TO_PERCENT = 0.015;

interface MentorshipProps {
  teamMembers: TeamMember[];
}

export function Mentorship({ teamMembers }: MentorshipProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDiscordClick = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    void confettiLib({
      particleCount: 150,
      spread: 70,
      origin: { x, y },
      colors: ["#007AFF", "#AF58DA", "#FF9500"],
      shapes: ["circle", "square"],
    });
    window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
  };

  const handleTeamClick = () => {
    router.push("/team");
  };

  return (
    <section
      id="mentorship"
      ref={containerRef}
      aria-label="Community"
      data-testid="mentorship-section"
      className="relative min-h-[600px] w-full overflow-hidden bg-background flex flex-col items-center justify-center py-16 md:py-24"
    >
      {/* Background layer */}

      {/* Header Content */}
      <div className="relative z-10 container mx-auto px-6 text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-jetbrains-mono)] font-bold tracking-tight mb-6">
          Our <span className="text-aurora">Community</span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Meet the mentors and builders who make up the Volvox ecosystem. Join
          our community to learn, grow, and build together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton strength={0.3}>
            <Button
              variant="accent"
              size="lg"
              className="h-14 px-8 text-base gap-3"
              onClick={handleDiscordClick}
              aria-label="Join our Discord community (opens in new tab)"
            >
              <DiscordLogo
                weight="fill"
                className="h-6 w-6"
                aria-hidden="true"
              />
              Join Us
            </Button>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Button
              size="lg"
              variant="ghost"
              className="h-14 px-8 text-base gap-3 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md"
              onClick={handleTeamClick}
              aria-label="View team members page"
            >
              <Users weight="fill" className="h-6 w-6" aria-hidden="true" />
              Meet the Team
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Draggable Velocity Marquee */}
      <div className="relative z-10 w-full overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Left/Right Fade Gradients */}
        <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        <ParallaxText baseVelocity={-1} teamMembers={teamMembers} />
      </div>

      {/* Top/Bottom Fade Gradients */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}

// --- Internal Components ---

interface ParallaxTextProps {
  baseVelocity: number;
  teamMembers: TeamMember[];
}

function ParallaxText({ baseVelocity, teamMembers }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Duplicate data multiple times for a truly infinite feel
  const marqueeData = useMemo(() => {
    return [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
  }, [teamMembers]);

  /**
   * We wrap between 0 and -25% (since we have 4 copies, 25% represents one full set)
   * This ensures a seamless loop.
   */
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const prevT = useRef<number>(0);

  useAnimationFrame((t) => {
    if (!prevT.current) {
      prevT.current = t;
      return;
    }

    const timeDelta = t - prevT.current;
    prevT.current = t;

    // Skip update if paused
    if (isHovered || isDragging) return;

    // baseVelocity is -1.
    // We want slow, steady movement.
    // 0.005 factor for smoothness with timeDelta (approx 0.08% per frame at 16ms)
    let moveBy = baseVelocity * (timeDelta * 0.005);

    /**
     * Scroll velocity adds to the speed
     * Scrolling increases speed in the same direction (negative X / left)
     */
    const v = velocityFactor.get();
    if (v !== 0) {
      // Math.abs(v) ensures scroll direction (up or down) always speeds it up leftwards
      moveBy -= Math.abs(v) * (timeDelta * 0.005);
    }

    baseX.set(baseX.get() + moveBy);
  });

  const handleDragEnd = () => {
    setIsDragging(false);
    // Reset prevT to avoid jump when resuming
    prevT.current = 0;
  };

  return (
    <motion.div
      className="flex gap-4 md:gap-6 w-max py-4"
      style={{ x }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      drag="x"
      // Large constraints to allow free sliding
      dragConstraints={{ left: -5000, right: 5000 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => {
        // Update baseX directly based on drag delta
        baseX.set(baseX.get() + info.delta.x * DRAG_PIXEL_TO_PERCENT);
      }}
      dragElastic={0}
      dragMomentum={false}
    >
      {marqueeData.map((profile, i) => (
        <CommunityCard key={`${profile.id}-${i}`} profile={profile} />
      ))}
    </motion.div>
  );
}

function CommunityCard({ profile }: { profile: TeamMember }) {
  return (
    <div
      className={cn(
        "shrink-0 w-[320px] md:w-[400px] rounded-[24px] border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300",
        "border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 select-none"
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 border-2 border-border shadow-md">
          <AvatarImage
            src={profile.avatar}
            alt={profile.name}
            draggable={false}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {profile.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-foreground text-base truncate leading-tight">
            {profile.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {profile.type === "mentor" ? (
              <Badge
                variant="default"
                className="bg-primary/20 text-primary border-primary/20 text-[10px] px-2 h-5"
              >
                MENTOR
              </Badge>
            ) : profile.type === "builder" ? (
              <Badge
                variant="secondary"
                className="bg-secondary/20 text-secondary border-secondary/20 text-[10px] px-2 h-5"
              >
                BUILDER
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-accent/20 text-accent border-accent/20 text-[10px] px-2 h-5"
              >
                MENTEE
              </Badge>
            )}
            {(profile.type === "mentor" || profile.type === "builder") && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                {profile.role}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Bio / Goal Snippet */}
        <p className="text-sm text-muted-foreground line-clamp-4 min-h-[4em] leading-relaxed">
          {profile.type === "mentee" ? profile.goals : profile.bio}
        </p>

        {/* Tech Stack / Progress Mini-bar */}
        {profile.type === "mentee" ? (
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-purple-500"
              style={{ width: profile.progress }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {profile.expertise?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-muted text-muted-foreground border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
