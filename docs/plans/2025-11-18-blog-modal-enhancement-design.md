# Blog Modal Enhancement Design

**Date:** 2025-11-18
**Status:** Approved
**Priority:** High

## Overview

Transform the blog preview modal from a basic text display into a full-featured reading experience with markdown rendering, reading progress tracking, and navigation to full articles.

## Current State

The existing modal (`src/components/blog.tsx` lines 146-210) shows:
- Author avatar and metadata
- Post title and tags
- Plain text content (no markdown rendering)
- Basic dialog with static content

## Goals

1. **Rich content rendering** - Render full markdown with syntax highlighting, code blocks, images, and proper typography
2. **Reading progress** - Visual indicator showing scroll progress through the article
3. **Enhanced navigation** - Sticky header with metadata and CTA button to full article page
4. **Maintain quick preview** - Modal remains fast, lightweight preview with escape hatch to full experience

## Design Specification

### Architecture & Layout

```
┌─────────────────────────────────────┐
│ [Progress Bar - 0-100%]             │ ← Sticky header
│ Avatar | Author | Date              │
│ Title                               │
│ Tags [tag1] [tag2] [tag3]          │
├─────────────────────────────────────┤
│                                     │
│ # Rendered Markdown Content         │ ← Scrollable
│                                     │
│ Proper headings, code blocks,       │
│ syntax highlighting, images         │
│                                     │
│ ...                                 │
├─────────────────────────────────────┤
│ [← Back]  [Read Full Article →]    │ ← Footer CTA
└─────────────────────────────────────┘
```

**Component Structure:**
- Enhanced Dialog component with markdown rendering
- Sticky progress header (progress bar + metadata)
- Scrollable content area with prose typography
- Footer with CTA button to `/blog/[slug]`
- Reuse existing `next-mdx-remote/rsc` infrastructure

### Reading Progress & Sticky Header

**Visual Design:**
```
┌─────────────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░░░░ 35%   │ ← 2px gradient bar
├─────────────────────────────────────┤
│ [Avatar] Author Name                │
│          Role/Title                 │
│                                     │
│ Article Title Here                  │
│                                     │
│ Dec 15, 2024 · 👁 342               │
│ [tag1] [tag2] [tag3]                │
└─────────────────────────────────────┘
```

**Implementation:**
- Progress calculation: `(scrollTop / (scrollHeight - clientHeight)) * 100`
- Real-time updates via `onScroll` event on DialogContent
- Smooth transition animation: `transition-all duration-150`
- Gradient progress bar: `bg-gradient-to-r from-primary via-primary/80 to-primary/60`

**Sticky Behavior:**
- Header fixed at top with `sticky top-0`
- Shadow appears when scrolled: `shadow-md` after 10px scroll
- Blur background: `backdrop-blur-sm bg-background/95`

**Mobile Optimization:**
- Header compresses when scrolled (reduced padding)
- Progress bar remains visible
- Title truncates to 2 lines max

### Markdown Content Rendering

**Content Features:**
- Headings (h1-h6) with proper hierarchy
- Code blocks with syntax highlighting via `rehype-highlight`
- Inline code with distinct background
- Lists with proper indentation
- Blockquotes with left border accent
- Links opening in new tabs
- Responsive images with lazy loading
- Tables with striped rows
- Bold, italic, strikethrough formatting

**Typography System:**
```css
prose prose-slate dark:prose-invert max-w-none
prose-headings:font-bold
prose-h1:text-3xl prose-h1:mb-4
prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
prose-p:leading-relaxed prose-p:mb-4
prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
prose-code:rounded prose-code:text-sm
prose-pre:bg-slate-900 prose-pre:p-4
prose-img:rounded-lg prose-img:shadow-lg
```

**Component:**
```tsx
<div className="prose prose-slate dark:prose-invert max-w-none px-6 py-8">
  <MDXRemote source={selectedPost.content} />
</div>
```

**Technical:**
- Reuse MDX config from `src/app/blog/[slug]/page.tsx`
- Content scrolling: `overflow-y-auto scroll-smooth`
- Max height: `max-h-[calc(90vh-200px)]`

### Footer & Call-to-Action

**Layout:**
```
┌─────────────────────────────────────┐
│  [← Back]  [Read Full Article →]   │
└─────────────────────────────────────┘
```

**Behavior:**
- Primary: "Read Full Article" → navigates to `/blog/[slug]`
- Secondary: "Back" → closes modal
- Footer shadow when content scrollable: `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`
- Mobile: CTA takes full width
- Clicking CTA closes modal and navigates

**Styling:**
- Border top separator
- Transparent background with blur: `bg-background/95 backdrop-blur-sm`
- Primary button with gradient/brand color

### Visual Polish & Animations

**Modal Transitions:**
- Open: Scale 0.95→1.0 with fade-in (200ms ease-out)
- Close: Scale to 0.95 with fade-out (150ms ease-in)
- Backdrop: Animated blur fade-in

**Scroll Interactions:**
- Progress bar: `transition-all duration-150 ease-out`
- Header shadow: Fade-in when scrolled >10px (`transition-shadow duration-200`)
- Smooth scrolling: `scroll-smooth`

**Content Reveal:**
- Content fades in with upward motion after modal opens
- 50ms stagger between header and content
- No per-paragraph animations

**Interactive Elements:**
- Buttons: `hover:scale-[1.02] active:scale-[0.98]`
- Links: Underline on hover with color transition
- Glass effects: `backdrop-blur-sm bg-background/95`

**Responsive:**
- Desktop: `max-w-4xl`
- Tablet: `max-w-3xl`
- Mobile: Full width, `p-4` padding

**Performance:**
- CSS transforms for GPU acceleration
- No layout thrashing during scroll
- Efficient scroll progress calculation

## Implementation Details

### File Changes

1. **`src/components/blog.tsx`** - Main enhancement
   - Add scroll progress state
   - Integrate MDXRemote
   - Add sticky header and footer
   - Update DialogContent structure

2. **Optional:** `src/components/blog-modal-content.tsx`
   - Extract modal content for clarity
   - Handle scroll tracking
   - Keep Blog component clean

### State Management

```tsx
const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
const [scrollProgress, setScrollProgress] = useState(0);
const [isScrolled, setIsScrolled] = useState(false);
```

### Key Functions

```tsx
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight - target.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  setScrollProgress(progress);
  setIsScrolled(scrollTop > 10);
};
```

### Edge Cases

- Empty/null content → graceful fallback
- Short posts → progress still shown
- Failed image loads → skip or fallback
- Markdown parse errors → plain text fallback
- Mobile keyboard → modal height adjustment

### Accessibility

- Keyboard navigation (ESC to close)
- Focus trap within modal
- ARIA labels on progress bar
- Semantic HTML in markdown
- Screen reader announces title on open

### Dependencies (Already in project)

- `next-mdx-remote/rsc` ✓
- `rehype-highlight` ✓
- `framer-motion` ✓
- Phosphor icons ✓

### Testing Considerations

- Short posts (<1 screen)
- Long posts (>5 screens)
- Various markdown features
- Mobile viewports
- Light/dark themes

## Success Criteria

- ✅ Modal renders full markdown with syntax highlighting
- ✅ Reading progress bar updates smoothly on scroll
- ✅ Sticky header remains visible while scrolling
- ✅ "Read Full Article" button navigates to `/blog/[slug]`
- ✅ Animations are smooth and performant
- ✅ Works on mobile and desktop
- ✅ Maintains accessibility standards
- ✅ Graceful fallbacks for edge cases

## Future Enhancements (Not in scope)

- Copy button on code blocks
- Share buttons in footer
- Related posts section
- Collapsible table of contents
- Reading time estimation
- Bookmark/save functionality

---

## Implementation Complete

**Date:** 2025-11-18

**Changes Made:**
- ✅ Scroll progress tracking with state management
- ✅ Sticky header with gradient progress bar
- ✅ Markdown rendering via MDXRemote with rehype-highlight
- ✅ Footer with "Read Full Article" CTA
- ✅ Smooth animations and transitions
- ✅ Fully responsive design
- ✅ Accessibility maintained (keyboard navigation, ARIA)

**Files Modified:**
- `src/components/blog.tsx` - Enhanced Dialog component with scroll tracking, sticky header/footer, MDX rendering
- `src/app/layout.tsx` - Added highlight.js CSS for syntax highlighting
- `tests/postcss-tailwind.test.ts` - Fixed for Tailwind CSS v4 compatibility

**Testing:**
- Manual testing: ✅ All features verified (dev server running on http://localhost:3000)
- Unit tests: ✅ 14/14 passing
- Production build: ✅ Success (with pre-existing Sentry warnings unrelated to changes)

**Commits:**
1. `5846f78` - chore: add .worktrees/ to .gitignore
2. `8fa7b1c` - fix: update PostCSS/Tailwind tests for v4 compatibility
3. `28d0738` - feat: add scroll progress tracking state to blog modal
4. `7e6e5a8` - feat: add sticky header with progress bar to blog modal
5. `6cd2e32` - feat: add markdown rendering with syntax highlighting to modal
6. `8ce8089` - fix: add syntax highlighting styles for code blocks
7. `acddcfc` - feat: add footer with CTA button linking to full article
8. `dc0f13a` - feat: update modal layout for better content flow
9. `21af1bf` - feat: add smooth animations and interaction polish to modal
10. `0eb301d` - test: verify all blog modal enhancements working

**Next Steps:**
- Consider adding table of contents for long posts
- Consider adding share buttons
- Consider adding related posts section
