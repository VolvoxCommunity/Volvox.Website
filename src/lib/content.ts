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
