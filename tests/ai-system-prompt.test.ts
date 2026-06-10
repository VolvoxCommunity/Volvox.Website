import assert from "node:assert/strict";
import test from "node:test";

import { ctaFor } from "../src/lib/ai/cta-bank";
import { detectIntent } from "../src/lib/ai/intent";
import { buildSystemPrompt } from "../src/lib/ai/system-prompt";
import type { VisitorIntent } from "../src/lib/ai/types";

const ALL_INTENTS: VisitorIntent[] = ["beginner", "professional", "hirer"];

test("buildSystemPrompt includes the master preamble for every persona", () => {
  for (const intent of ALL_INTENTS) {
    const prompt = buildSystemPrompt(intent);
    assert.ok(prompt.includes("Volvox Assistant"));
    assert.ok(prompt.includes("Sobers"));
    assert.ok(prompt.includes("Decision Jar"));
  }
});

test("buildSystemPrompt includes beginner persona block", () => {
  const prompt = buildSystemPrompt("beginner");
  assert.ok(prompt.includes("Persona: BEGINNER"));
  assert.ok(prompt.toLowerCase().includes("warm"));
});

test("buildSystemPrompt includes hirer persona block", () => {
  const prompt = buildSystemPrompt("hirer");
  assert.ok(prompt.includes("Persona: HIRER"));
  assert.ok(prompt.toLowerCase().includes("direct"));
});

test("buildSystemPrompt includes professional persona block", () => {
  const prompt = buildSystemPrompt("professional");
  assert.ok(prompt.includes("Persona: PROFESSIONAL"));
  assert.ok(prompt.toLowerCase().includes("peer"));
});

test("buildSystemPrompt always includes tool guidance", () => {
  const prompt = buildSystemPrompt("professional");
  assert.ok(prompt.includes("get_team_members"));
  assert.ok(prompt.includes("get_products"));
  assert.ok(prompt.includes("get_blog_posts"));
});

test("ctaFor returns a CTA for each persona", () => {
  for (const intent of ALL_INTENTS) {
    const cta = ctaFor(intent);
    assert.ok(cta.welcomeIntro);
    assert.ok(cta.fallback());
    assert.ok(cta.afterTeamMember("Test").includes("Test"));
  }
});

test("beginner CTA prefers Discord", () => {
  const cta = ctaFor("beginner");
  assert.ok(cta.fallback().toLowerCase().includes("discord"));
});

test("hirer CTA prefers email", () => {
  const cta = ctaFor("hirer");
  assert.ok(cta.fallback().includes("bill@volvox.dev"));
});

test("detects beginner from text and composes beginner prompt", () => {
  const text = "I'm new to coding and want to learn";
  const result = detectIntent([{ role: "user", content: text }]);
  assert.equal(result.intent, "beginner");
  const prompt = buildSystemPrompt(result.intent);
  assert.ok(prompt.includes("Persona: BEGINNER"));
});

test("detects hirer from text and composes hirer prompt", () => {
  const text = "Looking to hire a developer for our team";
  const result = detectIntent([{ role: "user", content: text }]);
  assert.equal(result.intent, "hirer");
  const prompt = buildSystemPrompt(result.intent);
  assert.ok(prompt.includes("Persona: HIRER"));
});

test("tool handlers return data for valid slugs", async () => {
  const { getTeamMemberBySlug } = await import("../src/lib/ai/tool-handlers");
  const member = getTeamMemberBySlug("bill-chirico");
  assert.ok(member);
  assert.equal(member?.name, "Bill Chirico");
});

test("tool handlers return data for product slugs", async () => {
  const { getProductBySlug } = await import("../src/lib/ai/tool-handlers");
  const product = getProductBySlug("sobers");
  assert.ok(product);
  assert.equal(product?.name, "Sobers");
});

test("tool handlers list team members", async () => {
  const { listTeamMembers } = await import("../src/lib/ai/tool-handlers");
  const members = listTeamMembers();
  assert.ok(members.length > 0);
});

test("tool handlers list products", async () => {
  const { listProducts } = await import("../src/lib/ai/tool-handlers");
  const products = listProducts();
  assert.ok(products.length > 0);
});
