# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Volvox is a Next.js 16 application showcasing software development, mentorship programs, and blog content. The project was migrated from Vite to Next.js App Router and uses React 19, TypeScript, and Tailwind CSS v4.

**Package Manager**: This project uses pnpm (pinned to v10.23.0). The `.npmrc` file configures strict peer dependencies and disables shamefully-hoist for better dependency management.

**Tailwind CSS v4**: This project uses Tailwind CSS v4 with CSS-first configuration. Theme customization is done via the `@theme` directive in `src/app/globals.css` instead of a JavaScript config file. Lightning CSS is used automatically by Next.js for faster builds.

## Development Commands

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run TypeScript type checking
pnpm typecheck

# Run linting
pnpm lint

# Run unit tests
pnpm test

# Format code with Prettier
pnpm format

# Check code formatting
pnpm format:check
```

## Code Quality Requirements

**MANDATORY**: After changing or editing any files, you MUST follow this workflow:

1. **Formatting**: Run `pnpm format` to ensure consistent code formatting
2. **Type Checking**: Run `pnpm typecheck` to verify TypeScript type safety
3. **Linting**: Run `pnpm lint` to check for code quality issues (includes type-aware linting)
4. **Build**: Run `pnpm build` to verify production build passes
5. **Commit and Push**: After all checks pass, commit and push all changes

These checks are not optional. All validation steps must pass before committing. If any check fails, fix the issues and re-run all checks before proceeding.

**Complete Workflow:**

```bash
# Step 1-4: Run all validation checks
pnpm format && pnpm typecheck && pnpm lint && pnpm build

# Step 5: If all checks pass, commit and push
git add .
git commit -m "your commit message"
git push
```

**Important:**

- Do NOT commit if any validation check fails
- Do NOT skip the validation checks to save time
- Always push after committing (unless explicitly told not to)

**Why this matters:**

- Prevents TypeScript errors from reaching production
- Catches type safety issues with type-aware ESLint rules
- Maintains consistent code style across the project
- Catches potential bugs and issues early (floating promises, unsafe any usage, etc.)
- Ensures CI/CD pipeline will pass
- Keeps remote repository in sync with local changes

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

- **Local Files**: All content stored as local MDX and JSON files in `content/` directory
- **Blog posts**: Stored as MDX files in `content/blog/` with frontmatter (title, slug, excerpt, authorId, date, tags, published)
- **Blog utilities**: `src/lib/blog.ts` provides `getAllPosts()`, `getPostBySlug()`, `getPostSlugs()`
- **Content rendering**: Uses `next-mdx-remote/rsc` for server-side markdown rendering with syntax highlighting via `rehype-highlight`
- **Products**: Stored in `content/products.json`, fetched via `getAllProducts()` in `src/lib/data.ts`
- **Mentorship**: Mentors and mentees stored in `content/mentors.json` and `content/mentees.json`, fetched via `getAllMentors()` and `getAllMentees()`
- **Authors**: Blog post authors stored in `content/authors.json` with relational links via authorId in blog post frontmatter
- **Validation**: All content validated at runtime using Zod schemas defined in `src/lib/schemas.ts`

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
- **Validation schemas**: `src/lib/schemas.ts` contains Zod schemas for runtime validation of content files
- **Path aliases**: `@/*` maps to `src/*` via tsconfig paths
- **Strict TypeScript**: Project uses strict mode

### Content Structure

```
/content
  /blog/*.mdx - Blog posts with frontmatter
  authors.json - Author profiles
  products.json - Product information
  mentors.json - Mentor profiles
  mentees.json - Mentee profiles
```

**Blog Post Frontmatter:**

- `title` - Post title
- `slug` - URL slug (must match filename)
- `excerpt` - Brief description
- `authorId` - Reference to author in authors.json
- `date` - Publication date (YYYY-MM-DD format)
- `tags` - Array of tag strings
- `published` - Boolean (only published posts are displayed)

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
- **Brand Colors**: Primary (Blue), Secondary (Purple), and Accent (Orange) are defined in CSS variables as hex codes.
- **Custom animations**: `gradient-x` and `pulse-slow` defined as `@keyframes` and registered via `@theme`
- **Dark mode**: Configured via `@variant dark (&:where(.dark, .dark *))` in CSS
- **Class variance authority**: Used for component variants (see `src/components/ui/button.tsx`)
- **clsx + tailwind-merge**: Combined via `cn()` utility in `src/lib/utils.ts` for conditional classes

### Build Output

- Static generation for blog posts via `generateStaticParams()`
- Server-side rendering for other pages
- `.next/` directory contains build artifacts (git-ignored)

### Data Resilience

- `src/app/page.tsx` uses `Promise.allSettled` to tolerate partial content loading failures and logs issues via `reportError`
- `src/lib/logger.ts` provides the shim for forwarding server-side errors to the centralized tracker (falls back to `console.error`)
- `src/lib/content.ts` wraps all file reads in try-catch blocks, returning empty arrays on error to prevent page crashes
- All content is validated at runtime using Zod schemas to catch malformed data early
