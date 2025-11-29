import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Blog } from "@/components/blog";
import { Products } from "@/components/products";
import { Mentorship } from "@/components/mentorship";
import { About } from "@/components/about";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock("canvas-confetti", () => jest.fn(() => Promise.resolve()));

jest.mock("react-markdown", () => (props: any) => <div>{props.children}</div>);
jest.mock("rehype-highlight", () => () => {});
jest.mock("remark-gfm", () => () => {});

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Sections", () => {
  describe("Blog", () => {
    const mockPosts = [
      {
        id: "1",
        slug: "post-1",
        title: "Post 1",
        excerpt: "Excerpt 1",
        date: "2023-01-01",
        author: { id: "1", name: "Author 1", role: "Role", avatar: "/avatar" },
        tags: ["tag1"],
        content: "Content",
        published: true,
      },
    ];

    it("renders posts", () => {
      render(<Blog posts={mockPosts} />);
      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Excerpt 1")).toBeInTheDocument();
    });

    it("opens dialog on click", async () => {
      render(<Blog posts={mockPosts} />);
      fireEvent.click(screen.getByText("Post 1"));

      expect(await screen.findByText("Read Full Article")).toBeInTheDocument();
    });

    it("renders empty state", () => {
      render(<Blog posts={[]} />);
      expect(screen.getByText(/No blog posts yet/i)).toBeInTheDocument();
    });
  });

  describe("Products", () => {
    const mockProducts = [
      {
        id: "1",
        name: "Product 1",
        description: "Desc 1",
        longDescription: "Long Desc 1",
        features: ["F1"],
        image: "I1",
        githubUrl: "http://github.com",
        demoUrl: "http://demo.com",
      },
    ];

    it("renders product", () => {
      render(<Products products={mockProducts} />);
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Desc 1")).toBeInTheDocument();
      expect(screen.getByText("F1")).toBeInTheDocument();
    });

    it("renders empty state", () => {
      render(<Products products={[]} />);
      expect(screen.getByText("No product available yet. Check back soon!")).toBeInTheDocument();
    });
  });

  describe("Mentorship", () => {
    const mockMentors = [
      {
        id: "1",
        name: "Mentor 1",
        role: "Role 1",
        avatar: "/avatar",
        expertise: ["Exp 1"],
        bio: "Bio 1",
        githubUrl: "http://github.com",
      },
    ];
    const mockMentees = [
      {
        id: "1",
        name: "Mentee 1",
        avatar: "/avatar",
        goals: "Goal 1",
        progress: "Progress 1",
        githubUrl: "http://github.com",
      },
    ];

    it("renders mentorship content", () => {
      render(<Mentorship mentors={mockMentors} mentees={mockMentees} />);
      expect(screen.getByText("Mentorship Program")).toBeInTheDocument();

      // Check tabs triggers
      const mentorTrigger = screen.getByText("Our Mentors");
      const menteeTrigger = screen.getByText("Featured Mentees");
      expect(mentorTrigger).toBeInTheDocument();

      // Mentors are default
      expect(screen.getByText("Mentor 1")).toBeInTheDocument();
      expect(screen.getByText("Bio 1")).toBeInTheDocument();

      // Switch to mentees
      // fireEvent.click(menteeTrigger); // Not needed with mocked tabs showing everything
      expect(screen.getByText("Mentee 1")).toBeInTheDocument();
      expect(screen.getByText("Goal 1")).toBeInTheDocument();
    });

    it("renders empty states", () => {
      render(<Mentorship mentors={[]} mentees={[]} />);
      expect(screen.getByText(/Our mentor team is growing/i)).toBeInTheDocument();

      // const menteeTrigger = screen.getByText("Featured Mentees");
      // fireEvent.click(menteeTrigger);
      expect(screen.getByText(/Be the first to join/i)).toBeInTheDocument();
    });
  });

  describe("About", () => {
    it("renders about section", () => {
      render(<About />);
      expect(screen.getByText("About Volvox")).toBeInTheDocument();
      expect(screen.getByText("Our Story")).toBeInTheDocument();
      expect(screen.getByText("Software Development")).toBeInTheDocument();
    });
  });
});
