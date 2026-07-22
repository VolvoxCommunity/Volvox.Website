import assert from "node:assert/strict";
import test from "node:test";

import { getEnabledAnalyticsIntegrations } from "../src/components/conditional-analytics";

const CONSENT_ALL = {
  advertising: true,
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
    metaPixel: false,
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
    metaPixel: true,
    speedInsights: true,
    vercelAnalytics: true,
  });
});

test("analytics integrations respect declined consent in deployed production", () => {
  const enabled = getEnabledAnalyticsIntegrations({
    consent: {
      advertising: false,
      analytics: false,
      performance: false,
    },
    deploymentEnvironment: "production",
    gaId: "G-PROD",
    nodeEnv: "production",
  });

  assert.deepEqual(enabled, {
    googleAnalytics: false,
    metaPixel: false,
    speedInsights: false,
    vercelAnalytics: false,
  });
});

test("meta pixel follows advertising consent independently of analytics", () => {
  const enabled = getEnabledAnalyticsIntegrations({
    consent: {
      advertising: true,
      analytics: false,
      performance: false,
    },
    deploymentEnvironment: "production",
    gaId: "G-PROD",
    nodeEnv: "production",
  });

  assert.deepEqual(enabled, {
    googleAnalytics: false,
    metaPixel: true,
    speedInsights: false,
    vercelAnalytics: false,
  });
});
