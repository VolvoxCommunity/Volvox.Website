import {
  generateOrganizationSchema,
  generateArticleSchema,
  generateWebPageSchema,
} from "@/lib/structured-data";

describe("structured data", () => {
  it("generates organization schema", () => {
    const schema = generateOrganizationSchema();
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Volvox");
  });

  it("generates article schema", () => {
    const post = {
      title: "Title",
      excerpt: "Excerpt",
      date: "2023-01-01",
      author: { name: "Author" },
    };
    const schema = generateArticleSchema(post, "slug");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Title");
    // Cast to any to access properties that TS might not infer strictly if return type is implicit
    expect((schema.author as any).name).toBe("Author");
  });

  it("generates webpage schema", () => {
    const schema = generateWebPageSchema("Title", "Desc", "/path");
    expect(schema["@type"]).toBe("WebPage");
    expect(schema.name).toBe("Title");
  });
});
