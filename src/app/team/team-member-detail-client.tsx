"use client";

import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  Briefcase,
  Envelope,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { type JSX, useRef } from "react";
import { Footer } from "@/components/footer";
import { MemberNavbar } from "@/components/team/member-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import type { TeamMember } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface TeamMemberDetailClientProps {
  member: TeamMember;
}

export function TeamMemberDetailClient({
  member,
}: TeamMemberDetailClientProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContact = () => {
    if (member.email) {
      window.location.href = `mailto:${member.email}`;
    }
  };

  const handleHire = () => {
    if (member.linkedinUrl) {
      window.open(member.linkedinUrl, "_blank", "noopener,noreferrer");
    }
  };

  useGSAP(
    () => {
      // Smooth staggering entrance on scroll for hero section
      gsap.fromTo(
        [
          ".hero-avatar-shell",
          ".hero-eyebrow",
          ".hero-name",
          ".hero-tagline",
          ".hero-badge-row",
          ".hero-actions",
        ],
        { opacity: 0, y: 30, filter: "blur(10px)", scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      // Scroll trigger reveal for Bio section
      gsap.fromTo(
        ".bio-grid-card",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          scrollTrigger: {
            trigger: ".bio-grid-trigger",
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          ease: "power2.out",
        },
      );

      // Scroll trigger reveal for Projects section
      if (member.projects && member.projects.length > 0) {
        gsap.fromTo(
          ".project-reveal-card",
          { opacity: 0, y: 50, filter: "blur(12px)", scale: 0.96 },
          {
            scrollTrigger: {
              trigger: ".projects-trigger-section",
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      }

      // Scroll trigger reveal for Connect section
      gsap.fromTo(
        ".connect-reveal-item",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          scrollTrigger: {
            trigger: ".connect-trigger-section",
            start: "top 90%",
            end: "top 75%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative flex flex-col overflow-x-hidden bg-background"
      data-testid="team-member-profile"
    >
      {/* Site Navigation & Back Header */}
      <MemberNavbar />

      {/* Decorative ambient gradient spots */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] transform-gpu" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] transform-gpu" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 container mx-auto px-6 max-w-5xl pt-16 pb-24">
        {/* Hero Segment */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start mb-24">
          {/* Avatar Concentric Double-Bezel */}
          <div className="hero-avatar-shell p-2 rounded-[2.5rem] bg-card-deep/20 border border-border/30 shadow-2xl shrink-0 self-center md:self-start">
            <div
              className="relative w-48 h-48 md:w-60 md:h-60 rounded-[calc(2.5rem-0.5rem)] overflow-hidden border border-border/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] bg-card"
              data-testid="member-avatar"
            >
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 192px, 240px"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Core Identity Info */}
          <div className="flex-1 text-center md:text-left pt-2">
            <div className="hero-eyebrow mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary/80 px-3.5 py-1.5 rounded-md bg-primary/5 border border-primary/10">
                {member.type !== "mentee" ? member.role : "Mentee"}
              </span>
            </div>

            <h1
              className="hero-name text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-foreground mb-4 font-mono uppercase"
              data-testid="member-name"
            >
              {member.name}
            </h1>

            <p
              className="hero-tagline text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium mb-6"
              data-testid="member-tagline"
            >
              {member.tagline}
            </p>

            {/* Badges / Status */}
            <div className="hero-badge-row flex items-center gap-3 justify-center md:justify-start mb-8 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] tracking-[0.15em] font-mono font-bold uppercase border border-border/40 bg-card-deep/40 text-muted-foreground">
                {member.type === "mentee" ? "Mentee" : "Mentor"}
              </span>
              {member.isHireable && (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] tracking-[0.15em] font-mono font-bold uppercase border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Available For Hire
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="hero-actions flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {member.email && (
                <MagneticButton strength={0.15}>
                  <Button size="lg" onClick={handleContact}>
                    <Envelope weight="bold" className="h-5 w-5" />
                    Get in touch
                  </Button>
                </MagneticButton>
              )}
              {member.linkedinUrl && member.isHireable && (
                <MagneticButton strength={0.15}>
                  <Button size="lg" variant="outline" onClick={handleHire}>
                    <Briefcase weight="bold" className="h-5 w-5" />
                    Hire Member
                  </Button>
                </MagneticButton>
              )}
            </div>
          </div>
        </div>

        {/* Biography & Skills Bento Segment */}
        <div className="bio-grid-trigger grid grid-cols-1 md:grid-cols-5 gap-6 mb-24">
          {/* Biography Block - Col Span 3 */}
          <div className="bio-grid-card md:col-span-3 p-1.5 rounded-[2rem] bg-card-deep/20 border border-border/30 shadow-2xl">
            <div className="h-full rounded-[calc(2rem-0.375rem)] bg-card border border-border/10 p-8 md:p-10 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70 mb-6">
                  {member.type === "mentee" ? "Personal Goals" : "Biography"}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-normal max-w-[65ch]">
                  {member.type === "mentee" ? member.goals : member.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Stats / Expertise Block - Col Span 2 */}
          <div className="bio-grid-card md:col-span-2 p-1.5 rounded-[2rem] bg-card-deep/20 border border-border/30 shadow-2xl">
            <div className="h-full rounded-[calc(2rem-0.375rem)] bg-card border border-border/10 p-8 md:p-10 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div>
                {member.type === "mentee" ? (
                  <>
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70 mb-6">
                      Current Progress
                    </h2>
                    <p className="text-foreground leading-relaxed text-base">
                      {member.progress}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70 mb-6">
                      Expertise
                    </h2>
                    {member.expertise && member.expertise.length > 0 ? (
                      <div
                        className="flex flex-wrap gap-2"
                        data-testid="expertise-section"
                      >
                        {member.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-xs px-3 py-1.5 rounded-md bg-primary/5 text-primary/90 border border-primary/10 uppercase tracking-wider"
                            data-testid="expertise-badge"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm font-mono">
                        No expertise listed yet.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Projects Segment */}
        {member.projects && member.projects.length > 0 && (
          <div
            className="projects-trigger-section mb-24"
            data-testid="projects-section"
          >
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight font-mono uppercase text-foreground">
                Selected Works
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                {member.projects.length}{" "}
                {member.projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.projects.map((project) => (
                <div
                  key={project.name}
                  className="project-reveal-card group p-1.5 rounded-[2rem] bg-card-deep/20 border border-border/30 hover:border-primary/20 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-2xl active:scale-[0.985]"
                  data-testid="project-card"
                >
                  <div className="h-full rounded-[calc(2rem-0.375rem)] bg-card border border-border/10 p-6 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] min-h-[180px]">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300 font-mono uppercase">
                          {project.name}
                        </h3>
                        {project.url && (
                          <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-primary/15 shrink-0 border border-border/40"
                            aria-label={`Visit ${project.name}`}
                          >
                            <ArrowUpRight
                              weight="bold"
                              className="w-4 h-4 text-primary"
                            />
                          </Link>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 group-hover:text-foreground/90 transition-colors duration-300">
                        {project.description}
                      </p>
                    </div>

                    {project.role && (
                      <div className="flex justify-start">
                        <Badge
                          variant="secondary"
                          className="font-mono text-[10px] tracking-wider uppercase bg-primary/10 text-primary border border-primary/10 rounded group-hover:bg-primary/15 transition-colors duration-300 px-2.5 py-1"
                        >
                          {project.role}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connect Segment */}
        <div
          className="connect-trigger-section border-t border-border/20 pt-16 flex flex-col md:flex-row md:items-center justify-between gap-8"
          data-testid="social-links-section"
        >
          <div className="connect-reveal-item">
            <h2 className="text-xl font-bold font-mono uppercase tracking-wide mb-2">
              Connect with {member.name.split(" ")[0]}
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Follow their open source journey and stay updated with their
              latest contributions.
            </p>
          </div>

          <div
            className="connect-reveal-item flex gap-4"
            data-testid="social-buttons"
          >
            {member.githubUrl && (
              <MagneticButton strength={0.3}>
                <Button
                  variant="outline"
                  size="icon-lg"
                  data-testid="github-button"
                  aria-label={`Visit ${member.name}'s GitHub profile`}
                  onClick={() =>
                    window.open(
                      member.githubUrl,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <GithubLogo weight="fill" className="h-5 w-5" />
                </Button>
              </MagneticButton>
            )}
            {member.linkedinUrl && (
              <MagneticButton strength={0.3}>
                <Button
                  variant="outline"
                  size="icon-lg"
                  data-testid="linkedin-button"
                  aria-label={`Visit ${member.name}'s LinkedIn profile`}
                  onClick={() =>
                    window.open(
                      member.linkedinUrl,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <LinkedinLogo weight="fill" className="h-5 w-5" />
                </Button>
              </MagneticButton>
            )}
            {member.email && (
              <MagneticButton strength={0.3}>
                <Button
                  variant="outline"
                  size="icon-lg"
                  data-testid="email-button"
                  aria-label={`Send email to ${member.name}`}
                  onClick={() =>
                    (window.location.href = `mailto:${member.email}`)
                  }
                >
                  <Envelope weight="fill" className="h-5 w-5" />
                </Button>
              </MagneticButton>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
