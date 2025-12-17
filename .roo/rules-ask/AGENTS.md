# Ask Mode Agent Guidelines

This file provides analysis and documentation guidance for agents working in Ask mode on this project.

## Codebase Exploration and Understanding

### Systematic Exploration Approach

1. Start with `codebase_search` tool for semantic searches before using other search tools
2. Use `list_code_definition_names` to get overview of source code definitions
3. Follow up with `read_file` for detailed examination of relevant files
4. Use `search_files` for specific pattern searches after initial exploration

### Key Architecture Components to Understand

- **Data Resilience Pattern**: `Promise.allSettled()` in `src/app/page.tsx`
- **Server/Client Architecture**: Server Components fetch data, Client Components handle interactivity
- **Navigation System**: Dual-mode navigation (scroll-to-section vs link navigation)
- **Content Management**: File-based content with MDX and JSON files

### Critical Files for Context

- `src/app/page.tsx` - Main homepage with data resilience pattern
- `src/components/homepage-client.tsx` - Client-side navigation and scrolling
- `src/lib/content.ts` - Content management functions with error handling
- `src/lib/schemas.ts` - Zod validation schemas for content
- `src/lib/logger.ts` - Error reporting with Sentry integration

## Documentation Patterns and Conventions

### Project-Specific Documentation Standards

- All public APIs require JSDoc/TSDoc comments
- Follow import organization: framework → third-party → local
- Use path aliases (`@/*`) for local imports
- File structure: imports → types → constants → logic → exports

### Documentation Locations

- Component documentation in respective component files
- Utility function documentation in `src/lib/` directory
- Type definitions in `src/lib/types.ts`
- Content schema documentation in `src/lib/schemas.ts`

### External Resource Access Guidelines

- Check existing documentation before creating new content
- Reference project-specific patterns in `AGENTS.md` and `.roo/rules/`
- Use semantic search to find related implementations before suggesting new ones
- Consider existing utilities and patterns before recommending external solutions

## Code Review and Explanation Approaches

### Analysis Framework

1. **Purpose**: What problem does this code solve?
2. **Architecture**: How does it fit into the overall system?
3. **Dependencies**: What does it rely on?
4. **Impact**: What other components does it affect?
5. **Patterns**: Does it follow project conventions?

### Key Patterns to Explain

- **Error Handling**: Use of `reportError()` function and try-catch wrappers
- **Data Flow**: Server Component → Client Component data passing
- **Styling**: Tailwind CSS v4 with CSS-first configuration
- **Content Validation**: Runtime validation with Zod schemas
- **Performance**: Lightning CSS, image optimization, code splitting

### Context Gathering Techniques

- Use `codebase_search` to find related implementations
- Check `tests/` directory for usage examples
- Review content files in `content/` directory for data structures
- Examine component props and state management patterns

## Specialized Knowledge Areas

### Content Management System

- Blog posts as MDX files with frontmatter (title, slug, authorId, date, tags, published)
- Relational data: Authors linked via `authorId` to `content/authors.json`
- Content functions with resilience patterns in `src/lib/content.ts`
- MDX rendering with `next-mdx-remote/rsc` for server-side rendering

### Theme System

- Custom theme storage in localStorage as `volvox-theme`
- Theme provider in `src/components/providers/theme-provider.tsx`
- Theme toggle component in `src/components/theme-toggle.tsx`

### Error Reporting and Monitoring

- Custom `reportError()` function in `src/lib/logger.ts`
- Dual Sentry configuration (server and edge runtimes)
- Instrumentation files: `src/instrumentation.ts` and `src/instrumentation-client.ts`

### Testing Infrastructure

- Unit tests using Jest with Testing Library in `tests/` directory
- E2E tests with Playwright (multi-browser: Chromium, Firefox, Safari + mobile)
- Test commands: `pnpm test` (unit), `pnpm exec playwright test` (E2E)

## Analysis Best Practices

### When Explaining Code

1. Start with the high-level purpose and context
2. Explain how it fits into the project's architecture
3. Detail key implementation choices and patterns
4. Highlight any non-obvious or project-specific details
5. Mention related components or dependencies

### When Documenting Features

1. Focus on user-facing functionality
2. Explain the technical implementation briefly
3. Include examples of usage
4. Reference related files and components
5. Note any special considerations or limitations

### When Analyzing Issues

1. Identify the affected components and data flow
2. Check error handling and reporting mechanisms
3. Review related tests for expected behavior
4. Consider performance and accessibility implications
5. Suggest specific file locations for fixes

## Project-Specific Gotchas

### Common Misconceptions

- **CSS Configuration**: No JavaScript Tailwind config - uses CSS-first approach
- **Theme Storage**: Uses `volvox-theme` key, not default
- **Data Loading**: Partial failures are expected due to `Promise.allSettled()`
- **Error Handling**: Always use `reportError()` before throwing
- **Import Paths**: Use `@/*` aliases, not relative paths

### Non-Obvious Implementation Details

- Server Components handle all data fetching
- Client Components only handle interactivity and state
- Content validation happens at runtime with Zod
- Navigation supports both scrolling and linking modes
- Error boundaries at multiple levels for resilience

### Performance Considerations

- Lightning CSS automatically used for faster builds
- Image optimization through Next.js Image component
- Code splitting and dynamic imports for performance
- Bundle size monitoring and optimization

## Context Gathering Checklist

### Before Providing Analysis

- [ ] Used `codebase_search` for relevant implementations
- [ ] Checked related components and utilities
- [ ] Reviewed existing documentation and comments
- [ ] Understood the data flow and dependencies
- [ ] Considered performance and security implications

### When Explaining Architectural Decisions

- [ ] Identified the problem being solved
- [ ] Explained why this approach was chosen
- [ ] Discussed alternatives and trade-offs
- [ ] Noted impact on other system components
- [ ] Referenced related patterns in the codebase
