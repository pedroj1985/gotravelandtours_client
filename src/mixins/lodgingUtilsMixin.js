// DEPRECATED: Use composables/useLodging.js instead
import { useLodging } from "../composables/useLodging";
export const lodgingUtilsMixin = {
  methods: {
    ...useLodging(),
    async performSearch(query) {
      const res = await useLodging().executeQuery(query);
      this.searchResult = res;
      return res;
    }
  }
};
