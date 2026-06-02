// DEPRECATED: Use composables/useHelpers.js instead
import { useHelpers } from "../composables/useHelpers";

export const reusableMethodsMixin = {
  methods: {
    ...useHelpers()
  }
};
