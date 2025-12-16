# Homepage Products List Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single "Featured Product" section on the homepage with a full products list showing all products as large, detailed cards.

**Architecture:** The homepage Products component will loop through all ExtendedProducts and render them as stacked feature cards. The `/products` route will redirect to `/#products`. Navigation links will point to the homepage products section.

**Tech Stack:** Next.js 16 App Router, TypeScript, Framer Motion, Tailwind CSS

---

### Task 1: Update Products Component Types

**Files:**

- Modify: `src/components/products.tsx:19-21`

**Step 1: Update the interface to use ExtendedProduct**

Change the ProductsProps interface from:

```typescript
interface ProductsProps {
  products: Product[];
}
```

To:

```typescript
interface ProductsProps {
  products: ExtendedProduct[];
}
```

**Step 2: Update the import**

Change line 15 from:

```typescript
import { Product } from "@/lib/types";
```

To:

```typescript
import type { ExtendedProduct } from "@/lib/types";
```

**Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: Errors about type mismatch (expected - we'll fix in later tasks)

---

### Task 2: Update Products Component to Show All Products

**Files:**

- Modify: `src/components/products.tsx`

**Step 1: Update section title**

Change line 52-55 from:

```tsx
<h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Product</h2>
```

To:

```tsx
<h2 className="text-3xl md:text-5xl font-bold mb-4">Our Products</h2>
```

**Step 2: Update subtitle**

Change line 56-58 from:

```tsx
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  Crafted with precision, built to support recovery journeys.
</p>
```

To:

```tsx
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  Open-source applications built with care, designed to make a real difference.
</p>
```

**Step 3: Replace single product with products map**

Replace the entire component body (lines 31-210) with:

```tsx
export function Products({ products }: ProductsProps) {
  if (products.length === 0) {
    return (
      <section id="products" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Open-source applications built with care, designed to make a real
            difference.
          </p>
        </div>

        <div className="space-y-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Add ProductCard component in same file**

Add above the Products function:

```tsx
interface ProductCardProps {
  product: ExtendedProduct;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const heroImage = product.screenshots[0];
  const imagePath = heroImage
    ? `/images/product/${product.slug}/${heroImage}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-2xl hover:shadow-secondary/5 transition-[box-shadow,border-color] duration-500 border-2 hover:border-secondary/30 overflow-hidden bg-card/80 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-0">
          <motion.div
            className="aspect-video md:aspect-auto md:min-h-[300px] bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {imagePath ? (
              <>
                <Image
                  src={imagePath}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-[120px] md:text-[180px] font-bold text-foreground/5"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.name.charAt(0)}
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
              </>
            )}
          </motion.div>

          <div className="flex flex-col">
            <CardHeader className="pb-4 pt-6 md:pt-8 px-6 md:px-8">
              <CardTitle className="text-2xl md:text-3xl font-bold transition-colors duration-300">
                {product.name}
              </CardTitle>
              <CardDescription className="text-base mt-3 leading-relaxed">
                {product.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-7 px-6 md:px-8">
              <div>
                <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="h-px w-4 bg-primary/50" />
                  Key Features
                </h4>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3 group/item"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle
                        weight="fill"
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform"
                      />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="pt-6 pb-6 md:pb-8 px-6 md:px-8">
              <Button asChild className="gap-2 group/btn">
                <Link href={`/products/${product.slug}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
```

**Step 5: Clean up unused imports**

Remove these unused imports:

- `GithubLogo`, `ArrowUpRight` from `@phosphor-icons/react`

Final imports should be:

```typescript
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@phosphor-icons/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ExtendedProduct } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
```

**Step 6: Run typecheck**

Run: `pnpm typecheck`
Expected: Errors in homepage-client.tsx and page.tsx (will fix next)

---

### Task 3: Update Homepage Client Props

**Files:**

- Modify: `src/components/homepage-client.tsx:14,18`

**Step 1: Update import**

Change line 14 from:

```typescript
import type { BlogPost, Product, Mentor, Mentee } from "@/lib/types";
```

To:

```typescript
import type { BlogPost, ExtendedProduct, Mentor, Mentee } from "@/lib/types";
```

**Step 2: Update interface**

Change line 18 from:

```typescript
products: Product[];
```

To:

```typescript
products: ExtendedProduct[];
```

**Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: Error in src/app/page.tsx (will fix next)

---

### Task 4: Update Homepage Server Component

**Files:**

- Modify: `src/app/page.tsx:3-4,14`

**Step 1: Update import**

Change line 3 from:

```typescript
import { getAllProducts } from "@/lib/data";
```

To:

```typescript
import { getAllExtendedProducts } from "@/lib/content";
```

**Step 2: Update data fetching**

Change line 14 from:

```typescript
getAllProducts(),
```

To:

```typescript
Promise.resolve(getAllExtendedProducts()),
```

**Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS (all type errors resolved)

**Step 4: Run tests**

Run: `pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products.tsx src/components/homepage-client.tsx src/app/page.tsx
git commit -m "feat(products): show all products on homepage instead of featured"
```

---

### Task 5: Update Hero Link

**Files:**

- Modify: `src/components/hero.tsx:117`

**Step 1: Change Link href**

Change line 117 from:

```tsx
<Link href="/products">
```

To:

```tsx
<Link href="/#products">
```

**Step 2: Run tests**

Run: `pnpm test`
Expected: FAIL - hero test expects href="/products"

---

### Task 6: Update Hero Test

**Files:**

- Modify: `tests/components/hero.test.tsx:13-17`

**Step 1: Update test expectation**

Change the test from:

```typescript
it("renders Explore Products as link to /products", () => {
  render(<Hero onNavigate={jest.fn()} />);
  const link = screen.getByRole("link", { name: /Explore Products/i });
  expect(link).toHaveAttribute("href", "/products");
});
```

To:

```typescript
it("renders Explore Products as link to /#products", () => {
  render(<Hero onNavigate={jest.fn()} />);
  const link = screen.getByRole("link", { name: /Explore Products/i });
  expect(link).toHaveAttribute("href", "/#products");
});
```

**Step 2: Run tests**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/hero.tsx tests/components/hero.test.tsx
git commit -m "feat(hero): update Explore Products link to /#products"
```

---

### Task 7: Update Navigation Products Link

**Files:**

- Modify: `src/components/navigation.tsx:70`

**Step 1: Change Products href**

Change line 70 from:

```typescript
{ id: "products", label: "Products", href: "/products" },
```

To:

```typescript
{ id: "products", label: "Products", href: "/#products" },
```

**Step 2: Run tests**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/navigation.tsx
git commit -m "feat(nav): update Products link to /#products"
```

---

### Task 8: Convert /products Page to Redirect

**Files:**

- Modify: `src/app/products/page.tsx`

**Step 1: Replace page with redirect**

Replace entire file contents with:

```typescript
import { redirect } from "next/navigation";

/**
 * Redirects /products to homepage products section.
 */
export default function ProductsPage() {
  redirect("/#products");
}
```

**Step 2: Run build**

Run: `pnpm build`
Expected: PASS

**Step 3: Commit**

```bash
git add src/app/products/page.tsx
git commit -m "feat(products): redirect /products to /#products"
```

---

### Task 9: Delete Unused Files

**Files:**

- Delete: `src/app/products/products-index-client.tsx`
- Delete: `src/components/products/product-card.tsx`

**Step 1: Remove files**

```bash
rm src/app/products/products-index-client.tsx
rm src/components/products/product-card.tsx
```

**Step 2: Update products component index**

Check if `src/components/products/index.ts` exports ProductCard and remove it.

**Step 3: Run build**

Run: `pnpm build`
Expected: PASS

**Step 4: Run all validation**

Run: `pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: All PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused products index client and card components"
```

---

### Task 10: Final Verification

**Step 1: Start dev server**

Run: `pnpm dev`

**Step 2: Manual verification checklist**

- [ ] Homepage shows all products as large cards
- [ ] "Our Products" heading displays
- [ ] Each product card has image, description, features, View Details button
- [ ] View Details links to `/products/[slug]`
- [ ] Hero "Explore Products" scrolls to products section
- [ ] Navigation "Products" link scrolls to products section
- [ ] `/products` URL redirects to `/#products`
- [ ] Product detail pages still work (`/products/sobriety-waypoint`)

**Step 3: Stop dev server and confirm all tests pass**

Run: `pnpm test`
Expected: PASS
