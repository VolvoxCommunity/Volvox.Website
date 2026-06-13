import assert from "node:assert/strict";
import test from "node:test";

import { detectIntent } from "../src/lib/ai/intent";

test("detectIntent returns professional by default for empty input", () => {
  const result = detectIntent([]);
  assert.equal(result.intent, "professional");
});

test("detectIntent detects beginner signals", () => {
  const result = detectIntent([
    { role: "user", content: "I'm just starting to learn to code" },
  ]);
  assert.equal(result.intent, "beginner");
});

test("detectIntent detects hirer signals", () => {
  const result = detectIntent([
    { role: "user", content: "We're hiring a frontend developer for our team" },
  ]);
  assert.equal(result.intent, "hirer");
});

test("detectIntent detects professional signals", () => {
  const result = detectIntent([
    { role: "user", content: "How can I contribute to the open source repo?" },
  ]);
  assert.equal(result.intent, "professional");
});

test("detectIntent shifts intent based on latest message", () => {
  const result = detectIntent([
    { role: "user", content: "I'm a beginner" },
    { role: "user", content: "actually I'm looking to hire" },
  ]);
  assert.equal(result.intent, "hirer");
});

test("detectIntent boosts explicit seed", () => {
  const result = detectIntent([{ role: "user", content: "Hello there" }], {
    explicitSeed: "beginner",
  });
  assert.equal(result.intent, "beginner");
  assert.ok(result.confidence > 0);
});

test("detectIntent ignores non-user messages", () => {
  const result = detectIntent([
    { role: "assistant", content: "I am a beginner" },
    { role: "user", content: "Hi" },
  ]);
  assert.equal(result.intent, "professional");
});

test("detectIntent returns bounded confidence", () => {
  const result = detectIntent([
    { role: "user", content: "hire react developer" },
  ]);
  assert.ok(result.confidence > 0);
  assert.ok(result.confidence <= 1);
});
