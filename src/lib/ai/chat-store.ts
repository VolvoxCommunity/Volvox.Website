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

function isValidStoredMessage(value: unknown): value is StoredChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const m = value as { id?: unknown; role?: unknown };
  return typeof m.id === "string" && typeof m.role === "string";
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
    const validMessages = parsed.messages.filter(isValidStoredMessage);
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
    const payload: PersistedChat = {
      messages: data.messages as StoredChatMessage[],
      intent: data.intent,
      expiresAt: Date.now() + TTL_MS,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
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
