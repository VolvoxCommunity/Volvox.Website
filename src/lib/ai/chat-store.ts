export interface StoredChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parts?: unknown;
  createdAt?: number;
}

export type VisitorIntent = "beginner" | "professional" | "hirer";

export interface PersistedChat {
  messages: StoredChatMessage[];
  intent: VisitorIntent | null;
  expiresAt: number;
}

const STORAGE_KEY = "volvox-chat-history";
const TTL_MS = 14 * 24 * 60 * 60 * 1000;
const CHAT_ROLES = new Set(["user", "assistant", "system"]);
const SURFACE_TOOL_TYPES = new Set([
  "tool-surface_team_card",
  "tool-surface_product_card",
  "tool-surface_blog_card",
]);

function normalizeStoredMessage(value: unknown): StoredChatMessage | null {
  if (typeof value !== "object" || value === null) return null;
  const m = value as {
    id?: unknown;
    role?: unknown;
    content?: unknown;
    parts?: unknown;
    createdAt?: unknown;
  };
  if (
    typeof m.id !== "string" ||
    typeof m.role !== "string" ||
    !CHAT_ROLES.has(m.role)
  ) {
    return null;
  }
  const content =
    typeof m.content === "string" ? m.content : getTextContent(m.parts);
  return {
    id: m.id,
    role: m.role as StoredChatMessage["role"],
    content,
    parts: m.parts,
    createdAt: typeof m.createdAt === "number" ? m.createdAt : undefined,
  };
}

function isTextPart(
  part: unknown,
): part is { type: "text"; text: string; state?: string } {
  if (typeof part !== "object" || part === null) return false;
  const p = part as { type?: unknown; text?: unknown };
  return p.type === "text" && typeof p.text === "string";
}

function isSurfaceToolPart(
  part: unknown,
): part is { type: string; input?: unknown; output?: unknown; state?: string } {
  if (typeof part !== "object" || part === null) return false;
  const p = part as { type?: unknown };
  return typeof p.type === "string" && SURFACE_TOOL_TYPES.has(p.type);
}

function getTextContent(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return parts
    .filter(isTextPart)
    .map((part) => part.text)
    .join("")
    .trim();
}

function sanitizeParts(
  role: StoredChatMessage["role"],
  content: string,
  parts: unknown,
): unknown[] | undefined {
  const rawParts = Array.isArray(parts)
    ? parts
    : content
      ? [{ type: "text", text: content }]
      : [];
  const visibleParts = rawParts.filter((part) => {
    if (isTextPart(part)) return part.text.trim().length > 0;
    return role === "assistant" && isSurfaceToolPart(part);
  });
  return visibleParts.length > 0 ? visibleParts : undefined;
}

function hasVisibleContent(message: StoredChatMessage): boolean {
  if (message.role === "system") return false;
  if (message.content.trim().length > 0) return true;
  return Array.isArray(message.parts) && message.parts.some(isSurfaceToolPart);
}

function sanitizeStoredMessage(
  message: StoredChatMessage,
): StoredChatMessage | null {
  const parts = sanitizeParts(message.role, message.content, message.parts);
  const sanitized: StoredChatMessage = {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    ...(parts ? { parts } : {}),
  };
  return hasVisibleContent(sanitized) ? sanitized : null;
}

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      return (globalThis as { localStorage: Storage }).localStorage;
    }
  } catch {}
  return null;
}

export function loadChat(): PersistedChat | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedChat;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.messages) ||
      typeof parsed.expiresAt !== "number"
    ) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    const validMessages = parsed.messages
      .map(normalizeStoredMessage)
      .filter((m): m is StoredChatMessage => m !== null)
      .map(sanitizeStoredMessage)
      .filter((m): m is StoredChatMessage => m !== null);
    if (validMessages.length === 0) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() > parsed.expiresAt) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return { ...parsed, messages: validMessages };
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
}

export function saveChat(data: {
  messages: unknown[];
  intent: VisitorIntent | null;
}): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const filteredMessages = data.messages
      .map(normalizeStoredMessage)
      .filter((m): m is StoredChatMessage => m !== null)
      .map(sanitizeStoredMessage)
      .filter((m): m is StoredChatMessage => m !== null);
    if (filteredMessages.length === 0) {
      console.warn(
        "[chat-store] saveChat: no valid messages to persist, skipping",
      );
      return;
    }
    const payload: PersistedChat = {
      messages: filteredMessages,
      intent: data.intent,
      expiresAt: Date.now() + TTL_MS,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("[chat-store] saveChat failed:", err);
  }
}

export function clearChat(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {}
}

export function getChatTtlDays(): number {
  return TTL_MS / (24 * 60 * 60 * 1000);
}
