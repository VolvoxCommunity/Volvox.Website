/**
 * Represents an author record.
 */
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  website?: string;
}

/**
 * Describes the blog post data shape consumed by the UI.
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author | null;
  date: string;
  tags: string[];
  slug: string;
  views: number;
  readingTime: number;
  published: boolean;
  banner?: string;
}

/**
 * Defines the product card content showcased on the homepage.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  image: string;
}

/**
 * Re-export schema-inferred types for extended product data.
 * These are the canonical types - use these throughout the codebase.
 */
export type {
  ExtendedProduct,
  FaqItem,
  Testimonial,
  ProductLinks,
  TeamMemberProject,
} from "./schemas";

import { z } from "zod";
import { TeamMemberSchema } from "./schemas";

export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type Mentor = Extract<TeamMember, { type: "mentor" }>;
export type Mentee = Extract<TeamMember, { type: "mentee" }>;
