import { expect, test } from "@playwright/test";

const DECISION_JAR_FEATURES = [
  "Shake-to-decide or tap for random selection from custom jars",
  "AI-powered suggestions to expand your options (up to 50/day on Premium)",
  "Decision history tracking to identify choice patterns",
  "QR code sharing for instant jar importing with friends",
];

const SOBERS_FEATURES = [
  "Secure sponsor-sponsee pairing with invite code system",
  "Sobriety timeline with transparent relapse tracking",
  "Task management with sponsor assignment and sponsee completion notes",
  "Visual journey timeline displaying milestones, tasks, and step progress",
];

const VOLVOX_BOT_FEATURES = [
  "AI chat for context-aware Discord replies",
  "AI auto-moderation with configurable thresholds and actions",
  "Reputation and XP tracking with role rewards",
  "Long-term user memory for personalized interactions",
];

const HOMEPAGE_FEATURES = [
  ...DECISION_JAR_FEATURES,
  ...SOBERS_FEATURES,
  ...VOLVOX_BOT_FEATURES,
];

type FeatureRenderState = {
  clientWidth: number;
  isHorizontallyClipped: boolean;
  isMissing: boolean;
  overflow: string;
  scrollWidth: number;
  text: string;
  textOverflow: string;
  whiteSpace: string;
};

test("homepage product feature previews show their full text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 680, height: 743 });
  await page.goto("/");

  const renderStates = await page.evaluate((featureTexts) => {
    const productSection = document.querySelector("#products");
    if (!productSection) {
      throw new Error("Products section was not rendered");
    }

    return featureTexts.map((text): FeatureRenderState => {
      const featureElement = Array.from(
        productSection.querySelectorAll("span"),
      ).find((element) => element.textContent?.trim() === text);

      if (!featureElement) {
        return {
          clientWidth: 0,
          isHorizontallyClipped: false,
          isMissing: true,
          overflow: "",
          scrollWidth: 0,
          text,
          textOverflow: "",
          whiteSpace: "",
        };
      }

      const computedStyle = window.getComputedStyle(featureElement);

      return {
        clientWidth: featureElement.clientWidth,
        isHorizontallyClipped:
          featureElement.scrollWidth > featureElement.clientWidth,
        isMissing: false,
        overflow: computedStyle.overflow,
        scrollWidth: featureElement.scrollWidth,
        text,
        textOverflow: computedStyle.textOverflow,
        whiteSpace: computedStyle.whiteSpace,
      };
    });
  }, HOMEPAGE_FEATURES);

  expect(renderStates).toEqual(
    expect.arrayContaining(
      HOMEPAGE_FEATURES.map((text) =>
        expect.objectContaining({
          isHorizontallyClipped: false,
          isMissing: false,
          overflow: "visible",
          text,
          textOverflow: "clip",
          whiteSpace: "normal",
        }),
      ),
    ),
  );
});
