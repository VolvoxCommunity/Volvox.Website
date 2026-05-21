export type BlogPublishableFrontmatter = {
  date: string;
  published: boolean;
};

type PublishDate = {
  isDateOnly: boolean;
  timestamp: number;
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T/;
const TIMEZONE_SUFFIX_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/;

export class InvalidBlogPublishDateError extends Error {
  constructor(date: string) {
    super(
      `Invalid blog publish date: "${date}". Use YYYY-MM-DD or an ISO datetime with Z or an explicit timezone offset.`,
    );
    this.name = "InvalidBlogPublishDateError";
  }
}

function parseDateOnly(trimmedDate: string): PublishDate | null {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(trimmedDate);
  if (!dateOnlyMatch) {
    return null;
  }

  const [, yearValue, monthValue, dayValue] = dateOnlyMatch;
  if (!yearValue || !monthValue || !dayValue) {
    return null;
  }

  const year = Number.parseInt(yearValue, 10);
  const month = Number.parseInt(monthValue, 10);
  const day = Number.parseInt(dayValue, 10);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsedDate = new Date(timestamp);
  const isValidDate =
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day;

  return isValidDate ? { isDateOnly: true, timestamp } : null;
}

export function parseBlogPublishDate(date: string): PublishDate {
  const trimmedDate = date.trim();
  const dateOnly = parseDateOnly(trimmedDate);
  if (dateOnly) {
    return dateOnly;
  }

  if (
    !DATE_TIME_PATTERN.test(trimmedDate) ||
    !TIMEZONE_SUFFIX_PATTERN.test(trimmedDate)
  ) {
    throw new InvalidBlogPublishDateError(date);
  }

  const timestamp = Date.parse(trimmedDate);
  if (!Number.isFinite(timestamp)) {
    throw new InvalidBlogPublishDateError(date);
  }

  return { isDateOnly: false, timestamp };
}

export function isValidBlogPublishDate(date: string): boolean {
  try {
    parseBlogPublishDate(date);
    return true;
  } catch {
    return false;
  }
}

function getCurrentPublishTimestamp(now: Date, isDateOnly: boolean): number {
  if (!isDateOnly) {
    return now.getTime();
  }

  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

export function isBlogPostPublishable(
  frontmatter: BlogPublishableFrontmatter,
  now = new Date(),
): boolean {
  if (!frontmatter.published) {
    return false;
  }

  const publishDate = parseBlogPublishDate(frontmatter.date);

  return (
    publishDate.timestamp <=
    getCurrentPublishTimestamp(now, publishDate.isDateOnly)
  );
}
