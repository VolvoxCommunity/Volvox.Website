# Blog Modal Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the blog preview modal from basic text display into a full-featured reading experience with markdown rendering, reading progress tracking, and navigation to full article pages.

**Architecture:** Enhance the existing Dialog component in `src/components/blog.tsx` to use MDXRemote for markdown rendering, add scroll progress tracking with a sticky header, and implement a footer with CTA button linking to the full blog post page.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, next-mdx-remote/rsc, rehype-highlight, Radix UI Dialog

---

## Task 1: Add Scroll Progress State Management

**Files:**

- Modify: `src/components/blog.tsx:28-32`

**Step 1: Add scroll progress state**

Add state variables for tracking scroll progress and header scroll state after the existing `selectedPost` state:

```tsx
const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
const [scrollProgress, setScrollProgress] = useState(0);
const [isScrolled, setIsScrolled] = useState(false);
```

**Step 2: Add scroll handler function**

Add this function before the `return` statement (after `handlePostClick`):

```tsx
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight - target.clientHeight;

  if (scrollHeight > 0) {
    const progress = (scrollTop / scrollHeight) * 100;
    setScrollProgress(Math.min(progress, 100));
  }

  setIsScrolled(scrollTop > 10);
};
```

**Step 3: Reset scroll state when modal closes**

Update the `setSelectedPost(null)` call in the Dialog's `onOpenChange`:

```tsx
<Dialog
  open={!!selectedPost}
  onOpenChange={() => {
    setSelectedPost(null);
    setScrollProgress(0);
    setIsScrolled(false);
  }}
>
```

**Step 4: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add scroll progress tracking state to blog modal"
```

---

## Task 2: Create Enhanced Modal Header with Progress Bar

**Files:**

- Modify: `src/components/blog.tsx:150-200`

**Step 1: Import required icons**

Update the imports at the top of the file to include ArrowRight:

```tsx
import { Clock, Eye, ArrowRight } from "@phosphor-icons/react";
```

**Step 2: Replace DialogHeader content**

Replace the entire DialogHeader section (lines 150-200) with the enhanced header:

```tsx
<DialogHeader
  className={`sticky top-0 z-10 transition-all duration-200 ${
    isScrolled ? "shadow-md bg-background/95 backdrop-blur-sm" : "bg-background"
  }`}
>
  {/* Progress Bar */}
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
    <div
      className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-150 ease-out"
      style={{ width: `${scrollProgress}%` }}
    />
  </div>

  <div className="pt-6 px-6 pb-4">
    {/* Author Info */}
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={selectedPost.author?.avatar}
          alt={selectedPost.author?.name || "Volvox"}
        />
        <AvatarFallback>
          {(selectedPost.author?.name || "Volvox").charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">
          {selectedPost.author?.name || "Volvox"}
        </p>
        <p className="text-xs text-muted-foreground">
          {selectedPost.author?.role || "Team"}
        </p>
      </div>
    </div>

    {/* Title */}
    <DialogTitle className="text-2xl md:text-3xl mb-3">
      {selectedPost.title}
    </DialogTitle>

    {/* Metadata */}
    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
      <span>
        {new Date(selectedPost.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
      <span className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        {selectedPost.views} views
      </span>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2">
      {selectedPost.tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
</DialogHeader>
```

**Step 3: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add sticky header with progress bar to blog modal"
```

---

## Task 3: Add Markdown Rendering to Modal Content

**Files:**

- Modify: `src/components/blog.tsx:1-3` (imports)
- Modify: `src/components/blog.tsx:202-206` (content area)

**Step 1: Add MDXRemote import**

Add to the imports at the top of the file:

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
```

**Step 2: Replace content div with MDX rendering**

Replace the existing prose div (lines 202-206) with:

```tsx
<div
  className="prose prose-slate dark:prose-invert max-w-none px-6 py-8 overflow-y-auto scroll-smooth"
  style={{ maxHeight: "calc(90vh - 280px)" }}
  onScroll={handleScroll}
>
  <MDXRemote
    source={selectedPost.content}
    options={{
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    }}
  />
</div>
```

**Step 3: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add markdown rendering with syntax highlighting to modal"
```

---

## Task 4: Add Modal Footer with CTA

**Files:**

- Modify: `src/components/blog.tsx` (add Link import and footer)

**Step 1: Add Link import**

Add to the imports at the top:

```tsx
import Link from "next/link";
```

**Step 2: Add Button import**

Update the Button import to include it if not already imported:

```tsx
import { Button } from "@/components/ui/button";
```

**Step 3: Add footer before closing DialogContent**

Add this code right before the closing `</>` of the DialogContent (after the MDX div):

```tsx
{
  /* Footer CTA */
}
<div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm p-4 flex items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
  <Button
    variant="ghost"
    onClick={() => setSelectedPost(null)}
    className="text-muted-foreground"
  >
    Back
  </Button>

  <Button asChild className="flex-1 sm:flex-none">
    <Link href={`/blog/${selectedPost.slug}`}>
      Read Full Article
      <ArrowRight className="h-4 w-4 ml-2" />
    </Link>
  </Button>
</div>;
```

**Step 4: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add footer with CTA button linking to full article"
```

---

## Task 5: Update DialogContent Styling

**Files:**

- Modify: `src/components/blog.tsx:147` (DialogContent props)

**Step 1: Update DialogContent className**

Replace the DialogContent opening tag (line 147) with:

```tsx
<DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
```

**Step 2: Verify modal responsiveness**

Run the development server and test:

```bash
pnpm dev
```

Open http://localhost:3000, click on a blog post card, verify:

- Modal opens with enhanced header
- Progress bar updates on scroll
- Markdown renders correctly with syntax highlighting
- Footer CTA is visible and functional
- Modal is responsive on mobile (test with browser DevTools)

**Step 3: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: update modal layout for better content flow"
```

---

## Task 6: Add Animations and Polish

**Files:**

- Modify: `src/components/blog.tsx` (add motion animations)

**Step 1: Import motion components**

Verify motion is imported (should already be):

```tsx
import { motion } from "framer-motion";
```

**Step 2: Add fade-in animation to content**

Wrap the MDX content div with motion.div:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05, duration: 0.2 }}
  className="prose prose-slate dark:prose-invert max-w-none px-6 py-8 overflow-y-auto scroll-smooth"
  style={{ maxHeight: "calc(90vh - 280px)" }}
  onScroll={handleScroll}
>
  <MDXRemote
    source={selectedPost.content}
    options={{
      mdxOptions: {
        rehypePlugins: [rehypeHighlight],
      },
    }}
  />
</motion.div>
```

**Step 3: Add hover effects to footer buttons**

Update the footer buttons with Tailwind transitions:

```tsx
<Button
  variant="ghost"
  onClick={() => setSelectedPost(null)}
  className="text-muted-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
>
  Back
</Button>

<Button
  asChild
  className="flex-1 sm:flex-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
>
  <Link href={`/blog/${selectedPost.slug}`}>
    Read Full Article
    <ArrowRight className="h-4 w-4 ml-2" />
  </Link>
</Button>
```

**Step 4: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add smooth animations and interaction polish to modal"
```

---

## Task 7: Final Testing and Verification

**Files:**

- Test: `src/components/blog.tsx` (manual testing)

**Step 1: Run development server**

```bash
pnpm dev
```

**Step 2: Test all modal features**

Open http://localhost:3000 and verify:

1. ✅ Click blog post card → modal opens
2. ✅ Progress bar at top shows 0%
3. ✅ Scroll content → progress bar updates smoothly
4. ✅ Header shows shadow after scrolling 10px
5. ✅ Markdown renders with headings, code blocks, lists
6. ✅ Syntax highlighting works in code blocks
7. ✅ Tags display correctly
8. ✅ Author info and metadata visible
9. ✅ "Read Full Article" button navigates to `/blog/[slug]`
10. ✅ "Back" button closes modal
11. ✅ ESC key closes modal
12. ✅ Modal responsive on mobile (< 640px width)
13. ✅ Dark mode works correctly

**Step 3: Run tests**

```bash
pnpm test
```

Expected: All 14 tests pass ✅

**Step 4: Build for production**

```bash
pnpm build
```

Expected: Build succeeds without errors

**Step 5: Commit final verification**

```bash
git commit --allow-empty -m "test: verify all blog modal enhancements working"
```

---

## Task 8: Update Documentation

**Files:**

- Modify: `docs/plans/2025-11-18-blog-modal-enhancement-design.md`

**Step 1: Add implementation notes**

Add this section at the end of the design doc:

```markdown
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

- `src/components/blog.tsx` - Enhanced Dialog component

**Testing:**

- Manual testing: ✅ All features verified
- Unit tests: ✅ 14/14 passing
- Production build: ✅ Success

**Next Steps:**

- Consider adding table of contents for long posts
- Consider adding share buttons
- Consider adding related posts section
```

**Step 2: Commit documentation**

```bash
git add docs/plans/2025-11-18-blog-modal-enhancement-design.md
git commit -m "docs: add implementation completion notes"
```

---

## Task 9: Create Pull Request

**Files:**

- N/A (Git operations)

**Step 1: Push branch to remote**

```bash
git push -u origin feature/blog-modal-enhancement
```

**Step 2: Create PR using gh CLI**

```bash
gh pr create --title "feat: enhance blog modal with markdown rendering and progress tracking" --body "$(cat <<'EOF'
## Summary
- Enhanced blog preview modal with full markdown rendering
- Added scroll progress bar with sticky header
- Implemented footer CTA linking to full article page
- Maintained responsive design and accessibility

## Features
- **Markdown Rendering**: Full MDX support with syntax highlighting
- **Reading Progress**: Visual progress bar that updates on scroll
- **Sticky Header**: Metadata and author info stays visible
- **Footer CTA**: "Read Full Article" button for navigation
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Works on mobile and desktop

## Testing
- ✅ All 14 unit tests passing
- ✅ Manual testing completed
- ✅ Production build successful
- ✅ Mobile responsive verified

## Screenshots
[Add screenshots of the enhanced modal]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 3: Verify PR created**

Visit the PR URL printed by the command and verify:

- Title and description are correct
- All commits are included
- CI/CD checks are running (if configured)

---

## Completion Checklist

Before marking this plan as complete, verify:

- [ ] All 9 tasks completed
- [ ] All commits follow conventional commit format
- [ ] All tests passing (14/14)
- [ ] Production build succeeds
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] PR created and reviewed
- [ ] No console errors in browser
- [ ] Accessibility verified (keyboard navigation)
- [ ] Dark mode tested
- [ ] Mobile responsive verified

## Notes for Engineer

**DRY (Don't Repeat Yourself):**

- Reuse existing MDX configuration from blog detail page
- Leverage existing UI components (Dialog, Button, Badge, Avatar)
- Use existing Tailwind prose classes

**YAGNI (You Aren't Gonna Need It):**

- No table of contents (not in scope)
- No share buttons (future enhancement)
- No related posts (future enhancement)
- No copy button on code blocks (nice-to-have)

**TDD (Test-Driven Development):**

- Tests already passing from previous work
- Manual testing required for UI changes
- No new unit tests needed (component testing only)

**Frequent Commits:**

- One commit per task (9 commits total)
- Use conventional commit messages
- Keep commits atomic and focused

**Common Pitfalls:**

- Don't forget to reset scroll state when modal closes
- Ensure progress bar doesn't exceed 100%
- Test with short posts (<1 screen) and long posts (>5 screens)
- Verify modal height calculation accounts for header/footer
- Check that Link href uses backticks for template literal
