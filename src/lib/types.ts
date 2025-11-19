/**
 * Represents an author record returned from Supabase.
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
  readTime: string;
  slug: string;
  views: number;
  published: boolean;
}

/**
 * Defines the product card content showcased on the homepage.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  image: string;
}

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

/**
 * Request options for paginated Supabase queries.
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Metadata returned alongside paginated results.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
