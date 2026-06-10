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
      if (!member) return { kind: "team" as const, slug, reason, found: false };
      return {
        kind: "team" as const,
        slug,
        reason,
        found: true,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        profileUrl: member.profileUrl,
        isHireable: member.isHireable,
        tagline: member.tagline,
      };
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
      if (!product)
        return { kind: "product" as const, slug, reason, found: false };
      return {
        kind: "product" as const,
        slug,
        reason,
        found: true,
        name: product.name,
        tagline: product.tagline,
        pageUrl: product.pageUrl,
        image: `/images/product/${product.slug === "sobers" ? "sobers.png" : "decision-jar/1.png"}`,
      };
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
      if (!post) return { kind: "blog" as const, slug, reason, found: false };
      return {
        kind: "blog" as const,
        slug,
        reason,
        found: true,
        title: post.title,
        excerpt: post.excerpt,
        authorName: post.authorName,
        readingTime: post.readingTime,
        url: post.url,
        banner: post.banner,
      };
    },
  }),

  report_intent: tool({
    description:
      "Report the assistant's read of the current user intent. The server already runs its own intent detector each turn — this tool lets the model communicate its own read for transparency. Safe to call once per turn, optional.",
    inputSchema: z.object({
      intent: z.enum(["beginner", "professional", "hirer"]),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe("How confident the assistant is in this intent (0-1)"),
      reasoning: z
        .string()
        .optional()
        .describe("Short note on what signals led to this read"),
    }),
    execute: async ({ intent, confidence, reasoning }) => ({
      intent,
      confidence,
      reasoning: reasoning ?? "",
    }),
  }),
} as const;

export type AiTools = typeof aiTools;
