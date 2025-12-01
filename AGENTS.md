# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Development Commands

**MANDATORY**: After changing any files, run this validation workflow:

```bash
pnpm format && pnpm typecheck && pnpm lint && pnpm build
```

All checks must pass before committing. Do not skip these steps.

## Project-Specific Architecture

- **Data Resilience**: Homepage uses `Promise.allSettled()` in `src/app/page.tsx` to tolerate partial content loading failures
- **Server/Client Pattern**: Server Components fetch data, pass props to Client Components for interactivity
- **Single-page Navigation**: Homepage uses client-side scrolling with section tracking in `homepage-client.tsx`
- **Dual-mode Navigation**: Navigation supports both scroll-to-section (homepage) and link navigation (other pages)

## Unique Technical Details

- **Tailwind CSS v4**: Uses CSS-first configuration with `@theme` directive in `src/app/globals.css` (no JavaScript config)
- **Theme Storage**: Theme preference stored in localStorage as `volvox-theme` (not the default)
- **Sentry Dual Configuration**: Separate configs for server (`sentry.server.config.ts`) and edge (`sentry.edge.config.ts`) runtimes
- **Error Reporting**: Custom `reportError()` function in `src/lib/logger.ts` forwards to Sentry with context
- **Lightning CSS**: Automatically used by Next.js for faster builds (replaces PostCSS)

## Critical Utilities and Patterns

- **`generateHeadingId()`**: Creates URL-safe heading IDs with hash-based fallbacks for international content
- **`cn()` utility**: Combines `clsx` and `tailwind-merge` for conditional class names
- **Content Validation**: All content validated at runtime using Zod schemas in `src/lib/schemas.ts`
- **File-based Content**: All content stored in `content/` directory with JSON/MDX files

## Testing Setup

- **Node.js Test Runner**: Uses `tsx` instead of Jest for unit tests in `tests/` directory
- **Playwright E2E**: Configuration in `playwright.config.ts` targets Chromium only
- **Test Commands**:
  - Unit tests: `pnpm test`
  - E2E tests: `pnpm exec playwright test`
  - Interactive UI: `pnpm exec playwright test --ui`

## Code Style Requirements

- **Import Organization**: framework → third-party → local
- **File Structure**: imports → types → constants → logic → exports
- **Path Aliases**: `@/*` maps to `src/*` (configured in tsconfig)
- **Strict TypeScript**: Project uses strict mode with explicit types for public APIs

## Content Management

- **Blog Posts**: MDX files in `content/blog/` with frontmatter (title, slug, authorId, date, tags, published)
- **Relational Data**: Authors linked via `authorId` in blog frontmatter to `content/authors.json`
- **Content Functions**: Located in `src/lib/content.ts` with try-catch wrappers for resilience
- **MDX Rendering**: Uses `next-mdx-remote/rsc` for server-side rendering with syntax highlighting
