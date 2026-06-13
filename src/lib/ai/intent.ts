import type { IntentDetectionResult, VisitorIntent } from "./types";

export type { IntentDetectionResult, VisitorIntent } from "./types";

const BEGINNER_PATTERNS: RegExp[] = [
  /\bbeginner\b/i,
  /\bjust starting\b/i,
  /\bnew to (coding|programming|tech|development)\b/i,
  /\bstart(ing)? (to )?(code|program|learn)\b/i,
  /\blearn(ing)? to code\b/i,
  /\bfirst (app|project|website|job)\b/i,
  /\bstudent\b/i,
  /\bself[- ]taught\b/i,
  /\bcoding bootcamp\b/i,
  /\bcs degree\b/i,
  /\bcareer (switch|change)\b/i,
];

const HIRER_PATTERNS: RegExp[] = [
  /\bhire\b/i,
  /\bhiring\b/i,
  /\bavailable for (work|hire|hiring|projects)\b/i,
  /\blooking for (a |an )?dev(eloper)?\b/i,
  /\bfreelance\b/i,
  /\bcontract(ing)?\b/i,
  /\bwe('re| are) (hiring|looking|recruiting)\b/i,
  /\bneed (a |an )?(developer|engineer|designer|frontend|backend|fullstack)\b/i,
  /\bfor (our|my|the) (team|company|startup|project|business)\b/i,
  /\bcan (you|he|she|they) (work|build|do) (for|with) (us|me)\b/i,
];

const PROFESSIONAL_PATTERNS: RegExp[] = [
  /\breact\b/i,
  /\btypescript\b/i,
  /\bjavascript\b/i,
  /\bnext\.?js\b/i,
  /\btailwind\b/i,
  /\bopen[- ]source\b/i,
  /\bcontribut(e|ing|ion)\b/i,
  /\bnode\.?js\b/i,
  /\bbackend\b/i,
  /\bfrontend\b/i,
  /\bfull[- ]?stack\b/i,
  /\bsystem design\b/i,
  /\bapi\b/i,
  /\bdatabase\b/i,
  /\barchitecture\b/i,
  /\bmobile (dev|development|app)\b/i,
  /\breact native\b/i,
];

const INTENT_HINTS: Record<Exclude<VisitorIntent, null>, RegExp[]> = {
  beginner: BEGINNER_PATTERNS,
  hirer: HIRER_PATTERNS,
  professional: PROFESSIONAL_PATTERNS,
};

export function detectIntentFromText(text: string): VisitorIntent {
  const text_ = text.toLowerCase();
  if (BEGINNER_PATTERNS.some((r) => r.test(text_))) return "beginner";
  if (HIRER_PATTERNS.some((r) => r.test(text_))) return "hirer";
  if (PROFESSIONAL_PATTERNS.some((r) => r.test(text_))) return "professional";
  return "professional";
}

const DEFAULT_RESULT: IntentDetectionResult = {
  intent: "professional",
  confidence: 0,
  signals: { beginner: 0, professional: 0, hirer: 0 },
};

export function detectIntent(
  messages: { role: string; content: string }[],
  options: { explicitSeed?: VisitorIntent | null } = {},
): IntentDetectionResult {
  const recent = messages
    .filter((m) => m.role === "user" && m.content.trim().length > 0)
    .slice(-4);

  if (recent.length === 0) {
    return options.explicitSeed
      ? {
          intent: options.explicitSeed,
          confidence: 0.4,
          signals: { beginner: 0, professional: 0, hirer: 0 },
        }
      : DEFAULT_RESULT;
  }

  const scores: Record<VisitorIntent, number> = {
    beginner: 0,
    professional: 0,
    hirer: 0,
  };

  for (let i = 0; i < recent.length; i++) {
    const m = recent[i];
    const text = m.content;
    const recencyBoost = 1 + (i / recent.length) * 0.5;
    for (const intent of Object.keys(INTENT_HINTS) as VisitorIntent[]) {
      const matches = INTENT_HINTS[intent].reduce(
        (count, pattern) => (pattern.test(text) ? count + 1 : count),
        0,
      );
      scores[intent] += matches * recencyBoost;
    }
  }

  if (options.explicitSeed) {
    scores[options.explicitSeed] += 1.5;
  }

  const total = scores.beginner + scores.professional + scores.hirer;
  const winner = (Object.entries(scores) as [VisitorIntent, number][]).reduce(
    (best, [intent, score]) => (score > best[1] ? [intent, score] : best),
    ["professional", 0] as [VisitorIntent, number],
  );

  const intent =
    winner[1] > 0 ? winner[0] : (options.explicitSeed ?? "professional");
  const confidence = total === 0 ? 0.3 : Math.min(1, winner[1] / (total + 1));

  return { intent, confidence, signals: scores };
}

export const INTENT_LABELS: Record<VisitorIntent, string> = {
  beginner: "Learning to code",
  professional: "Developer / peer",
  hirer: "Looking to hire",
};

export const INTENT_DESCRIPTIONS: Record<VisitorIntent, string> = {
  beginner:
    "I'll show you the friendliest on-ramp: mentors, beginner-friendly Discord channels, and stories from devs who started where you are.",
  professional:
    "I'll point you at open-source repos to contribute, technical deep-dives, and the right expert for your stack.",
  hirer:
    "I'll surface hireable team members with their portfolios, contact channels, and the fastest path to Bill (CEO) for a warm intro.",
};
