type SentryBuildEnvironment = Record<string, string | undefined>;

export function shouldUploadSentryArtifacts(
  environment: SentryBuildEnvironment,
): boolean {
  const isCi = environment.CI === "true" || environment.CI === "1";
  const hasAuthToken = Boolean(environment.SENTRY_AUTH_TOKEN?.trim());

  return isCi && hasAuthToken && environment.VERCEL_ENV === "production";
}
