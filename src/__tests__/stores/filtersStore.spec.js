import { describe, it, expect, beforeEach } from "vitest";
import { filtersStore } from "../../stores/filtersStore";

describe("filtersStore", () => {
  beforeEach(() => {
    filtersStore.reset();
  });

  it("should start with empty filters", () => {
    expect(filtersStore.filters).toEqual({});
  });

  it("should update filters (merge)", () => {
    filtersStore.update({ category: "lodging", priceRange: [0, 100] });
    expect(filtersStore.filters.category).toBe("lodging");
    expect(filtersStore.filters.priceRange).toEqual([0, 100]);
  });

  it("should merge new filters with existing", () => {
    filtersStore.update({ category: "lodging" });
    filtersStore.update({ priceRange: [0, 100] });
    expect(filtersStore.filters).toEqual({
      category: "lodging",
      priceRange: [0, 100]
    });
  });

  it("should override existing filter key on update", () => {
    filtersStore.update({ category: "lodging" });
    filtersStore.update({ category: "rent" });
    expect(filtersStore.filters.category).toBe("rent");
  });

  it("should reset to empty", () => {
    filtersStore.update({ category: "lodging" });
    filtersStore.reset();
    expect(filtersStore.filters).toEqual({});
  });

  it("should set filters directly", () => {
    const newFilters = { category: "rent", stars: [3, 4] };
    filtersStore.filters = newFilters;
    expect(filtersStore.filters).toEqual(newFilters);
  });
});
