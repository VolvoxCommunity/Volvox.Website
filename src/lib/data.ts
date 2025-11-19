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
export async function getAllProducts(
  _limit = 50,
  _offset = 0,
) {
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
