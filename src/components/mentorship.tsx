"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AnimatedBackground } from "@/components/animated-background";
import { DiscordLogo, Users } from "@phosphor-icons/react";
import { TeamMember } from "@/lib/types";
import confettiLib from "canvas-confetti";
import { DISCORD_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

interface MentorshipProps {
  teamMembers: TeamMember[];
}

export function Mentorship({ teamMembers }: MentorshipProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseOffset, setBaseOffset] = useState(0);

  // Duplicate data for seamless infinite scroll
  const marqueeData = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    // Duplicate 4x for smooth infinite scroll
    return [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
  }, [teamMembers]);

  // Track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Convert scroll progress to a smooth x offset (multiplied for effect)
  const scrollX = useTransform(scrollYProgress, [0, 1], [0, -1500]);
  const smoothX = useSpring(scrollX, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Base auto-scroll animation
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setBaseOffset((prev) => {
        const newOffset = prev - 0.5; // Base speed
        // Reset when scrolled too far (based on content width)
        if (newOffset < -2000) return 0;
        return newOffset;
      });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleDiscordClick = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    void confettiLib({
      particleCount: 150,
      spread: 70,
      origin: { x, y },
      colors: ["#5865F2", "#00FFF0", "#FF00AA"],
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
      className="relative min-h-[600px] w-full overflow-hidden bg-background flex flex-col items-center justify-center py-16 md:py-24"
    >
      {/* Background layer */}
      <AnimatedBackground
        className="absolute inset-0 z-0"
        colors={[
          { color: "var(--background)", stop: "0%" },
          {
            color: "color-mix(in oklch, var(--primary), transparent 90%)",
            stop: "50%",
          },
          { color: "var(--background)", stop: "100%" },
        ]}
        enableNoise={true}
        noiseIntensity={0.5}
      />

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
              size="lg"
              className="h-14 px-8 text-base gap-3 shadow-[0_0_40px_-10px_var(--primary)] border border-primary/50"
              onClick={handleDiscordClick}
            >
              <DiscordLogo weight="fill" className="h-6 w-6" />
              Join Us
            </Button>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Button
              size="lg"
              variant="ghost"
              className="h-14 px-8 text-base gap-3 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md"
              onClick={handleTeamClick}
            >
              <Users weight="fill" className="h-6 w-6" />
              Meet the Team
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Horizontal Marquee - Scroll Velocity Driven */}
      <div className="relative z-10 w-full overflow-hidden">
        {/* Left/Right Fade Gradients */}
        <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Marquee Track - Driven by scroll velocity + base animation */}
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          style={{ x: smoothX }}
        >
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{ x: baseOffset }}
            transition={{ duration: 0, ease: "linear" }}
          >
            {marqueeData.map((profile, i) => (
              <CommunityCard key={`${profile.id}-${i}`} profile={profile} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Top/Bottom Fade Gradients */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}

// --- Internal Components ---

function CommunityCard({ profile }: { profile: TeamMember }) {
  return (
    <div
      className={cn(
        "shrink-0 w-[280px] md:w-[320px] rounded-[24px] border bg-card/80 backdrop-blur-sm p-5 transition-all duration-300",
        "border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 border-2 border-border shadow-md">
          <AvatarImage src={profile.avatar} alt={profile.name} />
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
            ) : (
              <Badge
                variant="secondary"
                className="bg-secondary/20 text-secondary border-secondary/20 text-[10px] px-2 h-5"
              >
                BUILDER
              </Badge>
            )}
            {profile.type === "mentor" && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                {profile.role}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Bio / Goal Snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em] leading-relaxed">
          {profile.type === "mentor" ? profile.bio : profile.goals}
        </p>

        {/* Tech Stack / Progress Mini-bar */}
        {profile.type === "mentor" ? (
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
        ) : (
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary to-purple-500 w-[60%]" />
          </div>
        )}
      </div>
    </div>
  );
}
