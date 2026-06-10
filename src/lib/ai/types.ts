export type VisitorIntent = "beginner" | "professional" | "hirer";

export type ChatRole = "user" | "assistant" | "system";

export type SurfaceCardKind = "team" | "product" | "blog";

export interface SurfaceCardData {
  kind: SurfaceCardKind;
  slug: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  surfaceCards?: SurfaceCardData[];
  createdAt: number;
}

export interface ChatRequestBody {
  messages: { id: string; role: ChatRole; content: string }[];
  intentSeed?: VisitorIntent | null;
}

export interface IntentDetectionResult {
  intent: VisitorIntent;
  confidence: number;
  signals: { beginner: number; professional: number; hirer: number };
}
