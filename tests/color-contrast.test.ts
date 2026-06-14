import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const globalsCss = readFileSync("src/app/globals.css", "utf8");

function getThemeBlock(
  selector: ":root" | ".dark",
  source = globalsCss,
): string {
  const selectorMatch = new RegExp(
    `${selector.replace(".", "\\.")}\\s*\\{`,
  ).exec(source);
  assert.ok(selectorMatch, `Expected ${selector} theme block`);

  const blockStart = selectorMatch.index + selectorMatch[0].length;
  let depth = 1;

  for (let index = blockStart; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    }

    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(blockStart, index);
      }
    }
  }

  assert.fail(`Expected ${selector} theme block to close`);
}

function getColor(block: string, token: string): string {
  const match = block.match(
    new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6}|oklch\\([^;]+\\));`),
  );
  assert.ok(match, `Expected ${token} token`);
  return match[1];
}

function hexToRgb(hexColor: string): [number, number, number] {
  const value = Number.parseInt(hexColor.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function oklchToRgb(oklchColor: string): [number, number, number] {
  const match = oklchColor.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/);
  assert.ok(match, `Unsupported OKLCH color: ${oklchColor}`);

  const lightness = Number(match[1]);
  const chroma = Number(match[2]);
  const hueRadians = (Number(match[3]) * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);

  const lPrime = lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b;
  const mPrime = lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b;
  const sPrime = lightness - 0.089_484_177_5 * a - 1.291_485_548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [
    4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s,
    -1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s,
    -0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s,
  ].map((linearChannel) => {
    const channel =
      linearChannel <= 0.003_130_8
        ? 12.92 * linearChannel
        : 1.055 * linearChannel ** (1 / 2.4) - 0.055;

    return Math.round(Math.min(Math.max(channel, 0), 1) * 255);
  }) as [number, number, number];
}

function toRgb(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }

  return oklchToRgb(color);
}

function relativeLuminance(color: string): number {
  const channels = toRgb(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.039_28
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(firstColor: string, secondColor: string): number {
  const [lighter, darker] = [
    relativeLuminance(firstColor),
    relativeLuminance(secondColor),
  ].sort((first, second) => second - first);

  return (lighter + 0.05) / (darker + 0.05);
}

test("filled primary and secondary colors meet WCAG AA contrast", () => {
  for (const selector of [":root", ".dark"] as const) {
    const block = getThemeBlock(selector);

    for (const token of ["primary", "secondary"] as const) {
      const background = getColor(block, token);
      const foreground = getColor(block, `${token}-foreground`);

      assert.ok(
        contrastRatio(background, foreground) >= 4.5,
        `${selector} ${token} foreground must contrast against its background`,
      );
    }
  }
});

test("theme block parser tolerates non-Biome indentation", () => {
  const reindentedCss = `
    @layer base {
      :root {
        --primary: #0068d9;
      }
    }
  `;

  assert.equal(
    getColor(getThemeBlock(":root", reindentedCss), "primary"),
    "#0068d9",
  );
});

test("muted foreground colors meet WCAG AA contrast on muted surfaces", () => {
  for (const selector of [":root", ".dark"] as const) {
    const block = getThemeBlock(selector);
    const foreground = getColor(block, "muted-foreground");

    for (const backgroundToken of ["background", "card", "muted"] as const) {
      assert.ok(
        contrastRatio(foreground, getColor(block, backgroundToken)) >= 4.5,
        `${selector} muted foreground must contrast against ${backgroundToken}`,
      );
    }
  }
});
