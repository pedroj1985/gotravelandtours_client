export const clickOutside = {
  mounted(el, binding) {
    el.__clickOutsideHandler = (event) => {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.__clickOutsideHandler);
  },
  unmounted(el) {
    document.removeEventListener("click", el.__clickOutsideHandler);
  }
};
