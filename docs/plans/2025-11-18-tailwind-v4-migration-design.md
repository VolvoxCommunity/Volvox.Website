# Tailwind CSS v4 Migration Design

**Date:** 2025-11-18
**Status:** Ready for Implementation
**Goals:** Latest features, future-proofing, performance improvements

## Overview

Migrate from Tailwind CSS v3.4.18 to v4.x with full CSS-first configuration approach using Lightning CSS for optimal performance.

## Architecture Changes

### Configuration Paradigm Shift

**From:** JavaScript/TypeScript configuration (`tailwind.config.ts`)
**To:** CSS-first configuration using `@theme` and `@import` directives

This aligns with v4's philosophy and leverages our existing CSS variable approach.

### Key Changes

1. **Import Method**
   - Replace: `@tailwind base; @tailwind components; @tailwind utilities;`
   - With: `@import "tailwindcss";`

2. **Configuration Location**
   - Delete: `tailwind.config.ts`
   - Move all theme config to: `src/app/globals.css` using `@theme` directive

3. **Build Pipeline**
   - Replace: PostCSS + Autoprefixer
   - With: Lightning CSS (automatic via Next.js 15+)
   - Delete: `postcss.config.mjs`
   - Remove: `autoprefixer` dependency

4. **Dark Mode**
   - Replace: `darkMode: ['class']` in config
   - With: `@variant dark (&:where(.dark, .dark *))` in CSS
   - No changes to theme toggle component or `.dark` class usage

## Configuration Migration

### Theme Colors

Current colors are already CSS variables. Reference them in `@theme`:

```css
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

### Border Radius

```css
@theme {
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

### Custom Animations

Keyframes remain in CSS. Register with Tailwind:

```css
@theme {
  --animate-gradient-x: gradient-x 3s ease infinite;
  --animate-pulse-slow: pulse-slow 4s ease-in-out infinite;
}
```

### Content Paths

Delete content configuration. v4 auto-detects component files.

## New CSS File Structure

`src/app/globals.css` organization:

```css
/* 1. Import Tailwind v4 */
@import "tailwindcss";

/* 2. Configure dark mode variant */
@variant dark (&:where(.dark, .dark *));

/* 3. Theme configuration */
@theme {
  /* Colors, radius, animations */
}

/* 4. CSS variables (unchanged) */
@layer base {
  :root { /* ... */ }
  .dark { /* ... */ }
}

/* 5. Keyframes (unchanged) */
@keyframes gradient-x { /* ... */ }
@keyframes pulse-slow { /* ... */ }

/* 6. Base styles (unchanged) */
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

## Package Changes

### Update

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0"
  }
}
```

### Remove

```json
{
  "dependencies": {
    "autoprefixer": "^10.4.22"  // DELETE
  }
}
```

### Delete Files

- `tailwind.config.ts`
- `postcss.config.mjs`

## What Stays Unchanged

- All component code (`.tsx` files)
- CSS variable usage in components
- Theme toggle component behavior
- Build scripts (`pnpm dev`, `pnpm build`)
- File structure

## Validation Strategy

### 1. Visual Regression Check

Start dev server and test:
- Hero section
- Products section
- Blog section
- Mentorship section
- About section
- Theme toggle (light ↔ dark)
- Responsive behavior (mobile/desktop)

### 2. Build Validation

```bash
pnpm build
pnpm start
```

Verify:
- No Tailwind warnings/errors
- Static generation works for blog posts
- Production rendering matches dev

### 3. Component-Specific Tests

- Custom animations: `gradient-x`, `pulse-slow`
- Border radius: `rounded-lg`, `rounded-md`, `rounded-sm`
- Color utilities: `bg-background`, `text-primary`, etc.
- Dark mode: `.dark` class toggles

### Success Criteria

✓ Dev and build complete without errors
✓ All pages render identically to v3
✓ Theme toggle works correctly
✓ Animations play smoothly
✓ No console errors or warnings
✓ Performance improvement visible in build times

## Rollback Plan

All changes are in version control. If issues occur:

```bash
git reset --hard HEAD
pnpm install
```

## Documentation Updates

After successful migration, update:

- `README.md`: Change "Tailwind CSS v3" → "Tailwind CSS v4"
- `CLAUDE.md`: Update Tailwind version and note CSS-first configuration
- Add note about Lightning CSS usage

## Timeline

1. Package updates (5 min)
2. CSS file restructuring (10 min)
3. Delete old config files (1 min)
4. Visual validation (10 min)
5. Build validation (5 min)
6. Documentation updates (5 min)

**Total estimated time:** ~35 minutes

## Benefits

- **Performance:** Faster builds with Lightning CSS
- **Future-proof:** Latest Tailwind version with ongoing support
- **Cleaner architecture:** CSS-first aligns with existing CSS variable approach
- **New features:** Access to v4 utilities, container queries, improvements
- **Simpler config:** No JavaScript config to maintain
