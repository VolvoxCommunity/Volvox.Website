# Product Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add dedicated product detail pages with screenshots, app store links, changelog, FAQ, testimonials, and a products index page.

**Architecture:** Folder-based content structure (`content/products/[slug]/`) with Next.js App Router dynamic routes. Server Components for data fetching, Client Components for interactivity. Reuses existing patterns from blog implementation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Zod validation, MDX for changelogs

---

## Phase 1: Data Layer & Content Structure

### Task 1: Create Product Zod Schema

**Files:**

- Modify: `src/lib/schemas.ts`
- Test: `tests/lib/schemas.test.ts` (create if needed)

**Step 1: Add the new schema types to schemas.ts**

Add after existing schemas in `src/lib/schemas.ts`:

```typescript
/**
 * Schema for product FAQ items.
 */
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

/**
 * Schema for product testimonials.
 */
export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  avatar: z.string().optional(),
});

/**
 * Schema for product links.
 */
export const productLinksSchema = z.object({
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  appStore: z.string().url().optional(),
  playStore: z.string().url().optional(),
});

/**
 * Schema for extended product data (folder-based structure).
 */
export const extendedProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  tagline: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  features: z.array(z.string()).min(1),
  techStack: z.array(z.string()).default([]),
  links: productLinksSchema.default({}),
  screenshots: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});

export type ExtendedProduct = z.infer<typeof extendedProductSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ProductLinks = z.infer<typeof productLinksSchema>;
```

**Step 2: Run typecheck to verify**

Run: `pnpm typecheck`
Expected: PASS (no type errors)

**Step 3: Commit**

```bash
git add src/lib/schemas.ts
git commit -m "feat(schema): add extended product schema with FAQ and testimonials"
```

---

### Task 2: Update Types

**Files:**

- Modify: `src/lib/types.ts`

**Step 1: Add extended product type to types.ts**

Add after existing Product interface in `src/lib/types.ts`:

```typescript
/**
 * Extended product data for detail pages.
 */
export interface ExtendedProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  links: {
    github?: string;
    demo?: string;
    appStore?: string;
    playStore?: string;
  };
  screenshots: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  testimonials: Array<{
    name: string;
    role?: string;
    quote: string;
    avatar?: string;
  }>;
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(types): add ExtendedProduct interface"
```

---

### Task 3: Create Content Directory Structure

**Files:**

- Create: `content/products/sobriety-waypoint/index.json`
- Create: `content/products/sobriety-waypoint/changelog.mdx`
- Move: `public/images/product/sobriety-waypoint.png` → `content/products/sobriety-waypoint/screenshots/hero.png`

**Step 1: Create directory structure**

Run:

```bash
mkdir -p content/products/sobriety-waypoint/screenshots
```

**Step 2: Create index.json with migrated + extended data**

Create `content/products/sobriety-waypoint/index.json`:

```json
{
  "id": "ee7a459b-9319-4568-8c70-a9842e3c3558",
  "name": "Sobriety Waypoint",
  "slug": "sobriety-waypoint",
  "tagline": "Recovery accountability made simple",
  "description": "A comprehensive accountability app empowering sponsors and sponsees in 12-step recovery programs through structured task management, sobriety tracking, and visual progress timelines.",
  "longDescription": "Sobriety Waypoint transforms the sponsor-sponsee relationship with powerful accountability tools designed for adults in recovery. Sponsors create secure connections via invite codes, assign tasks with optional due dates, and monitor their sponsees' journey through an intuitive timeline view. Sponsees track continuous sobriety, document relapses transparently, complete sponsor-assigned tasks with private notes, and visualize their progress through milestones and step completion. Built with React Native and Expo for seamless cross-platform performance on iOS, Android, and Web.",
  "features": [
    "Secure sponsor-sponsee pairing with invite code system",
    "Sobriety timeline with transparent relapse tracking",
    "Task management with sponsor assignment and sponsee completion notes",
    "Visual journey timeline displaying milestones, tasks, and step progress",
    "Accountability loop supporting effective sponsorship",
    "Cross-platform support (iOS, Android, Web)"
  ],
  "techStack": ["React Native", "Expo", "TypeScript", "Firebase"],
  "links": {
    "github": "https://github.com/VolvoxCommunity/Sobriety-Waypoint",
    "demo": "https://sobrietywaypoint.com"
  },
  "screenshots": ["hero.png"],
  "faq": [
    {
      "question": "Is Sobriety Waypoint free to use?",
      "answer": "Yes, Sobriety Waypoint is completely free and open source. We believe recovery tools should be accessible to everyone."
    },
    {
      "question": "How do I connect with my sponsor?",
      "answer": "Your sponsor will provide you with a unique invite code. Enter this code in the app to establish your connection and begin your accountability partnership."
    },
    {
      "question": "Is my data private?",
      "answer": "Absolutely. Your sobriety data and personal notes are only visible to you and your connected sponsor. We use secure encryption and never share your information with third parties."
    }
  ],
  "testimonials": []
}
```

**Step 3: Create placeholder changelog.mdx**

Create `content/products/sobriety-waypoint/changelog.mdx`:

```mdx
# Changelog

All notable changes to Sobriety Waypoint will be documented here.

## [Unreleased]

### Added

- Initial release planning

---

_More updates coming soon as we continue development._
```

**Step 4: Copy existing image to screenshots folder**

Run:

```bash
cp public/images/product/sobriety-waypoint.png content/products/sobriety-waypoint/screenshots/hero.png
```

**Step 5: Commit**

```bash
git add content/products/
git commit -m "feat(content): add folder-based product structure for Sobriety Waypoint"
```

---

### Task 4: Create Product Content Loading Functions

**Files:**

- Modify: `src/lib/content.ts`
- Test: `tests/lib/content.test.ts`

**Step 1: Write failing tests for new functions**

Add to `tests/lib/content.test.ts`:

```typescript
import {
  getAllExtendedProducts,
  getExtendedProductBySlug,
  getProductChangelog,
} from "@/lib/content";

describe("Extended Product Content", () => {
  describe("getAllExtendedProducts", () => {
    it("returns array of extended products", () => {
      const products = getAllExtendedProducts();
      expect(Array.isArray(products)).toBe(true);
    });

    it("returns products with required fields", () => {
      const products = getAllExtendedProducts();
      if (products.length > 0) {
        const product = products[0];
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("slug");
        expect(product).toHaveProperty("tagline");
        expect(product).toHaveProperty("links");
        expect(product).toHaveProperty("faq");
      }
    });
  });

  describe("getExtendedProductBySlug", () => {
    it("returns product for valid slug", () => {
      const product = getExtendedProductBySlug("sobriety-waypoint");
      expect(product).not.toBeNull();
      expect(product?.slug).toBe("sobriety-waypoint");
    });

    it("returns null for invalid slug", () => {
      const product = getExtendedProductBySlug("nonexistent-product");
      expect(product).toBeNull();
    });
  });

  describe("getProductChangelog", () => {
    it("returns changelog content for valid slug", () => {
      const changelog = getProductChangelog("sobriety-waypoint");
      expect(changelog).not.toBeNull();
      expect(changelog).toContain("Changelog");
    });

    it("returns null for invalid slug", () => {
      const changelog = getProductChangelog("nonexistent-product");
      expect(changelog).toBeNull();
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test tests/lib/content.test.ts`
Expected: FAIL (functions not defined)

**Step 3: Implement the content loading functions**

Add to `src/lib/content.ts`:

```typescript
import { extendedProductSchema, type ExtendedProduct } from "./schemas";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

/**
 * Retrieves all extended products from the folder-based content structure.
 * Each product folder should contain an index.json file.
 *
 * @returns Array of validated ExtendedProduct objects
 */
export function getAllExtendedProducts(): ExtendedProduct[] {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return [];
    }

    const productFolders = fs.readdirSync(PRODUCTS_DIR, {
      withFileTypes: true,
    });
    const products: ExtendedProduct[] = [];

    for (const folder of productFolders) {
      if (!folder.isDirectory()) continue;

      const indexPath = path.join(PRODUCTS_DIR, folder.name, "index.json");
      if (!fs.existsSync(indexPath)) continue;

      try {
        const content = fs.readFileSync(indexPath, "utf-8");
        const data = JSON.parse(content);
        const validated = extendedProductSchema.parse(data);
        products.push(validated);
      } catch (err) {
        reportError(`Failed to load product: ${folder.name}`, err);
      }
    }

    return products;
  } catch (err) {
    reportError("Failed to read products directory", err);
    return [];
  }
}

/**
 * Retrieves a single extended product by its slug.
 *
 * @param slug - The product slug (folder name)
 * @returns The validated ExtendedProduct or null if not found
 */
export function getExtendedProductBySlug(slug: string): ExtendedProduct | null {
  try {
    const indexPath = path.join(PRODUCTS_DIR, slug, "index.json");
    if (!fs.existsSync(indexPath)) {
      return null;
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    const data = JSON.parse(content);
    return extendedProductSchema.parse(data);
  } catch (err) {
    reportError(`Failed to load product: ${slug}`, err);
    return null;
  }
}

/**
 * Retrieves the changelog MDX content for a product.
 *
 * @param slug - The product slug (folder name)
 * @returns The raw MDX content or null if not found
 */
export function getProductChangelog(slug: string): string | null {
  try {
    const changelogPath = path.join(PRODUCTS_DIR, slug, "changelog.mdx");
    if (!fs.existsSync(changelogPath)) {
      return null;
    }

    return fs.readFileSync(changelogPath, "utf-8");
  } catch (err) {
    reportError(`Failed to load changelog for: ${slug}`, err);
    return null;
  }
}
```

**Step 4: Add import for extendedProductSchema at top of file**

Ensure the import exists at top of `src/lib/content.ts`:

```typescript
import { extendedProductSchema } from "./schemas";
import type { ExtendedProduct } from "./schemas";
```

**Step 5: Run tests to verify they pass**

Run: `pnpm test tests/lib/content.test.ts`
Expected: PASS

**Step 6: Run full test suite**

Run: `pnpm test`
Expected: All tests PASS

**Step 7: Commit**

```bash
git add src/lib/content.ts tests/lib/content.test.ts
git commit -m "feat(content): add extended product loading functions"
```

---

## Phase 2: Product Detail Page

### Task 5: Create Product Detail Page Route

**Files:**

- Create: `src/app/products/[slug]/page.tsx`

**Step 1: Create the page file**

Create `src/app/products/[slug]/page.tsx`:

```typescript
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllExtendedProducts,
  getExtendedProductBySlug,
  getProductChangelog,
} from "@/lib/content";
import { ProductDetailClient } from "./product-detail-client";

/**
 * Generates static params for all product pages.
 */
export async function generateStaticParams() {
  const products = getAllExtendedProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

/**
 * Generates metadata for product pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
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
    },
  };
}

/**
 * Product detail page server component.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const changelog = getProductChangelog(slug);

  return <ProductDetailClient product={product} changelog={changelog} />;
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: FAIL (ProductDetailClient does not exist yet - expected)

**Step 3: Commit partial progress**

```bash
git add src/app/products/[slug]/page.tsx
git commit -m "feat(products): add product detail page route"
```

---

### Task 6: Create Product Hero Component

**Files:**

- Create: `src/components/products/product-hero.tsx`

**Step 1: Create the component**

Create `src/components/products/product-hero.tsx`:

```typescript
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GithubLogo, ArrowUpRight, AppleLogo, GooglePlayLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { ExtendedProduct } from "@/lib/types";

interface ProductHeroProps {
  product: ExtendedProduct;
}

/**
 * Hero section for product detail pages.
 * Displays product name, tagline, primary screenshot, and action buttons.
 */
export function ProductHero({ product }: ProductHeroProps) {
  const heroImage = product.screenshots[0];
  const imagePath = heroImage
    ? `/images/product/${product.slug}/${heroImage}`
    : null;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {product.tagline}
            </p>

            {/* App Store Badges */}
            {(product.links.appStore || product.links.playStore) && (
              <div className="flex flex-wrap gap-3 mb-6">
                {product.links.appStore && (
                  <a
                    href={product.links.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
                  >
                    <AppleLogo weight="fill" className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-[10px] leading-none">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </a>
                )}
                {product.links.playStore && (
                  <a
                    href={product.links.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
                  >
                    <GooglePlayLogo weight="fill" className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-[10px] leading-none">Get it on</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {product.links.demo && (
                <Button
                  variant="accent"
                  size="lg"
                  asChild
                  className="gap-2 shadow-lg shadow-accent/20"
                >
                  <a
                    href={product.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Try Demo
                    <ArrowUpRight weight="bold" className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {product.links.github && (
                <Button variant="outline" size="lg" asChild className="gap-2">
                  <a
                    href={product.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo weight="fill" className="h-5 w-5" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20"
          >
            {imagePath ? (
              <Image
                src={imagePath}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] font-bold text-foreground/10">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: May show errors for missing ExtendedProduct in types.ts - this is fine for now

**Step 3: Commit**

```bash
git add src/components/products/product-hero.tsx
git commit -m "feat(products): add ProductHero component"
```

---

### Task 7: Create Product Features Component

**Files:**

- Create: `src/components/products/product-features.tsx`

**Step 1: Create the component**

Create `src/components/products/product-features.tsx`:

```typescript
"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ProductFeaturesProps {
  features: string[];
}

/**
 * Features section displaying product capabilities as an animated checklist.
 */
export function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Features</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <CheckCircle
                weight="fill"
                className="h-6 w-6 text-primary mt-0.5 flex-shrink-0"
              />
              <span className="text-base leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-features.tsx
git commit -m "feat(products): add ProductFeatures component"
```

---

### Task 8: Create Product FAQ Component

**Files:**

- Create: `src/components/products/product-faq.tsx`

**Step 1: Create the component**

Create `src/components/products/product-faq.tsx`:

```typescript
"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface ProductFaqProps {
  faq: FaqItem[];
}

/**
 * FAQ section with accordion-style expandable items.
 */
export function ProductFaq({ faq }: ProductFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faq.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="border border-border/50 rounded-lg overflow-hidden bg-card/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                aria-expanded={openIndex === idx}
              >
                <span className="font-medium pr-4">{item.question}</span>
                <CaretDown
                  weight="bold"
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    openIndex === idx && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 text-muted-foreground">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-faq.tsx
git commit -m "feat(products): add ProductFaq accordion component"
```

---

### Task 9: Create Product Testimonials Component

**Files:**

- Create: `src/components/products/product-testimonials.tsx`

**Step 1: Create the component**

Create `src/components/products/product-testimonials.tsx`:

```typescript
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quotes } from "@phosphor-icons/react";

interface Testimonial {
  name: string;
  role?: string;
  quote: string;
  avatar?: string;
}

interface ProductTestimonialsProps {
  testimonials: Testimonial[];
}

/**
 * Testimonials section displaying user feedback in card format.
 */
export function ProductTestimonials({ testimonials }: ProductTestimonialsProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          What People Are Saying
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-xl bg-card/50 border border-border/50"
            >
              <Quotes
                weight="fill"
                className="h-8 w-8 text-primary/30 mb-4"
              />
              <p className="text-base leading-relaxed mb-4">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  {testimonial.role && (
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-testimonials.tsx
git commit -m "feat(products): add ProductTestimonials component"
```

---

### Task 10: Create Product Changelog Component

**Files:**

- Create: `src/components/products/product-changelog.tsx`

**Step 1: Create the component**

Create `src/components/products/product-changelog.tsx`:

```typescript
"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import { motion } from "framer-motion";

interface ProductChangelogProps {
  content: string | null;
}

/**
 * Changelog section rendering MDX content.
 */
export function ProductChangelog({ content }: ProductChangelogProps) {
  if (!content) {
    return null;
  }

  return (
    <section id="changelog" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-bold prose-h1:mb-8
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-medium
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-muted-foreground
            prose-p:text-muted-foreground
          "
        >
          <MDXRemote source={content} />
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-changelog.tsx
git commit -m "feat(products): add ProductChangelog MDX component"
```

---

### Task 11: Create Product Screenshots Component

**Files:**

- Create: `src/components/products/product-screenshots.tsx`

**Step 1: Create the component**

Create `src/components/products/product-screenshots.tsx`:

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProductScreenshotsProps {
  slug: string;
  screenshots: string[];
  productName: string;
}

/**
 * Screenshot gallery with lightbox functionality.
 */
export function ProductScreenshots({
  slug,
  screenshots,
  productName,
}: ProductScreenshotsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter out hero image if it's the only one
  const galleryImages = screenshots.filter((_, i) => i > 0 || screenshots.length === 1);

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section id="screenshots" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Screenshots</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((screenshot, idx) => {
            const imagePath = `/images/product/${slug}/${screenshot}`;
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImage(imagePath)}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border/50 hover:border-primary/50 transition-colors cursor-zoom-in"
              >
                <Image
                  src={imagePath}
                  alt={`${productName} screenshot ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Lightbox */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
            <VisuallyHidden>
              <DialogTitle>Screenshot Preview</DialogTitle>
              <DialogDescription>
                Full size screenshot of {productName}
              </DialogDescription>
            </VisuallyHidden>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={selectedImage}
                    alt="Screenshot preview"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-screenshots.tsx
git commit -m "feat(products): add ProductScreenshots gallery with lightbox"
```

---

### Task 12: Create Product Table of Contents Component

**Files:**

- Create: `src/components/products/product-toc.tsx`

**Step 1: Create the component**

Create `src/components/products/product-toc.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocSection {
  id: string;
  label: string;
}

interface ProductTocProps {
  sections: TocSection[];
}

/**
 * Sticky table of contents with scroll tracking.
 */
export function ProductToc({ sections }: ProductTocProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-20 z-20 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3 mb-8">
      <div className="container mx-auto max-w-4xl px-4">
        <ul className="flex flex-wrap gap-2 md:gap-4 justify-center">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={cn(
                  "px-3 py-1 text-sm rounded-full transition-colors",
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/products/product-toc.tsx
git commit -m "feat(products): add ProductToc sticky navigation"
```

---

### Task 13: Create Product Detail Client Component

**Files:**

- Create: `src/app/products/[slug]/product-detail-client.tsx`

**Step 1: Create the component**

Create `src/app/products/[slug]/product-detail-client.tsx`:

```typescript
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { Footer } from "@/components/footer";
import { ProductHero } from "@/components/products/product-hero";
import { ProductToc } from "@/components/products/product-toc";
import { ProductFeatures } from "@/components/products/product-features";
import { ProductFaq } from "@/components/products/product-faq";
import { ProductTestimonials } from "@/components/products/product-testimonials";
import { ProductChangelog } from "@/components/products/product-changelog";
import { ProductScreenshots } from "@/components/products/product-screenshots";
import type { ExtendedProduct } from "@/lib/types";
import { NAV_HEIGHT } from "@/lib/constants";

interface ProductDetailClientProps {
  product: ExtendedProduct;
  changelog: string | null;
}

/**
 * Client component for product detail page.
 * Renders all sections with scroll tracking.
 */
export function ProductDetailClient({
  product,
  changelog,
}: ProductDetailClientProps) {
  // Build TOC sections based on available content
  const tocSections = [
    { id: "overview", label: "Overview" },
    product.screenshots.length > 1 && { id: "screenshots", label: "Screenshots" },
    { id: "features", label: "Features" },
    changelog && { id: "changelog", label: "Changelog" },
    product.faq.length > 0 && { id: "faq", label: "FAQ" },
    product.testimonials.length > 0 && { id: "testimonials", label: "Testimonials" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Navigation */}
        <BlogNavigation />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        {/* Back Navigation */}
        <div
          className="sticky z-30 bg-background/80 backdrop-blur-sm border-b border-border/50 py-3"
          style={{ top: NAV_HEIGHT }}
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Products
            </Link>
          </div>
        </div>

        <main>
          {/* Hero Section */}
          <ProductHero product={product} />

          {/* Table of Contents */}
          <ProductToc sections={tocSections} />

          {/* Overview Section */}
          <section id="overview" className="py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.longDescription}
              </p>
            </div>
          </section>

          {/* Screenshots */}
          <ProductScreenshots
            slug={product.slug}
            screenshots={product.screenshots}
            productName={product.name}
          />

          {/* Features */}
          <ProductFeatures features={product.features} />

          {/* Changelog */}
          <ProductChangelog content={changelog} />

          {/* FAQ */}
          <ProductFaq faq={product.faq} />

          {/* Testimonials */}
          <ProductTestimonials testimonials={product.testimonials} />
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS (or minor issues to fix)

**Step 3: Commit**

```bash
git add src/app/products/[slug]/product-detail-client.tsx
git commit -m "feat(products): add ProductDetailClient page component"
```

---

### Task 14: Create Components Index Export

**Files:**

- Create: `src/components/products/index.ts`

**Step 1: Create barrel export**

Create `src/components/products/index.ts`:

```typescript
export { ProductHero } from "./product-hero";
export { ProductFeatures } from "./product-features";
export { ProductFaq } from "./product-faq";
export { ProductTestimonials } from "./product-testimonials";
export { ProductChangelog } from "./product-changelog";
export { ProductScreenshots } from "./product-screenshots";
export { ProductToc } from "./product-toc";
```

**Step 2: Commit**

```bash
git add src/components/products/index.ts
git commit -m "feat(products): add barrel export for product components"
```

---

## Phase 3: Products Index Page

### Task 15: Create Product Card Component

**Files:**

- Create: `src/components/products/product-card.tsx`

**Step 1: Create the component**

Create `src/components/products/product-card.tsx`:

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppleLogo, GooglePlayLogo, ArrowRight } from "@phosphor-icons/react";
import type { ExtendedProduct } from "@/lib/types";

interface ProductCardProps {
  product: ExtendedProduct;
  index: number;
}

/**
 * Product card for the products index page.
 */
export function ProductCard({ product, index }: ProductCardProps) {
  const heroImage = product.screenshots[0];
  const imagePath = heroImage
    ? `/images/product/${product.slug}/${heroImage}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 overflow-hidden">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-foreground/10">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <CardDescription className="text-base">
            {product.tagline}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Tech Stack */}
          {product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Platform indicators */}
          <div className="flex items-center gap-2">
            {product.links.appStore && (
              <AppleLogo weight="fill" className="h-5 w-5 text-muted-foreground" />
            )}
            {product.links.playStore && (
              <GooglePlayLogo weight="fill" className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full gap-2 group/btn">
            <Link href={`/products/${product.slug}`}>
              View Details
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
```

**Step 2: Add to barrel export**

Add to `src/components/products/index.ts`:

```typescript
export { ProductCard } from "./product-card";
```

**Step 3: Commit**

```bash
git add src/components/products/product-card.tsx src/components/products/index.ts
git commit -m "feat(products): add ProductCard for index page"
```

---

### Task 16: Create Products Index Page

**Files:**

- Create: `src/app/products/page.tsx`

**Step 1: Create the page**

Create `src/app/products/page.tsx`:

```typescript
import { Metadata } from "next";
import { getAllExtendedProducts } from "@/lib/content";
import { ProductsIndexClient } from "./products-index-client";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our open-source products and applications built to make a difference.",
  openGraph: {
    title: "Products | Volvox",
    description: "Explore our open-source products and applications built to make a difference.",
    type: "website",
  },
};

/**
 * Products index page server component.
 */
export default function ProductsPage() {
  const products = getAllExtendedProducts();

  return <ProductsIndexClient products={products} />;
}
```

**Step 2: Create client component**

Create `src/app/products/products-index-client.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { BlogNavigation } from "@/components/blog/blog-navigation";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/products/product-card";
import type { ExtendedProduct } from "@/lib/types";
import { NAV_HEIGHT } from "@/lib/constants";

interface ProductsIndexClientProps {
  products: ExtendedProduct[];
}

/**
 * Client component for products index page.
 */
export function ProductsIndexClient({ products }: ProductsIndexClientProps) {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1">
        {/* Navigation */}
        <BlogNavigation />

        {/* Spacer for fixed navigation */}
        <div style={{ height: NAV_HEIGHT }} />

        <main className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Our Products
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Open-source applications built with care, designed to make a real difference.
              </p>
            </motion.div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Products coming soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/products/page.tsx src/app/products/products-index-client.tsx
git commit -m "feat(products): add products index page"
```

---

## Phase 4: Open Graph Image Generation

### Task 17: Create Product Social Image Generator

**Files:**

- Modify: `src/lib/social-images.tsx`

**Step 1: Add product social image function**

Add to `src/lib/social-images.tsx`:

```typescript
/**
 * Product data shape for OG image generation.
 */
export interface ProductOgData {
  name: string;
  tagline: string;
  techStack?: string[];
}

/**
 * Generates a dynamic social image for a product page.
 *
 * @param product - The product data
 * @param logoData - The logo image data
 * @returns ImageResponse with product-specific social preview image
 */
export async function generateProductSocialImage(
  product: ProductOgData | null | undefined,
  logoData: ArrayBuffer | null
) {
  const fontData = await fetchJetBrainsMonoFont();

  const logoSrc = logoData
    ? `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`
    : null;

  try {
    if (!product) {
      throw new Error("No product data provided");
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "#0a0a0a",
          fontFamily: fontData ? '"JetBrains Mono"' : "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Product Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {product.name}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: "#d1d5db",
              lineHeight: 1.4,
              marginBottom: 40,
              display: "flex",
            }}
          >
            {product.tagline}
          </div>

          {/* Tech Stack */}
          {product.techStack && product.techStack.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {product.techStack.slice(0, 4).map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#60a5fa",
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 20,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {logoSrc && (
            <img
              src={logoSrc}
              width={48}
              height={48}
              style={{ marginRight: 16 }}
              alt="Volvox logo"
            />
          )}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#3b82f6",
            }}
          >
            VOLVOX
          </div>
        </div>
      </div>,
      {
        ...IMAGE_SIZE,
        ...(fontData && {
          fonts: [
            {
              name: "JetBrains Mono",
              data: fontData,
              style: "normal" as const,
              weight: 700 as const,
            },
          ],
        }),
      }
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(createFallbackImage(logoData), {
      ...IMAGE_SIZE,
      ...(fontData && {
        fonts: [
          {
            name: "JetBrains Mono",
            data: fontData,
            style: "normal" as const,
            weight: 700 as const,
          },
        ],
      }),
    });
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/social-images.tsx
git commit -m "feat(og): add generateProductSocialImage function"
```

---

### Task 18: Create Product OG Image Route

**Files:**

- Create: `src/app/products/[slug]/opengraph-image.tsx`

**Step 1: Create the OG image route**

Create `src/app/products/[slug]/opengraph-image.tsx`:

```typescript
import { generateProductSocialImage, getLogoData } from "@/lib/social-images";
import { getExtendedProductBySlug } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Volvox Product";

/**
 * Generates a dynamic OpenGraph image for each product page.
 * Displays product name, tagline, tech stack, and Volvox branding.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getExtendedProductBySlug(slug);
  const logoData = getLogoData();

  const productData = product
    ? {
        name: product.name,
        tagline: product.tagline,
        techStack: product.techStack,
      }
    : null;

  return generateProductSocialImage(productData, logoData);
}
```

**Step 2: Commit**

```bash
git add src/app/products/[slug]/opengraph-image.tsx
git commit -m "feat(og): add dynamic OG image for product pages"
```

---

## Phase 5: Homepage Integration & Cleanup

### Task 19: Update Homepage Products Section

**Files:**

- Modify: `src/components/products.tsx`

**Step 1: Add "View Details" link to homepage product card**

Update `src/components/products.tsx` to add a link to the product detail page. After the existing action buttons in CardFooter, add:

```typescript
// Add this import at the top
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// In the CardFooter section, add after the demo button:
<Button
  variant="ghost"
  size="lg"
  asChild
  className="flex-1 gap-2 group/btn"
>
  <Link href={`/products/${product.id === "ee7a459b-9319-4568-8c70-a9842e3c3558" ? "sobriety-waypoint" : product.name.toLowerCase().replace(/\s+/g, "-")}`}>
    View Details
    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
  </Link>
</Button>
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/products.tsx
git commit -m "feat(homepage): add View Details link to product card"
```

---

### Task 20: Update Navigation with Products Link

**Files:**

- Modify: `src/components/navigation.tsx`

**Step 1: Add Products to navigation items**

In `src/components/navigation.tsx`, add Products to the navigation items array:

Find the navigation items array and add:

```typescript
{ name: "Products", href: "/products" },
```

**Step 2: Commit**

```bash
git add src/components/navigation.tsx
git commit -m "feat(nav): add Products link to navigation"
```

---

### Task 21: Configure Image Paths for Product Screenshots

**Files:**

- Modify: `next.config.ts`

**Step 1: Verify image configuration**

Check that `next.config.ts` allows local images from the public directory. Usually no changes needed, but verify the images work.

**Step 2: Copy product images to public directory**

Run:

```bash
mkdir -p public/images/product/sobriety-waypoint
cp content/products/sobriety-waypoint/screenshots/* public/images/product/sobriety-waypoint/
```

**Step 3: Commit**

```bash
git add public/images/product/
git commit -m "feat(assets): add product screenshot images"
```

---

### Task 22: Add Sitemap Entry for Products

**Files:**

- Modify: `src/app/sitemap.ts`

**Step 1: Add products to sitemap**

Update `src/app/sitemap.ts` to include product pages:

```typescript
import { getAllExtendedProducts } from "@/lib/content";

// Add in the sitemap function:
const products = getAllExtendedProducts();
const productUrls = products.map((product) => ({
  url: `${baseUrl}/products/${product.slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
}));

// Add /products index page
const productsIndexUrl = {
  url: `${baseUrl}/products`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.9,
};

// Include in return array
return [...STATIC_ROUTES, productsIndexUrl, ...productUrls, ...blogUrls];
```

**Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add product pages to sitemap"
```

---

## Phase 6: Testing & Validation

### Task 23: Run Full Test Suite

**Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests PASS

**Step 2: Fix any failing tests**

If tests fail, fix the issues.

**Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 4: Run linter**

Run: `pnpm lint`
Expected: PASS (or fix issues)

**Step 5: Run build**

Run: `pnpm build`
Expected: PASS

**Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve test and build issues"
```

---

### Task 24: Manual Testing

**Step 1: Start dev server**

Run: `pnpm dev`

**Step 2: Test product index page**

Navigate to: `http://localhost:3000/products`
Verify:

- Page loads without errors
- Product card displays correctly
- Navigation works

**Step 3: Test product detail page**

Navigate to: `http://localhost:3000/products/sobriety-waypoint`
Verify:

- Hero section displays
- TOC navigation works
- All sections render
- FAQ accordion works
- Back navigation works

**Step 4: Test homepage link**

Navigate to: `http://localhost:3000`
Scroll to products section
Verify: "View Details" link navigates to product page

**Step 5: Test OG image**

Use OG debugger or view source to verify OG image URL works

---

### Task 25: Final Cleanup & Documentation

**Step 1: Format code**

Run: `pnpm format`

**Step 2: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and formatting"
```

**Step 3: Push branch**

```bash
git push -u origin feat/product-pages
```

---

## Summary

**Total Tasks:** 25

**New Files Created:**

- `content/products/sobriety-waypoint/index.json`
- `content/products/sobriety-waypoint/changelog.mdx`
- `src/app/products/page.tsx`
- `src/app/products/products-index-client.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/products/[slug]/product-detail-client.tsx`
- `src/app/products/[slug]/opengraph-image.tsx`
- `src/components/products/product-hero.tsx`
- `src/components/products/product-features.tsx`
- `src/components/products/product-faq.tsx`
- `src/components/products/product-testimonials.tsx`
- `src/components/products/product-changelog.tsx`
- `src/components/products/product-screenshots.tsx`
- `src/components/products/product-toc.tsx`
- `src/components/products/product-card.tsx`
- `src/components/products/index.ts`

**Files Modified:**

- `src/lib/schemas.ts`
- `src/lib/types.ts`
- `src/lib/content.ts`
- `src/lib/social-images.tsx`
- `src/components/products.tsx`
- `src/components/navigation.tsx`
- `src/app/sitemap.ts`
- `tests/lib/content.test.ts`
