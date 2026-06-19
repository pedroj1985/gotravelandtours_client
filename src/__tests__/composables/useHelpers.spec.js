import { describe, it, expect } from "vitest";
import { useHelpers } from "../../composables/useHelpers";

describe("useHelpers", () => {
  describe("constructSpacedVal", () => {
    it("should join values with default separator", () => {
      const { constructSpacedVal } = useHelpers();
      expect(constructSpacedVal("Hello", "World")).toBe("Hello World");
    });

    it("should join values with custom separator", () => {
      const { constructSpacedVal } = useHelpers();
      expect(constructSpacedVal("a", "b", "-")).toBe("a-b");
    });
  });

  describe("styledPrice", () => {
    it("should split integer and decimal parts", () => {
      const { styledPrice } = useHelpers();
      const result = styledPrice(10.5);
      expect(result.intPart).toBeGreaterThanOrEqual(10);
      expect(typeof result.decimalPart).toBe("number");
    });

    it("should handle whole numbers", () => {
      const { styledPrice } = useHelpers();
      const result = styledPrice(100);
      expect(typeof result.intPart).toBe("number");
      expect(typeof result.decimalPart).toBe("string");
    });
  });

  describe("calculatePrice", () => {
    it("should sum rent items prices", () => {
      const { calculatePrice } = useHelpers();
      const items = [
        { tipo: "rent", precio: 100 },
        { tipo: "rent", precio: 50 }
      ];
      expect(calculatePrice(items)).toBe(150);
    });

    it("should return 0 for empty array", () => {
      const { calculatePrice } = useHelpers();
      expect(calculatePrice([])).toBe(0);
    });

    it("should handle lodging items", () => {
      const { calculatePrice } = useHelpers();
      const items = [
        {
          tipo: "lodging",
          reservedRooms: []
        }
      ];
      expect(calculatePrice(items)).toBe(0);
    });
  });
});
