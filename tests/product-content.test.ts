import assert from "node:assert/strict";
import test from "node:test";

import {
  getAllExtendedProducts,
  getAllProducts,
  getExtendedProductBySlug,
  isValidSlug,
} from "../src/lib/content";

test("loads Volvox.Bot as a routable extended product", () => {
  const products = getAllExtendedProducts();
  const volvoxBot = products.find((product) => product.slug === "volvox-bot");

  assert.ok(volvoxBot, "Expected Volvox.Bot to load from content/products");
  assert.equal(volvoxBot.name, "Volvox.Bot");
  assert.equal(volvoxBot.links.demo, "https://volvox.bot");
  assert.equal(isValidSlug(volvoxBot.slug), true);
  assert.ok(
    volvoxBot.features.includes("AI chat for context-aware Discord replies"),
    "Expected Volvox.Bot feature copy to mention AI chat",
  );
});

test("loads Volvox.Bot in the legacy products list used by llms.txt", () => {
  const products = getAllProducts();
  const volvoxBot = products.find((product) => product.name === "Volvox.Bot");

  assert.ok(
    volvoxBot,
    "Expected Volvox.Bot to load from content/products.json",
  );
  assert.equal(volvoxBot.demoUrl, "https://volvox.bot");
  assert.ok(
    volvoxBot.description.includes("AI-powered Discord bot"),
    "Expected Volvox.Bot summary to describe the product category",
  );
});

test("rejects the Volvox.Bot domain as a product route slug", () => {
  assert.equal(isValidSlug("volvox.bot"), false);
  assert.equal(getExtendedProductBySlug("volvox.bot"), null);
});
