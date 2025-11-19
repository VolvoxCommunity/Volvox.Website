# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Volvox is a Next.js 16 application showcasing software development, mentorship programs, and blog content. The project was migrated from Vite to Next.js App Router and uses React 19, TypeScript, and Tailwind CSS v4.

**Package Manager**: This project uses pnpm. The `.npmrc` file configures strict peer dependencies and disables shamefully-hoist for better dependency management.

**Tailwind CSS v4**: This project uses Tailwind CSS v4 with CSS-first configuration. Theme customization is done via the `@theme` directive in `src/app/globals.css` instead of a JavaScript config file. Lightning CSS is used automatically by Next.js for faster builds.

## Development Commands

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run unit tests
pnpm test

# Format code with Prettier
pnpm format

# Check code formatting
pnpm format:check
```

## Architecture

### Framework & Routing

- **Next.js 16 App Router**: Uses the `src/app` directory structure
- **Server Components by default**: Pages like `src/app/page.tsx` are Server Components that fetch data
- **Client Components**: Marked with `"use client"` directive (e.g., `homepage-client.tsx`)
- **Dynamic routes**: Blog posts use `src/app/blog/[slug]/page.tsx` with `generateStaticParams()`

### Data Flow Pattern

1. Server Components (`src/app/page.tsx`) fetch data using async functions
2. Data is passed as props to Client Components (`homepage-client.tsx`)
3. Client Components handle interactivity, state, and browser APIs
4. This pattern separates data fetching (server) from UI interactivity (client)

### Content Management

- **Database**: All content stored in Supabase PostgreSQL database
- **Blog posts**: Stored in `blog_posts` table with markdown content, metadata, and view tracking
- **Blog utilities**: `src/lib/blog.ts` provides `getAllPosts()`, `getPostBySlug()`, `getPostSlugs()`, `incrementPostViews()`
- **Content rendering**: Uses `next-mdx-remote/rsc` for server-side markdown rendering with syntax highlighting via `rehype-highlight`
- **Products**: Stored in `products` table, fetched via `getAllProducts()` in `src/lib/data.ts`
- **Mentorship**: Mentors and mentees stored in respective tables, fetched via `getAllMentors()` and `getAllMentees()`
- **Authors**: Blog post authors stored in `authors` table with relational links to blog posts
- **View tracking**: Blog post views automatically incremented via database function and API route (`/api/blog/views`)
- **Pagination**: Product queries accept `limit`/`offset` while mentor/mentee queries return paginated metadata via `PaginatedResult<T>` to avoid loading entire tables at once

### UI Architecture

- **Single-page layout**: Homepage is a client-side scrolling experience with section-based navigation
- **Section tracking**: `homepage-client.tsx` tracks current section via scroll position and updates navigation
- **Component structure**:
  - Layout components: `navigation.tsx`, `footer.tsx`, `animated-background.tsx`
  - Section components: `hero.tsx`, `products.tsx`, `blog.tsx`, `mentorship.tsx`, `about.tsx`
  - UI primitives: `src/components/ui/` (button, card, badge, dialog, etc.)

### Theming

- **Theme system**: Uses `next-themes` via `theme-provider.tsx` with system/light/dark modes
- **Storage**: Theme preference stored in localStorage as `volvox-theme`
- **CSS variables**: Color system defined in `src/app/globals.css` using CSS custom properties
- **Tailwind integration**: `tailwind.config.ts` maps CSS variables to Tailwind utilities

### Type System

- **Shared types**: `src/lib/types.ts` defines `BlogPost`, `Product`, `Mentor`, `Mentee`, `Author` interfaces
- **Database types**: `src/lib/database.types.ts` contains auto-generated Supabase types
- **Supabase client**: `src/lib/supabase.ts` exports configured Supabase client with type safety
- **Path aliases**: `@/*` maps to `src/*` via tsconfig paths
- **Strict TypeScript**: Project uses strict mode

### Database Schema

**Supabase PostgreSQL** with the following tables:

- `authors` - Author profiles (id, name, role, avatar)
- `blog_posts` - Blog content (id, title, slug, excerpt, content, author_id, date, tags, views, published)
- `products` - Product information (id, name, description, long_description, tech_stack, features, github_url, demo_url, image)
- `mentors` - Mentor profiles (id, name, avatar, role, expertise, bio, github_url)
- `mentees` - Mentee profiles (id, name, avatar, goals, progress, github_url)

**Row Level Security (RLS)**: Enabled on all tables with policies for public read access and authenticated write access

**Database Functions**: `increment_post_views(post_slug)` for atomic view count updates

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public API key

### Custom Hooks

- `use-confetti-easter-eggs.ts`: Easter egg functionality triggered by specific interactions
- `use-mouse-glow.ts`: Mouse tracking effect for interactive glow
- `use-mobile.ts`: Mobile viewport detection

## Key Technical Details

### Image Handling

- Next.js Image component configured in `next.config.ts` to allow GitHub images
- Remote patterns: `https://github.com`

### Font Loading

- Uses `next/font/google` to load JetBrains Mono with weight variants 300-800
- Font variable: `--font-jetbrains-mono`

### Metadata

- SEO metadata defined in `src/app/layout.tsx` for the site
- Dynamic metadata for blog posts generated in `src/app/blog/[slug]/page.tsx`
- Includes OpenGraph and Twitter card metadata

### Styling Approach

- **Tailwind CSS v4**: Utility-first CSS framework with CSS-first configuration
- **Lightning CSS**: Automatic via Next.js (replaces PostCSS/Autoprefixer for faster builds)
- **Theme Configuration**: Uses `@theme` directive in `globals.css` instead of JavaScript config
- **Custom animations**: `gradient-x` and `pulse-slow` defined as `@keyframes` and registered via `@theme`
- **Dark mode**: Configured via `@variant dark (&:where(.dark, .dark *))` in CSS
- **Class variance authority**: Used for component variants (see `src/components/ui/button.tsx`)
- **clsx + tailwind-merge**: Combined via `cn()` utility in `src/lib/utils.ts` for conditional classes

### Build Output

- Static generation for blog posts via `generateStaticParams()`
- Server-side rendering for other pages
- `.next/` directory contains build artifacts (git-ignored)

### Data Resilience & Analytics

- `src/app/page.tsx` uses `Promise.allSettled` to tolerate partial Supabase failures and logs issues via `reportError`
- `src/lib/logger.ts` provides the shim for forwarding server-side errors to the centralized tracker (falls back to `console.error`)
- `src/lib/validation.ts` contains slug validation helpers used by `/api/blog/views`; covered by `tests/slug-validation.test.ts`
- `src/components/post-view-tracker.tsx` relies on `navigator.sendBeacon` with a keepalive fetch fallback to reduce dropped analytics events
