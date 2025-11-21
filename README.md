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
- **Content**: MDX with `next-mdx-remote`
- **Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons, Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- pnpm (install globally: `npm install -g pnpm`)

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
pnpm test
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
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Homepage (Server Component)
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── providers/        # Context providers (theme)
│   └── ...               # Section components (hero, blog, etc.)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and types
│   ├── blog.ts           # Blog post utilities (MDX reading)
│   ├── content.ts        # Content file readers (JSON)
│   ├── data.ts           # Data accessor facades
│   ├── logger.ts         # Centralized error reporting shim
│   ├── schemas.ts        # Zod validation schemas
│   ├── types.ts          # TypeScript interfaces
│   └── validation.ts     # Shared validation helpers
└── tests/                 # Node test suites
    └── slug-validation.test.ts

content/
├── blog/                  # MDX blog posts with frontmatter
├── authors.json           # Author profiles
├── products.json          # Product information
├── mentors.json           # Mentor profiles
└── mentees.json           # Mentee profiles
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

## Contributing

This is a personal project and learning platform. Feel free to explore the code and use it as a reference for your own projects.

## License

This project is private and not licensed for reuse.
