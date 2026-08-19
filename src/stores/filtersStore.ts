import { defineStore } from "pinia";

interface FiltersState {
  filters: Record<string, unknown>;
}

export const useFiltersStore = defineStore("filters", {
  state: (): FiltersState => ({
    filters: {},
  }),
  actions: {
    update(newFilters: Record<string, unknown>) {
      this.filters = { ...this.filters, ...newFilters };
    },
    reset() {
      this.filters = {};
    },
  },
});
