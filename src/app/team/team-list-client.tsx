"use client";

import { useState, useMemo } from "react";
import { TeamMember } from "@/lib/types";
import { TeamNavbar } from "@/components/team/team-navbar";
import { TeamCard } from "@/components/team/team-card";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

interface TeamListClientProps {
  teamMembers: TeamMember[];
}

type FilterMode = "all" | "mentors";

/**
 * Team listing page with semantic HTML structure for accessibility.
 * Uses proper heading hierarchy and ARIA landmarks.
 */
export function TeamListClient({ teamMembers }: TeamListClientProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredMembers = useMemo(() => {
    if (filterMode === "mentors") {
      return teamMembers.filter((m) => m.type === "mentor");
    }
    return teamMembers;
  }, [teamMembers, filterMode]);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background - decorative */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      {/* Main Navigation */}
      <Navigation linkMode />

      {/* Content Layer */}
      <div className="relative z-10 flex-1 pt-20">
        <TeamNavbar
          filterMode={filterMode}
          onFilterChange={setFilterMode}
          resultCount={filteredMembers.length}
        />

        <main
          id="main-content"
          role="main"
          className="container mx-auto px-4 max-w-7xl pt-16 pb-8"
          aria-labelledby="team-page-heading"
        >
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1
              id="team-page-heading"
              className="text-4xl md:text-6xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-4"
            >
              Our Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the mentors and builders who make up the Volvox community.
            </p>
          </header>

          {/* Team Grid - labeled region for screen reader navigation */}
          <section aria-labelledby="team-grid-heading">
            <h2 id="team-grid-heading" className="sr-only">
              Team members grid
            </h2>
            {filteredMembers.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                role="list"
                aria-label={`${filteredMembers.length} team member${filteredMembers.length !== 1 ? "s" : ""}`}
              >
                {filteredMembers.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16" role="status">
                <p className="text-muted-foreground">No team members found.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
