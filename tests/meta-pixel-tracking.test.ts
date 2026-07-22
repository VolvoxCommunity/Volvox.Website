import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { COOKIE_CONSENT_KEY } from "../src/components/providers/cookie-consent-provider";
import { trackMetaPixelEvent } from "../src/lib/meta-pixel";

type FbqCall = [
  command: string,
  eventName: string,
  parameters: Record<string, unknown> | undefined,
];

interface MutableGlobal {
  window?: { fbq?: (...args: FbqCall) => void };
}

const mutableGlobal = globalThis as unknown as MutableGlobal;

/** Backing store for the minimal localStorage stub used by the consent reader */
const storage = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  writable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
  },
});

function seedConsent(advertising: boolean): void {
  storage.set(
    COOKIE_CONSENT_KEY,
    JSON.stringify({
      hasConsented: true,
      essential: true,
      analytics: false,
      advertising,
      performance: false,
      timestamp: new Date().toISOString(),
    }),
  );
}

function installFbqRecorder(): FbqCall[] {
  const calls: FbqCall[] = [];
  mutableGlobal.window = {
    fbq: (...args: FbqCall) => {
      calls.push(args);
    },
  };
  return calls;
}

beforeEach(() => {
  storage.clear();
  mutableGlobal.window = {};
});

test("ignores events when the pixel is not loaded", () => {
  seedConsent(true);

  assert.doesNotThrow(() => {
    trackMetaPixelEvent("Lead");
  });
});

test("ignores events when advertising consent was never granted", () => {
  const calls = installFbqRecorder();

  trackMetaPixelEvent("Lead");

  assert.equal(calls.length, 0);
});

test("forwards events while advertising consent is granted", () => {
  const calls = installFbqRecorder();
  seedConsent(true);

  trackMetaPixelEvent("Lead", { source: "cta" });

  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], ["track", "Lead", { source: "cta" }]);
});

test("stops forwarding events after advertising consent is revoked mid-session", () => {
  const calls = installFbqRecorder();
  seedConsent(true);

  trackMetaPixelEvent("Lead");
  assert.equal(calls.length, 1);

  // The visitor revokes advertising consent; the already-loaded pixel script
  // keeps window.fbq alive, but no further events may be forwarded.
  seedConsent(false);

  trackMetaPixelEvent("Lead");
  assert.equal(calls.length, 1);
});
