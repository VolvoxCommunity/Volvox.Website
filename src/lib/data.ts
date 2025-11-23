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
  await Promise.resolve();
  void _limit;
  void _offset;
  return getProducts();
}

/**
 * Fetches all mentors.
 *
 * @returns All mentors from the JSON file.
 */
export async function getAllMentors() {
  await Promise.resolve();
  const mentors = getMentors();
  return {
    items: mentors,
    total: mentors.length,
    limit: mentors.length,
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
  await Promise.resolve();
  const mentees = getMentees();
  return {
    items: mentees,
    total: mentees.length,
    limit: mentees.length,
    offset: 0,
    hasMore: false,
  };
}
