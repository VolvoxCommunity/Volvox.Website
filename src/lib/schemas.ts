import { z } from "zod";

/**
 * Author schema matching the Author interface
 */
export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  website: z.string().url().optional(),
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
 * Team Member schema (discriminated union)
 */
export const TeamMemberSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mentor"),
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    role: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()),
    githubUrl: z.string().optional(),
  }),
  z.object({
    type: z.literal("mentee"),
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    goals: z.string(),
    progress: z.string(),
    githubUrl: z.string().optional(),
  }),
]);

/**
 * Helper to validate and parse team members array
 */
export const TeamMembersArraySchema = z.array(TeamMemberSchema);

/**
 * Helper to validate and parse authors array
 */
export const AuthorsArraySchema = z.array(AuthorSchema);

/**
 * Helper to validate and parse products array
 */
export const ProductsArraySchema = z.array(ProductSchema);

/**
 * Schema for product FAQ items.
 */
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

/**
 * Schema for product testimonials.
 */
export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  avatar: z.string().optional(),
});

/**
 * Schema for product links.
 */
export const productLinksSchema = z.object({
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  appStore: z.string().url().optional(),
  playStore: z.string().url().optional(),
});

/**
 * Schema for extended product data (folder-based structure).
 */
export const extendedProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    // Only allows lowercase alphanumeric characters and hyphens
    .regex(/^[a-z0-9-]+$/),
  tagline: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  features: z.array(z.string()).min(1),
  techStack: z.array(z.string()).default([]),
  links: productLinksSchema.default({}),
  screenshots: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});

export type ExtendedProduct = z.infer<typeof extendedProductSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ProductLinks = z.infer<typeof productLinksSchema>;
