import assert from "node:assert/strict";
import test from "node:test";

import { getAllTeamMembers, isValidSlug } from "../src/lib/content";

test("loads Rori and Naomi from team content with routable profile slugs", () => {
  const teamMembers = getAllTeamMembers();
  const rori = teamMembers.find((member) => member.id === "rori");

  assert.ok(rori, "Expected Rori to load from content/team.json");
  assert.equal(rori.name, "Rori Alano");
  assert.equal(rori.type, "staff");
  assert.equal(isValidSlug(rori.slug), true);

  const naomi = teamMembers.find((member) => member.id === "naomi");

  assert.ok(naomi, "Expected Naomi to load from content/team.json");
  assert.equal(naomi.name, "Naomi Rosales");
  assert.equal(naomi.type, "marketer");
  assert.equal(isValidSlug(naomi.slug), true);
});

test("loads John, Alex, and Anthony with routable profile slugs", () => {
  const teamMembers = getAllTeamMembers();

  const john = teamMembers.find((member) => member.id === "john");

  assert.ok(john, "Expected John to load from content/team.json");
  assert.equal(john.name, "John Edward Lerguna");
  assert.equal(isValidSlug(john.slug), true);

  const alex = teamMembers.find((member) => member.id === "alex");

  assert.ok(alex, "Expected Alex to load from content/team.json");
  assert.equal(alex.name, "Alex Kingsley");
  assert.equal(isValidSlug(alex.slug), true);

  const anthony = teamMembers.find((member) => member.id === "anthony");

  assert.ok(anthony, "Expected Anthony to load from content/team.json");
  assert.equal(anthony.name, "Anthony Cotteta");
  assert.equal(isValidSlug(anthony.slug), true);
});
