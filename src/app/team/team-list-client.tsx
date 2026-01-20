"use client";

import { useState, useMemo } from "react";
import { TeamMember } from "@/lib/types";
import { TeamNavbar } from "@/components/team/team-navbar";
import { TeamCard } from "@/components/team/team-card";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";

interface TeamListClientProps {
  teamMembers: TeamMember[];
}

type FilterMode = "all" | "mentors";

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
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        <TeamNavbar
          filterMode={filterMode}
          onFilterChange={setFilterMode}
          resultCount={filteredMembers.length}
        />

        <main
          id="main-content"
          className="container mx-auto px-4 max-w-7xl pt-16 pb-8"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-jetbrains-mono)] font-bold mb-4">
              Our <span className="text-aurora">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the mentors and builders who make up the Volvox community.
            </p>
          </div>

          {/* Team Grid */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No team members found.</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
