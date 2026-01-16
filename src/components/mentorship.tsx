"use client";

import { useRef, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AnimatedBackground } from "@/components/animated-background";
import { DiscordLogo, GithubLogo } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TeamMember } from "@/lib/types";
import confettiLib from "canvas-confetti";
import { DISCORD_URL, GITHUB_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MentorshipProps {
  teamMembers: TeamMember[];
}

export function Mentorship({ teamMembers }: MentorshipProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate for infinite loop illusion
  const streamData = useMemo(() => {
    // Ensure we have enough data to scroll
    if (!teamMembers || teamMembers.length === 0) return [];
    return [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];
  }, [teamMembers]);

  // Distribute into 3 columns
  const col1 = streamData.filter((_, i) => i % 3 === 0);
  const col2 = streamData.filter((_, i) => i % 3 === 1);
  const col3 = streamData.filter((_, i) => i % 3 === 2);

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

  const handleGithubClick = () => {
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="mentorship"
      ref={containerRef}
      className="relative min-h-[850px] w-full overflow-hidden bg-background flex flex-col items-center justify-center py-20"
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

      {/* The Neural Stream Container */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 md:opacity-60 pointer-events-none md:pointer-events-auto">
        {/* Rotate container for diagonal effect */}
        <div className="relative w-[150%] h-[150%] flex gap-6 md:gap-12 -rotate-12 transform-gpu">
          <InfiniteColumn data={col1} direction="up" speed={30} />
          <InfiniteColumn data={col2} direction="down" speed={45} />
          <InfiniteColumn data={col3} direction="up" speed={35} />
        </div>
      </div>

      {/* Overlay Content - FIXED: overflow-visible to prevent text clipping */}
      <div className="relative z-10 container mx-auto px-6 text-center overflow-visible">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono tracking-widest uppercase text-white/80">
            Network Active
          </span>
        </div>

        {/* FIXED: Added overflow-visible and extra inline padding to prevent clipping */}
        <h2 className="text-5xl md:text-8xl font-[family-name:var(--font-jetbrains-mono)] tracking-tighter mb-8 px-4 py-2">
          THE NEURAL <br />
          <span className="text-aurora italic inline-block px-4">STREAM</span>
        </h2>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/5">
          Join the hive mind. A continuous flow of knowledge transfer between
          mentors and builders. Connect, contribute, and accelerate your growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <MagneticButton strength={0.3}>
            <Button
              size="lg"
              className="h-16 px-10 text-lg gap-3 shadow-[0_0_40px_-10px_var(--primary)] border border-primary/50"
              onClick={handleDiscordClick}
            >
              <DiscordLogo weight="fill" className="h-7 w-7" />
              Connect to Stream
            </Button>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Button
              size="lg"
              variant="ghost"
              className="h-16 px-10 text-lg gap-3 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md"
              onClick={handleGithubClick}
            >
              <GithubLogo weight="fill" className="h-7 w-7" />
              Explore Source
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Top/Bottom Fade Gradients for smooth cutoff */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}

// --- Internal Components ---

interface InfiniteColumnProps {
  data: TeamMember[];
  direction: "up" | "down";
  speed: number;
}

function InfiniteColumn({ data, direction, speed }: InfiniteColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);

  if (data.length === 0) return null;

  return (
    <div
      ref={columnRef}
      className="flex flex-col gap-6 w-[280px] md:w-[350px] shrink-0"
    >
      <div
        className={cn(
          "flex flex-col gap-6 animate-infinite-scroll",
          direction === "down" ? "flex-col-reverse" : ""
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "down" ? "reverse" : "normal",
        }}
      >
        {data.map((profile, i) => (
          <StreamCard key={`${profile.id}-${i}`} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function StreamCard({ profile }: { profile: TeamMember }) {
  // Simple static card without effects
  return (
    <div className="group relative rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md p-1">
      <div className="relative p-5 h-full rounded-xl bg-white/5 overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white/10 shadow-lg">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-bold text-white text-lg truncate leading-tight">
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
                <span className="text-[10px] text-white/40 truncate max-w-[100px]">
                  {profile.role}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Bio / Goal Snippet */}
          <p className="text-xs text-white/60 line-clamp-2 min-h-[2.5em] leading-relaxed">
            {profile.type === "mentor" ? profile.bio : profile.goals}
          </p>

          {/* Tech Stack / Progress Mini-bar */}
          {profile.type === "mentor" ? (
            <div className="flex flex-wrap gap-1">
              {profile.expertise?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-purple-500 w-[60%]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
