import { Metadata } from "next";
import Script from "next/script";
import { getAllTeamMembers } from "@/lib/content";
import { TeamListClient } from "./team-list-client";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the mentors and builders who make up the Volvox community.",
  alternates: {
    canonical: "/team",
  },
};

export default function TeamPage() {
  const teamMembers = getAllTeamMembers();

  return (
    <>
      <Script
        id="team-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Team", url: `${SITE_URL}/team` },
            ])
          ),
        }}
      />
      <TeamListClient teamMembers={teamMembers} />
    </>
  );
}
