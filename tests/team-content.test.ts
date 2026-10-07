import assert from "node:assert/strict";
import test from "node:test";

import { getAllTeamMembers, isValidSlug } from "../src/lib/content";

test("loads Rori and Naomi from team content with routable profile slugs", () => {
  const teamMembers = getAllTeamMembers();
  const rori = teamMembers.find((member) => member.id === "rori");

  assert.ok(rori, "Expected Rori to load from content/team.json");
  assert.equal(rori.name, "Rori Alano");
  assert.equal(rori.type, "marketer");
  assert.equal(isValidSlug(rori.slug), true);

  const naomi = teamMembers.find((member) => member.id === "naomi");

  assert.ok(naomi, "Expected Naomi to load from content/team.json");
  assert.equal(naomi.name, "Naomi Rosales");
  assert.equal(naomi.type, "marketer");
  assert.equal(isValidSlug(naomi.slug), true);
});
