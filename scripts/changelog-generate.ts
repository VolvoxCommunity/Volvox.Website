#!/usr/bin/env tsx

/**
 * Generates a CHANGELOG.md draft entry from git commits.
 * Uses [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format
 * with [Semantic Versioning](https://semver.org/) level indicators.
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CHANGELOG_PATH = join(process.cwd(), "CHANGELOG.md");

// Keep a Changelog 1.1.0 categories: https://keepachangelog.com/en/1.1.0/
type ChangeCategory =
  | "Added"
  | "Changed"
  | "Deprecated"
  | "Removed"
  | "Fixed"
  | "Security";

interface Commit {
  sha: string;
  type: string;
  scope: string | null;
  description: string;
  breaking: boolean;
}

// Types to skip in changelog (not user-facing)
const SKIP_TYPES = ["docs", "test", "ci", "build", "chore", "revert"];

function getCommits(range: string): Commit[] {
  try {
    const output = execSync(`git log --format='%H|%s' ${range}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    return output
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => parseCommit(line));
  } catch (error) {
    console.error("Failed to get commits:", error);
    return [];
  }
}

function parseCommit(line: string): Commit {
  const [sha, subject] = line.split("|");
  const parsed = parseConventionalCommit(subject);

  return {
    sha: sha.slice(0, 7),
    type: parsed.type,
    scope: parsed.scope ?? null,
    description: parsed.description,
    breaking: parsed.breaking,
  };
}

function parseConventionalCommit(message: string): {
  type: string;
  scope: string | null;
  description: string;
  breaking: boolean;
} {
  const CONVENTIONAL_COMMIT_REGEX = /^(?:(\w+)(?:\(([^)]+)\))(!)?)?\s*(.+)$/;
  const match = message.match(CONVENTIONAL_COMMIT_REGEX);

  if (!match) {
    return {
      type: "chore",
      scope: null,
      description: message,
      breaking: false,
    };
  }

  return {
    type: match[1] || "chore",
    scope: match[2] || null,
    description: (match[4] || "").trim(),
    breaking: match[3] === "!",
  };
}

function formatCommit(commit: Commit): string {
  const scope = commit.scope ? `${commit.scope}: ` : "";
  let desc = commit.description;
  if (desc.endsWith(".")) desc = desc.slice(0, -1);
  const formattedDesc = desc.charAt(0).toUpperCase() + desc.slice(1);

  return `- **${scope}${formattedDesc}** (${commit.sha})`;
}

// Map commit types to KaC categories with SemVer level
function categorizeChange(
  type: string,
  breaking: boolean
): {
  category: ChangeCategory | null;
  semVer: "MAJOR" | "MINOR" | "PATCH" | null;
} {
  // Breaking changes always require MAJOR
  if (breaking) {
    return { category: "Changed", semVer: "MAJOR" };
  }

  switch (type) {
    case "feat":
    case "add":
    case "feature":
      return { category: "Added", semVer: "MINOR" };
    case "fix":
    case "bugfix":
      return { category: "Fixed", semVer: "PATCH" };
    case "refactor":
    case "perf":
    case "style":
      return { category: "Changed", semVer: "PATCH" };
    case "remove":
    case "delete":
      return { category: "Removed", semVer: "MAJOR" };
    case "deprecate":
      return { category: "Deprecated", semVer: "MINOR" };
    case "security":
      return { category: "Security", semVer: "PATCH" };
    default:
      return { category: null, semVer: null };
  }
}

function categorizeCommits(
  commits: Commit[]
): Map<
  ChangeCategory,
  { items: string[]; semVer: "MAJOR" | "MINOR" | "PATCH" }
> {
  const categorized = new Map<
    ChangeCategory,
    { items: string[]; semVer: "MAJOR" | "MINOR" | "PATCH" }
  >();

  // Initialize all categories
  categorized.set("Added", { items: [], semVer: "MINOR" });
  categorized.set("Changed", { items: [], semVer: "PATCH" });
  categorized.set("Deprecated", { items: [], semVer: "MINOR" });
  categorized.set("Removed", { items: [], semVer: "MAJOR" });
  categorized.set("Fixed", { items: [], semVer: "PATCH" });
  categorized.set("Security", { items: [], semVer: "PATCH" });

  for (const commit of commits) {
    if (SKIP_TYPES.includes(commit.type)) {
      continue;
    }

    const { category, semVer } = categorizeChange(commit.type, commit.breaking);

    if (!category || !semVer) {
      continue;
    }

    const existing = categorized.get(category);
    if (existing) {
      existing.items.push(formatCommit(commit));

      // Update Changed category SemVer if breaking change found
      if (category === "Changed" && semVer === "MAJOR") {
        categorized.set("Changed", { items: existing.items, semVer: "MAJOR" });
      }
    }
  }

  return categorized;
}

function findChangelogPath(): string {
  return CHANGELOG_PATH;
}

function updateChangelog(
  categorized: Map<
    ChangeCategory,
    { items: string[]; semVer: "MAJOR" | "MINOR" | "PATCH" }
  >
): void {
  const changelogPath = findChangelogPath();

  let content: string;

  try {
    content = readFileSync(changelogPath, "utf-8");
  } catch {
    content = `# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
`;
  }

  // Insert entries under each appropriate category
  let updatedContent = content;

  for (const [category, data] of categorized.entries()) {
    if (data.items.length > 0) {
      const categoryPattern = new RegExp(`(### ${category}\\n)`);
      const entries = data.items.join("\n") + "\n";
      updatedContent = updatedContent.replace(categoryPattern, `$1${entries}`);
    }
  }

  // Check if any changes were made
  const hasChanges = Array.from(categorized.values()).some(
    (c) => c.items.length > 0
  );

  if (!hasChanges) {
    console.log("No user-facing changes found. CHANGELOG.md not updated.");
    process.exit(0);
  }

  writeFileSync(changelogPath, updatedContent);

  // Determine highest SemVer level needed
  const semVerOrder = ["MAJOR", "MINOR", "PATCH"] as const;
  let highestSemVer: "MAJOR" | "MINOR" | "PATCH" = "PATCH";

  for (const [, data] of categorized.entries()) {
    if (data.items.length > 0) {
      const idx = semVerOrder.indexOf(data.semVer);
      const highestIdx = semVerOrder.indexOf(highestSemVer);
      if (idx < highestIdx) {
        highestSemVer = data.semVer;
      }
    }
  }

  console.log("");
  console.log("✅ CHANGELOG.md updated at:", changelogPath);
  console.log("");
  console.log(`📋 Recommended version bump: ${highestSemVer}`);
  console.log("─".repeat(60));

  for (const [category, data] of categorized.entries()) {
    if (data.items.length > 0) {
      console.log(`\n### ${category} [${data.semVer}]`);
      data.items.forEach((item) => console.log(item));
    }
  }

  console.log("");
  console.log("─".repeat(60));
  console.log("");
}

function main(): void {
  const range = process.argv[2];

  if (!range) {
    console.error("Usage: changelog-generate.ts <commit-range>");
    console.error("Example: changelog-generate.ts main..HEAD");
    process.exit(1);
  }

  const commits = getCommits(range);

  if (commits.length === 0) {
    console.log("No commits found in range:", range);
    process.exit(0);
  }

  console.log(`Found ${commits.length} commit(s) to process`);

  const categorized = categorizeCommits(commits);
  updateChangelog(categorized);

  process.exit(1);
}

main();
