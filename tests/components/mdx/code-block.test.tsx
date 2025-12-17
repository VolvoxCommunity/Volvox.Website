/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/unbound-method */
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CodeBlock } from "@/components/mdx/code-block";
import { reportError } from "@/lib/logger";

jest.mock("@/lib/logger", () => ({
  reportError: jest.fn(),
}));

describe("CodeBlock", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
    jest.useRealTimers();
  });

  it("renders children correctly", () => {
    render(
      <CodeBlock className="language-js">
        <code>{"console.log('hello')"}</code>
      </CodeBlock>
    );
    expect(screen.getByText("console.log('hello')")).toBeInTheDocument();
  });

  it("renders filename when provided", () => {
    render(
      <CodeBlock filename="test.js" className="language-js">
        <code>code</code>
      </CodeBlock>
    );
    expect(screen.getByText("test.js")).toBeInTheDocument();
    expect(screen.getByText("js")).toBeInTheDocument();
  });

  it("renders language even without filename", () => {
    render(
      <CodeBlock className="language-python">
        <code>{"print('hello')"}</code>
      </CodeBlock>
    );
    expect(screen.getByText("python")).toBeInTheDocument();
  });

  it("defaults to plaintext language if no class provided", () => {
    render(
      <CodeBlock>
        <code>raw text</code>
      </CodeBlock>
    );
    expect(screen.getByText("plaintext")).toBeInTheDocument();
  });

  it("copies text to clipboard on click", async () => {
    render(
      <CodeBlock className="language-js">
        <code data-testid="code-content">const a = 1;</code>
      </CodeBlock>
    );

    const copyButton = screen.getByLabelText("Copy code");

    // Use act to handle state update
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("const a = 1;");
    expect(screen.getByLabelText("Copied!")).toBeInTheDocument();

    // Fast-forward timeout to reset state
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
  });

  it("handles string children directly", async () => {
    render(<CodeBlock>raw string content</CodeBlock>);

    const copyButton = screen.getByLabelText("Copy code");
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "raw string content"
    );
  });

  it("reports error when no text content found", async () => {
    // This tests the error path when extractTextContent cannot find text.
    // The CodeBlock component expects either:
    // 1. A string child directly, or
    // 2. A <code> element with textContent
    // By passing a nested <div><span>...</span></div> structure without a <code>
    // wrapper, the extraction logic fails to find valid text content,
    // triggering the error handling path we want to test.
    render(
      <CodeBlock>
        <div>
          <span>Complex</span>
          <span>Child</span>
        </div>
      </CodeBlock>
    );

    const copyButton = screen.getByLabelText("Copy code");
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(reportError).toHaveBeenCalledWith(
      "CodeBlock: No text content found to copy",
      expect.any(Error)
    );
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("reports error when clipboard write fails", async () => {
    const error = new Error("Clipboard error");
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(error);

    render(
      <CodeBlock>
        <code>fail</code>
      </CodeBlock>
    );

    const copyButton = screen.getByLabelText("Copy code");
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(reportError).toHaveBeenCalledWith(
      "CodeBlock: Failed to copy to clipboard",
      error
    );
  });
});
