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

- **Blog posts**: MDX files in `content/blog/` directory
- **Blog utilities**: `src/lib/blog.ts` provides `getAllPosts()`, `getPostBySlug()`, `getPostSlugs()`
- **MDX rendering**: Uses `next-mdx-remote/rsc` for server-side MDX rendering with syntax highlighting via `rehype-highlight`
- **Frontmatter**: Blog posts use `gray-matter` for parsing YAML frontmatter (title, excerpt, author, date, tags, readTime)
- **Static data**: Products and mentorship data in `src/data/` as TypeScript files

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

- **Shared types**: `src/lib/types.ts` defines `BlogPost`, `Product`, `Mentor`, `Mentee` interfaces
- **Path aliases**: `@/*` maps to `src/*` via tsconfig paths
- **Strict TypeScript**: Project uses strict mode

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
