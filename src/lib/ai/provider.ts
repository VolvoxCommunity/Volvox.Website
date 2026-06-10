import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Provider switcher for the Volvox Assistant.
 *
 * Currently active: OpenRouter (free models for development/testing).
 * When ready for production, uncomment the Z.AI / GLM block below and set
 * Z_AI_API_KEY in your env. The model config lives entirely in env vars so
 * no code changes are needed to swap.
 */

// ── ACTIVE: OpenRouter (free tier) ────────────────────────────────────
// Free models on OpenRouter: https://openrouter.ai/models?q=free
// Set OPENROUTER_API_KEY in your .env (or .env.local) file.
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
if (!openrouterApiKey) {
  throw new Error(
    "OPENROUTER_API_KEY is required. Set it in your .env file or environment variables.",
  );
}

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  apiKey: openrouterApiKey,
});

const openrouterModelId =
  process.env.OPENROUTER_MODEL ?? "moonshotai/kimi-k2.6:free";

export const chatModel = openrouter(openrouterModelId);

// ── DISABLED: Z.AI GLM (uncomment when ready for production) ──────────
// const zai = createOpenAI({
// 	baseURL: process.env.Z_AI_BASE_URL ?? "https://api.z.ai/api/paas/v4/",
// 	apiKey: process.env.Z_AI_API_KEY ?? "",
// });
// const zaiModelId = process.env.Z_AI_MODEL ?? "glm-4.5";
// export const chatModel = zai(zaiModelId);

export const chatProviderInfo = {
  provider: "openrouter" as const,
  model: openrouterModelId,
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  // provider: "z-ai",
  // model: zaiModelId,
  // baseURL: process.env.Z_AI_BASE_URL ?? "https://api.z.ai/api/paas/v4/",
} as const;
