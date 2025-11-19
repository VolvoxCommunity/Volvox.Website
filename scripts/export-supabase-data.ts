import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

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
  fs.writeFileSync(
    "content/authors.json",
    JSON.stringify(data, null, 2)
  );

  console.log(`✅ Exported ${data?.length} authors`);
}

async function exportBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:authors (
        id,
        name,
        role,
        avatar
      )
    `)
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
      `authorId: "${post.author?.id || ''}"`,
      `date: "${post.date}"`,
      `tags: [${post.tags?.map((t: string) => `"${t}"`).join(", ") || ""}]`,
      `published: ${post.published}`,
      "---",
      "",
    ].join("\n");

    const content = frontmatter + (post.content || "");

    fs.writeFileSync(
      `content/blog/${post.slug}.mdx`,
      content
    );
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

  fs.writeFileSync(
    "content/products.json",
    JSON.stringify(products, null, 2)
  );

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

  fs.writeFileSync(
    "content/mentors.json",
    JSON.stringify(mentors, null, 2)
  );

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

  fs.writeFileSync(
    "content/mentees.json",
    JSON.stringify(mentees, null, 2)
  );

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
