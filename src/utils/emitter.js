export function createEmitter() {
  const handlers = new Map();
  return {
    on(event, handler) {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event).push(handler);
    },
    off(event, handler) {
      const list = handlers.get(event);
      if (list) handlers.set(event, list.filter(h => h !== handler));
    },
    emit(event, payload) {
      (handlers.get(event) || []).forEach(h => h(payload));
    }
  };
}

export const diffDaysEmitter = createEmitter();
