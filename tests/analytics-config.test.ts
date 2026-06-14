import assert from "node:assert/strict";
import test from "node:test";

import { getEnabledAnalyticsIntegrations } from "../src/components/conditional-analytics";

const CONSENT_ALL = {
  analytics: true,
  performance: true,
};

test("analytics integrations stay disabled for local production builds", () => {
  const enabled = getEnabledAnalyticsIntegrations({
    consent: CONSENT_ALL,
    deploymentEnvironment: null,
    gaId: "G-LOCAL",
    nodeEnv: "production",
  });

  assert.deepEqual(enabled, {
    googleAnalytics: false,
    speedInsights: false,
    vercelAnalytics: false,
  });
});

test("analytics integrations enable only on deployed production with consent", () => {
  const enabled = getEnabledAnalyticsIntegrations({
    consent: CONSENT_ALL,
    deploymentEnvironment: "production",
    gaId: "G-PROD",
    nodeEnv: "production",
  });

  assert.deepEqual(enabled, {
    googleAnalytics: true,
    speedInsights: true,
    vercelAnalytics: true,
  });
});

test("analytics integrations respect declined consent in deployed production", () => {
  const enabled = getEnabledAnalyticsIntegrations({
    consent: {
      analytics: false,
      performance: false,
    },
    deploymentEnvironment: "production",
    gaId: "G-PROD",
    nodeEnv: "production",
  });

  assert.deepEqual(enabled, {
    googleAnalytics: false,
    speedInsights: false,
    vercelAnalytics: false,
  });
});
