import { getAllProducts, getAllMentors, getAllMentees } from "@/lib/data";
import { getAllProducts as getProducts, getAllMentors as getMentors, getAllMentees as getMentees } from "@/lib/content";

jest.mock("@/lib/content", () => ({
  getAllProducts: jest.fn(),
  getAllMentors: jest.fn(),
  getAllMentees: jest.fn(),
}));

describe("data lib", () => {
   it("getAllProducts", async () => {
     (getProducts as jest.Mock).mockReturnValue(["p1"]);
     const result = await getAllProducts();
     expect(result).toEqual(["p1"]);
   });

   it("getAllMentors", async () => {
     (getMentors as jest.Mock).mockReturnValue(["m1"]);
     const result = await getAllMentors();
     expect(result.items).toEqual(["m1"]);
     expect(result.total).toBe(1);
   });

   it("getAllMentees", async () => {
     (getMentees as jest.Mock).mockReturnValue(["m1"]);
     const result = await getAllMentees();
     expect(result.items).toEqual(["m1"]);
     expect(result.total).toBe(1);
   });
});
