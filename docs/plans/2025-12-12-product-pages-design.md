# Product Pages Design

**Date:** 2025-12-12
**Status:** Approved

## Overview

Add dedicated product detail pages with comprehensive information including screenshots, app store links, changelog, FAQ, and testimonials. Also includes a products index page listing all products.

## URL Structure

- `/products` — Index page listing all products
- `/products/[slug]` — Detail page for each product (e.g., `/products/sobriety-waypoint`)

## Content Structure

Migrate from flat `content/products.json` to folder-based structure:

```
content/products/[slug]/
  index.json        # Core product data + FAQ + testimonials
  changelog.mdx     # Version history with rich formatting
  screenshots/
    hero.png        # Primary image for hero section
    1.png           # Gallery images (up to 5 total)
    2.png
    ...
```

### Product Schema (`index.json`)

```json
{
  "id": "uuid",
  "name": "Product Name",
  "slug": "product-slug",
  "tagline": "Short catchy description",
  "description": "Brief description for cards",
  "longDescription": "Detailed description for overview section",
  "features": ["Feature 1", "Feature 2", "..."],
  "techStack": ["React Native", "Expo", "TypeScript"],
  "links": {
    "github": "https://github.com/...",
    "demo": "https://...",
    "appStore": "https://apps.apple.com/...",
    "playStore": "https://play.google.com/..."
  },
  "screenshots": ["hero.png", "1.png", "2.png"],
  "faq": [
    {
      "question": "How do I get started?",
      "answer": "Download the app and create an account..."
    }
  ],
  "testimonials": [
    {
      "name": "John Doe",
      "role": "Recovery Coach",
      "quote": "This app has been transformative...",
      "avatar": "https://..."
    }
  ]
}
```

## Product Detail Page Layout

Route: `src/app/products/[slug]/page.tsx`

### Sections (top to bottom)

1. **Hero Section**
   - Product name + tagline
   - Primary screenshot/logo (from `hero.png`)
   - App Store & Play Store badges (if available)
   - GitHub and Demo buttons
   - Gradient background consistent with homepage style

2. **Sticky Table of Contents**
   - Appears after scrolling past hero
   - Links: Overview, Screenshots, Features, Changelog, FAQ, Testimonials
   - Highlights current section (reuse blog TOC pattern)

3. **Overview Section**
   - `longDescription` rendered as formatted text
   - Sets context before diving into details

4. **Screenshots Gallery**
   - Horizontal scrollable on mobile, grid on desktop
   - Click to expand (lightbox/zoom using existing ImageZoom)
   - 3-5 images max

5. **Features Section**
   - Checkmark list (similar to current homepage card)
   - Animated list items with Framer Motion

6. **Changelog Section**
   - Rendered from `changelog.mdx`
   - Shows latest 3-5 releases
   - "View all" expands or links to full changelog

7. **FAQ Section**
   - Accordion/collapsible format
   - Question headers, click to reveal answers

8. **Testimonials Section**
   - Card-based layout with avatar, name, role, quote
   - 2-3 testimonials shown

## Products Index Page

Route: `src/app/products/page.tsx`

### Layout

- Hero banner with title "Our Products" and brief intro text
- Grid of product cards (responsive: 1 column mobile, 2-3 columns desktop)

### Product Card Contents

- Primary screenshot as thumbnail (from `hero.png`)
- Product name (linked to detail page)
- Tagline
- Tech stack pills (small, subtle)
- App Store/Play Store icons if available (visual indicator)
- "View Details" button

### Empty State

- If no products exist, show friendly message: "Products coming soon"

## Navigation & Linking

### From Homepage to Product Page

- Existing "Featured Product" card links to `/products/[slug]`
- Product name becomes clickable link
- Add "View Details" button alongside existing GitHub/Demo buttons

### Breadcrumb Navigation

- Product detail pages show: `Home > Products > Product Name`
- Helps users understand location and navigate back

### Back Navigation

- Sticky back link similar to blog: "Back to All Products" linking to `/products`

## SEO & Open Graph

### Dynamic OG Image Generation

Create `src/app/products/[slug]/opengraph-image.tsx`:

- Uses Next.js `ImageResponse` (same pattern as blog)
- Displays: Product name, tagline, Volvox logo
- Size: 1200x630 (standard OG image)
- Dark background with brand colors

### Metadata

`generateMetadata()` in product page returns:

```typescript
{
  title: product.name,
  description: product.tagline,
  openGraph: {
    title: product.name,
    description: product.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: product.name,
    description: product.tagline,
  }
}
```

### Structured Data (JSON-LD)

Add `SoftwareApplication` schema:

- name, description, operatingSystem, applicationCategory
- Improves search engine understanding

## Components

### New Components (`src/components/products/`)

| Component                  | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `product-hero.tsx`         | Hero section with name, tagline, screenshot, app badges, buttons |
| `product-toc.tsx`          | Sticky table of contents (extend/reuse blog TOC pattern)         |
| `product-screenshots.tsx`  | Gallery with lightbox/zoom functionality                         |
| `product-features.tsx`     | Checkmark feature list                                           |
| `product-changelog.tsx`    | Renders MDX changelog, shows latest entries                      |
| `product-faq.tsx`          | Accordion-style FAQ section                                      |
| `product-testimonials.tsx` | Testimonial cards grid                                           |
| `product-card.tsx`         | Card for index page listing                                      |

### Reusable from Existing Codebase

- `Card`, `Button`, `Badge` from `src/components/ui/`
- `ImageZoom` from `src/components/mdx/` for screenshot lightbox
- TOC scroll tracking logic from blog components
- Framer Motion animations consistent with homepage sections

## Data Layer

### Content Loading Functions

Add to `src/lib/content.ts`:

```typescript
// Scans content/products/ folders, returns array of products
getAllProducts(): Product[]

// Loads single product's index.json
getProductBySlug(slug: string): Product | null

// Loads and parses changelog.mdx
getProductChangelog(slug: string): string | null
```

### Validation

Extend `src/lib/schemas.ts` with updated Zod schema:

- Validates: `slug`, `tagline`, `links`, `techStack`, `screenshots`, `faq`, `testimonials`
- FAQ items: `{ question: string, answer: string }`
- Testimonials: `{ name: string, role?: string, quote: string, avatar?: string }`

### Static Generation

`src/app/products/[slug]/page.tsx` uses `generateStaticParams()` to pre-render all product pages at build time (same pattern as blog posts).

## Migration

### From Current Structure

Current `content/products.json` will be replaced by folder structure:

1. Create `content/products/sobriety-waypoint/` folder
2. Migrate existing data to `index.json` with extended schema
3. Move existing image to `screenshots/hero.png`
4. Create placeholder `changelog.mdx`
5. Delete old `content/products.json`

### Homepage Update

Modify `src/components/products.tsx`:

- Add "View Details" link to `/products/[slug]`
- Keep current card design, just add navigation

## File Structure Summary

```
src/app/products/
  page.tsx                      # Index page
  [slug]/
    page.tsx                    # Detail page
    opengraph-image.tsx         # Dynamic OG image

src/components/products/
  product-hero.tsx
  product-toc.tsx
  product-screenshots.tsx
  product-features.tsx
  product-changelog.tsx
  product-faq.tsx
  product-testimonials.tsx
  product-card.tsx

src/lib/
  content.ts                    # Updated with product loading functions
  schemas.ts                    # Updated with product schemas
  social-images.tsx             # Add generateProductSocialImage()
  types.ts                      # Updated Product interface

content/products/
  sobriety-waypoint/
    index.json
    changelog.mdx
    screenshots/
      hero.png
      1.png
      ...
```
