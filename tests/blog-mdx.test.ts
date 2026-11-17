import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { blogMdxConfig } from "../src/lib/mdx-components";

test("blog MDX renders pipe tables with aligned columns and formatted cells", async () => {
  const { compileMDX } = await import("next-mdx-remote/rsc");
  const source = [
    "| Model | Requests |",
    "| --- | ---: |",
    "| **Alpha\\|Beta** | `42` |",
  ].join("\n");

  const { content } = await compileMDX({ source, ...blogMdxConfig });
  const html = renderToStaticMarkup(content);

  assert.match(html, /<table\b/);
  assert.match(html, /<thead><tr><th>Model<\/th>/);
  assert.match(html, /<th style="text-align:right">Requests<\/th>/);
  assert.match(html, /<tbody><tr><td><strong>Alpha\|Beta<\/strong><\/td>/);
  assert.match(html, /<td style="text-align:right"><code>42<\/code><\/td>/);
});
