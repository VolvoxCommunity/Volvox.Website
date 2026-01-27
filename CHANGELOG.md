# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Marketing: Add ActiveCampaign form embed script site-wide** (`src/app/layout.tsx`)
- **feat(ui): Add "Innovation Pipeline" products section to homepage with GSAP and Framer Motion animations** (`src/components/products.tsx`, `src/components/homepage-client.tsx`)
- **feat(content): Add mock product data for Aurora AI, NexTask, and Lumina Docs** (`content/products.json`, `content/products/`)
- **test(a11y): Add E2E tests for ARIA landmark roles** (`e2e/landmarks-verification.spec.ts`)
- **a11y: Add ARIA landmark roles for screen reader navigation** (banner, main, contentinfo, section aria-labels)
- **ui: Add keyboard shortcuts hook for navigation** (`src/hooks/use-keyboard-shortcuts.ts`)
- **ui: Add App Store and Google Play badge SVGs** (`public/images/stores/`)
- **ui: Add unified member navbar component** (`src/components/team/member-navbar.tsx`)
- **config: Add Playwright configuration** (`playwright.config.ts`)
- **Community: Add Hossain Jahed (Rabden) to team profiles with detailed project portfolio** (`content/team.json`)
- **Schema: Add support for 'builder' team member type** (`src/lib/schemas.ts`, `src/components/mentorship.tsx`, `src/app/team/team-member-detail-client.tsx`)
- **ui: Redesign neural stream section with improved visual effects**
- **ui: Add team member list and detail pages** (`/team`, `/team/[slug]`)
- **ui: Full UI overhaul**
- **SEO: Add IndexNow GitHub Actions workflow for automatic search engine indexing** (`.github/workflows/indexnow.yml`)
- **Changelog: Add CHANGELOG.md with Keep a Changelog and SemVer format** (changelog-check.ts, changelog-generate.ts)
- **Changelog: Add pre-commit hook that auto-generates draft entries from commit messages** (.husky/pre-commit)
- **Changelog: Add npm scripts for changelog generation and validation** (package.json)
- **Changelog: Add CHANGELOG guidelines to CLAUDE.md with category to SemVer mapping** (CLAUDE.md)

### Changed

- **perf: Replace `<img>` with Next.js `<Image>` for app store badges** (`src/components/products.tsx`, `src/components/products/product-hero.tsx`)
- **ui: Replace custom typewriter hook with react-simple-typewriter** (`hero.tsx`)
- **ui: Update hero section to use semantic section element with aria-label** (`hero.tsx`)
- **ui: Improve skip link component styling and behavior** (`skip-link.tsx`)
- **ui: Update blog and products navbar styling** (`blog-navbar.tsx`, `products-navbar.tsx`)
- **ui: Update filter controls and code block components** (`filter-controls.tsx`, `code-block.tsx`)
- **ui: Refactor Team and Blog navbars to simplify mobile view** (removed logo/links, kept back button)
- **ui: Refactor Team Member and Blog Post pages to use unified navbars** (branding + back button)
- **ui: Add new CSS utilities and styles** (`globals.css`)
- **config: Update ESLint and TypeScript configurations** (`eslint.config.mjs`, `tsconfig.json`)
- **Docs: Redesign README with centered logo, badges (build, codecov, E2E, last-commit, Discord, Zread), Quick Links navigation, and improved documentation structure** (README.md)
- **Visual: Update footer visual baseline for current implementation** (e2e/visual.spec.ts-snapshots)

### Deprecated

### Removed

- **ui: Remove custom typewriter effect hook** in favor of react-simple-typewriter (`src/hooks/use-typewriter-effect.ts`)
- **SEO: Remove redundant IndexNow API route** (GitHub workflow calls IndexNow directly per best practices)

### Fixed

- **ui: Fix navigation structure and "Back to Products" logic in product detail pages** (`src/components/products/product-post-navbar.tsx`, `src/app/products/[slug]/product-detail-client.tsx`)
- **SEO: Team member cards use proper `<Link>` elements for internal linking** (fixes orphan page detection) (`src/components/team/team-card.tsx`)
- **Hero: Fix typewriter effect hydration mismatch and dependency stability** (`src/components/hero.tsx`, `src/hooks/use-typewriter-effect.ts`)
- **Mentorship: Refactor infinite marquee for better performance and seamless looping** (`src/components/mentorship.tsx`, `src/app/globals.css`)
- **Team: Fix missing bio and expertise on team member detail pages for builders** (`src/app/team/team-member-detail-client.tsx`)
- **SEO: Add missing canonical tags to all pages** (`/`, `/blog`, `/blog/[slug]`, `/products`, `/products/[slug]`)
- **SEO: Add missing `/blog` listing page to sitemap** (`sitemap.ts`)

### Security
