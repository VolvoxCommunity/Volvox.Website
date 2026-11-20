import { GET as getLlmsTxt } from "../src/app/llms.txt/route";
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

  it("loads Volvox.Bot in the legacy product catalog", () => {
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

  it("lists Volvox.Quest in both catalogs with the same product ID and site", () => {
    const quest = getExtendedProductBySlug("volvox-quest");

    expect(quest).toMatchObject({
      name: "Volvox.Quest",
      links: { demo: "https://volvox.app" },
    });
    expect(getAllExtendedProducts()).toContainEqual(quest);
    expect(
      getAllProducts().find((product) => product.name === "Volvox.Quest"),
    ).toMatchObject({ id: quest?.id, demoUrl: "https://volvox.app" });
  });

  it("links to the Volvox.Quest product page in llms.txt", async () => {
    const body = await (await getLlmsTxt()).text();

    expect(body).toContain(
      "[Volvox.Quest](https://www.volvox.dev/products/volvox-quest)",
    );
  });
});
