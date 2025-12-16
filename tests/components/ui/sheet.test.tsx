import { render, screen, fireEvent } from "@testing-library/react";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

describe("Sheet Components", () => {
  describe("Sheet", () => {
    it("renders children", () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });

    it("opens and shows content when trigger is clicked", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <div>Sheet Body Content</div>
          </SheetContent>
        </Sheet>
      );

      // Content should not be visible initially
      expect(screen.queryByText("Sheet Body Content")).not.toBeInTheDocument();

      // Click the trigger button
      fireEvent.click(screen.getByRole("button", { name: /open sheet/i }));

      // Content should now be visible
      expect(screen.getByText("Sheet Body Content")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("SheetTrigger", () => {
    it("renders as a button with accessible name", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
        </Sheet>
      );
      expect(
        screen.getByRole("button", { name: /open sheet/i })
      ).toBeInTheDocument();
    });

    it("has data-slot attribute for component identification", () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>
      );
      const trigger = screen.getByRole("button", { name: /open/i });
      expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
    });
  });

  describe("SheetClose", () => {
    it("renders close button", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetClose data-testid="close-btn">Close</SheetClose>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("close-btn")).toBeInTheDocument();
    });

    it("closes sheet when clicked", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetClose data-testid="close-btn">Close</SheetClose>
            <div data-testid="sheet-body">Sheet Body Content</div>
          </SheetContent>
        </Sheet>
      );

      // Verify sheet is initially open
      expect(screen.getByTestId("sheet-body")).toBeInTheDocument();

      // Click the close button
      fireEvent.click(screen.getByTestId("close-btn"));

      // Verify sheet content is removed
      expect(screen.queryByTestId("sheet-body")).not.toBeInTheDocument();
    });
  });

  describe("SheetContent", () => {
    it("renders content when open", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <div>Sheet Content</div>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByText("Sheet Content")).toBeInTheDocument();
    });

    it("renders with right side by default", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <div>Content</div>
          </SheetContent>
        </Sheet>
      );
      const content = screen.getByText("Content").parentElement;
      expect(content).toHaveClass("right-0");
    });

    it("renders with left side", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="left">
            <SheetTitle>Title</SheetTitle>
            <div>Left Content</div>
          </SheetContent>
        </Sheet>
      );
      const content = screen.getByText("Left Content").parentElement;
      expect(content).toHaveClass("left-0");
    });

    it("renders with top side", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="top">
            <SheetTitle>Title</SheetTitle>
            <div>Top Content</div>
          </SheetContent>
        </Sheet>
      );
      const content = screen.getByText("Top Content").parentElement;
      expect(content).toHaveClass("top-0");
    });

    it("renders with bottom side", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="bottom">
            <SheetTitle>Title</SheetTitle>
            <div>Bottom Content</div>
          </SheetContent>
        </Sheet>
      );
      const content = screen.getByText("Bottom Content").parentElement;
      expect(content).toHaveClass("bottom-0");
    });

    it("renders close button with X icon", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <div>Content</div>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent className="custom-class">
            <SheetTitle>Title</SheetTitle>
            <div>Content</div>
          </SheetContent>
        </Sheet>
      );
      const content = screen.getByText("Content").parentElement;
      expect(content).toHaveClass("custom-class");
    });
  });

  describe("SheetHeader", () => {
    it("renders header content with proper heading semantics", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Header Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      // Verify heading semantics for accessibility
      expect(
        screen.getByRole("heading", { name: /header title/i })
      ).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader data-testid="header">
              <SheetTitle>Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("header")).toHaveAttribute(
        "data-slot",
        "sheet-header"
      );
    });

    it("applies custom className", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader className="custom-header" data-testid="header">
              <SheetTitle>Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("SheetFooter", () => {
    it("renders footer content within the sheet", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetFooter data-testid="footer">Footer Content</SheetFooter>
          </SheetContent>
        </Sheet>
      );
      // Primary behavioral assertion: footer content renders
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
      // Verify slot plumbing for component identification
      expect(screen.getByTestId("footer")).toHaveAttribute(
        "data-slot",
        "sheet-footer"
      );
    });

    it("applies custom className", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetFooter className="custom-footer" data-testid="footer">
              Footer
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("SheetTitle", () => {
    it("renders title with heading semantics", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>My Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      // Use role-based query for semantic verification
      expect(
        screen.getByRole("heading", { name: /my title/i })
      ).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle data-testid="title">Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("title")).toHaveAttribute(
        "data-slot",
        "sheet-title"
      );
    });

    it("applies custom className", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle className="custom-title" data-testid="title">
              Title
            </SheetTitle>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("SheetDescription", () => {
    it("renders description text", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>My Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByText("My Description")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription data-testid="desc">Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("desc")).toHaveAttribute(
        "data-slot",
        "sheet-description"
      );
    });

    it("applies custom className", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription className="custom-desc" data-testid="desc">
              Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });

    it("wires aria-describedby to the dialog", () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription data-testid="sheet-desc">
              This is a sheet description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      const dialog = screen.getByRole("dialog");
      const description = screen.getByTestId("sheet-desc");

      // Radix UI automatically wires SheetDescription to aria-describedby
      // using its own generated ID
      expect(dialog).toHaveAttribute("aria-describedby");
      expect(dialog.getAttribute("aria-describedby")).toBe(description.id);
    });
  });
});
