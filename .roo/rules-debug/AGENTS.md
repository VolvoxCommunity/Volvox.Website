# Debug Mode Agent Guidelines

This file provides debugging-specific guidance for agents working in Debug mode on this project.

## Error Logging and Reporting

### Primary Error Reporting

- Use `reportError()` function from `src/lib/logger.ts` for all error reporting
- This function forwards to Sentry with appropriate context
- Always report errors before throwing them - don't throw directly

### Sentry Configuration

- Dual configuration: server (`sentry.server.config.ts`) and edge (`sentry.edge.config.ts`)
- Check both configurations when debugging error reporting issues
- Instrumentation files: `src/instrumentation.ts` and `src/instrumentation-client.ts`

### Error Context Collection

- Include relevant context when reporting errors (user actions, component state, etc.)
- Use structured logging with consistent format
- Check browser console for client-side errors that might not reach Sentry

## Common Issues and Solutions

### Data Loading Issues

- Homepage uses `Promise.allSettled()` in `src/app/page.tsx` - partial failures are expected
- Check content functions in `src/lib/content.ts` for try-catch wrappers
- Validate content structure using Zod schemas in `src/lib/schemas.ts`

### Theme System Problems

- Theme preference stored in localStorage as `volvox-theme` (not default)
- Check theme provider in `src/components/providers/theme-provider.tsx`
- Verify theme toggle component in `src/components/theme-toggle.tsx`

### Navigation Issues

- Homepage uses client-side scrolling in `src/components/homepage-client.tsx`
- Navigation supports both scroll-to-section and link navigation
- Check section tracking implementation for homepage navigation

### CSS and Styling Problems

- Tailwind CSS v4 uses CSS-first configuration in `src/app/globals.css`
- No JavaScript config - don't look for tailwind.config.js
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes

## Debugging Workflow and Best Practices

### Systematic Debugging Approach

1. Reproduce the issue consistently
2. Check browser console for client-side errors
3. Check server logs for server-side errors
4. Verify data flow from Server Components to Client Components
5. Test with different content states (empty, partial, full)

### Performance Debugging

- Use Next.js built-in performance tools
- Check Lightning CSS build output for CSS issues
- Monitor bundle size and loading performance
- Test with different network conditions

### Content Debugging

- Validate MDX content structure in `content/blog/` directory
- Check author relationships via `authorId` to `content/authors.json`
- Verify MDX component imports in `src/lib/mdx-components.tsx`
- Test content validation with Zod schemas

## Hidden Debugging Locations

### Error Boundaries

- Global error boundary in `src/app/global-error.tsx`
- Check for unhandled promise rejections
- Monitor error propagation through component hierarchy

### Data Flow Debugging

- Server Components fetch data in `src/app/page.tsx`
- Client Components receive props in `src/components/homepage-client.tsx`
- Track data transformations between server and client

### Build Process Debugging

- Lightning CSS replaces PostCSS - check CSS compilation
- TypeScript strict mode - check type errors carefully
- ESLint type-aware rules - check for type safety issues

## Debugging Tools and Techniques

### Browser DevTools

- Use React DevTools to inspect component state and props
- Check Network tab for API calls and data loading
- Monitor Console for client-side errors and warnings
- Use Performance tab for runtime performance analysis

### Node.js Debugging

- Use Jest for unit test debugging in `tests/` directory
- Check build output for TypeScript compilation issues
- Monitor server-side rendering performance

### E2E Test Debugging

- Use Playwright's interactive UI mode: `pnpm exec playwright test --ui`
- Check test configuration in `playwright.config.ts`
- Debug test failures with browser devtools integration

## Specific Debugging Scenarios

### MDX Rendering Issues

- Check custom MDX components in `src/components/mdx/`
- Verify syntax highlighting configuration
- Test with different MDX content types
- Check for component re-rendering issues

### Client-Side State Issues

- Debug React hooks in client components
- Check for stale closures and memory leaks
- Monitor component lifecycle methods
- Test state persistence across page navigation

### Build and Deployment Issues

- Check environment variable configuration
- Verify build output for missing assets
- Test production build locally before deployment
- Monitor CI/CD pipeline for build failures

## Performance Debugging Techniques

### Bundle Analysis

- Use Next.js built-in bundle analyzer
- Check for unused dependencies and code
- Optimize dynamic imports and code splitting
- Monitor JavaScript execution time

### Rendering Performance

- Check for unnecessary re-renders
- Optimize component memoization
- Monitor server-side rendering time
- Test with different content sizes

### Network Performance

- Optimize image loading with Next.js Image component
- Check for unnecessary API calls
- Monitor resource loading order
- Test with slow network conditions

## Debugging Gotchas

1. **CSS Configuration**: Don't look for JavaScript Tailwind config - it's CSS-only
2. **Theme Storage**: Use `volvox-theme` key, not default theme key
3. **Error Reporting**: Always use `reportError()` before throwing
4. **Data Resilience**: Partial content loading failures are expected behavior
5. **Import Order**: Check import order when debugging module resolution issues
6. **Path Aliases**: Use `@/*` for local imports, not relative paths
