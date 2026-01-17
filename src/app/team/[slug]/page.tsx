import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTeamMembers, isValidSlug } from "@/lib/content";
import { TeamMemberDetailClient } from "../team-member-detail-client";

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

  return <TeamMemberDetailClient member={member} />;
}
