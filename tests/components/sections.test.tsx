import { render, screen } from "@testing-library/react";
import { Blog } from "@/components/blog";
import { Products } from "@/components/products";
import { Mentorship } from "@/components/mentorship";
import { About } from "@/components/about";
import type { BlogPost, ExtendedProduct, Mentor, Mentee } from "@/lib/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { alt = "", ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

interface MotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
    li: ({ children, ...props }: MotionProps) => (
      <li {...(props as React.LiHTMLAttributes<HTMLLIElement>)}>{children}</li>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("canvas-confetti", () => jest.fn(() => Promise.resolve()));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("rehype-highlight", () => () => {});
jest.mock("remark-gfm", () => () => {});

interface TabsProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: TabsProps) => <div>{children}</div>,
  TabsList: ({ children }: TabsProps) => <div>{children}</div>,
  TabsTrigger: ({ children, onClick }: TabsTriggerProps) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  TabsContent: ({ children }: TabsProps) => <div>{children}</div>,
}));

describe("Sections", () => {
  describe("Blog", () => {
    const mockPosts: BlogPost[] = [
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
        views: 0,
      },
    ];

    it("renders posts", () => {
      render(<Blog posts={mockPosts} />);
      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Excerpt 1")).toBeInTheDocument();
    });

    it("links to blog post page", () => {
      render(<Blog posts={mockPosts} />);
      const link = screen.getByRole("link", { name: /Post 1/i });
      expect(link).toHaveAttribute("href", "/blog/post-1");
    });

    it("shows View All Posts button", () => {
      render(<Blog posts={mockPosts} />);
      const viewAllLink = screen.getByRole("link", { name: /View All Posts/i });
      expect(viewAllLink).toHaveAttribute("href", "/blog");
    });

    it("limits to 3 most recent posts", () => {
      const manyPosts: BlogPost[] = [
        {
          ...mockPosts[0],
          id: "1",
          slug: "post-1",
          title: "Post 1",
          date: "2023-01-01",
        },
        {
          ...mockPosts[0],
          id: "2",
          slug: "post-2",
          title: "Post 2",
          date: "2023-02-01",
        },
        {
          ...mockPosts[0],
          id: "3",
          slug: "post-3",
          title: "Post 3",
          date: "2023-03-01",
        },
        {
          ...mockPosts[0],
          id: "4",
          slug: "post-4",
          title: "Post 4",
          date: "2023-04-01",
        },
        {
          ...mockPosts[0],
          id: "5",
          slug: "post-5",
          title: "Post 5",
          date: "2023-05-01",
        },
      ];
      render(<Blog posts={manyPosts} />);
      // Should show only 3 most recent (Post 5, Post 4, Post 3)
      expect(screen.getByText("Post 5")).toBeInTheDocument();
      expect(screen.getByText("Post 4")).toBeInTheDocument();
      expect(screen.getByText("Post 3")).toBeInTheDocument();
      expect(screen.queryByText("Post 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Post 1")).not.toBeInTheDocument();
    });

    it("renders empty state", () => {
      render(<Blog posts={[]} />);
      expect(screen.getByText(/No blog posts yet/i)).toBeInTheDocument();
    });
  });

  describe("Products", () => {
    const mockProducts: ExtendedProduct[] = [
      {
        id: "1",
        name: "Product 1",
        slug: "product-1",
        tagline: "Tagline 1",
        description: "Desc 1",
        longDescription: "Long Desc 1",
        features: ["F1"],
        techStack: ["Tech 1"],
        links: {
          github: "http://github.com",
          demo: "http://demo.com",
        },
        screenshots: [],
        faq: [],
        testimonials: [],
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
      expect(
        screen.getByText("No products available yet. Check back soon!")
      ).toBeInTheDocument();
    });
  });

  describe("Mentorship", () => {
    const mockMentors: Mentor[] = [
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
    const mockMentees: Mentee[] = [
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
      expect(mentorTrigger).toBeInTheDocument();

      // Mentors are default
      expect(screen.getByText("Mentor 1")).toBeInTheDocument();
      expect(screen.getByText("Bio 1")).toBeInTheDocument();

      // With mocked tabs, both mentors and mentees are rendered simultaneously
      expect(screen.getByText("Mentee 1")).toBeInTheDocument();
      expect(screen.getByText("Goal 1")).toBeInTheDocument();
    });

    it("renders empty states", () => {
      render(<Mentorship mentors={[]} mentees={[]} />);
      expect(
        screen.getByText(/Our mentor team is growing/i)
      ).toBeInTheDocument();

      // With mocked tabs, both empty states are rendered simultaneously
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
