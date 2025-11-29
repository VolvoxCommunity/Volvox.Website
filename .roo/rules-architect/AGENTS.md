# Architect Mode Agent Guidelines

This file provides system design and architecture guidance for agents working in Architect mode on this project.

## System Design and Architecture Principles

### Core Architectural Patterns
- **Data Resilience**: Use `Promise.allSettled()` for tolerant data loading patterns
- **Server/Client Separation**: Server Components handle data fetching, Client Components handle interactivity
- **Progressive Enhancement**: Ensure functionality works without JavaScript when possible
- **Error Boundaries**: Implement at multiple levels for graceful degradation

### Component Architecture Decisions
- **Atomic Design**: Organize components by function and reusability
- **Prop Drilling Minimization**: Use context providers for shared state
- **Component Composition**: Prefer composition over inheritance
- **Single Responsibility**: Each component should have one clear purpose

## Planning and Design Patterns

### Feature Planning Framework
1. **Requirements Analysis**: Identify user needs and technical constraints
2. **Architecture Impact**: Assess changes to existing patterns
3. **Data Flow Design**: Map Server Component → Client Component data flow
4. **Error Handling Strategy**: Plan for partial failures and edge cases
5. **Performance Considerations**: Bundle size, rendering, and network impact

### Integration and Dependency Management
- **Minimal Dependencies**: Prefer built-in Next.js/React features
- **Version Compatibility**: Ensure compatibility with Next.js App Router
- **Bundle Analysis**: Monitor and optimize bundle size impact
- **Tree Shaking**: Ensure unused code is eliminated

### Technical Debt and Refactoring Guidance
- **Incremental Refactoring**: Make small, testable changes
- **Pattern Consistency**: Follow established project patterns
- **Documentation Updates**: Keep documentation in sync with changes
- **Test Coverage**: Maintain or improve test coverage during refactoring

## Scalability and Performance Considerations

### Content Scalability
- **File-based Content**: Design for growth in `content/` directory
- **Content Validation**: Use Zod schemas for type safety and validation
- **MDX Rendering**: Server-side rendering with `next-mdx-remote/rsc`
- **Image Optimization**: Leverage Next.js Image component for all images

### Performance Architecture
- **Code Splitting**: Implement strategic code splitting for large features
- **Dynamic Imports**: Use for heavy components and routes
- **Bundle Optimization**: Monitor and optimize JavaScript/CSS bundle sizes
- **Caching Strategy**: Leverage Next.js built-in caching mechanisms

### Monitoring and Observability
- **Error Tracking**: Dual Sentry configuration (server and edge)
- **Performance Metrics**: Monitor Core Web Vitals and custom metrics
- **User Experience**: Track interaction and loading performance
- **Build Performance**: Monitor build times and optimization

## Component Architecture Guidelines

### Server Components
- **Data Fetching**: All data fetching should occur in Server Components
- **Direct Database/API Access**: No client-side data fetching libraries needed
- **SEO Optimization**: Server-rendered content for search engines
- **Initial Load Performance**: Critical for first-contentful paint

### Client Components
- **Interactivity Only**: Handle user interactions and state management
- **Minimal Bundle Impact**: Keep client-side JavaScript minimal
- **Progressive Enhancement**: Ensure functionality degrades gracefully
- **Event Handling**: Efficient event handling and cleanup

### Shared Component Patterns
- **Utility Functions**: Reusable logic in `src/lib/` directory
- **Type Safety**: Shared types in `src/lib/types.ts`
- **Styling Consistency**: Use `cn()` utility for conditional classes
- **Error Boundaries**: Implement at appropriate component levels

## Data Architecture Patterns

### Content Management Architecture
- **Structured Content**: MDX files with frontmatter for blog posts
- **Relational Data**: Author relationships via `authorId` references
- **Content Validation**: Runtime validation with Zod schemas
- **Content Functions**: Centralized content access with error handling

### State Management Patterns
- **Local State**: React hooks for component-specific state
- **Global State**: Context providers for app-wide state
- **Server State**: Server Components with props to Client Components
- **Persistent State**: localStorage for theme and user preferences

### API Design Patterns
- **Type Safety**: TypeScript for all API interfaces
- **Error Handling**: Consistent error responses and reporting
- **Validation**: Input validation with Zod schemas
- **Documentation**: JSDoc/TSDoc for all public APIs

## Security Architecture

### Input Validation and Sanitization
- **Content Validation**: Zod schemas for all content inputs
- **XSS Prevention**: Proper escaping and sanitization
- **CSRF Protection**: Next.js built-in CSRF protection
- **Environment Variables**: Secure configuration management

### Performance Security
- **Resource Limits**: Implement appropriate rate limiting
- **Bundle Security**: Audit dependencies for vulnerabilities
- **Content Security Policy**: Implement appropriate CSP headers
- **Secure Headers**: Implement security-related HTTP headers

## Deployment and Infrastructure Architecture

### Build Architecture
- **Lightning CSS**: Faster builds with Lightning CSS (replaces PostCSS)
- **TypeScript Compilation**: Strict mode with explicit types
- **Bundle Optimization**: Automatic code splitting and optimization
- **Asset Optimization**: Image and font optimization

### Environment Configuration
- **Development**: Local development with hot reloading
- **Staging**: Pre-production testing environment
- **Production**: Optimized production builds
- **Edge Deployment**: Leverage Next.js Edge Runtime when appropriate

### Monitoring and Observability
- **Error Reporting**: Sentry integration with dual configuration
- **Performance Monitoring**: Core Web Vitals and custom metrics
- **Build Monitoring**: Build performance and success rates
- **User Analytics**: Privacy-focused user behavior tracking

## Architectural Decision Records

### Key Architectural Decisions
1. **Next.js App Router**: Chosen for improved performance and developer experience
2. **Tailwind CSS v4**: CSS-first configuration for better performance
3. **Server Components**: For improved SEO and performance
4. **File-based Content**: For simplicity and maintainability
5. **TypeScript Strict Mode**: For improved type safety

### Technology Stack Rationale
- **Next.js**: Full-stack React framework with excellent performance
- **TypeScript**: Type safety and improved developer experience
- **Tailwind CSS**: Utility-first CSS framework with excellent DX
- **Sentry**: Error tracking and performance monitoring
- **Playwright**: Reliable end-to-end testing

## Future Architecture Considerations

### Scalability Planning
- **Content Growth**: Plan for increased content volume and complexity
- **Traffic Growth**: Design for increased user traffic and engagement
- **Feature Expansion**: Architecture should support new feature additions
- **Team Growth**: Code organization for larger development teams

### Technology Evolution
- **Framework Updates**: Plan for Next.js and React updates
- **Tooling Improvements**: Evaluate and adopt new development tools
- **Performance Optimizations**: Continuously improve performance
- **Security Enhancements**: Regular security updates and improvements

### Integration Opportunities
- **CMS Integration**: Potential integration with headless CMS
- **Analytics Integration**: Enhanced user behavior tracking
- **Search Integration**: Improved content search capabilities
- **Personalization**: User-specific content and experiences