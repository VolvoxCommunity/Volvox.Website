# Volvox

A modern web platform for software development, mentorship, and community learning. Built with Next.js 16, React 19, and TypeScript.

## About

Volvox is a software development and learning community that:

- Showcases open-source projects and products
- Publishes technical blog content using MDX
- Facilitates mentorship programs for developers
- Promotes collaborative learning and growth

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first with Lightning CSS)
- **Content**: MDX with `next-mdx-remote`, syntax highlighting via `rehype-highlight`
- **Components**: Radix UI primitives for accessible components
- **Animations**: Framer Motion for motion effects, canvas-confetti for celebratory animations
- **Icons**: Phosphor Icons (`@phosphor-icons/react`), Lucide React (`lucide-react`)
- **Monitoring**: Sentry (error tracking with replay), Vercel Analytics & Speed Insights
- **Testing**: Node test runner (unit), Playwright (E2E)
- **Notifications**: Sonner (toast notifications)
- **Date Handling**: date-fns for date manipulation and formatting

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- pnpm v10.23.0+ (install globally: `npm install -g pnpm`)

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
# Run unit tests (Node test runner)
pnpm test

# Run E2E tests (Playwright)
pnpm exec playwright test

# Open Playwright UI
pnpm exec playwright test --ui
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting without making changes
pnpm format:check
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/[slug]/       # Dynamic blog post routes
│   ├── privacy/           # Privacy policy page
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage (Server Component)
│   └── global-error.tsx   # Global error boundary
├── components/            # React components
│   ├── ui/               # Reusable UI primitives (button, card, badge, etc.)
│   ├── providers/        # Context providers (theme)
│   ├── blog/             # Blog-specific components (reading progress, TOC, heading anchors)
│   ├── mdx/              # MDX custom components (callout, code-block, image-zoom, link)
│   └── ...               # Section components (hero, blog, mentorship, etc.)
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts     # Mobile viewport detection (useIsMobile hook)
│   └── use-mouse-glow.ts # Mouse tracking glow effect
├── lib/                   # Utilities and types
│   ├── blog.ts           # Blog post utilities (MDX reading)
│   ├── content.ts        # Content file readers (JSON)
│   ├── data.ts           # Data accessor facades
│   ├── logger.ts         # Centralized error reporting (Sentry integration)
│   ├── mdx-components.tsx # Custom MDX component mappings
│   ├── schemas.ts        # Zod validation schemas
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Utility functions (cn, generateHeadingId)
│   └── validation.ts     # Slug validation helpers
├── instrumentation.ts     # Server instrumentation for Sentry
└── instrumentation-client.ts # Client instrumentation for Sentry

tests/                     # Node test suites
├── slug-validation.test.ts
├── generate-heading-id.test.ts
└── postcss-tailwind.test.ts

content/
├── blog/                  # MDX blog posts with frontmatter
├── authors.json           # Author profiles
├── products.json          # Product information
├── mentors.json           # Mentor profiles
└── mentees.json           # Mentee profiles

e2e/                       # Playwright E2E tests
└── blog-view-tracking.spec.ts
```

## Key Features

### Server/Client Component Architecture

- Server Components for data fetching and SEO
- Client Components for interactivity and browser APIs
- Clear separation of concerns

### MDX Blog System

- Blog posts written in MDX (`content/blog/`)
- Frontmatter metadata (title, author, date, tags)
- Syntax highlighting with `rehype-highlight`
- Static generation with `generateStaticParams()`

### Theme System

- Light/dark/system modes via `next-themes`
- CSS custom properties for colors
- Persistent theme selection

### Single-Page Experience

- Smooth scrolling navigation
- Section-based routing
- Dynamic section tracking

### Resilient Data Loading

- Promise.allSettled data fetching guards against partial failures
- Local file-based content with Zod validation for type safety
- Node-based unit tests cover validation logic to prevent regressions

### Error Monitoring & Analytics

- **Sentry Integration**: Automatic error tracking and performance monitoring
  - Configured via environment variables (`NEXT_PUBLIC_SENTRY_DSN`)
  - Server, edge, and client-side error capture
  - Session replay with 10% sampling (100% on errors)
  - Monitoring tunnel at `/monitoring` to bypass ad blockers
  - Request error tracking via instrumentation
- **Vercel Analytics**: User analytics and insights
- **Vercel Speed Insights**: Performance monitoring

## Content Management

All content is stored as local files in the `content/` directory:

- **Blog posts**: `content/blog/*.mdx` - MDX files with frontmatter
- **Authors**: `content/authors.json` - JSON array of author objects
- **Products**: `content/products.json` - JSON array of product objects
- **Mentors**: `content/mentors.json` - JSON array of mentor objects
- **Mentees**: `content/mentees.json` - JSON array of mentee objects

### Adding a New Blog Post

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Post Title"
   slug: "post-slug"
   excerpt: "Brief description"
   authorId: "author-id-from-authors-json"
   date: "2024-01-15"
   tags: ["tag1", "tag2"]
   published: true
   ---
   ```
3. Write your content in MDX format below the frontmatter
4. Rebuild the site: `pnpm build`

### Editing Other Content

Edit the respective JSON files in `content/` and rebuild.

## Environment Variables

| Variable                 | Required | Description                                                    |
| ------------------------ | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN` | No       | Sentry DSN for error tracking. If not set, Sentry is disabled. |

Create a `.env.local` file in the project root with the variable above for local development.

## Contributing

This is a personal project and learning platform. Feel free to explore the code and use it as a reference for your own projects.

## License

This project is private and not licensed for reuse.
