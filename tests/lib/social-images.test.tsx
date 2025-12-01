import { generateBlogPostSocialImage, getLogoData } from "@/lib/social-images";
import { ImageResponse } from "next/og";
import * as fs from "fs";

jest.mock("fs");
jest.mock("next/og", () => ({
  ImageResponse: jest.fn(() => ({ type: "ImageResponse" })),
}));

describe("social-images", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("css content src: url(http://font.ttf)"),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("getLogoData reads file", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue({
      buffer: new ArrayBuffer(8),
    });
    const data = getLogoData();
    expect(data).toBeTruthy();
  });

  it("generateBlogPostSocialImage creates ImageResponse", async () => {
    const frontmatter = {
      title: "Test Title",
      date: "2023-01-01",
      excerpt: "Test excerpt",
      author: { name: "Author" },
      tags: ["tag1"],
    };
    const logoData = new ArrayBuffer(8);

    const response = await generateBlogPostSocialImage(frontmatter, logoData);
    expect(ImageResponse).toHaveBeenCalled();
    expect(response).toEqual({ type: "ImageResponse" });
  });

  it("generateBlogPostSocialImage handles missing frontmatter (fallback)", async () => {
    await generateBlogPostSocialImage(null, null);
    expect(ImageResponse).toHaveBeenCalled();
  });
});
