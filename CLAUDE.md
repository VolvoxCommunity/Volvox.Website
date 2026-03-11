# CLAUDE.md

## Overview

Next.js 16 website for Volvox (`volvox.dev`) — software development, mentorship, and blog. React 19, TypeScript (strict), Tailwind CSS v4, Biome, pnpm.

## Commands

```bash
pnpm dev              # Dev server (localhost:3000)
pnpm build            # Production build
pnpm typecheck        # TypeScript type checking
pnpm lint             # Biome lint + format check
pnpm lint:fix         # Auto-fix lint + format issues
pnpm format           # Format with Biome (write)
pnpm format:check     # Format check (no write)
```

**E2E tests** (Playwright):
```bash
pnpm exec playwright test --project=chromium  # Chromium only (fast validation)
pnpm exec playwright test                      # All browsers
```

**Pre-commit hook**: lint-staged (Biome) -> typecheck -> build

## Visual Change Verification (MANDATORY)

**ALL visual changes MUST be verified using the Chrome DevTools MCP server.** After making any UI/styling/layout change:

1. Ensure the dev server is running (`pnpm dev`)
2. Use `chrome-devtools` MCP tools to take a screenshot and visually confirm the change renders correctly
3. Do NOT mark visual work as complete without screenshot verification

This is non-negotiable. No exceptions.

## Git Policy

**NEVER push without explicit user approval.** Before committing:

1. All validation passing: `pnpm lint && pnpm typecheck && pnpm build`
2. Update `CHANGELOG.md` for user-facing changes ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, [SemVer](https://semver.org/))
3. Use conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`)

## Project Structure

```
src/
  app/
    blog/[slug]/          # Blog post pages + OG images
    products/[slug]/      # Product pages + OG images
    team/[slug]/          # Team member pages
    privacy/, terms/      # Legal pages
    llms.txt/             # LLM-friendly content endpoint
    api/blog/[slug]/      # Blog API (view counts)
    styles/               # CSS (animations, prose, syntax highlighting)
    layout.tsx            # Root layout (fonts, analytics, Sentry)
    page.tsx              # Homepage (Server Component)
    globals.css           # Tailwind v4 theme + custom styles
  components/
    ui/                   # Primitives (button, card, dialog, filter-controls)
    blog/                 # Blog-specific (heading-with-anchor)
    hero/                 # Hero section components
    mdx/                  # MDX renderers (callout, code-block, image-zoom)
    products/             # Product detail components
    providers/            # Context providers (smooth-scroll)
    team/                 # Team member components
  hooks/                  # use-mobile, use-mouse-glow, use-keyboard-shortcuts
  lib/
    blog.ts               # getAllPosts, getPostBySlug (reads content/blog/*.mdx)
    content.ts            # getAllProducts, getTeamMembers (reads content/*.json)
    constants.ts          # SITE_URL, SITE_NAME, NAV_ITEMS, BRAND_COLORS
    schemas.ts            # Zod validation for all content types
    types.ts              # BlogPost, Product, Author, TeamMember
    social-images.tsx     # OG image generation (ImageResponse API)
    structured-data.ts    # Schema.org JSON-LD generators
    views.ts              # Blog view tracking (Upstash Redis)
    utils.ts              # cn(), generateHeadingId()

content/
  blog/*.mdx              # Blog posts (frontmatter + MDX)
  products/[slug]/        # Product data (changelog, index.json, screenshots/)
  authors.json            # Author profiles
  products.json           # Product catalog
  team.json               # Team member profiles

e2e/                      # Playwright E2E tests
```

## Key Patterns

**Server -> Client flow**: Server Components fetch data (`page.tsx`) -> pass as props to Client Components (`*-client.tsx`) for interactivity.

**Content pipeline**: Local MDX/JSON in `content/` -> validated with Zod schemas (`lib/schemas.ts`) -> consumed by `lib/blog.ts` and `lib/content.ts`.

**Styling**: Tailwind CSS v4 with `@theme` in `globals.css`. Use `cn()` from `lib/utils.ts` for conditional classes. Dark mode via `next-themes` (class strategy with `.dark`).

**OG images**: Generated dynamically via `lib/social-images.tsx` using Next.js `ImageResponse`. Uses raw `<img>` tags (not `next/image`) — this is intentional for OG context.

## Blog Post Frontmatter

```yaml
title: Post Title
slug: url-slug
excerpt: Brief description
authorId: author-id     # References content/authors.json
date: 2024-01-15
tags: [tag1, tag2]
published: true          # Only published posts are displayed
banner: /images/...      # Optional banner image
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking |
| `UPSTASH_REDIS_REST_URL` | Blog view counts |
| `UPSTASH_REDIS_REST_TOKEN` | Blog view counts |

## Gotchas

- **`globals.css` excluded from Biome** — Tailwind v4 `@variant` syntax causes parse errors; file is excluded in `biome.json`
- **Sentry tunnel route** — `/monitoring` is a Sentry tunnel (see `next.config.ts`), not an app route
- **Security headers** — Custom headers configured in `next.config.ts` (HSTS, X-Frame-Options, CSP, etc.)
- **Path alias**: `@/*` -> `src/*`
- **Font**: JetBrains Mono (variable, 300-800 weights)
- **Images**: GitHub remote patterns allowed in `next.config.ts`

## Test Selectors

Key `data-testid` attributes for E2E:

- Homepage: `hero-section`, `products-section`, `blog-section`, `mentorship-section`, `about-section`
- Global: `footer`, `theme-toggle`, `mobile-menu-button`, `cookie-consent-banner`
- Blog: `blog-header`, `post-date`, `author-info`, `blog-content`
