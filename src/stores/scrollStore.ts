import { defineStore } from "pinia";

interface ScrollState {
  activeSection: string | null;
}

export const useScrollStore = defineStore("scroll", {
  state: (): ScrollState => ({
    activeSection: null,
  }),
  actions: {
    scrollTo(sectionId: string) {
      this.activeSection = sectionId;
    },
  },
});
