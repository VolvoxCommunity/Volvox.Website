import assert from "node:assert/strict";
import test from "node:test";

import {
  clearChat,
  getChatTtlDays,
  loadChat,
  saveChat,
} from "../src/lib/ai/chat-store";

const memory = new Map<string, string>();

const mockStore = {
  getItem: (k: string) => memory.get(k) ?? null,
  setItem: (k: string, v: string) => {
    memory.set(k, v);
  },
  removeItem: (k: string) => {
    memory.delete(k);
  },
  clear: () => memory.clear(),
  key: () => null,
  length: 0,
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockStore,
  configurable: true,
});

test("chat-store returns null when nothing is stored", () => {
  memory.clear();
  assert.equal(loadChat(), null);
});

test("chat-store saves and loads a chat", () => {
  memory.clear();
  saveChat({
    messages: [{ id: "1", role: "user", content: "hi" }],
    intent: "beginner",
  });
  const loaded = loadChat();
  assert.ok(loaded);
  assert.equal(loaded?.messages.length, 1);
  assert.equal(loaded?.intent, "beginner");
  assert.ok((loaded?.expiresAt ?? 0) > Date.now());
});

test("chat-store clears a chat", () => {
  memory.clear();
  saveChat({
    messages: [{ id: "1", role: "user", content: "hi" }],
    intent: null,
  });
  clearChat();
  assert.equal(loadChat(), null);
});

test("chat-store expires after TTL", () => {
  memory.clear();
  saveChat({
    messages: [{ id: "1", role: "user", content: "hi" }],
    intent: "professional",
  });
  const loaded = loadChat();
  assert.ok(loaded);
  if (loaded) {
    memory.clear();
    const expiredPayload = JSON.stringify({
      ...loaded,
      expiresAt: Date.now() - 1000,
    });
    memory.set("volvox-chat-history", expiredPayload);
    assert.equal(loadChat(), null);
  }
});

test("chat-store TTL is 14 days", () => {
  assert.equal(getChatTtlDays(), 14);
});
