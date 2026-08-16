import { add, init, setOptOut, track } from "@amplitude/analytics-browser";
import { SessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const AMPLITUDE_API_KEY = "7e4898973f18d766ff22eb9be4c92058";

let amplitudeReady = false;

export function initAmplitude(): void {
  if (typeof window === "undefined") return;

  if (!amplitudeReady) {
    init(AMPLITUDE_API_KEY, undefined, {
      fetchRemoteConfig: true,
    });
    add(new SessionReplayPlugin());
    amplitudeReady = true;
  }

  setOptOut(false);
}

export function disableAmplitude(): void {
  setOptOut(true);
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  track(eventName, properties);
}
