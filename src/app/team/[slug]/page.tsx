import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getAllTeamMembers, isValidSlug } from "@/lib/content";
import { TeamMemberDetailClient } from "../team-member-detail-client";
import {
  generateBreadcrumbSchema,
  generatePersonSchema,
} from "@/lib/structured-data";
import { safeJsonLdSerialize, SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const members = getAllTeamMembers();
  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return { title: "Not Found" };
  }

  const members = getAllTeamMembers();
  const member = members.find((m) => m.slug === slug);

  if (!member) {
    return { title: "Not Found" };
  }

  return {
    title: `${member.name} - Team`,
    description: member.tagline,
    alternates: {
      canonical: `/team/${slug}`,
    },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  const members = getAllTeamMembers();
  const member = members.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <>
      <Script
        id={`team-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generateBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Team", url: `${SITE_URL}/team` },
              { name: member.name, url: `${SITE_URL}/team/${slug}` },
            ])
          ),
        }}
      />
      <Script
        id={`person-schema-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdSerialize(
            generatePersonSchema({
              name: member.name,
              slug: member.slug,
              tagline: member.tagline,
              avatar: member.avatar,
              role: "role" in member ? member.role : undefined,
              githubUrl: member.githubUrl,
              linkedinUrl: member.linkedinUrl,
            })
          ),
        }}
      />
      <TeamMemberDetailClient member={member} />
    </>
  );
}
