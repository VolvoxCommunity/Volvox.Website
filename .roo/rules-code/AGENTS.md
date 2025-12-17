# Code Mode Agent Guidelines

This file provides implementation-specific guidance for agents working in Code mode on this project.

## Build/Development Workflow

**MANDATORY**: After changing any files, run this validation workflow:

```bash
pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

All checks must pass before committing. Do not skip these steps.

## Implementation-Specific Patterns

### Data Resilience Patterns

- Homepage uses `Promise.allSettled()` in `src/app/page.tsx` to tolerate partial content loading failures
- All content functions in `src/lib/content.ts` include try-catch wrappers for resilience
- Follow this pattern when adding new data fetching: use Promise.allSettled() for parallel requests

### Server/Client Component Architecture

- Server Components fetch data, pass props to Client Components for interactivity
- Keep data fetching logic in Server Components
- Client Components should only handle interactivity and state management
- Example pattern: `src/app/page.tsx` (Server) → `src/components/homepage-client.tsx` (Client)

### Navigation Implementation

- Homepage uses client-side scrolling with section tracking in `homepage-client.tsx`
- Navigation supports both scroll-to-section (homepage) and link navigation (other pages)
- When adding new sections to homepage, update section tracking in `homepage-client.tsx`

## Critical Utilities to Use

### CSS and Styling

- Use `cn()` utility from `src/lib/utils.ts` for conditional class names
- Tailwind CSS v4 uses CSS-first configuration with `@theme` directive in `src/app/globals.css`
- No JavaScript config for Tailwind - all styling is CSS-based

### Content Handling

- Use `generateHeadingId()` for URL-safe heading IDs with hash-based fallbacks
- All content must be validated using Zod schemas from `src/lib/schemas.ts`
- Content is stored in `content/` directory with JSON/MDX files

### Error Reporting

- Use `reportError()` function from `src/lib/logger.ts` for all error reporting
- This forwards to Sentry with appropriate context
- Never throw errors directly - always report them first

## Code Style Requirements

### Import Organization

```typescript
// Framework imports
import { Component } from "react";

// Third-party imports
import clsx from "clsx";

// Local imports
import { cn } from "@/lib/utils";
```

### File Structure

1. Imports/dependencies
2. Type definitions
3. Constants
4. Helper/utility functions
5. Main logic (components, classes, etc.)
6. Exports

### TypeScript Requirements

- Project uses strict mode with explicit types for public APIs
- Avoid `any`; use `unknown` with type guards
- Use path aliases (`@/*`) for local imports
- All public APIs must have JSDoc/TSDoc comments

## Testing Implementation

### Unit Tests

- Uses Jest with Testing Library for unit tests in `tests/` directory
- Test utilities and helper functions thoroughly
- Run tests with `pnpm test`

### E2E Tests

- Playwright configuration in `playwright.config.ts` targets multi-browser (Chromium, Firefox, Safari + mobile)
- Run E2E tests with `pnpm exec playwright test`
- Use interactive UI mode with `pnpm exec playwright test --ui`

## Content Management Implementation

### Blog Posts

- MDX files in `content/blog/` with frontmatter (title, slug, authorId, date, tags, published)
- Authors linked via `authorId` in blog frontmatter to `content/authors.json`
- Use content functions from `src/lib/content.ts` for all content operations

### MDX Rendering

- Uses `next-mdx-remote/rsc` for server-side rendering with syntax highlighting
- Custom MDX components in `src/components/mdx/` directory
- All MDX components must be imported in `src/lib/mdx-components.tsx`

## Special Implementation Details

### Theme System

- Theme preference stored in localStorage as `volvox-theme` (not the default)
- Theme provider in `src/components/providers/theme-provider.tsx`
- Use `useTheme` hook from this provider for theme operations

### Sentry Configuration

- Separate configs for server (`sentry.server.config.ts`) and edge (`sentry.edge.config.ts`) runtimes
- Ensure proper error boundaries and instrumentation
- Use `src/instrumentation.ts` and `src/instrumentation-client.ts` for setup

### Performance Considerations

- Lightning CSS automatically used by Next.js for faster builds (replaces PostCSS)
- Optimize images and components for performance
- Use Next.js Image component for all images

## Common Gotchas

1. **CSS Configuration**: Don't create a `tailwind.config.js` - this project uses CSS-first configuration
2. **Theme Storage**: Use `volvox-theme` key, not the default theme key
3. **Content Validation**: Always validate content with Zod schemas before using
4. **Error Handling**: Use `reportError()` instead of throwing directly
5. **Import Order**: Follow framework → third-party → local order strictly
6. **Path Aliases**: Use `@/*` for all local imports, not relative paths
