import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mentorshipSource = readFileSync("src/components/mentorship.tsx", "utf8");

test("mentorship CTA accessible names include their visible labels", () => {
  assert.match(
    mentorshipSource,
    /aria-label="Join Us\b[^"]*"/,
    "Join Us button accessible name must include the visible label",
  );
  assert.match(
    mentorshipSource,
    /aria-label="Meet the Team\b[^"]*"/,
    "Meet the Team button accessible name must include the visible label",
  );
});

test("community card names follow the page heading order", () => {
  assert.match(mentorshipSource, /<h3 className="font-bold/);
  assert.doesNotMatch(mentorshipSource, /<h4 className="font-bold/);
});

test("mentor badges use a filled accessible contrast treatment", () => {
  assert.match(
    mentorshipSource,
    /className="bg-primary text-primary-foreground border-primary/,
  );
});
