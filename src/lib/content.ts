import * as fs from "fs";
import * as path from "path";
import { reportError } from "./logger";
import {
  AuthorsArraySchema,
  ProductsArraySchema,
  MentorsArraySchema,
  MenteesArraySchema,
  extendedProductSchema,
} from "./schemas";
import type { Author, Product, Mentor, Mentee, ExtendedProduct } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PRODUCTS_DIR = path.join(CONTENT_DIR, "products");

/**
 * Validates a slug to prevent path traversal attacks.
 * Only allows lowercase alphanumeric characters and hyphens.
 *
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

/**
 * Reads and validates authors from JSON file
 */
export function getAllAuthors(): Author[] {
  try {
    const filePath = path.join(CONTENT_DIR, "authors.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const json: unknown = JSON.parse(fileContents);

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
    const json: unknown = JSON.parse(fileContents);

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
    const json: unknown = JSON.parse(fileContents);

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
    const json: unknown = JSON.parse(fileContents);

    // Validate with Zod
    const mentees = MenteesArraySchema.parse(json);
    return mentees;
  } catch (error) {
    reportError("Failed to read mentees.json", error);
    return [];
  }
}

/**
 * Retrieves all extended products from the folder-based content structure.
 * Each product folder should contain an index.json file.
 *
 * @returns Array of validated ExtendedProduct objects
 */
export function getAllExtendedProducts(): ExtendedProduct[] {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return [];
    }

    const productFolders = fs.readdirSync(PRODUCTS_DIR, {
      withFileTypes: true,
    });
    const products: ExtendedProduct[] = [];

    for (const folder of productFolders) {
      if (!folder.isDirectory()) continue;

      const indexPath = path.join(PRODUCTS_DIR, folder.name, "index.json");
      if (!fs.existsSync(indexPath)) continue;

      try {
        const content = fs.readFileSync(indexPath, "utf-8");
        const data: unknown = JSON.parse(content);
        const validated = extendedProductSchema.parse(data);
        products.push(validated);
      } catch (err) {
        reportError(`Failed to load product: ${folder.name}`, err);
      }
    }

    return products;
  } catch (err) {
    reportError("Failed to read products directory", err);
    return [];
  }
}

/**
 * Retrieves a single extended product by its slug.
 *
 * @param slug - The product slug (folder name)
 * @returns The validated ExtendedProduct or null if not found
 */
export function getExtendedProductBySlug(slug: string): ExtendedProduct | null {
  // Validate slug to prevent path traversal attacks
  if (!isValidSlug(slug)) {
    return null;
  }

  try {
    const indexPath = path.join(PRODUCTS_DIR, slug, "index.json");
    if (!fs.existsSync(indexPath)) {
      return null;
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    const data: unknown = JSON.parse(content);
    return extendedProductSchema.parse(data);
  } catch (err) {
    reportError(`Failed to load product: ${slug}`, err);
    return null;
  }
}

/**
 * Retrieves the changelog MDX content for a product.
 *
 * @param slug - The product slug (folder name)
 * @returns The raw MDX content or null if not found
 */
export function getProductChangelog(slug: string): string | null {
  // Validate slug to prevent path traversal attacks
  if (!isValidSlug(slug)) {
    return null;
  }

  try {
    const changelogPath = path.join(PRODUCTS_DIR, slug, "changelog.mdx");
    if (!fs.existsSync(changelogPath)) {
      return null;
    }

    return fs.readFileSync(changelogPath, "utf-8");
  } catch (err) {
    reportError(`Failed to load changelog for: ${slug}`, err);
    return null;
  }
}
