import { z } from "zod";
import { isValidBlogPublishDate } from "./blog-dates";

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/);

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
  date: z.string().refine(isValidBlogPublishDate, {
    message:
      "Date must be YYYY-MM-DD or an ISO datetime with Z or an explicit timezone offset.",
  }),
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
 * Schema for team member project/contribution entries.
 */
export const TeamMemberProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  role: z.string().optional(),
  url: z.string().url().optional(),
});

/**
 * Team Member schema (discriminated union)
 */
export const TeamMemberSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mentor"),
    id: z.string(),
    slug: slugSchema,
    name: z.string(),
    avatar: z.string(),
    role: z.string(),
    tagline: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()),
    projects: z.array(TeamMemberProjectSchema).optional(),
    updatedAt: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    email: z.string().optional(),
    isHireable: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("mentee"),
    id: z.string(),
    slug: slugSchema,
    name: z.string(),
    avatar: z.string(),
    tagline: z.string(),
    goals: z.string(),
    progress: z.string(),
    projects: z.array(TeamMemberProjectSchema).optional(),
    updatedAt: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    email: z.string().optional(),
    isHireable: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("builder"),
    id: z.string(),
    slug: slugSchema,
    name: z.string(),
    avatar: z.string(),
    role: z.string(),
    tagline: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()),
    projects: z.array(TeamMemberProjectSchema).optional(),
    updatedAt: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    email: z.string().optional(),
    isHireable: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("marketer"),
    id: z.string(),
    slug: slugSchema,
    name: z.string(),
    avatar: z.string(),
    role: z.string(),
    tagline: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()),
    projects: z.array(TeamMemberProjectSchema).optional(),
    updatedAt: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    email: z.string().optional(),
    isHireable: z.boolean().optional(),
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
  type: z.string().optional(),
  slug: slugSchema,
  tagline: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  features: z.array(z.string()).min(1),
  techStack: z.array(z.string()).default([]),
  updatedAt: z.string().datetime().optional(),
  links: productLinksSchema.default({}),
  screenshots: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});

export type ExtendedProduct = z.infer<typeof extendedProductSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ProductLinks = z.infer<typeof productLinksSchema>;
export type TeamMemberProject = z.infer<typeof TeamMemberProjectSchema>;

/**
 * Homepage review sources (maps to icons/labels in the UI).
 */
export const reviewSourceSchema = z.enum(["product-hunt", "app-store", "x"]);

/**
 * Single community / product review for the homepage reviews section.
 */
export const homepageReviewSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  source: reviewSourceSchema,
  product: z.string().optional(),
  featured: z.boolean().optional(),
  profilePicUrl: z.string().url().optional(),
});

/**
 * Trust badge shown under the reviews carousel.
 */
export const reviewTrustBadgeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  rating: z.string().min(1),
  source: reviewSourceSchema,
});

/**
 * Full homepage reviews content file (`content/review.json`).
 */
export const reviewsContentSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  trustBadges: z.array(reviewTrustBadgeSchema).default([]),
  reviews: z
    .array(homepageReviewSchema)
    .min(1)
    .refine(
      (reviews) => new Set(reviews.map((r) => r.id)).size === reviews.length,
      { message: "Review ids must be unique" },
    ),
});

export type ReviewSource = z.infer<typeof reviewSourceSchema>;
export type HomepageReview = z.infer<typeof homepageReviewSchema>;
export type ReviewTrustBadge = z.infer<typeof reviewTrustBadgeSchema>;
export type ReviewsContent = z.infer<typeof reviewsContentSchema>;
