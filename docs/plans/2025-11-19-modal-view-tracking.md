# Modal View Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add session-based view tracking that counts each blog post view exactly once per session, whether opened via modal or full page.

**Architecture:** Create a utility function + React hook that uses sessionStorage to deduplicate view tracking across modal and full page contexts. The utility handles the API call and sessionStorage management, while the hook provides a declarative interface for page components.

**Tech Stack:** React 19, TypeScript, Next.js 16, sessionStorage API, existing `/api/blog/views` endpoint

---

## Task 1: Create View Tracking Utility with Tests

**Files:**
- Create: `src/lib/view-tracking.ts`
- Create: `tests/view-tracking.test.ts`

**Step 1: Write failing test for sessionStorage helpers**

Create `tests/view-tracking.test.ts`:

```typescript
import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";

describe("View Tracking", () => {
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    mockSessionStorage = {};

    global.sessionStorage = {
      getItem: (key: string) => mockSessionStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        mockSessionStorage = {};
      },
      length: 0,
      key: () => null,
    } as Storage;
  });

  describe("getViewedPosts", () => {
    it("returns empty Set when no posts viewed", async () => {
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 0);
    });

    it("returns Set with stored slugs", async () => {
      mockSessionStorage["volvox_viewed_posts"] = JSON.stringify([
        "post-1",
        "post-2",
      ]);
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 2);
      assert.ok(result.has("post-1"));
      assert.ok(result.has("post-2"));
    });
  });

  describe("saveViewedPosts", () => {
    it("saves Set to sessionStorage as JSON array", async () => {
      const { saveViewedPosts } = await import("../src/lib/view-tracking.js");
      const posts = new Set(["post-1", "post-2"]);
      saveViewedPosts(posts);
      const stored = mockSessionStorage["volvox_viewed_posts"];
      assert.ok(stored);
      const parsed = JSON.parse(stored);
      assert.strictEqual(parsed.length, 2);
      assert.ok(parsed.includes("post-1"));
      assert.ok(parsed.includes("post-2"));
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: FAIL with "Cannot find module '../src/lib/view-tracking.js'"

**Step 3: Implement sessionStorage helpers**

Create `src/lib/view-tracking.ts`:

```typescript
const VIEWED_POSTS_KEY = "volvox_viewed_posts";

/**
 * Get the set of viewed post slugs from sessionStorage.
 */
export function getViewedPosts(): Set<string> {
  try {
    if (typeof window === "undefined") return new Set();
    const stored = sessionStorage.getItem(VIEWED_POSTS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

/**
 * Save the set of viewed post slugs to sessionStorage.
 */
export function saveViewedPosts(posts: Set<string>): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify([...posts]));
  } catch (error) {
    console.error("Failed to save viewed posts:", error);
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/lib/view-tracking.ts tests/view-tracking.test.ts
git commit -m "test: add sessionStorage helpers for view tracking"
```

---

## Task 2: Implement trackPostView with Tests

**Files:**
- Modify: `src/lib/view-tracking.ts`
- Modify: `tests/view-tracking.test.ts`

**Step 1: Write failing test for trackPostView**

Add to `tests/view-tracking.test.ts`:

```typescript
describe("trackPostView", () => {
  let fetchMock: any;

  beforeEach(() => {
    mockSessionStorage = {};
    fetchMock = mock.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    global.fetch = fetchMock as any;
  });

  it("tracks view for new post", async () => {
    const { trackPostView } = await import("../src/lib/view-tracking.js");
    await trackPostView("test-post");

    assert.strictEqual(fetchMock.mock.calls.length, 1);
    const [url, options] = fetchMock.mock.calls[0].arguments;
    assert.strictEqual(url, "/api/blog/views");
    assert.strictEqual(options.method, "POST");
    assert.ok(options.body.includes("test-post"));

    const stored = mockSessionStorage["volvox_viewed_posts"];
    const parsed = JSON.parse(stored);
    assert.ok(parsed.includes("test-post"));
  });

  it("skips tracking for already viewed post", async () => {
    mockSessionStorage["volvox_viewed_posts"] = JSON.stringify(["test-post"]);
    const { trackPostView } = await import("../src/lib/view-tracking.js");
    await trackPostView("test-post");

    assert.strictEqual(fetchMock.mock.calls.length, 0);
  });

  it("does not save to sessionStorage if API fails", async () => {
    fetchMock = mock.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );
    global.fetch = fetchMock as any;

    const { trackPostView } = await import("../src/lib/view-tracking.js");
    await trackPostView("test-post");

    assert.strictEqual(fetchMock.mock.calls.length, 1);
    assert.strictEqual(mockSessionStorage["volvox_viewed_posts"], undefined);
  });

  it("handles empty slug gracefully", async () => {
    const { trackPostView } = await import("../src/lib/view-tracking.js");
    await trackPostView("");

    assert.strictEqual(fetchMock.mock.calls.length, 0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: FAIL with "trackPostView is not defined"

**Step 3: Implement trackPostView function**

Add to `src/lib/view-tracking.ts`:

```typescript
/**
 * Track a blog post view, ensuring it's only counted once per session.
 * Uses sessionStorage to deduplicate across modal and full page views.
 */
export async function trackPostView(slug: string): Promise<void> {
  if (!slug || typeof window === "undefined") return;

  // Check if already tracked in this session
  const viewedPosts = getViewedPosts();
  if (viewedPosts.has(slug)) return;

  // Track the view via API
  try {
    const response = await fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    });

    if (response.ok) {
      // Only mark as viewed if API call succeeds
      viewedPosts.add(slug);
      saveViewedPosts(viewedPosts);
    }
  } catch (error) {
    console.error("Failed to track post view:", error);
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: PASS (6 tests total)

**Step 5: Commit**

```bash
git add src/lib/view-tracking.ts tests/view-tracking.test.ts
git commit -m "feat: implement trackPostView with session deduplication"
```

---

## Task 3: Add usePostViewTracking Hook with Tests

**Files:**
- Modify: `src/lib/view-tracking.ts`
- Modify: `tests/view-tracking.test.ts`

**Step 1: Write failing test for hook**

Add to `tests/view-tracking.test.ts` (note: this is a basic unit test, not a full React test):

```typescript
import { useEffect } from "react";

describe("usePostViewTracking", () => {
  it("exports the hook function", async () => {
    const { usePostViewTracking } = await import("../src/lib/view-tracking.js");
    assert.strictEqual(typeof usePostViewTracking, "function");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: FAIL with "usePostViewTracking is not defined"

**Step 3: Implement the hook**

Add to `src/lib/view-tracking.ts`:

```typescript
import { useEffect } from "react";

/**
 * React hook to track post view on component mount.
 * Use this in blog post pages for declarative view tracking.
 */
export function usePostViewTracking(slug: string): void {
  useEffect(() => {
    trackPostView(slug);
  }, [slug]);
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm test tests/view-tracking.test.ts`
Expected: PASS (7 tests total)

**Step 5: Commit**

```bash
git add src/lib/view-tracking.ts tests/view-tracking.test.ts
git commit -m "feat: add usePostViewTracking hook for declarative tracking"
```

---

## Task 4: Integrate Tracking into Blog Modal

**Files:**
- Modify: `src/components/blog.tsx:1` (imports)
- Modify: `src/components/blog.tsx` (handlePostClick function)

**Step 1: Add import**

Add to imports at top of `src/components/blog.tsx`:

```typescript
import { trackPostView } from "@/lib/view-tracking";
```

**Step 2: Find the handlePostClick function**

Locate the `handlePostClick` function in `src/components/blog.tsx`. It should look like:

```typescript
const handlePostClick = (post: BlogPost) => {
  setSelectedPost(post);
};
```

**Step 3: Update handlePostClick to track views**

Replace with:

```typescript
const handlePostClick = async (post: BlogPost) => {
  await trackPostView(post.slug);
  setSelectedPost(post);
};
```

**Step 4: Manual test - modal tracking**

Run dev server:
```bash
pnpm dev
```

Open http://localhost:3000, open browser DevTools Network tab:
1. Click a blog post card
2. Verify POST request to `/api/blog/views` appears
3. Close modal, reopen same post
4. Verify NO new POST request (already tracked)
5. Open different post
6. Verify NEW POST request appears

Check sessionStorage in DevTools Application tab:
- Key: `volvox_viewed_posts`
- Value: Should be JSON array of viewed slugs

**Step 5: Commit**

```bash
git add src/components/blog.tsx
git commit -m "feat: add view tracking to blog modal on open"
```

---

## Task 5: Integrate Tracking into Full Blog Page

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Read current implementation**

Read `src/app/blog/[slug]/page.tsx` to see how it currently uses `PostViewTracker`.

**Step 2: Add import**

Add to imports:

```typescript
import { usePostViewTracking } from "@/lib/view-tracking";
```

**Step 3: Find where PostViewTracker is used**

Look for:
```typescript
<PostViewTracker slug={post.slug} />
```

**Step 4: Replace PostViewTracker with hook**

Remove the `<PostViewTracker slug={post.slug} />` line.

Add the hook call near the top of the component function (after params destructuring):

```typescript
export default function BlogPost({ params }: { params: { slug: string } }) {
  usePostViewTracking(params.slug);
  // ... rest of component
}
```

**Step 5: Manual test - full page tracking**

With dev server running, test:

1. **Direct page visit:**
   - Navigate to `/blog/[any-slug]` directly
   - Check Network tab for POST to `/api/blog/views`
   - Refresh page
   - Verify NO new POST (already tracked in session)

2. **After modal view:**
   - Go to homepage
   - Open a post in modal (triggers tracking)
   - Click "Read Full Article"
   - Navigate to full page
   - Verify NO POST request (already tracked from modal)

3. **Before modal view:**
   - Clear sessionStorage in DevTools
   - Visit full page directly (triggers tracking)
   - Go back to homepage
   - Open same post in modal
   - Verify NO POST request (already tracked from page)

**Step 6: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: use view tracking hook in blog detail page"
```

---

## Task 6: Add Deprecation Comment to PostViewTracker

**Files:**
- Modify: `src/components/post-view-tracker.tsx`

**Step 1: Add deprecation notice**

Add comment at the top of the file:

```typescript
/**
 * @deprecated This component has been replaced by the usePostViewTracking hook
 * from src/lib/view-tracking.ts for better session-based deduplication.
 *
 * This file is kept for backwards compatibility and can be removed in a future cleanup.
 *
 * Migration: Replace `<PostViewTracker slug={slug} />` with `usePostViewTracking(slug)` hook.
 */
```

**Step 2: Commit**

```bash
git add src/components/post-view-tracker.tsx
git commit -m "docs: deprecate PostViewTracker in favor of new hook"
```

---

## Task 7: Run Full Test Suite

**Files:**
- N/A (Testing)

**Step 1: Run all tests**

```bash
pnpm test
```

Expected: All tests pass (14 existing + 7 new = 21 total)

**Step 2: If tests fail**

Debug and fix any failures before proceeding.

**Step 3: Commit (if fixes were needed)**

```bash
git add [any-fixed-files]
git commit -m "fix: resolve test failures"
```

---

## Task 8: Build Verification

**Files:**
- N/A (Build)

**Step 1: Run production build**

```bash
pnpm build
```

Expected: Build succeeds with no errors

**Step 2: Start production server**

```bash
pnpm start
```

**Step 3: Manual test in production mode**

Test the same scenarios from Tasks 4 and 5 in production build.

**Step 4: Stop server**

Press Ctrl+C to stop production server.

---

## Task 9: Update Design Document

**Files:**
- Modify: `docs/plans/2025-11-19-modal-view-tracking-design.md`

**Step 1: Add implementation completion section**

Add at the end of the design doc:

```markdown
## Implementation Complete

**Date:** 2025-11-19

**Changes Made:**
- ✅ Created `src/lib/view-tracking.ts` with utility and hook
- ✅ Added comprehensive unit tests (7 new tests)
- ✅ Integrated tracking into blog modal (handlePostClick)
- ✅ Integrated tracking into blog detail page (usePostViewTracking hook)
- ✅ Deprecated old PostViewTracker component
- ✅ All tests passing (21/21)
- ✅ Production build successful

**Files Modified:**
- `src/lib/view-tracking.ts` (new)
- `tests/view-tracking.test.ts` (new)
- `src/components/blog.tsx` (added trackPostView call)
- `src/app/blog/[slug]/page.tsx` (replaced PostViewTracker with hook)
- `src/components/post-view-tracker.tsx` (added deprecation comment)

**Testing:**
- ✅ Unit tests: 21/21 passing
- ✅ Manual testing: Modal and page tracking verified
- ✅ Cross-navigation: No duplicate tracking
- ✅ Production build: Success

**Verification:**
- sessionStorage properly tracks viewed posts
- No duplicate API calls for same post
- Works across modal and full page contexts
- Graceful error handling for edge cases
```

**Step 2: Commit**

```bash
git add docs/plans/2025-11-19-modal-view-tracking-design.md
git commit -m "docs: mark implementation as complete"
```

---

## Completion Checklist

Before marking this plan as complete, verify:

- [ ] All 9 tasks completed
- [ ] All tests passing (21/21)
- [ ] Production build succeeds
- [ ] Manual testing completed for all scenarios
- [ ] Modal tracking works (first view only)
- [ ] Full page tracking works (first view only)
- [ ] Cross-navigation prevents duplicates
- [ ] sessionStorage contains viewed posts
- [ ] No console errors
- [ ] Design document updated
- [ ] All commits use conventional commit format

## Common Issues

**Issue: Tests fail with "window is not defined"**
- Solution: Tests mock sessionStorage correctly in beforeEach

**Issue: fetch is not defined in tests**
- Solution: Tests mock fetch in beforeEach

**Issue: API returns 400 Bad Request**
- Solution: Check slug validation in API route, ensure slug is valid

**Issue: sessionStorage quota exceeded**
- Solution: Unlikely with small slug arrays, but catch block handles gracefully

**Issue: Duplicate tracking still happening**
- Solution: Check that sessionStorage key matches between utility and tests
