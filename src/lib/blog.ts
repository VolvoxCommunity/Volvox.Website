import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "./types";

const postsDirectory = path.join(process.cwd(), "content/blog");

export async function getAllPosts(): Promise<BlogPost[]> {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id: data.id || slug,
        title: data.title,
        excerpt: data.excerpt,
        content,
        author: data.author,
        date: data.date,
        tags: data.tags || [],
        readTime: data.readTime,
        slug,
      } as BlogPost;
    });

  // Sort by date, newest first
  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
    slug,
  };
}

export async function getPostSlugs(): Promise<string[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}
