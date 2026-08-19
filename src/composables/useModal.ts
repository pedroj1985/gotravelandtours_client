export function useModal(context: Record<string, unknown>) {
  if (!context || typeof context !== "object") {
    throw new Error("useModal requires a component context (this)");
  }

  return {
    open() {
      context.isModalActive = true;
    },
    close() {
      context.isModalActive = false;
    },
    toggle() {
      context.isModalActive = !context.isModalActive;
    },
    set(value: boolean) {
      context.isModalActive = Boolean(value);
    },
    get isOpen() {
      return Boolean(context.isModalActive);
    }
  };
}
