import { render, waitFor } from "@testing-library/react";
import { ViewTracker } from "@/components/blog/view-tracker";

describe("ViewTracker", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ views: 1 }),
    });
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    sessionStorage.clear();
  });

  it("calls the views API on mount", async () => {
    render(<ViewTracker slug="test-post" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/blog/test-post/views",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("encodes slug in URL", async () => {
    render(<ViewTracker slug="post with spaces" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/blog/post%20with%20spaces/views",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("only calls API once per session", async () => {
    const { rerender, unmount } = render(<ViewTracker slug="test-post" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Re-render with same props
    rerender(<ViewTracker slug="test-post" />);

    // Should still be 1 call (sessionStorage prevents duplicate)
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Unmount and remount (simulates StrictMode behavior)
    unmount();
    render(<ViewTracker slug="test-post" />);

    // Should still be 1 call due to sessionStorage
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("tracks different slugs separately", async () => {
    render(<ViewTracker slug="post-1" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    render(<ViewTracker slug="post-2" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("renders nothing", () => {
    const { container } = render(<ViewTracker slug="test-post" />);

    expect(container.innerHTML).toBe("");
  });

  it("handles fetch errors silently", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    // Should not throw
    render(<ViewTracker slug="test-post" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
