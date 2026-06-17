import { reactive } from "vue";

const state = reactive({
  activeSection: null
});

export const scrollStore = {
  get activeSection() {
    return state.activeSection;
  },
  set activeSection(val) {
    state.activeSection = val;
  },
  scrollTo(sectionId) {
    state.activeSection = sectionId;
  }
};
