type Handler<T = unknown> = (payload: T) => void;

interface Emitter<T = unknown> {
  on: (event: string, handler: Handler<T>) => void;
  off: (event: string, handler: Handler<T>) => void;
  emit: (event: string, payload: T) => void;
}

export function createEmitter<T = unknown>(): Emitter<T> {
  const handlers = new Map<string, Handler<T>[]>();
  return {
    on(event: string, handler: Handler<T>) {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event)!.push(handler);
    },
    off(event: string, handler: Handler<T>) {
      const list = handlers.get(event);
      if (list) handlers.set(event, list.filter(h => h !== handler));
    },
    emit(event: string, payload: T) {
      (handlers.get(event) || []).forEach(h => h(payload));
    }
  };
}

export const diffDaysEmitter = createEmitter<unknown>();
