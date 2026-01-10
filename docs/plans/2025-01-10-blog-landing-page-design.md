# Blog Landing Page Design

**Date:** 2025-01-10
**Status:** Approved

## Overview

Create a dedicated blog landing page at `/blog` with search, tag filtering, sorting, and switchable grid/list layouts. The homepage blog section remains unchanged.

## Design Decisions

| Decision       | Choice                          | Rationale                         |
| -------------- | ------------------------------- | --------------------------------- |
| Page strategy  | Both homepage section + `/blog` | Best of both worlds               |
| Feature level  | Full-featured                   | Search, tags, sort, layout toggle |
| Layout options | Switchable grid/list            | User preference                   |
| Filtering      | Hybrid (URL + client-side)      | Fast AND shareable                |
| Pagination     | Deferred (YAGNI)                | Only 3 posts currently            |
| Sort options   | Date + Views                    | Newest, oldest, most viewed       |

## Architecture

### Route Structure

```
/blog                    → Dedicated landing page with full filtering
/#blog (homepage)        → Unchanged, links to /blog
/blog/[slug]            → Individual post pages (unchanged)
```

### Component Hierarchy

```
src/app/blog/page.tsx (Server Component)
└── Fetches posts via getAllPosts()
└── Passes data to BlogListClient

src/components/blog-list-client.tsx (Client Component)
├── BlogListControls (search, filters, sort, layout toggle)
├── Grid View (existing card style)
└── List View (horizontal card variant)
```

## URL Parameters

```
/blog?q=react&tags=TypeScript,Next.js&sort=views&view=list
```

| Param  | Values                      | Default  |
| ------ | --------------------------- | -------- |
| `q`    | search string               | (empty)  |
| `tags` | comma-separated             | (all)    |
| `sort` | `newest`, `oldest`, `views` | `newest` |
| `view` | `grid`, `list`              | `grid`   |

## Data Flow

### Filtering Pipeline

```typescript
posts
  .filter((post) => matchesSearch(post, query)) // title, excerpt, tags
  .filter((post) => matchesTags(post, selectedTags)) // OR logic
  .sort(sortFn); // by date or views
```

### Search Behavior

- Searches: title, excerpt, tags
- Case-insensitive matching
- Debounced input (300ms)

### Tag Filtering

- "All" selected by default
- Multiple tags = OR logic (post matches if it has ANY selected tag)
- Tags extracted dynamically from posts

### URL Sync

- Shallow routing via `router.replace(url, { scroll: false })`
- Back/forward navigation works
- Shareable URLs restore filter state

## UI Layout

### Controls Bar

```
┌─────────────────────────────────────────────────────┐
│ [Search...]                                         │
├─────────────────────────────────────────────────────┤
│ Tags: [All] [React] [TypeScript] [+3 more]          │
│                        Sort: [Newest ▼]  [⊞] [☰]   │
└─────────────────────────────────────────────────────┘
```

### Grid View (Default)

- 3 columns desktop, 2 tablet, 1 mobile
- Same card design as homepage blog section
- Aspect-ratio banner, author avatar, tags, date, views

### List View

- Horizontal card layout
- Thumbnail left (~200px), content right
- Full excerpt visible
- Better for scanning

### Responsive Behavior

- Mobile: Search full-width, tags scrollable, layout toggle hidden (always grid)
- Desktop: All controls in single row

### Empty States

- No matches: "No posts found. Try adjusting your search or filters." + Clear button
- No posts: "No blog posts yet. Check back soon!"

## Files to Create

| File                                    | Purpose                              |
| --------------------------------------- | ------------------------------------ |
| `src/app/blog/page.tsx`                 | Server component, data fetching      |
| `src/components/blog-list-client.tsx`   | Client component, state/filtering    |
| `src/components/blog-list-controls.tsx` | Search, filters, sort, layout toggle |
| `src/components/blog-card-list.tsx`     | Horizontal list-view card            |

## Files to Modify

| File                      | Change                              |
| ------------------------- | ----------------------------------- |
| `src/components/blog.tsx` | Extract shared card logic if needed |

## No Changes Needed

- Homepage blog section (existing behavior preserved)
- Individual blog post pages (`/blog/[slug]`)
- Navigation structure

## Testing Requirements

- Unit tests for filter/sort logic
- E2E tests for URL param persistence
- Accessibility: keyboard navigation, ARIA labels

## Implementation Notes

- Follow existing patterns from products page
- Reuse Card, Badge, Button components
- Use Framer Motion for animations (match homepage style)
- Save layout preference to localStorage (`volvox-blog-view`)
