import type { Directive, DirectiveBinding } from "vue";

declare global {
  interface HTMLElement {
    __clickOutsideHandler?: (event: Event) => void;
  }
}

export const clickOutside: Directive<HTMLElement, (event: Event) => void> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<(event: Event) => void>) {
    const handler = (event: Event) => {
      if (!el.contains(event.target as Node) && el !== event.target) {
        binding.value(event);
      }
    };
    el.__clickOutsideHandler = handler;
    document.addEventListener("click", handler);
  },
  unmounted(el: HTMLElement) {
    if (el.__clickOutsideHandler) {
      document.removeEventListener("click", el.__clickOutsideHandler);
    }
  }
};
