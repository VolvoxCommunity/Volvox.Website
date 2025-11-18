import { getAllPosts } from "@/lib/blog";
import { products } from "@/data/products";
import { HomepageClient } from "@/components/homepage-client";

export default async function HomePage() {
  const blogPosts = await getAllPosts();

  return <HomepageClient blogPosts={blogPosts} products={products} />;
}
