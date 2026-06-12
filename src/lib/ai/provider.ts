import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

let _chatModel: ReturnType<ReturnType<typeof createOpenAICompatible>> | null =
  null;

function getZaiModel() {
  const apiKey = process.env.Z_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Z_AI_API_KEY is required. Set it in your .env file or environment variables. Get a key at https://z.ai",
    );
  }
  const zai = createOpenAICompatible({
    name: "zai",
    baseURL: process.env.Z_AI_BASE_URL ?? "https://api.z.ai/api/paas/v4",
    apiKey,
  });
  return zai(process.env.Z_AI_MODEL ?? "glm-5.1");
}

export function getChatModel() {
  if (!_chatModel) {
    _chatModel = getZaiModel();
  }
  return _chatModel;
}

const modelId = process.env.Z_AI_MODEL ?? "glm-5.1";

export const chatProviderInfo = {
  provider: "z-ai" as const,
  model: modelId,
  baseURL: process.env.Z_AI_BASE_URL ?? "https://api.z.ai/api/paas/v4",
} as const;
