import { onMounted, onBeforeUnmount, type Ref } from "vue";
import { useScrollStore } from "../stores/scrollStore";

export function useScroll(elRef: Ref<HTMLElement | null | undefined>) {
  function handleScroll() {
    const height = window.innerHeight;
    const el = elRef?.value || (elRef?.value as unknown as { $el: HTMLElement })?.$el;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (height * 0.25 > rect.top && 0 < rect.top) {
      useScrollStore().scrollTo(el.id);
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return { handleScroll };
}
