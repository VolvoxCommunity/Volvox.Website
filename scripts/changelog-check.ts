#!/usr/bin/env tsx

/**
 * Pre-commit hook that checks if CHANGELOG.md needs updating.
 * Generates a draft if user-facing changes are detected and CHANGELOG isn't staged.
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

  // Map conventional commit types to KaC categories
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
      // Skip docs, test, ci, build, chore, revert
      return { category: null, semVer: null };
  }
}

function getStagedFiles(): string[] {
  try {
    const output = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
    });
    return output.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function isChangelogStaged(): boolean {
  const stagedFiles = getStagedFiles();
  return stagedFiles.some((f) => f === "CHANGELOG.md");
}

function hasUserFacingChanges(): boolean {
  const stagedFiles = getStagedFiles();

  const userFacingPatterns = [
    /^src\//,
    /^content\//,
    /^public\//,
    /^scripts\//,
    /^package\.json$/,
  ];

  const skipPatterns = [/\.test\./, /\.spec\./, /\.snap$/, /__snapshots__/];

  for (const file of stagedFiles) {
    if (file.includes("CHANGELOG")) continue;

    const isUserFacing = userFacingPatterns.some((p) => p.test(file));
    const shouldSkip = skipPatterns.some((p) => p.test(file));

    if (isUserFacing && !shouldSkip) {
      return true;
    }
  }

  return false;
}

function parseConventionalCommit(message: string): {
  type: string;
  scope: string | null;
  description: string;
  breaking: boolean;
} {
  // type(scope)!: description - breaking indicated by !
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

function getCommitMessage(): string {
  try {
    const msgPath = join(process.cwd(), ".git", "COMMIT_EDITMSG");
    const msg = readFileSync(msgPath, "utf-8");
    return msg.trim().split("\n")[0];
  } catch {
    return "";
  }
}

function generateDraftFromCommitMessage(): {
  draft: string;
  semVer: "MAJOR" | "MINOR" | "PATCH";
  category: ChangeCategory;
} | null {
  const commitMsg = getCommitMessage();

  if (!commitMsg) {
    return null;
  }

  const parsed = parseConventionalCommit(commitMsg);
  const { category, semVer } = categorizeChange(parsed.type, parsed.breaking);

  if (!category || !semVer) {
    return null;
  }

  const scope = parsed.scope ? `${parsed.scope}: ` : "";
  let desc = parsed.description;
  if (desc.endsWith(".")) desc = desc.slice(0, -1);
  const formattedDesc = desc.charAt(0).toUpperCase() + desc.slice(1);

  const draft = `### ${category}\n- **${scope}${formattedDesc}**\n`;

  return { draft, semVer, category };
}

function updateChangelogWithDraft(
  draft: string,
  category: ChangeCategory
): void {
  let content: string;

  try {
    content = readFileSync(CHANGELOG_PATH, "utf-8");
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

  // Insert draft under the appropriate category
  const categoryPattern = new RegExp(`(### ${category}\\n)`);
  const updatedContent = content.replace(categoryPattern, `$1${draft}`);

  writeFileSync(CHANGELOG_PATH, updatedContent);
}

function main(): void {
  if (isChangelogStaged()) {
    console.log("✅ CHANGELOG.md is staged - continuing...");
    process.exit(0);
  }

  if (!hasUserFacingChanges()) {
    console.log("ℹ️  No user-facing changes detected - continuing...");
    process.exit(0);
  }

  const result = generateDraftFromCommitMessage();

  if (!result) {
    console.warn("⚠️  CHANGELOG.md needs to be updated.");
    console.warn(
      "   User-facing changes were detected, but no CHANGELOG.md entry was found."
    );
    console.warn("");
    console.warn(
      "   Also attempted to auto-generate a draft from the commit message, but"
    );
    console.warn("   could not read or parse the commit message.");
    console.warn("");
    console.warn(
      "   Please manually add an entry to CHANGELOG.md and stage it."
    );
    console.warn("   Format example:");
    console.warn("     ### Added");
    console.warn("     - **scope: Description of change**");
    process.exit(1);
  }

  const { draft, semVer, category } = result;
  updateChangelogWithDraft(draft, category);

  console.log("");
  console.log("⚠️  CHANGELOG.md has been updated with a draft entry.");
  console.log("");
  console.log(`📋 [${semVer}] ${category}`);
  console.log("─".repeat(60));
  console.log(draft.trim());
  console.log("─".repeat(60));
  console.log("");
  console.log("Next steps:");
  console.log("  1. Review and edit CHANGELOG.md");
  console.log("  2. Stage the CHANGELOG: git add CHANGELOG.md");
  console.log("  3. Commit again: git commit");
  console.log("");

  process.exit(1);
}

main();
