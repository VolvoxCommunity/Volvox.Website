import type { UIMessage } from "ai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";
import { z } from "zod";
import type { VisitorIntent } from "@/lib/ai/intent";
import { detectIntent } from "@/lib/ai/intent";
import { chatModel } from "@/lib/ai/provider";
import { assertChatRateLimit, type RateLimitResult } from "@/lib/ai/rate-limit";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { aiTools } from "@/lib/ai/tools";
import { reportError } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 30;

const INTENT_SEED_VALUES = ["beginner", "professional", "hirer"] as const;

const ChatRequestSchema = z.object({
  messages: z.array(z.any()).min(1).max(50),
  intentSeed: z.enum(INTENT_SEED_VALUES).optional().nullable(),
});

function isUIMessage(value: unknown): value is UIMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "role" in value &&
    "id" in value &&
    typeof (value as { id?: unknown }).id === "string"
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid request shape", { status: 400 });
  }

  const rawMessages = parsed.data.messages.filter(isUIMessage);
  if (rawMessages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const vercelForwarded = req.headers.get("x-vercel-forwarded-for") ?? "";
  const realIp = req.headers.get("x-real-ip") ?? "";
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const ip =
    vercelForwarded.split(",")[0]?.trim() ||
    realIp.split(",")[0]?.trim() ||
    forwardedFor.split(",")[0]?.trim() ||
    "anon";

  let rateLimit: RateLimitResult;
  try {
    rateLimit = await assertChatRateLimit(ip);
  } catch (err) {
    reportError("Chat rate limit threw", err);
    rateLimit = { success: true, limit: 20, remaining: 20, reset: 0 };
  }

  if (!rateLimit.success) {
    return new Response(
      JSON.stringify({
        error: "rate_limited",
        message:
          "You're sending messages too fast. Take a breath and try again in a moment.",
        reset: rateLimit.reset,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const userTextFromMessages: string[] = [];
  for (const m of rawMessages) {
    if (m.role !== "user") continue;
    const parts = (m as { parts?: unknown }).parts;
    if (Array.isArray(parts)) {
      const text = parts
        .map((p) => {
          if (typeof p !== "object" || p === null) return "";
          const t = (p as { text?: unknown }).text;
          return typeof t === "string" ? t : "";
        })
        .join(" ")
        .trim();
      if (text) userTextFromMessages.push(text);
    }
  }

  const seed: VisitorIntent | null = parsed.data.intentSeed ?? null;
  const detection = detectIntent(
    userTextFromMessages.map((content) => ({ role: "user", content })),
    { explicitSeed: seed },
  );

  const system = buildSystemPrompt(detection.intent);

  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
  try {
    modelMessages = await convertToModelMessages(rawMessages);
  } catch (err) {
    reportError("Failed to convert UI messages to model messages", err);
    return new Response("Failed to process messages", { status: 400 });
  }

  const stream = createUIMessageStream({
    originalMessages: rawMessages,
    execute: async ({ writer }) => {
      writer.write({
        type: "data-chat-meta",
        data: {
          intent: detection.intent,
          confidence: detection.confidence,
          signals: detection.signals,
          rateLimitRemaining: rateLimit.remaining,
        },
        transient: true,
      });

      const result = streamText({
        model: chatModel,
        system,
        messages: modelMessages,
        tools: aiTools,
        stopWhen: stepCountIs(6),
        onError: ({ error }) => {
          reportError("Chat stream error", error);
        },
      });

      writer.merge(result.toUIMessageStream());
    },
    onError: (error) => {
      reportError("Chat stream fatal", error);
      return "Something went sideways on our side. Try sending that again.";
    },
  });

  return createUIMessageStreamResponse({ stream });
}
