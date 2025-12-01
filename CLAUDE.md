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

# Run unit tests (Node test runner with tsx)
pnpm test

# Run E2E tests (Playwright)
pnpm exec playwright test

# Open Playwright UI for interactive E2E testing
pnpm exec playwright test --ui

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
4. **Testing**: Run `pnpm test` to ensure all unit tests pass
5. **Build**: Run `pnpm build` to verify production build passes
6. **Commit and Push**: After all checks pass, commit and push all changes

These checks are not optional. All validation steps must pass before committing. If any check fails, fix the issues and re-run all checks before proceeding.

**Complete Workflow:**

```bash
# Step 1-5: Run all validation checks
pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build

# Step 6: If all checks pass, commit and push
git add .
git commit -m "your commit message"
git push
```

**Important:**

- Do NOT commit or push changes - allow the user to do this manually
- Do NOT skip the validation checks to save time
- All validation checks must pass before changes are considered complete

**Why this matters:**

- Prevents TypeScript errors from reaching production
- Catches type safety issues with type-aware ESLint rules
- Maintains consistent code style across the project
- Catches potential bugs and issues early (floating promises, unsafe any usage, etc.)
- Verifies all unit tests pass before changes are committed
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
  - Layout components: `navigation.tsx`, `footer.tsx`, `animated-background.tsx` (canvas-based particle animation with mouse tracking)
  - Section components: `hero.tsx`, `products.tsx`, `blog.tsx`, `mentorship.tsx`, `about.tsx`
  - UI primitives: `src/components/ui/` (button, card, badge, dialog, sheet, tabs, avatar, sonner, etc.)
  - Blog components: `src/components/blog/` (blog-post-header, table-of-contents, reading-progress, scroll-reveal, heading-with-anchor, blog-content-wrapper)
  - MDX components: `src/components/mdx/` (callout, code-block, image-zoom, link)
  - Theme components: `theme-toggle.tsx` (light/dark mode toggle with Sun/Moon icons)

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

/e2e
  blog-view-tracking.spec.ts - Playwright E2E test for blog view tracking

/tests
  slug-validation.test.ts - Blog post slug format validation
  generate-heading-id.test.ts - Heading ID generation tests
  postcss-tailwind.test.ts - Tailwind CSS configuration tests

/src
  /app
    /blog/[slug] - Dynamic blog post pages
    /privacy - Privacy policy page
    layout.tsx - Root layout
    page.tsx - Homepage server component
    global-error.tsx - Global error boundary
  /components
    /blog - Blog-specific components
    /mdx - Custom MDX components
    /ui - Reusable UI primitives
    /providers - React context providers
  /hooks - Custom React hooks
  /lib - Utilities, types, schemas
  instrumentation.ts - Server instrumentation for Sentry
  instrumentation-client.ts - Client instrumentation
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

- `use-mouse-glow.ts`: Mouse tracking effect for interactive glow effects
- `use-mobile.ts`: Exports `useIsMobile()` hook for mobile viewport detection (<768px breakpoint)

### Utility Functions

Located in `src/lib/`:

- **`utils.ts`**:
  - `cn(...inputs)`: Combines `clsx` and `tailwind-merge` for conditional class names
  - `generateHeadingId(text, fallback?)`: Creates URL-safe heading IDs from text, with hash-based fallbacks for non-ASCII content
  - `simpleHash(text)`: Generates hash codes for ID fallbacks
- **`validation.ts`**:
  - `normalizeSlug(rawSlug)`: Validates and normalizes blog post slugs
  - `slugConstraints`: Object containing pattern and max length constraints
- **`logger.ts`**:
  - `reportError(context, error)`: Reports errors to Sentry with context metadata, falls back to console.error
- **`mdx-components.tsx`**:
  - `mdxComponents`: Custom MDX component overrides (Callout, headings with anchors, code blocks, images with zoom, tables, task lists)

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

### Additional Dependencies

- **UI Components**: Radix UI primitives (`@radix-ui/react-*`) for accessible components
- **Icons**:
  - `@phosphor-icons/react` for Phosphor icons (used in navigation, social links)
  - `lucide-react` for Lucide icons (used in theme toggle, blog components)
- **Animations**: `framer-motion` for motion/animation effects (navigation, hero, products, about, mentorship, blog sections)
- **Notifications**: `sonner` for toast notifications (integrated via `src/components/ui/sonner.tsx`)
- **Confetti**: `canvas-confetti` for celebratory animations (triggers on Discord link click)
- **Date Formatting**: `date-fns` for date manipulation and formatting
- **Markdown Processing**:
  - `gray-matter` for parsing frontmatter
  - `next-mdx-remote` for MDX rendering
  - `react-markdown` for markdown rendering
  - `rehype-highlight` for syntax highlighting
  - `remark-gfm` for GitHub Flavored Markdown
  - `highlight.js` for code highlighting themes
- **Styling Utilities**:
  - `class-variance-authority` for component variants
  - `clsx` and `tailwind-merge` combined in `cn()` utility
  - `@radix-ui/colors` for color scales

### Build Output

- Static generation for blog posts via `generateStaticParams()`
- Server-side rendering for other pages
- `.next/` directory contains build artifacts (git-ignored)

### Error Monitoring & Analytics

- **Sentry**: Error tracking and performance monitoring
  - Configuration files: `sentry.server.config.ts`, `sentry.edge.config.ts`
  - Instrumentation: `src/instrumentation.ts` registers Sentry based on runtime (nodejs/edge)
  - Client instrumentation: `src/instrumentation-client.ts` for browser-side error tracking
  - Environment variable: `NEXT_PUBLIC_SENTRY_DSN` for configuring Sentry DSN
  - Features: trace sampling (100%), logs enabled, PII enabled
  - Replay integration: 10% session sampling, 100% on errors
  - Request error tracking via `onRequestError` hook
  - Next.js integration via `withSentryConfig` wrapper with monitoring tunnel at `/monitoring`
- **Vercel Analytics**: User analytics via `@vercel/analytics` package
- **Vercel Speed Insights**: Performance monitoring via `@vercel/speed-insights` package

### Testing

- **Unit Tests**: Uses Node.js test runner with `tsx` (located in `tests/`)
  - `slug-validation.test.ts`: Validates blog post slug format
  - `generate-heading-id.test.ts`: Tests heading ID generation utility
  - `postcss-tailwind.test.ts`: Tests Tailwind CSS configuration
  - Run with: `pnpm test`
- **E2E Tests**: Uses Playwright for end-to-end testing (located in `e2e/`)
  - Configuration: `playwright.config.ts` (targets Chromium)
  - Example: `blog-view-tracking.spec.ts` tests blog page interactions
  - Run with: `pnpm exec playwright test`
  - Interactive UI: `pnpm exec playwright test --ui`

### Data Resilience

- `src/app/page.tsx` uses `Promise.allSettled` to tolerate partial content loading failures and logs issues via `reportError`
- `src/lib/logger.ts` provides the shim for forwarding server-side errors to the centralized tracker (falls back to `console.error`)
- `src/lib/content.ts` wraps all file reads in try-catch blocks, returning empty arrays on error to prevent page crashes
- All content is validated at runtime using Zod schemas to catch malformed data early

### Content Loading Functions

Located in `src/lib/content.ts`:

- `getAllAuthors(): Author[]` - Reads and validates authors from JSON
- `getAuthorById(id: string): Author | null` - Retrieves single author by ID
- `getAllProducts(): Product[]` - Reads and validates products from JSON
- `getAllMentors(): Mentor[]` - Reads and validates mentors from JSON
- `getAllMentees(): Mentee[]` - Reads and validates mentees from JSON

Located in `src/lib/data.ts` (API compatibility wrappers):

- `getAllProducts(limit?, offset?)` - Async wrapper with pagination metadata
- `getAllMentors()` - Returns mentors with pagination metadata wrapper
- `getAllMentees()` - Returns mentees with pagination metadata wrapper

### Environment Variables

| Variable                 | Required | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry DSN for error tracking. If not set, Sentry is disabled. |

**Note:** No `.env.example` file exists. Copy the variable above to `.env.local` for local development.
