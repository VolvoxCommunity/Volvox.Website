import {
  getAllAuthors,
  getAuthorById,
  getAllProducts,
  getAllMentors,
  getAllMentees,
} from "@/lib/content";
import * as fs from "fs";
import { reportError } from "@/lib/logger";

jest.mock("fs");
jest.mock("@/lib/logger", () => ({ reportError: jest.fn() }));

describe("content lib", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getAllAuthors", () => {
    it("returns parsed authors", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAllAuthors();
      expect(result).toEqual(mockAuthors);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });

    it("handles invalid JSON data (Zod validation failure)", () => {
      // Missing required 'role' field should fail Zod validation
      const invalidAuthors = [{ id: "1", name: "Author 1", avatar: "/img1" }];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(invalidAuthors)
      );

      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });

    it("handles malformed JSON", () => {
      (fs.readFileSync as jest.Mock).mockReturnValue("not valid json");

      const result = getAllAuthors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAuthorById", () => {
    it("returns author if found", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAuthorById("1");
      expect(result).toEqual(mockAuthors[0]);
    });

    it("returns null if not found", () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", avatar: "/img1", role: "Role" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockAuthors)
      );

      const result = getAuthorById("2");
      expect(result).toBeNull();
    });
  });

  describe("getAllProducts", () => {
    it("returns products", () => {
      const mock = [
        {
          id: "1",
          name: "P1",
          description: "D1",
          longDescription: "LD1",
          features: ["F1"],
          image: "I1",
        },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllProducts()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllProducts();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAllMentors", () => {
    it("returns mentors", () => {
      const mock = [
        {
          id: "1",
          name: "M1",
          role: "R1",
          avatar: "I1",
          expertise: ["E1"],
          bio: "B1",
        },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllMentors()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllMentors();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe("getAllMentees", () => {
    it("returns mentees", () => {
      const mock = [
        { id: "1", name: "M1", avatar: "I1", goals: "G1", progress: "P1" },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mock));
      expect(getAllMentees()).toEqual(mock);
    });

    it("handles file read errors", () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error("File read error");
      });
      const result = getAllMentees();
      expect(result).toEqual([]);
      expect(reportError).toHaveBeenCalled();
    });
  });
});
