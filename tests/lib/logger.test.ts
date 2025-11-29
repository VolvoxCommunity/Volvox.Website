import { reportError } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
  withScope: jest.fn(),
}));

describe("logger", () => {
  it("reports error to console and sentry", () => {
    const error = new Error("Test error");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    reportError("Message", error, { context: "test" });

    expect(consoleSpy).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
