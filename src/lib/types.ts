/**
 * Represents an author record.
 */
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
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
} from "./schemas";

/**
 * Captures mentor profile information.
 */
export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  expertise: string[];
  bio: string;
  githubUrl?: string;
}

/**
 * Captures mentee profile information.
 */
export interface Mentee {
  id: string;
  name: string;
  avatar: string;
  goals: string;
  progress: string;
  githubUrl?: string;
}
