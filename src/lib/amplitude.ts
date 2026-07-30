import { add, init, track } from "@amplitude/analytics-browser";
import { SessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const AMPLITUDE_API_KEY = "7e4898973f18d766ff22eb9be4c92058";

let initialized = false;

export function initAmplitude() {
  if (initialized || typeof window === "undefined") return;

  init(AMPLITUDE_API_KEY, undefined, {
    fetchRemoteConfig: true,
  });
  add(new SessionReplayPlugin());

  initialized = true;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !initialized) return;
  track(eventName, properties);
}
