# Homepage Products List Design

**Date:** 2025-12-13
**Status:** Approved

## Overview

Replace the single "Featured Product" section on the homepage with a full products list showing all products as large, detailed cards stacked vertically. The separate `/products` page becomes a redirect to the homepage products section.

## Decisions

| Question                           | Decision                                               |
| ---------------------------------- | ------------------------------------------------------ |
| What happens to `/products` route? | Redirects to `/#products`                              |
| How should products display?       | Large feature cards, stacked vertically                |
| What details per card?             | Image, description, features list, "View Details" link |
| Section heading?                   | "Our Products"                                         |

## Routing

- `/products` → Redirects (308) to `/#products`
- `/products/[slug]` → Unchanged (individual product detail pages)
- Hero "Explore Products" button → Links to `/#products`

## Product Card Layout

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌─────────────────────────┐  │
│  │                  │  │ Product Name            │  │
│  │     Product      │  │ Description text here   │  │
│  │      Image       │  │                         │  │
│  │                  │  │ KEY FEATURES            │  │
│  │                  │  │ ✓ Feature one           │  │
│  │                  │  │ ✓ Feature two           │  │
│  └──────────────────┘  │ ✓ Feature three         │  │
│                        │                         │  │
│                        │ [View Details →]        │  │
│                        └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Layout:**

- Two-column grid on desktop (image left, content right)
- Stacks vertically on mobile (image top, content below)
- Same visual styling as current featured product card

**Removed elements:**

- GitHub button
- Demo button
- Long description footer section

## Implementation Changes

### Files to Modify

1. **`src/components/products.tsx`**
   - Rename section title to "Our Products"
   - Loop through all products instead of just `products[0]`
   - Remove GitHub/Demo buttons from card
   - Remove long description footer section
   - Change data type from `Product[]` to `ExtendedProduct[]`

2. **`src/app/page.tsx`**
   - Update to fetch `getAllExtendedProducts()` instead of `getAllProducts()`
   - Pass extended products to the Products component

3. **`src/app/products/page.tsx`**
   - Convert to a redirect to `/#products`

4. **`src/components/hero.tsx`**
   - Update "Explore Products" link from `/products` to `/#products`

### Files to Delete

- `src/app/products/products-index-client.tsx`
- `src/components/products/product-card.tsx`

### Files Unchanged

- `src/app/products/[slug]/` (detail pages remain)
- All other product components

## Edge Cases

- **No products:** Show "Products coming soon" placeholder
- **Single product:** Displays as one card (no special treatment)
- **Many products:** Cards stack vertically, no pagination needed

## SEO

- Products section indexable on homepage
- Individual product pages retain full SEO metadata
- 308 permanent redirect preserves any existing `/products` links
