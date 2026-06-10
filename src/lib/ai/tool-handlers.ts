import { SITE_URL } from "@/lib/constants";
import {
  getAllExtendedProducts,
  getAllProducts,
  getAllTeamMembers,
} from "@/lib/content";
import type {
  BlogPost,
  ExtendedProduct,
  Product,
  TeamMember,
} from "@/lib/types";

export interface TeamMemberSummary {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  type: string;
  expertise: string[];
  isHireable: boolean;
  avatar: string;
}

export interface TeamMemberDetail {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  expertise: string[];
  projects: Array<{
    name: string;
    description: string;
    role?: string;
    url?: string;
  }>;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  isHireable: boolean;
  avatar: string;
  profileUrl: string;
}

export interface ProductSummary {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  demoUrl?: string;
  isOpenSource: boolean;
  image: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  tagline: string;
  type?: string;
  description: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  faq: Array<{ question: string; answer: string }>;
  links: {
    github?: string;
    demo?: string;
    appStore?: string;
    playStore?: string;
  };
  updatedAt?: string;
  pageUrl: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  authorName: string;
  readingTime: number;
  url: string;
}

export interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  authorName: string;
  readingTime: number;
  banner?: string;
  bodyExcerpt: string;
  url: string;
}

export interface CommunityInfo {
  discord: string;
  github: string;
  blog: string;
  products: string;
  team: string;
  mentorshipPitch: string;
  hiringEmail: string;
  siteUrl: string;
}

function toTeamMemberSummary(m: TeamMember): TeamMemberSummary {
  const isMentee = m.type === "mentee";
  return {
    slug: m.slug,
    name: m.name,
    role: isMentee ? "Mentee" : m.role,
    tagline: m.tagline,
    type: m.type,
    expertise: isMentee ? [] : m.expertise,
    isHireable: m.isHireable ?? false,
    avatar: m.avatar,
  };
}

function toTeamMemberDetail(m: TeamMember): TeamMemberDetail {
  const isMentee = m.type === "mentee";
  const projects = isMentee
    ? []
    : ((
        m as {
          projects?: Array<{
            name: string;
            description: string;
            role?: string;
            url?: string;
          }>;
        }
      ).projects ?? []);
  const bio = isMentee ? `${m.goals} ${m.progress}` : m.bio;
  const expertise = isMentee ? [] : m.expertise;
  return {
    slug: m.slug,
    name: m.name,
    role: isMentee ? "Mentee" : m.role,
    tagline: m.tagline,
    bio,
    expertise,
    projects,
    githubUrl: m.githubUrl,
    linkedinUrl: m.linkedinUrl,
    email: m.email,
    isHireable: m.isHireable ?? false,
    avatar: m.avatar,
    profileUrl: `${SITE_URL}/team/${m.slug}`,
  };
}

function toProductSummary(p: Product): ProductSummary {
  return {
    slug: getProductSlugFromId(p.id),
    name: p.name,
    tagline: shortTagline(p),
    description: p.description,
    demoUrl: p.demoUrl,
    isOpenSource: Boolean(p.githubUrl),
    image: p.image,
  };
}

function shortTagline(p: Product): string {
  const first = p.description.split(/[.!?]/)[0]?.trim();
  return (first ?? p.description).slice(0, 140);
}

function getProductSlugFromId(id: string): string {
  if (id.includes("ee7a459b") || id.startsWith("ee7a459b")) return "sobers";
  if (id.includes("a3f8b2c1") || id.startsWith("a3f8b2c1"))
    return "decision-jar";
  return id;
}

function toProductDetail(p: ExtendedProduct): ProductDetail {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    type: p.type,
    description: p.description,
    longDescription: p.longDescription,
    features: p.features,
    techStack: p.techStack,
    faq: p.faq,
    links: p.links,
    updatedAt: p.updatedAt,
    pageUrl: `${SITE_URL}/products/${p.slug}`,
  };
}

function toBlogPostSummary(p: BlogPost): BlogPostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    tags: p.tags,
    authorName: p.author?.name ?? "Volvox",
    readingTime: p.readingTime,
    url: `${SITE_URL}/blog/${p.slug}`,
  };
}

function toBlogPostDetail(p: BlogPost): BlogPostDetail {
  const plain = p.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_`>]/g, "");
  const trimmed = plain.replace(/\s+/g, " ").trim().slice(0, 600);
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    tags: p.tags,
    authorName: p.author?.name ?? "Volvox",
    readingTime: p.readingTime,
    banner: p.banner,
    bodyExcerpt: trimmed,
    url: `${SITE_URL}/blog/${p.slug}`,
  };
}

export interface ListTeamMembersArgs {
  expertise?: string[];
  type?: "mentor" | "builder" | "marketer" | "mentee";
  isHireable?: boolean;
}

export function listTeamMembers(
  args: ListTeamMembersArgs = {},
): TeamMemberSummary[] {
  const members = getAllTeamMembers();
  let filtered = members;
  if (args.type) {
    filtered = filtered.filter((m) => m.type === args.type);
  }
  if (args.isHireable !== undefined) {
    filtered = filtered.filter(
      (m) => (m.isHireable ?? false) === args.isHireable,
    );
  }
  if (args.expertise && args.expertise.length > 0) {
    const lower = args.expertise.map((e: string) => e.toLowerCase());
    filtered = filtered.filter((m) => {
      if (m.type === "mentee") return false;
      const skills = m.expertise.map((e: string) => e.toLowerCase());
      return lower.some((e: string) =>
        skills.some((s: string) => s.includes(e)),
      );
    });
  }
  return filtered.map(toTeamMemberSummary);
}

export function getTeamMemberBySlug(slug: string): TeamMemberDetail | null {
  const members = getAllTeamMembers();
  const m = members.find((mem) => mem.slug === slug);
  if (!m) return null;
  return toTeamMemberDetail(m);
}

export function listProducts(): ProductSummary[] {
  const products = getAllProducts();
  return products.map(toProductSummary);
}

export function getProductBySlug(slug: string): ProductDetail | null {
  const products = getAllExtendedProducts();
  const p = products.find((prod) => prod.slug === slug);
  if (!p) return null;
  return toProductDetail(p);
}

export interface ListBlogPostsArgs {
  tag?: string;
  query?: string;
  limit?: number;
}

export async function listBlogPosts(
  args: ListBlogPostsArgs = {},
): Promise<BlogPostSummary[]> {
  const { getAllPosts } = await import("@/lib/blog");
  const posts = await getAllPosts({ includeViews: false });
  let filtered = posts;
  if (args.tag) {
    const lower = args.tag.toLowerCase();
    filtered = filtered.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === lower),
    );
  }
  if (args.query) {
    const q = args.query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  const limit = Math.min(args.limit ?? 6, 12);
  return filtered.slice(0, limit).map(toBlogPostSummary);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  const { getPostBySlug } = await import("@/lib/blog");
  try {
    const post = await getPostBySlug(slug);
    return toBlogPostDetail({
      id: post.slug,
      title: post.frontmatter.title,
      excerpt: post.frontmatter.excerpt,
      content: post.content,
      author: post.frontmatter.author,
      date: post.frontmatter.date,
      tags: post.frontmatter.tags,
      slug: post.slug,
      views: post.views,
      readingTime: post.readingTime,
      published: true,
      banner: post.frontmatter.banner,
    });
  } catch {
    return null;
  }
}

export function getCommunityInfo(): CommunityInfo {
  return {
    discord: "https://discord.gg/8ahXACdamN",
    github: "https://github.com/VolvoxCommunity",
    blog: `${SITE_URL}/blog`,
    products: `${SITE_URL}/products`,
    team: `${SITE_URL}/team`,
    mentorshipPitch:
      "Volvox pairs experienced developers with aspiring programmers through real-world open-source projects. The mentorship program has been running since 2018. Mentors include Bill Chirico (CEO) and Eleftheria Batsou (Developer Advocate).",
    hiringEmail: "bill@volvox.dev",
    siteUrl: SITE_URL,
  };
}
