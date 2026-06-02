// DEPRECATED: Use composables/useScroll.js instead
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
        this.$eventBus.$emit("componentScrolled", el.id);
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
