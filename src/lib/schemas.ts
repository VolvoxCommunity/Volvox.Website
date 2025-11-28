import { z } from "zod";

/**
 * Author schema matching the Author interface
 */
export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
});

/**
 * Blog post frontmatter schema
 */
export const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  authorId: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  published: z.boolean(),
  banner: z.string().optional(),
});

/**
 * Product schema matching the Product interface
 */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  longDescription: z.string(),
  features: z.array(z.string()),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  image: z.string(),
});

/**
 * Mentor schema matching the Mentor interface
 */
export const MentorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  role: z.string(),
  expertise: z.array(z.string()),
  bio: z.string(),
  githubUrl: z.string().optional(),
});

/**
 * Mentee schema matching the Mentee interface
 */
export const MenteeSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  goals: z.string(),
  progress: z.string(),
  githubUrl: z.string().optional(),
});

/**
 * Helper to validate and parse authors array
 */
export const AuthorsArraySchema = z.array(AuthorSchema);

/**
 * Helper to validate and parse products array
 */
export const ProductsArraySchema = z.array(ProductSchema);

/**
 * Helper to validate and parse mentors array
 */
export const MentorsArraySchema = z.array(MentorSchema);

/**
 * Helper to validate and parse mentees array
 */
export const MenteesArraySchema = z.array(MenteeSchema);
