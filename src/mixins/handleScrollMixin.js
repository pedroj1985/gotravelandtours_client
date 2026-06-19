// DEPRECATED: Use composables/useScroll.js instead
import { useScrollStore } from "../stores/scrollStore";

export const handleScrollMixin = {
  methods: {
    handleScroll() {
      let height = window.innerHeight;
      const el = this.$el;
      if (!el) return;
      if (
        height * 0.25 > el.getBoundingClientRect().top &&
        height * 0 < el.getBoundingClientRect().top
      ) {
        useScrollStore().scrollTo(el.id);
      }
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
