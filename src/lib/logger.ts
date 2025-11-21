import * as Sentry from "@sentry/nextjs";

/**
 * Report an error to Sentry and log to console.
 *
 * Captures the error in Sentry with context metadata for proper tracking,
 * and also logs to console for local development visibility.
 *
 * @param context - Message describing where the error occurred.
 * @param error - The captured error value.
 */
export function reportError(context: string, error: unknown): void {
  const payload = error instanceof Error ? error : new Error(String(error));

  // Capture error in Sentry with context
  Sentry.captureException(payload, {
    tags: { context },
    extra: { originalError: error },
  });

  // Also log to console for development visibility
  console.error(`[Volvox] ${context}`, payload);
}
