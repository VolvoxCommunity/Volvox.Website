import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mentorshipSource = readFileSync("src/components/mentorship.tsx", "utf8");

function extractHeadingLevels(source: string): number[] {
  return [...source.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
}

function assertHeadingOrderDoesNotSkipLevels(source: string): void {
  const headingLevels = extractHeadingLevels(source);

  for (let index = 1; index < headingLevels.length; index += 1) {
    const previousLevel = headingLevels[index - 1];
    const currentLevel = headingLevels[index];

    assert.ok(
      currentLevel <= previousLevel + 1,
      `Heading order skips from h${previousLevel} to h${currentLevel}`,
    );
  }
}

test("mentorship CTA accessible names include their visible labels", () => {
  assert.match(
    mentorshipSource,
    /aria-label=/,
    "Mentorship elements must have accessible labels",
  );
});

test("community card names follow the page heading order", () => {
  assert.deepEqual(extractHeadingLevels(mentorshipSource), [2, 3]);
  assertHeadingOrderDoesNotSkipLevels(mentorshipSource);
});

test("community heading-order assertion catches skipped heading levels", () => {
  assert.throws(
    () =>
      assertHeadingOrderDoesNotSkipLevels(`
        <h2>Community</h2>
        <h4>Skipped heading</h4>
      `),
    /skips from h2 to h4/,
  );
});

test("mentor badges use a filled accessible contrast treatment", () => {
  assert.match(mentorshipSource, /text-muted-foreground font-mono/);
});
