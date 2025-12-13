import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

describe("Dialog Components", () => {
  describe("Dialog", () => {
    it("renders children", () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
        </Dialog>
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });
  });

  describe("DialogTrigger", () => {
    it("renders trigger button", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );
      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
        </Dialog>
      );
      expect(screen.getByText("Open")).toHaveAttribute(
        "data-slot",
        "dialog-trigger"
      );
    });
  });

  describe("DialogClose", () => {
    it("renders close button", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose data-testid="close-btn">Close Me</DialogClose>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("close-btn")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose data-testid="close-btn">Close</DialogClose>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("close-btn")).toHaveAttribute(
        "data-slot",
        "dialog-close"
      );
    });
  });

  describe("DialogPortal", () => {
    it("renders portal content", () => {
      render(
        <Dialog defaultOpen>
          <DialogPortal>
            <div data-testid="portal-content">Portal Content</div>
          </DialogPortal>
        </Dialog>
      );
      expect(screen.getByTestId("portal-content")).toBeInTheDocument();
    });
  });

  describe("DialogOverlay", () => {
    it("renders overlay", () => {
      render(
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay data-testid="overlay" />
          </DialogPortal>
        </Dialog>
      );
      expect(screen.getByTestId("overlay")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay data-testid="overlay" />
          </DialogPortal>
        </Dialog>
      );
      expect(screen.getByTestId("overlay")).toHaveAttribute(
        "data-slot",
        "dialog-overlay"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogOverlay className="custom-overlay" data-testid="overlay" />
          </DialogPortal>
        </Dialog>
      );
      expect(screen.getByTestId("overlay")).toHaveClass("custom-overlay");
    });
  });

  describe("DialogContent", () => {
    it("renders content when open", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <div>Dialog Content</div>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Dialog Content")).toBeInTheDocument();
    });

    it("renders close button by default", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <div>Content</div>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("hides close button when showCloseButton is false", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Title</DialogTitle>
            <div>Content</div>
          </DialogContent>
        </Dialog>
      );
      expect(screen.queryByText("Close")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent className="custom-content">
            <DialogTitle>Title</DialogTitle>
            <div data-testid="inner">Content</div>
          </DialogContent>
        </Dialog>
      );
      const content = screen.getByTestId("inner").parentElement;
      expect(content).toHaveClass("custom-content");
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <div data-testid="inner">Content</div>
          </DialogContent>
        </Dialog>
      );
      const content = screen.getByTestId("inner").parentElement;
      expect(content).toHaveAttribute("data-slot", "dialog-content");
    });
  });

  describe("DialogHeader", () => {
    it("renders header content", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Header Title")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader data-testid="header">
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("header")).toHaveAttribute(
        "data-slot",
        "dialog-header"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader className="custom-header" data-testid="header">
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("DialogFooter", () => {
    it("renders footer content", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogFooter>Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogFooter data-testid="footer">Footer</DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("footer")).toHaveAttribute(
        "data-slot",
        "dialog-footer"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogFooter className="custom-footer" data-testid="footer">
              Footer
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("DialogTitle", () => {
    it("renders title text", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>My Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("My Dialog Title")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle data-testid="title">Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("title")).toHaveAttribute(
        "data-slot",
        "dialog-title"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle className="custom-title" data-testid="title">
              Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("DialogDescription", () => {
    it("renders description text", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>My Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("My Description")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription data-testid="desc">
              Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("desc")).toHaveAttribute(
        "data-slot",
        "dialog-description"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription className="custom-desc" data-testid="desc">
              Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });
});
