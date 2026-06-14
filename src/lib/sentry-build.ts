type SentryBuildEnvironment = Record<string, string | undefined>;

export function shouldUploadSentryArtifacts(
  environment: SentryBuildEnvironment,
): boolean {
  return Boolean(
    environment.CI &&
      environment.SENTRY_AUTH_TOKEN &&
      environment.VERCEL_ENV === "production",
  );
}
