"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Envelope,
  GithubLogo,
  LinkedinLogo,
  Briefcase,
  ArrowSquareOut,
  FolderOpen,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MemberNavbar } from "@/components/team/member-navbar";
import { Footer } from "@/components/footer";
import { TeamMember } from "@/lib/types";

interface TeamMemberDetailClientProps {
  member: TeamMember;
}

export function TeamMemberDetailClient({
  member,
}: TeamMemberDetailClientProps) {
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

  return (
    <div
      className="min-h-screen relative flex flex-col"
      data-testid="team-member-profile"
    >
      {/* Site Navigation & Back Header */}
      <MemberNavbar />

      {/* Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 max-w-4xl py-12">
        <div
          className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[48px] p-8 md:p-12 shadow-2xl shadow-primary/5"
          data-testid="profile-card"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
            {/* Avatar */}
            <div
              className="relative w-40 h-40 md:w-56 md:h-56 rounded-[32px] overflow-hidden border border-border/50 shadow-2xl shrink-0"
              data-testid="member-avatar"
            >
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left pt-2">
              <h1
                className="text-4xl md:text-5xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-3 tracking-tight"
                data-testid="member-name"
              >
                {member.name}
              </h1>
              {member.type === "mentor" && (
                <div
                  className="flex items-center gap-2 justify-center md:justify-start mb-4"
                  data-testid="member-role"
                >
                  <span className="text-xl text-primary font-semibold tracking-wide uppercase text-sm">
                    {member.role}
                  </span>
                  <Badge
                    variant="default"
                    className="rounded-full px-3 py-0.5 text-[10px] font-bold"
                  >
                    MENTOR
                  </Badge>
                </div>
              )}
              <p
                className="text-xl text-muted-foreground leading-relaxed mb-6 font-medium"
                data-testid="member-tagline"
              >
                {member.tagline}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-3 justify-center md:justify-start mb-8 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-xs font-bold"
                >
                  MEMBER
                </Badge>
                {member.isHireable && (
                  <Badge
                    variant="outline"
                    className="border-green-500/30 bg-green-500/10 text-green-400 rounded-full px-4 py-1 text-xs font-bold"
                  >
                    AVAILABLE FOR HIRE
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {member.email && (
                  <MagneticButton strength={0.2}>
                    <Button
                      size="lg"
                      className="gap-3 rounded-full h-14 px-8 text-base font-bold shadow-lg shadow-primary/20"
                      onClick={handleContact}
                    >
                      <Envelope weight="bold" className="h-5 w-5" />
                      Get in touch
                    </Button>
                  </MagneticButton>
                )}
                {member.linkedinUrl && member.isHireable && (
                  <MagneticButton strength={0.2}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-3 rounded-full h-14 px-8 text-base font-bold border-border/60 hover:bg-white/5"
                      onClick={handleHire}
                    >
                      <Briefcase weight="bold" className="h-5 w-5" />
                      Hire Member
                    </Button>
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>

          {/* Bio / Goals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-t border-border/30 pt-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]">
                {member.type === "mentee" ? "Personal Goals" : "Biography"}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {member.type === "mentee" ? member.goals : member.bio}
              </p>
            </div>

            {member.type === "mentee" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]">
                  Current Progress
                </h2>
                <p className="text-foreground leading-relaxed text-lg bg-white/5 p-6 rounded-[24px] border border-white/10">
                  {member.progress}
                </p>
              </div>
            )}

            {/* Expertise (for mentors and builders) */}
            {(member.type === "mentor" || member.type === "builder") &&
              member.expertise && (
                <div className="space-y-6" data-testid="expertise-section">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]">
                    Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {member.expertise.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-5 py-2 text-sm rounded-full border-border/60 font-medium bg-muted/30"
                        data-testid="expertise-badge"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Projects Section */}
          {member.projects && member.projects.length > 0 && (
            <div
              className="border-t border-border/30 pt-12 mb-12"
              data-testid="projects-section"
            >
              <div className="flex items-center gap-3 mb-8">
                <FolderOpen weight="bold" className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold font-[family-name:var(--font-jetbrains-mono)]">
                  Projects & Contributions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {member.projects.map((project) => (
                  <div
                    key={project.name}
                    className="group bg-white/5 border border-border/30 rounded-[24px] p-6 hover:bg-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    data-testid="project-card"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                        {project.name}
                      </h3>
                      {project.url && (
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-all duration-300 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1"
                          aria-label={`Visit ${project.name}`}
                        >
                          <ArrowSquareOut weight="bold" className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 group-hover:text-foreground/90 transition-colors duration-300">
                      {project.description}
                    </p>
                    {project.role && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-none rounded-full group-hover:bg-primary/20 transition-colors duration-300"
                      >
                        {project.role}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div
            className="border-t border-border/30 pt-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
            data-testid="social-links-section"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">
                Connect with {member.name.split(" ")[0]}
              </h2>
              <p className="text-muted-foreground text-sm">
                Follow their journey and stay updated with their latest work.
              </p>
            </div>
            <div className="flex gap-4" data-testid="social-buttons">
              {member.githubUrl && (
                <MagneticButton strength={0.4}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-border/60"
                    data-testid="github-button"
                    aria-label={`Visit ${member.name}'s GitHub profile`}
                    onClick={() =>
                      window.open(
                        member.githubUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <GithubLogo weight="fill" className="h-6 w-6" />
                  </Button>
                </MagneticButton>
              )}
              {member.linkedinUrl && (
                <MagneticButton strength={0.4}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-border/60"
                    data-testid="linkedin-button"
                    aria-label={`Visit ${member.name}'s LinkedIn profile`}
                    onClick={() =>
                      window.open(
                        member.linkedinUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <LinkedinLogo weight="fill" className="h-6 w-6" />
                  </Button>
                </MagneticButton>
              )}
              {member.email && (
                <MagneticButton strength={0.4}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12 border-border/60"
                    data-testid="email-button"
                    aria-label={`Send email to ${member.name}`}
                    onClick={() =>
                      (window.location.href = `mailto:${member.email}`)
                    }
                  >
                    <Envelope weight="fill" className="h-6 w-6" />
                  </Button>
                </MagneticButton>
              )}
            </div>
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
