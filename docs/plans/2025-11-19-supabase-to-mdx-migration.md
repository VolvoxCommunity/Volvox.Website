# Supabase to MDX/JSON Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate from Supabase database to local MDX files for blog posts and JSON files for other content (products, mentors, mentees, authors).

**Architecture:** Replace all Supabase queries with filesystem reads. Blog posts stored as MDX files with frontmatter. Other content stored as JSON arrays. Add Zod runtime validation. Remove view tracking entirely.

**Tech Stack:** Node.js `fs`, `gray-matter`, `zod`, `next-mdx-remote/rsc`

---

## Task 1: Export Existing Supabase Data

**Files:**

- Create: `scripts/export-supabase-data.ts`
- Create: `.env.local.backup` (backup current env vars)

**Step 1: Create export script**

Create `scripts/export-supabase-data.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportAuthors() {
  const { data, error } = await supabase.from("authors").select("*");

  if (error) throw error;

  fs.mkdirSync("content", { recursive: true });
  fs.writeFileSync("content/authors.json", JSON.stringify(data, null, 2));

  console.log(`✅ Exported ${data?.length} authors`);
}

async function exportBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:authors (
        id,
        name,
        role,
        avatar
      )
    `
    )
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) throw error;

  fs.mkdirSync("content/blog", { recursive: true });

  for (const post of data || []) {
    const frontmatter = [
      "---",
      `title: "${post.title}"`,
      `slug: "${post.slug}"`,
      `excerpt: "${post.excerpt}"`,
      `authorId: "${post.author?.id || ""}"`,
      `date: "${post.date}"`,
      `tags: [${post.tags?.map((t: string) => `"${t}"`).join(", ") || ""}]`,
      `published: ${post.published}`,
      "---",
      "",
    ].join("\n");

    const content = frontmatter + (post.content || "");

    fs.writeFileSync(`content/blog/${post.slug}.mdx`, content);
  }

  console.log(`✅ Exported ${data?.length} blog posts`);
}

async function exportProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const products = data?.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    longDescription: p.long_description,
    techStack: p.tech_stack || [],
    features: p.features || [],
    githubUrl: p.github_url || undefined,
    demoUrl: p.demo_url || undefined,
    image: p.image || "",
  }));

  fs.writeFileSync("content/products.json", JSON.stringify(products, null, 2));

  console.log(`✅ Exported ${products?.length} products`);
}

async function exportMentors() {
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const mentors = data?.map((m) => ({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    role: m.role,
    expertise: m.expertise || [],
    bio: m.bio,
    githubUrl: m.github_url || undefined,
  }));

  fs.writeFileSync("content/mentors.json", JSON.stringify(mentors, null, 2));

  console.log(`✅ Exported ${mentors?.length} mentors`);
}

async function exportMentees() {
  const { data, error } = await supabase
    .from("mentees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const mentees = data?.map((m) => ({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    goals: m.goals,
    progress: m.progress,
    githubUrl: m.github_url || undefined,
  }));

  fs.writeFileSync("content/mentees.json", JSON.stringify(mentees, null, 2));

  console.log(`✅ Exported ${mentees?.length} mentees`);
}

async function main() {
  console.log("🚀 Starting Supabase export...\n");

  await exportAuthors();
  await exportBlogPosts();
  await exportProducts();
  await exportMentors();
  await exportMentees();

  console.log("\n✨ Export complete! Check the content/ directory.");
}

main().catch(console.error);
```

**Step 2: Backup environment variables**

Run: `cp .env.local .env.local.backup`
Expected: Creates backup file

**Step 3: Run export script**

Run: `npx tsx scripts/export-supabase-data.ts`
Expected: Creates `content/` directory with all exported data

**Step 4: Verify exported data**

Run: `ls -R content/`
Expected: Shows `authors.json`, `products.json`, `mentors.json`, `mentees.json`, and `blog/*.mdx` files

**Step 5: Commit exported data**

```bash
git add content/ scripts/export-supabase-data.ts .env.local.backup
git commit -m "feat: export Supabase data to local files"
```

---

## Task 2: Install Dependencies and Add Validation Schemas

**Files:**

- Modify: `package.json`
- Create: `src/lib/schemas.ts`

**Step 1: Install gray-matter and zod**

Run: `pnpm add gray-matter zod`
Expected: Dependencies added to package.json

**Step 2: Create Zod validation schemas**

Create `src/lib/schemas.ts`:

```typescript
import { z } from "zod";

/**
 * Author schema matching the Author interface
 */
export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
});

/**
 * Blog post frontmatter schema
 */
export const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  authorId: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  published: z.boolean(),
});

/**
 * Product schema matching the Product interface
 */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  longDescription: z.string(),
  techStack: z.array(z.string()),
  features: z.array(z.string()),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  image: z.string(),
});

/**
 * Mentor schema matching the Mentor interface
 */
export const MentorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  role: z.string(),
  expertise: z.array(z.string()),
  bio: z.string(),
  githubUrl: z.string().optional(),
});

/**
 * Mentee schema matching the Mentee interface
 */
export const MenteeSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  goals: z.string(),
  progress: z.string(),
  githubUrl: z.string().optional(),
});

/**
 * Helper to validate and parse authors array
 */
export const AuthorsArraySchema = z.array(AuthorSchema);

/**
 * Helper to validate and parse products array
 */
export const ProductsArraySchema = z.array(ProductSchema);

/**
 * Helper to validate and parse mentors array
 */
export const MentorsArraySchema = z.array(MentorSchema);

/**
 * Helper to validate and parse mentees array
 */
export const MenteesArraySchema = z.array(MenteeSchema);
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 4: Commit schemas**

```bash
git add package.json pnpm-lock.yaml src/lib/schemas.ts
git commit -m "feat: add Zod validation schemas for content"
```

---

## Task 3: Create Content Reading Utilities

**Files:**

- Create: `src/lib/content.ts`

**Step 1: Create content.ts with JSON readers**

Create `src/lib/content.ts`:

```typescript
import * as fs from "fs";
import * as path from "path";
import { reportError } from "./logger";
import {
  AuthorsArraySchema,
  ProductsArraySchema,
  MentorsArraySchema,
  MenteesArraySchema,
} from "./schemas";
import type { Author, Product, Mentor, Mentee } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Reads and validates authors from JSON file
 */
export function getAllAuthors(): Author[] {
  try {
    const filePath = path.join(CONTENT_DIR, "authors.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContents);

    // Validate with Zod
    const authors = AuthorsArraySchema.parse(json);
    return authors;
  } catch (error) {
    reportError("Failed to read authors.json", error);
    return [];
  }
}

/**
 * Gets a single author by ID
 */
export function getAuthorById(id: string): Author | null {
  const authors = getAllAuthors();
  return authors.find((a) => a.id === id) || null;
}

/**
 * Reads and validates products from JSON file
 */
export function getAllProducts(): Product[] {
  try {
    const filePath = path.join(CONTENT_DIR, "products.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContents);

    // Validate with Zod
    const products = ProductsArraySchema.parse(json);
    return products;
  } catch (error) {
    reportError("Failed to read products.json", error);
    return [];
  }
}

/**
 * Reads and validates mentors from JSON file
 */
export function getAllMentors(): Mentor[] {
  try {
    const filePath = path.join(CONTENT_DIR, "mentors.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContents);

    // Validate with Zod
    const mentors = MentorsArraySchema.parse(json);
    return mentors;
  } catch (error) {
    reportError("Failed to read mentors.json", error);
    return [];
  }
}

/**
 * Reads and validates mentees from JSON file
 */
export function getAllMentees(): Mentee[] {
  try {
    const filePath = path.join(CONTENT_DIR, "mentees.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContents);

    // Validate with Zod
    const mentees = MenteesArraySchema.parse(json);
    return mentees;
  } catch (error) {
    reportError("Failed to read mentees.json", error);
    return [];
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 3: Commit content utilities**

```bash
git add src/lib/content.ts
git commit -m "feat: add content reading utilities for JSON files"
```

---

## Task 4: Refactor Blog Utilities to Read MDX

**Files:**

- Modify: `src/lib/blog.ts`

**Step 1: Replace blog.ts with filesystem implementation**

Replace entire contents of `src/lib/blog.ts`:

```typescript
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { reportError } from "./logger";
import { BlogPostFrontmatterSchema } from "./schemas";
import { getAuthorById } from "./content";
import type { BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Fetches all published blog posts ordered by date (newest first).
 *
 * @returns A list of published `BlogPost` objects.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Read all MDX files from content/blog
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    const posts: BlogPost[] = [];

    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter
      const { data, content } = matter(fileContents);

      // Validate frontmatter with Zod
      const frontmatter = BlogPostFrontmatterSchema.parse(data);

      // Only include published posts
      if (!frontmatter.published) {
        continue;
      }

      // Get author details
      const author = getAuthorById(frontmatter.authorId);

      posts.push({
        id: frontmatter.slug, // Use slug as ID
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
        slug: frontmatter.slug,
        views: 0, // No longer tracking views
        published: frontmatter.published,
      });
    }

    // Sort by date (newest first)
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return posts;
  } catch (error) {
    reportError("Failed to fetch blog posts", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = BlogPostFrontmatterSchema.parse(data);

    // Get author details
    const author = getAuthorById(frontmatter.authorId);

    return {
      frontmatter: {
        id: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        author,
        date: frontmatter.date,
        tags: frontmatter.tags,
      },
      content,
      slug: frontmatter.slug,
      views: 0, // No longer tracking views
    };
  } catch (error) {
    reportError(`Failed to fetch post: ${slug}`, error);
    throw new Error(`Post not found: ${slug}`);
  }
}

/**
 * Retrieves all published blog slugs.
 *
 * @returns Array of slug strings.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    const slugs: string[] = [];

    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Validate frontmatter
      const frontmatter = BlogPostFrontmatterSchema.parse(data);

      // Only include published posts
      if (frontmatter.published) {
        slugs.push(frontmatter.slug);
      }
    }

    return slugs;
  } catch (error) {
    reportError("Error fetching post slugs", error);
    return [];
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 3: Commit refactored blog utilities**

```bash
git add src/lib/blog.ts
git commit -m "refactor: replace Supabase queries with filesystem reads for blog"
```

---

## Task 5: Update Types and Remove Database Types

**Files:**

- Modify: `src/lib/types.ts`
- Delete: `src/lib/database.types.ts`

**Step 1: Update types.ts to remove Supabase references**

In `src/lib/types.ts`, update the comments to remove Supabase references:

```typescript
/**
 * Represents an author record.
 */
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

/**
 * Describes the blog post data shape consumed by the UI.
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author | null;
  date: string;
  tags: string[];
  slug: string;
  views: number; // Deprecated - always 0
  published: boolean;
}

/**
 * Defines the product card content showcased on the homepage.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  image: string;
}

/**
 * Captures mentor profile information.
 */
export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  expertise: string[];
  bio: string;
  githubUrl?: string;
}

/**
 * Captures mentee profile information.
 */
export interface Mentee {
  id: string;
  name: string;
  avatar: string;
  goals: string;
  progress: string;
  githubUrl?: string;
}
```

**Step 2: Delete database.types.ts**

Run: `rm src/lib/database.types.ts`
Expected: File removed

**Step 3: Remove PaginationOptions and PaginatedResult (no longer needed)**

Remove these interfaces from `src/lib/types.ts`:

- `PaginationOptions`
- `PaginatedResult<T>`

**Step 4: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 5: Commit type updates**

```bash
git add src/lib/types.ts
git add src/lib/database.types.ts
git commit -m "refactor: update types and remove database types"
```

---

## Task 6: Replace Data Fetching in src/lib/data.ts

**Files:**

- Modify: `src/lib/data.ts`

**Step 1: Replace data.ts with content.ts imports**

Replace entire contents of `src/lib/data.ts`:

```typescript
import {
  getAllProducts as getProducts,
  getAllMentors as getMentors,
  getAllMentees as getMentees,
} from "./content";

/**
 * Fetches all products.
 *
 * @deprecated limit and offset parameters are ignored (no pagination needed)
 * @returns All products from the JSON file.
 */
export async function getAllProducts(_limit = 50, _offset = 0) {
  return getProducts();
}

/**
 * Fetches all mentors.
 *
 * @returns All mentors from the JSON file.
 */
export async function getAllMentors() {
  return {
    items: getMentors(),
    total: getMentors().length,
    limit: getMentors().length,
    offset: 0,
    hasMore: false,
  };
}

/**
 * Fetches all mentees.
 *
 * @returns All mentees from the JSON file.
 */
export async function getAllMentees() {
  return {
    items: getMentees(),
    total: getMentees().length,
    limit: getMentees().length,
    offset: 0,
    hasMore: false,
  };
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 3: Commit data.ts updates**

```bash
git add src/lib/data.ts
git commit -m "refactor: replace Supabase data fetching with JSON file reads"
```

---

## Task 7: Remove View Tracking Components and Utilities

**Files:**

- Delete: `src/components/post-view-tracker.tsx`
- Delete: `src/lib/view-tracking.ts`
- Delete: `tests/view-tracking.test.ts`
- Delete: `src/app/api/blog/views/route.ts`
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Delete view tracking files**

Run:

```bash
rm src/components/post-view-tracker.tsx
rm src/lib/view-tracking.ts
rm tests/view-tracking.test.ts
rm -rf src/app/api/blog
```

Expected: Files removed

**Step 2: Remove PostViewTracker from blog post page**

In `src/app/blog/[slug]/page.tsx`, find and remove the import and usage of `PostViewTracker`.

Remove this import:

```typescript
import { PostViewTracker } from "@/components/post-view-tracker";
```

Remove this component usage (usually near the bottom of the component):

```typescript
<PostViewTracker slug={slug} />
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 4: Commit view tracking removal**

```bash
git add -A
git commit -m "refactor: remove view tracking functionality"
```

---

## Task 8: Remove Supabase Dependencies

**Files:**

- Delete: `src/lib/supabase.ts`
- Modify: `package.json`
- Delete: `.env.local` (Supabase env vars)
- Modify: `CLAUDE.md`

**Step 1: Delete supabase.ts**

Run: `rm src/lib/supabase.ts`
Expected: File removed

**Step 2: Uninstall Supabase package**

Run: `pnpm remove @supabase/supabase-js`
Expected: Package removed from package.json

**Step 3: Remove Supabase environment variables**

Edit `.env.local` and remove these lines:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Or delete the entire file if it only contains Supabase vars:

```bash
rm .env.local
```

**Step 4: Update CLAUDE.md to remove Supabase references**

In `CLAUDE.md`, find and update these sections:

Replace:

```markdown
### Content Management

- **Database**: All content stored in Supabase PostgreSQL database
```

With:

```markdown
### Content Management

- **Local Files**: All content stored as local MDX and JSON files in `content/` directory
```

Remove the entire "Database Schema" section.

Remove from "Environment Variables" section:

```markdown
Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public API key
```

Add new section:

```markdown
### Content Structure
```

/content
/blog/\*.mdx - Blog posts with frontmatter
authors.json - Author profiles
products.json - Product information
mentors.json - Mentor profiles
mentees.json - Mentee profiles

```

```

**Step 5: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 6: Commit Supabase removal**

```bash
git add -A
git commit -m "refactor: remove Supabase dependency completely"
```

---

## Task 9: Update Homepage Data Fetching

**Files:**

- Modify: `src/app/page.tsx`

**Step 1: Replace Supabase imports with filesystem imports**

In `src/app/page.tsx`, replace:

```typescript
import { getAllPosts } from "@/lib/blog";
import { getAllProducts, getAllMentors, getAllMentees } from "@/lib/data";
```

With:

```typescript
import { getAllPosts } from "@/lib/blog";
import { getAllProducts } from "@/lib/data";
import { getAllMentors, getAllMentees } from "@/lib/content";
```

**Step 2: Update data fetching to remove pagination**

Find the data fetching section in the page component and update:

Replace:

```typescript
const mentorsResult = await getAllMentors({ limit: 12 });
const menteesResult = await getAllMentees({ limit: 12 });
```

With:

```typescript
const mentors = getAllMentors();
const mentees = getAllMentees();
```

Update the Promise.allSettled to remove `.then()` for mentors/mentees:

```typescript
const [postsResult, productsResult, mentorsResult, menteesResult] =
  await Promise.allSettled([
    getAllPosts(),
    getAllProducts(),
    Promise.resolve(getAllMentors()),
    Promise.resolve(getAllMentees()),
  ]);
```

**Step 3: Update result handling**

Replace mentor/mentee result handling:

```typescript
const mentors =
  mentorsResult.status === "fulfilled" ? mentorsResult.value.items : [];
const mentees =
  menteesResult.status === "fulfilled" ? menteesResult.value.items : [];
```

With:

```typescript
const mentors = mentorsResult.status === "fulfilled" ? mentorsResult.value : [];
const mentees = menteesResult.status === "fulfilled" ? menteesResult.value : [];
```

**Step 4: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit`
Expected: No type errors

**Step 5: Commit homepage updates**

```bash
git add src/app/page.tsx
git commit -m "refactor: update homepage to use filesystem data"
```

---

## Task 10: Test the Migration

**Files:**

- Test all pages and features

**Step 1: Build the application**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 2: Start development server**

Run: `pnpm dev`
Expected: Server starts on http://localhost:3000

**Step 3: Test homepage**

Visit: `http://localhost:3000`
Expected: Homepage loads with all sections (hero, products, blog, mentorship, about)

**Step 4: Test blog list**

Verify: Blog section shows all posts with correct titles, excerpts, dates, and authors

**Step 5: Test blog post pages**

Visit: `http://localhost:3000/blog/[any-slug]`
Expected: Post page loads with correct content, author, and metadata

**Step 6: Test products section**

Verify: Products section shows all products with correct details

**Step 7: Test mentorship section**

Verify: Mentors and mentees sections show correct data

**Step 8: Document test results**

If all tests pass:

```bash
git add -A
git commit -m "test: verify migration works end-to-end"
```

If tests fail, note failures and fix before committing.

---

## Task 11: Clean Up and Final Documentation

**Files:**

- Modify: `README.md`
- Delete: `scripts/export-supabase-data.ts` (optional - can keep as reference)
- Delete: `.env.local.backup`

**Step 1: Update README.md**

Add section about content management:

````markdown
## Content Management

All content is stored as local files in the `content/` directory:

- **Blog posts**: `content/blog/*.mdx` - MDX files with frontmatter
- **Authors**: `content/authors.json` - JSON array of author objects
- **Products**: `content/products.json` - JSON array of product objects
- **Mentors**: `content/mentors.json` - JSON array of mentor objects
- **Mentees**: `content/mentees.json` - JSON array of mentee objects

### Adding a New Blog Post

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Post Title"
   slug: "post-slug"
   excerpt: "Brief description"
   authorId: "author-id-from-authors-json"
   date: "2024-01-15"
   tags: ["tag1", "tag2"]
   published: true
   ---
   ```
````

3. Write your content in MDX format below the frontmatter
4. Rebuild the site: `pnpm build`

### Editing Other Content

Edit the respective JSON files in `content/` and rebuild.

````

**Step 2: Delete backup files (optional)**

Run:
```bash
rm .env.local.backup
rm scripts/export-supabase-data.ts  # Optional - keep for reference
````

**Step 3: Run final build and tests**

Run:

```bash
pnpm build
pnpm test
```

Expected: All builds and tests pass

**Step 4: Final commit**

```bash
git add -A
git commit -m "docs: update README with local content management instructions"
```

---

## Migration Complete! 🎉

**Summary of Changes:**

- ✅ Exported all Supabase data to local files
- ✅ Created content validation with Zod
- ✅ Replaced all database queries with filesystem reads
- ✅ Removed view tracking feature
- ✅ Removed Supabase dependency completely
- ✅ Updated all imports and data flows
- ✅ Tested end-to-end functionality
- ✅ Updated documentation

**Next Steps:**

1. Delete the Supabase project (optional - wait a few days to ensure everything works)
2. Update deployment environment variables to remove Supabase vars
3. Consider adding a build-time content validator to catch errors early

**References:**

- @superpowers:verification-before-completion - Always verify the build before claiming completion
- @superpowers:test-driven-development - Consider adding tests for content reading utilities
