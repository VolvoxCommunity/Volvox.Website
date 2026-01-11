<div align="center">

<img src="public/logo.png" alt="Volvox Logo" width="140" height="140">

# **Volvox**

_A modern web platform for software development, mentorship, and community learning._

[![build](https://img.shields.io/github/actions/workflow/status/VolvoxCommunity/Volvox.Website/ci.yml?branch=main&style=flat-square)](https://github.com/VolvoxCommunity/Volvox.Website/actions)
[![codecov](https://img.shields.io/codecov/c/github/VolvoxCommunity/Volvox.Website?style=flat-square)](https://codecov.io/github/VolvoxCommunity/Volvox.Website)
[![E2E Tests](https://github.com/VolvoxCommunity/Volvox.Website/actions/workflows/e2e.yml/badge.svg)](https://github.com/VolvoxCommunity/Volvox.Website/actions/workflows/e2e.yml)
[![last-commit](https://img.shields.io/github/last-commit/VolvoxCommunity/Volvox.Website?style=flat-square)](https://github.com/VolvoxCommunity/Volvox.Website/commits/main)
<a href="https://discord.gg/8ahXACdamN" target="_blank"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"/></a>
<a href="https://zread.ai/VolvoxCommunity/Volvox.Website" target="_blank"><img src="https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff" alt="zread"/></a>

</div>

---

<br/>

<div align="center">

**Volvox** is a software development and learning community built with modern web technologies.

Showcase open-source projects, publish technical blog content, and facilitate mentorship programs.

</div>

<br/>

---

## **Quick Links**

&bull; [Getting Started](#quick-start) &bull; [Tech Stack](#-tech-stack) &bull; [Commands](#-commands) &bull; [Adding Content](#-adding-content)

---

> [!TIP]
> **New here?** Start with the [Quick Start](#quick-start) guide to get up and running in minutes.

## **Overview**

Volvox combines powerful features with a beautiful, accessible interface:

- **Blog System** — MDX-powered content with syntax highlighting, table of contents, and reading progress
- **Product Showcase** — Dynamic product pages with changelogs, screenshots, and FAQ sections
- **Mentorship Platform** — Connect mentors and mentees for growth opportunities
- **Theme System** — Light/dark/system modes with persistent selection
- **Single-Page Experience** — Smooth scrolling navigation with section tracking
- **SEO Optimized** — Dynamic sitemaps, Open Graph images, and structured data

---

## **Quick Start**

### **Prerequisites**

- **Node.js** 20 or higher
- **pnpm** v10.23.0 or higher

```bash
# Install pnpm globally if needed
npm install -g pnpm
```

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/volvox.git
cd volvox

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## **Tech Stack**

| Category            | Technology                                                                         |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Framework**       | [Next.js 16](https://nextjs.org/) (App Router)                                     |
| **UI Library**      | [React 19](https://react.dev/)                                                     |
| **Language**        | [TypeScript](https://www.typescriptlang.org/) (strict mode)                        |
| **Styling**         | [Tailwind CSS v4](https://tailwindcss.com/) with Lightning CSS                     |
| **Components**      | [Radix UI](https://www.radix-ui.com/) primitives                                   |
| **Animations**      | [Framer Motion](https://www.framer.com/motion/)                                    |
| **Content**         | MDX via `next-mdx-remote`, `rehype-highlight`                                      |
| **Icons**           | [@phosphor-icons/react](https://phosphoricons.com/), [Lucide](https://lucide.dev/) |
| **Monitoring**      | [Sentry](https://sentry.io/) (error tracking + replay)                             |
| **Analytics**       | [Vercel Analytics](https://vercel.com/analytics) & Speed Insights                  |
| **Testing**         | [Jest](https://jestjs.io/) (unit), [Playwright](https://playwright.dev/) (E2E)     |
| **Package Manager** | [pnpm](https://pnpm.io/) v10+                                                      |

---

## **Commands**

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Start development server on localhost:3000 |
| `pnpm build`     | Create production build                    |
| `pnpm start`     | Start production server                    |
| `pnpm typecheck` | Run TypeScript type checking               |
| `pnpm lint`      | Run ESLint                                 |
| `pnpm test`      | Run Jest unit tests                        |
| `pnpm test:e2e`  | Run Playwright E2E tests (Chromium only)   |
| `pnpm format`    | Format code with Prettier                  |

> **Note:** Pre-commit hooks automatically run: `lint-staged` → `typecheck` → `test` → `build` → `test:e2e`

---

## **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/[slug]/       # Dynamic blog post routes with OG images
│   ├── products/[slug]/   # Product detail pages with OG images
│   ├── privacy/           # Privacy policy page
│   ├── terms/             # Terms of service page
│   └── layout.tsx         # Root layout with theme provider
│
├── components/            # React components
│   ├── ui/               # Reusable UI primitives (button, card, dialog...)
│   ├── blog/             # Blog-specific components
│   ├── mdx/              # Custom MDX components (callout, code-block...)
│   ├── products/         # Product showcase components
│   └── providers/        # Context providers (theme)
│
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts     # Mobile viewport detection
│   └── use-mouse-glow.ts # Mouse tracking glow effect
│
└── lib/                   # Utilities and types
    ├── blog.ts           # Blog post utilities
    ├── content.ts        # Content file readers (JSON)
    ├── constants.ts      # Site constants (URL, name, colors)
    ├── schemas.ts        # Zod validation schemas
    ├── types.ts          # TypeScript interfaces
    ├── views.ts          # Blog view tracking (Upstash Redis)
    ├── structured-data.ts # Schema.org JSON-LD generators
    └── utils.ts          # Utility functions (cn, generateHeadingId)

content/
├── blog/*.mdx              # Blog posts with frontmatter
├── products/[slug]/        # Product content (changelog, index.json)
├── authors.json            # Author profiles
├── products.json           # Product data
├── mentors.json            # Mentor profiles
└── mentees.json            # Mentee profiles

e2e/                        # Playwright E2E tests
tests/                      # Jest unit tests
```

---

## **Adding Content**

### **Blog Post**

Create a new `.mdx` file in `content/blog/`:

```yaml
---
title: "Your Post Title"
slug: "your-post-slug"
excerpt: "Brief description of the post"
authorId: "author-id-from-authors-json"
date: "2024-01-15"
tags: ["tag1", "tag2"]
published: true
banner: /images/your-banner.png
---
Your MDX content goes here...
```

### **Product**

Create a new directory in `content/products/[slug]/`:

```
content/products/
└── your-product/
    ├── index.json      # Product metadata
    ├── changelog.mdx   # Optional changelog
    └── screenshots/    # Optional screenshots directory
        └── hero.png
```

**index.json** format:

```json
{
  "id": "unique-uuid",
  "name": "Product Name",
  "slug": "product-slug",
  "tagline": "Short one-liner",
  "description": "Brief description",
  "longDescription": "Detailed product description",
  "features": ["Feature 1", "Feature 2"],
  "techStack": ["Tech 1", "Tech 2"],
  "links": {
    "github": "https://github.com/user/repo",
    "demo": "https://demo-url.com"
  },
  "screenshots": ["hero.png"],
  "faq": [
    {
      "question": "Common question?",
      "answer": "Answer to the question."
    }
  ]
}
```

### **Authors & Mentors**

Edit the respective JSON files in `content/`:

- `authors.json` — Author profiles
- `mentors.json` — Mentor profiles
- `mentees.json` — Mentee profiles

---

## **Key Features**

### **Server/Client Component Pattern**

- **Server Components** — Data fetching, SEO, static generation
- **Client Components** — Interactivity, browser APIs, state management

### **Resilient Data Loading**

- `Promise.allSettled` guards against partial failures
- Zod schema validation at runtime for type safety
- Comprehensive unit tests for validation logic

### **Theme System**

- Light, dark, and system preference modes via `next-themes`
- CSS custom properties for color theming
- Persistent theme selection stored as `volvox-theme`

### **E2E Testing**

Multi-browser Playwright suite with:

- **Browsers**: Chromium, Firefox, Safari + mobile viewports
- **Accessibility**: Automated axe-core WCAG scans
- **SEO**: Meta tags, Open Graph, structured data
- **Visual Regression**: Screenshot comparisons
- **Performance**: Page load times, console errors

---

## **License**

This project is private and not licensed for reuse.

---

<div align="center">

**Built with ❤️ for the developer community**

</div>
