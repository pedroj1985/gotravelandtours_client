import { describe, it, expect } from "vitest";
import {
  visitantesToAcomodation,
  extractVisitorCounts,
  getVisitorSummary,
  validateVisitorConfiguration,
  mergeVisitorConfigs,
  createDefaultVisitorLayout
} from "../../utils/visitorTransformer";

describe("createDefaultVisitorLayout", () => {
  it("should create layout with default values (1 adult, 0 kids)", () => {
    const layout = createDefaultVisitorLayout();
    expect(layout.room).toBe(1);
    expect(layout.layout).toHaveLength(2);
    expect(layout.layout[0]).toMatchObject({ code: "adults", value: 1 });
    expect(layout.layout[1]).toMatchObject({ code: "kids", value: 0 });
  });

  it("should create layout with custom values", () => {
    const layout = createDefaultVisitorLayout(2, 1);
    expect(layout.layout[0].value).toBe(2);
    expect(layout.layout[1].value).toBe(1);
  });
});

describe("extractVisitorCounts", () => {
  it("should extract total adults and kids", () => {
    const visitors = [
      createDefaultVisitorLayout(2, 1),
      createDefaultVisitorLayout(1, 0)
    ];
    const counts = extractVisitorCounts(visitors);
    expect(counts.totalAdults).toBe(3);
    expect(counts.totalKids).toBe(1);
    expect(counts.totalVisitors).toBe(4);
  });

  it("should handle empty array", () => {
    const counts = extractVisitorCounts([]);
    expect(counts.totalAdults).toBe(0);
    expect(counts.totalKids).toBe(0);
    expect(counts.totalVisitors).toBe(0);
  });

  it("should handle visitors without layout", () => {
    const visitors = [{ room: 1, layout: [] }];
    const counts = extractVisitorCounts(visitors);
    expect(counts.totalAdults).toBe(0);
    expect(counts.totalKids).toBe(0);
  });
});

describe("getVisitorSummary", () => {
  it("should format summary string", () => {
    const visitors = [createDefaultVisitorLayout(2, 0)];
    expect(getVisitorSummary(visitors)).toBe("2 adultos · 0 niños");
  });

  it("should show kids when present", () => {
    const visitors = [createDefaultVisitorLayout(2, 1)];
    expect(getVisitorSummary(visitors)).toBe("2 adultos · 1 niños");
  });
});

describe("validateVisitorConfiguration", () => {
  it("should return valid for good configuration", () => {
    const visitors = [createDefaultVisitorLayout(2, 0)];
    const result = validateVisitorConfiguration(visitors);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should return invalid for empty array", () => {
    const result = validateVisitorConfiguration([]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Debe seleccionar al menos una habitación");
  });

  it("should return invalid for null/undefined", () => {
    expect(validateVisitorConfiguration(null).isValid).toBe(false);
    expect(validateVisitorConfiguration(undefined).isValid).toBe(false);
  });

  it("should detect room without layout", () => {
    const visitors = [{ room: 1 }];
    const result = validateVisitorConfiguration(visitors);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should detect room with 0 adults", () => {
    const visitors = [createDefaultVisitorLayout(0, 0)];
    const result = validateVisitorConfiguration(visitors);
    expect(result.isValid).toBe(false);
  });
});

describe("mergeVisitorConfigs", () => {
  it("should merge multiple config arrays", () => {
    const a = [1, 2];
    const b = [3, null, 4];
    const result = mergeVisitorConfigs(a, b);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should filter out falsy values", () => {
    const result = mergeVisitorConfigs([null, undefined, false, 0, ""]);
    expect(result).toEqual([]);
  });

  it("should handle single config", () => {
    const result = mergeVisitorConfigs([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe("visitantesToAcomodation", () => {
  it("should convert visitor layouts to accommodation objects", () => {
    const visitors = [createDefaultVisitorLayout(2, 0)];
    const result = visitantesToAcomodation(visitors);
    expect(result).toHaveLength(1);
    expect(result[0].hab).toBe("Doble");
    expect(result[0].adults).toBe(2);
    expect(result[0].kids).toBe(0);
  });

  it("should group identical room types", () => {
    const visitors = [
      createDefaultVisitorLayout(2, 0),
      createDefaultVisitorLayout(2, 0)
    ];
    const result = visitantesToAcomodation(visitors);
    expect(result).toHaveLength(1);
    expect(result[0].cantidad).toBe(2);
  });

  it("should handle different room types", () => {
    const visitors = [
      createDefaultVisitorLayout(1, 0),
      createDefaultVisitorLayout(2, 0)
    ];
    const result = visitantesToAcomodation(visitors);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
