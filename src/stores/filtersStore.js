import Vue from "vue";

const state = Vue.observable({
  filters: {}
});

export const filtersStore = {
  get filters() {
    return state.filters;
  },
  set filters(val) {
    state.filters = val;
  },
  update(newFilters) {
    state.filters = { ...state.filters, ...newFilters };
  },
  reset() {
    state.filters = {};
  }
};
