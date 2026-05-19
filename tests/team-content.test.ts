import assert from "node:assert/strict";
import test from "node:test";

import { getAllTeamMembers, isValidSlug } from "../src/lib/content";

test("loads Madhurima from team content with a routable profile slug", () => {
  const teamMembers = getAllTeamMembers();
  const madhurima = teamMembers.find((member) => member.id === "madhurima");

  assert.ok(madhurima, "Expected Madhurima to load from content/team.json");
  assert.equal(madhurima.name, "Madhurima Gupta");
  assert.equal(madhurima.type, "marketer");
  assert.equal(isValidSlug(madhurima.slug), true);
});
