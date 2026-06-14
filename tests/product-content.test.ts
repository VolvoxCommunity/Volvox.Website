import {
  getAllExtendedProducts,
  getAllProducts,
  getExtendedProductBySlug,
  isValidSlug,
} from "../src/lib/content";
import { describe, expect, it } from "./setup-globals";

describe("product content", () => {
  it("loads Volvox.Bot as a routable extended product", () => {
    const products = getAllExtendedProducts();
    const volvoxBot = products.find((product) => product.slug === "volvox-bot");

    expect(volvoxBot).toBeDefined();
    if (!volvoxBot) {
      throw new Error("Expected Volvox.Bot to load from content/products");
    }

    expect(volvoxBot.name).toBe("Volvox.Bot");
    expect(volvoxBot.links.demo).toBe("https://volvox.bot");
    expect(isValidSlug(volvoxBot.slug)).toBe(true);
    expect(
      volvoxBot.features.some((feature) =>
        feature.toLowerCase().includes("ai chat"),
      ),
    ).toBe(true);
  });

  it("loads Volvox.Bot in the legacy products list used by llms.txt", () => {
    const products = getAllProducts();
    const volvoxBot = products.find((product) => product.name === "Volvox.Bot");
    const extendedProduct = getExtendedProductBySlug("volvox-bot");

    expect(volvoxBot).toBeDefined();
    if (!volvoxBot) {
      throw new Error("Expected Volvox.Bot to load from content/products.json");
    }

    expect(extendedProduct).not.toBeNull();
    expect(volvoxBot.id).toBe(extendedProduct?.id);
    expect(volvoxBot.demoUrl).toBe("https://volvox.bot");
    expect(volvoxBot.description).toContain("AI-powered Discord bot");
  });

  it("rejects the Volvox.Bot domain as a product route slug", () => {
    expect(isValidSlug("volvox.bot")).toBe(false);
    expect(getExtendedProductBySlug("volvox.bot")).toBeNull();
  });
});
