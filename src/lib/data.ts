import { reportError } from "./logger";
import { supabase } from "./supabase";
import {
  Mentor,
  Mentee,
  PaginatedResult,
  PaginationOptions,
  Product,
} from "./types";

const MAX_LIMIT = 100;

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  long_description,
  tech_stack,
  features,
  github_url,
  demo_url,
  image,
  created_at
`;

const MENTOR_COLUMNS = `
  id,
  name,
  avatar,
  role,
  expertise,
  bio,
  github_url,
  created_at
`;

const MENTEE_COLUMNS = `
  id,
  name,
  avatar,
  goals,
  progress,
  github_url,
  created_at
`;

const clampPagination = (limit: number, offset: number) => {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const safeOffset = Math.max(offset, 0);

  return {
    limit: safeLimit,
    offset: safeOffset,
    rangeEnd: safeOffset + safeLimit - 1,
  };
};

async function getPaginatedData<T>(
  tableName: string,
  columns: string,
  mapper: (row: any) => T,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const {
    limit: safeLimit,
    offset: safeOffset,
    rangeEnd,
  } = clampPagination(options.limit ?? 12, options.offset ?? 0);

  try {
    const { data, error, count } = await supabase
      .from(tableName as any)
      .select(columns, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(safeOffset, rangeEnd);

    if (error) {
      throw error;
    }

    const items = data?.map(mapper) || [];
    const total = count ?? items.length;

    return {
      items,
      total,
      limit: safeLimit,
      offset: safeOffset,
      hasMore: safeOffset + items.length < total,
    };
  } catch (error) {
    reportError(`Error fetching ${tableName}`, error);
    return {
      items: [],
      total: 0,
      limit: safeLimit,
      offset: safeOffset,
      hasMore: false,
    };
  }
}

/**
 * Fetches products with pagination support.
 *
 * @param limit - Maximum number of records to return (default 50).
 * @param offset - Offset for pagination (default 0).
 * @returns A slice of the product catalog.
 */
export async function getAllProducts(
  limit = 50,
  offset = 0,
): Promise<Product[]> {
  const { offset: safeOffset, rangeEnd } = clampPagination(limit, offset);

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("created_at", { ascending: false })
      .range(safeOffset, rangeEnd);

    if (error) {
      throw error;
    }

    return (
      data?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        longDescription: product.long_description,
        techStack: product.tech_stack || [],
        features: product.features || [],
        githubUrl: product.github_url ?? undefined,
        demoUrl: product.demo_url ?? undefined,
        image: product.image || "",
      })) || []
    );
  } catch (error) {
    reportError("Error fetching products", error);
    return [];
  }
}

/**
 * Fetches a paginated list of mentors with metadata.
 *
 * @param options - Pagination configuration.
 * @returns Paginated mentors plus pagination metadata.
 */
export async function getAllMentors(
  options: PaginationOptions = {},
): Promise<PaginatedResult<Mentor>> {
  return getPaginatedData(
    "mentors",
    MENTOR_COLUMNS,
    (mentor) => ({
      id: mentor.id,
      name: mentor.name,
      avatar: mentor.avatar,
      role: mentor.role,
      expertise: mentor.expertise || [],
      bio: mentor.bio,
      githubUrl: mentor.github_url ?? undefined,
    }),
    options
  );
}

/**
 * Fetches a paginated list of mentees with metadata.
 *
 * @param options - Pagination configuration.
 * @returns Paginated mentees plus pagination metadata.
 */
export async function getAllMentees(
  options: PaginationOptions = {},
): Promise<PaginatedResult<Mentee>> {
  return getPaginatedData(
    "mentees",
    MENTEE_COLUMNS,
    (mentee) => ({
      id: mentee.id,
      name: mentee.name,
      avatar: mentee.avatar,
      goals: mentee.goals,
      progress: mentee.progress,
      githubUrl: mentee.github_url ?? undefined,
    }),
    options
  );
}
