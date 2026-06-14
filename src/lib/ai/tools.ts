import { tool } from "ai";
import { z } from "zod";
import {
  getBlogPostBySlug,
  getCommunityInfo,
  getProductBySlug,
  getTeamMemberBySlug,
  listBlogPosts,
  listProducts,
  listTeamMembers,
} from "./tool-handlers";

const surfaceTeamCardOutputSchema = z.discriminatedUnion("found", [
  z.object({
    kind: z.literal("team"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(true),
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    profileUrl: z.string(),
    isHireable: z.boolean(),
    tagline: z.string(),
  }),
  z.object({
    kind: z.literal("team"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(false),
  }),
]);

const surfaceProductCardOutputSchema = z.discriminatedUnion("found", [
  z.object({
    kind: z.literal("product"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(true),
    name: z.string(),
    tagline: z.string(),
    pageUrl: z.string(),
    image: z.string(),
  }),
  z.object({
    kind: z.literal("product"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(false),
  }),
]);

const surfaceBlogCardOutputSchema = z.discriminatedUnion("found", [
  z.object({
    kind: z.literal("blog"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(true),
    title: z.string(),
    excerpt: z.string(),
    authorName: z.string(),
    readingTime: z.number(),
    url: z.string(),
    banner: z.string().optional(),
  }),
  z.object({
    kind: z.literal("blog"),
    slug: z.string(),
    reason: z.string(),
    found: z.literal(false),
  }),
]);

export const aiTools = {
  get_team_members: tool({
    description:
      "List Volvox team members, optionally filtered by expertise, type (mentor, builder, marketer, mentee), or hireable status. Use this when the user asks about people on the team, who has a specific skill, or who is available for hire.",
    inputSchema: z.object({
      expertise: z
        .array(z.string())
        .optional()
        .describe("Skill keywords to match, e.g. ['React', 'Next.js']"),
      type: z
        .enum(["mentor", "builder", "marketer", "mentee"])
        .optional()
        .describe("Filter by member type"),
      isHireable: z
        .boolean()
        .optional()
        .describe("If true, only return members marked as available for hire"),
    }),
    execute: async (args) => listTeamMembers(args),
  }),

  get_team_member: tool({
    description:
      "Fetch the full profile of a single Volvox team member by slug (bio, expertise, projects, contact). Use after get_team_members to drill into a specific person.",
    inputSchema: z.object({
      slug: z
        .string()
        .describe("The team member slug, e.g. 'rabden' or 'bill-chirico'"),
    }),
    execute: async ({ slug }) => getTeamMemberBySlug(slug),
  }),

  get_products: tool({
    description:
      "List all Volvox products with summary info (Sobers, Decision Jar). Use when the user asks what Volvox builds.",
    inputSchema: z.object({}),
    execute: async () => listProducts(),
  }),

  get_product: tool({
    description:
      "Fetch the full details of a single Volvox product by slug (description, features, tech stack, FAQ, links).",
    inputSchema: z.object({
      slug: z
        .string()
        .describe("The product slug, e.g. 'sobers' or 'decision-jar'"),
    }),
    execute: async ({ slug }) => getProductBySlug(slug),
  }),

  get_blog_posts: tool({
    description:
      "List Volvox blog posts, optionally filtered by tag or search query. Use when the user asks what Volvox has written about.",
    inputSchema: z.object({
      tag: z
        .string()
        .optional()
        .describe("Filter by tag, e.g. 'Interview' or 'Community'"),
      query: z
        .string()
        .optional()
        .describe("Search keyword in title, excerpt, or tags"),
      limit: z
        .number()
        .optional()
        .describe("Max results to return (default 6, max 12)"),
    }),
    execute: async (args) => listBlogPosts(args),
  }),

  get_blog_post: tool({
    description:
      "Fetch the full content of a single Volvox blog post by slug. Returns an excerpt (first 600 chars of plain text) plus metadata.",
    inputSchema: z.object({
      slug: z.string().describe("The blog post slug, e.g. 'announcing-sobers'"),
    }),
    execute: async ({ slug }) => getBlogPostBySlug(slug),
  }),

  get_community_info: tool({
    description:
      "Get Volvox community info: Discord invite, GitHub org, hiring email, and the mentorship pitch. Use when the user asks how to join, collaborate, or hire.",
    inputSchema: z.object({}),
    execute: async () => getCommunityInfo(),
  }),

  surface_team_card: tool({
    description:
      "Render an inline clickable card for a team member inside the chat. Call this whenever you mention a specific person by name so the user can tap to view their profile / contact / hire them.",
    inputSchema: z.object({
      slug: z.string().describe("The team member slug"),
      reason: z
        .string()
        .describe(
          "One sentence explaining why this member is relevant to the user's question (shown in the card subtitle)",
        ),
    }),
    execute: async ({ slug, reason }) => {
      const member = getTeamMemberBySlug(slug);
      const raw: z.infer<typeof surfaceTeamCardOutputSchema> = member
        ? {
            kind: "team",
            slug,
            reason,
            found: true,
            name: member.name,
            role: member.role,
            avatar: member.avatar,
            profileUrl: member.profileUrl,
            isHireable: member.isHireable,
            tagline: member.tagline,
          }
        : { kind: "team", slug, reason, found: false };
      const result = surfaceTeamCardOutputSchema.safeParse(raw);
      if (!result.success) {
        console.warn(
          "[surface_team_card] output validation failed",
          result.error,
        );
        return { kind: "team", slug, reason, found: false };
      }
      return result.data;
    },
  }),

  surface_product_card: tool({
    description:
      "Render an inline clickable card for a Volvox product inside the chat. Call this whenever you mention a specific product (Sobers, Decision Jar) so the user can tap to learn more.",
    inputSchema: z.object({
      slug: z
        .string()
        .describe("The product slug, e.g. 'sobers' or 'decision-jar'"),
      reason: z
        .string()
        .describe(
          "One sentence explaining why this product is relevant to the user's question (shown in the card subtitle)",
        ),
    }),
    execute: async ({ slug, reason }) => {
      const product = getProductBySlug(slug);
      const raw: z.infer<typeof surfaceProductCardOutputSchema> = product
        ? {
            kind: "product",
            slug,
            reason,
            found: true,
            name: product.name,
            tagline: product.tagline,
            pageUrl: product.pageUrl,
            image: product.image,
          }
        : { kind: "product", slug, reason, found: false };
      const result = surfaceProductCardOutputSchema.safeParse(raw);
      if (!result.success) {
        console.warn(
          "[surface_product_card] output validation failed",
          result.error,
        );
        return { kind: "product", slug, reason, found: false };
      }
      return result.data;
    },
  }),

  surface_blog_card: tool({
    description:
      "Render an inline clickable card for a Volvox blog post inside the chat. Call this whenever you mention a specific blog post by title.",
    inputSchema: z.object({
      slug: z.string().describe("The blog post slug, e.g. 'announcing-sobers'"),
      reason: z
        .string()
        .describe(
          "One sentence explaining why this post is relevant to the user's question (shown in the card subtitle)",
        ),
    }),
    execute: async ({ slug, reason }) => {
      const post = await getBlogPostBySlug(slug);
      const raw: z.infer<typeof surfaceBlogCardOutputSchema> = post
        ? {
            kind: "blog",
            slug,
            reason,
            found: true,
            title: post.title,
            excerpt: post.excerpt,
            authorName: post.authorName,
            readingTime: post.readingTime,
            url: post.url,
            banner: post.banner,
          }
        : { kind: "blog", slug, reason, found: false };
      const result = surfaceBlogCardOutputSchema.safeParse(raw);
      if (!result.success) {
        console.warn(
          "[surface_blog_card] output validation failed",
          result.error,
        );
        return { kind: "blog", slug, reason, found: false };
      }
      return result.data;
    },
  }),
} as const;

export type AiTools = typeof aiTools;
