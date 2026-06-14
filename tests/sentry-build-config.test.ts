import assert from "node:assert/strict";
import test from "node:test";

import { shouldUploadSentryArtifacts } from "../src/lib/sentry-build";

test("Sentry artifacts upload only from Vercel production with an auth token", () => {
  assert.equal(
    shouldUploadSentryArtifacts({
      CI: "true",
      SENTRY_AUTH_TOKEN: "token",
      VERCEL_ENV: undefined,
    }),
    false,
  );

  assert.equal(
    shouldUploadSentryArtifacts({
      CI: "true",
      SENTRY_AUTH_TOKEN: "token",
      VERCEL_ENV: "preview",
    }),
    false,
  );

  assert.equal(
    shouldUploadSentryArtifacts({
      CI: "true",
      SENTRY_AUTH_TOKEN: "token",
      VERCEL_ENV: "production",
    }),
    true,
  );
});
