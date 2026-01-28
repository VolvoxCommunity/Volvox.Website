# CLAUDE.md

Guidance for Claude Code working with the Volvox.Website repository.

## Overview

Next.js 16 website for Volvox - software development, mentorship, and blog content. Uses React 19, TypeScript, Tailwind CSS v4, and pnpm.

## Commands

```bash
pnpm dev          # Dev server (localhost:3000)
pnpm build        # Production build
pnpm typecheck    # Type checking
pnpm lint         # Linting
pnpm test         # Unit tests (Jest)
pnpm test:e2e     # E2E tests (Chromium only)
pnpm format       # Format with Prettier

# E2E tests with Playwright
pnpm exec playwright test --project=brave     # Brave only
pnpm exec playwright test                      # All configured browsers
pnpm exec playwright test --ui                 # Interactive UI mode
```

**Pre-commit hooks run automatically**: lint-staged → typecheck → test → build → test:e2e

## ⚠️ Git Policy (CRITICAL)

**NEVER push changes to git without:**

1. All validation passing (typecheck, lint, test, build, test:e2e) - Run e2e tests in parallel with other validation checks. **Use the "brave" project or any available browser for E2E tests** (`pnpm exec playwright test --project=brave`) for validation.
2. **⚠️ CHANGELOG.md updated** - Document ALL user-facing changes in `CHANGELOG.md` before committing. This is MANDATORY for every commit that adds features, fixes bugs, or makes user-visible changes. A pre-commit hook will auto-generate a draft for review.
3. Explicit approval from the user

Always ask before pushing. No exceptions.

### CHANGELOG Guidelines

When making changes that affect users, update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with [Semantic Versioning](https://semver.org/):

| Category   | SemVer | Description                      |
| ---------- | ------ | -------------------------------- |
| Added      | MINOR  | New features                     |
| Changed    | PATCH  | Backwards-compatible changes     |
| Deprecated | MINOR  | Soon-to-be removed features      |
| Removed    | MAJOR  | Removed features (breaking)      |
| Fixed      | PATCH  | Bug fixes                        |
| Security   | PATCH  | Security vulnerability fixes     |
| feat!      | MAJOR  | Breaking change (via `!` suffix) |

Example entry:

```markdown
### Added

- **Blog listing page** (`/blog`) with search and filters (abc1234)
```

**Auto-generation**: The pre-commit hook automatically generates a draft CHANGELOG entry from your commit message (must use conventional commit format like `feat: description`). Review and edit the draft before committing again. To generate manually from a range: `pnpm changelog:generate <commit-range>`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── blog/[slug]/        # Blog post pages + OG images
│   ├── products/[slug]/    # Product pages + OG images
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── llms.txt/           # LLM-friendly content endpoint
│   ├── api/blog/[slug]/    # Blog API (views)
│   ├── styles/             # CSS modules (animations, prose, syntax)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage (Server Component)
│   ├── not-found.tsx       # Custom 404 page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt config
├── components/
│   ├── ui/                 # Primitives (button, card, dialog, etc.)
│   ├── blog/               # Blog components
│   ├── mdx/                # MDX components (callout, code-block, etc.)
│   ├── products/           # Product components
│   └── providers/          # Context providers
├── hooks/                  # use-mobile, use-mouse-glow
└── lib/
    ├── blog.ts             # getAllPosts, getPostBySlug
    ├── content.ts          # getAllProducts, getAllMentors, etc.
    ├── constants.ts        # SITE_URL, SITE_NAME, brand colors
    ├── schemas.ts          # Zod validation schemas
    ├── types.ts            # BlogPost, Product, Author, etc.
    ├── views.ts            # Blog view tracking (Upstash Redis)
    ├── structured-data.ts  # Schema.org JSON-LD generators
    └── utils.ts            # cn(), generateHeadingId()

content/
├── blog/*.mdx              # Blog posts with frontmatter
├── products/[slug]/        # Product content (changelog, index.json)
├── authors.json            # Author profiles
├── products.json           # Product data
├── mentors.json            # Mentor profiles
└── mentees.json            # Mentee profiles

e2e/                        # Playwright E2E tests
tests/                      # Jest unit tests
```

## Key Patterns

**Server → Client Component Flow**:

1. Server Components fetch data (`src/app/page.tsx`)
2. Pass data as props to Client Components (`homepage-client.tsx`)
3. Client Components handle interactivity and state

**Content**: Local MDX/JSON files in `content/`, validated with Zod schemas at runtime.

**Styling**: Tailwind CSS v4 with `@theme` directive in `globals.css`. Use `cn()` from `src/lib/utils.ts` for conditional classes.

**Theming**: `next-themes` with system/light/dark modes, stored as `volvox-theme` in localStorage.

## Blog Post Frontmatter

```yaml
title: Post Title
slug: url-slug
excerpt: Brief description
authorId: author-id # References content/authors.json
date: 2024-01-15
tags: [tag1, tag2]
published: true # Only published posts are displayed
banner: /images/... # Optional banner image
```

## Environment Variables

| Variable                           | Required | Description                         |
| ---------------------------------- | -------- | ----------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`           | No       | Sentry error tracking               |
| `UPSTASH_REDIS_REST_URL`           | No       | Blog view counts                    |
| `UPSTASH_REDIS_REST_TOKEN`         | No       | Blog view counts                    |
| `PLAYWRIGHT_BRAVE_EXECUTABLE_PATH` | No       | Path to Brave browser for E2E tests |

## Test Selectors

Key `data-testid` attributes:

- `hero-section`, `products-section`, `blog-section`, `mentorship-section`, `about-section`
- `footer`, `theme-toggle`, `mobile-menu-button`, `cookie-consent-banner`
- `blog-header`, `post-date`, `author-info`, `blog-content`

## Dependencies

- **UI**: Radix UI primitives, Framer Motion, Sonner (toasts)
- **Icons**: `@phosphor-icons/react`, `lucide-react`
- **Content**: `next-mdx-remote`, `gray-matter`, `rehype-highlight`, `remark-gfm`
- **Analytics**: Sentry, Vercel Analytics, Vercel Speed Insights
- **Storage**: Upstash Redis (blog views)

## Notes

- Path alias: `@/*` → `src/*`
- Strict TypeScript enabled
- Images: GitHub remote patterns allowed
- Font: JetBrains Mono (300-800 weights)
