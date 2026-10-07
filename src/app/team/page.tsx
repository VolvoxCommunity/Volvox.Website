import type { Metadata } from "next";
import { getAllTeamMembers } from "@/lib/content";
import { TeamListClient } from "./team-list-client";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the mentors, builders, marketers, and staff who make up the Volvox community.",
};

export default function TeamPage() {
  const teamMembers = getAllTeamMembers();

  return <TeamListClient teamMembers={teamMembers} />;
}
