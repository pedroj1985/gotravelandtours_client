import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFiltersStore } from "../../stores/filtersStore";

describe("filtersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useFiltersStore().reset();
  });

  it("should start with empty filters", () => {
    expect(useFiltersStore().filters).toEqual({});
  });

  it("should update filters (merge)", () => {
    useFiltersStore().update({ category: "lodging", priceRange: [0, 100] });
    expect(useFiltersStore().filters.category).toBe("lodging");
    expect(useFiltersStore().filters.priceRange).toEqual([0, 100]);
  });

  it("should merge new filters with existing", () => {
    useFiltersStore().update({ category: "lodging" });
    useFiltersStore().update({ priceRange: [0, 100] });
    expect(useFiltersStore().filters).toEqual({
      category: "lodging",
      priceRange: [0, 100]
    });
  });

  it("should override existing filter key on update", () => {
    useFiltersStore().update({ category: "lodging" });
    useFiltersStore().update({ category: "rent" });
    expect(useFiltersStore().filters.category).toBe("rent");
  });

  it("should reset to empty", () => {
    useFiltersStore().update({ category: "lodging" });
    useFiltersStore().reset();
    expect(useFiltersStore().filters).toEqual({});
  });

  it("should set filters directly", () => {
    const newFilters = { category: "rent", stars: [3, 4] };
    useFiltersStore().filters = newFilters;
    expect(useFiltersStore().filters).toEqual(newFilters);
  });
});
