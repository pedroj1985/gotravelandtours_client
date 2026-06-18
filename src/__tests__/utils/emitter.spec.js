import { describe, it, expect, vi } from "vitest";
import { createEmitter, diffDaysEmitter } from "../../utils/emitter";

describe("createEmitter", () => {
  it("should create an emitter with on, off, emit methods", () => {
    const emitter = createEmitter();
    expect(emitter).toHaveProperty("on");
    expect(emitter).toHaveProperty("off");
    expect(emitter).toHaveProperty("emit");
  });

  it("should call handler when event is emitted", () => {
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on("test", handler);
    emitter.emit("test", "payload");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("payload");
  });

  it("should call multiple handlers for same event", () => {
    const emitter = createEmitter();
    const h1 = vi.fn();
    const h2 = vi.fn();
    emitter.on("evt", h1);
    emitter.on("evt", h2);
    emitter.emit("evt", 42);
    expect(h1).toHaveBeenCalledWith(42);
    expect(h2).toHaveBeenCalledWith(42);
  });

  it("should NOT call handler after off()", () => {
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on("evt", handler);
    emitter.off("evt", handler);
    emitter.emit("evt", "data");
    expect(handler).not.toHaveBeenCalled();
  });

  it("should not throw when emitting unregistered event", () => {
    const emitter = createEmitter();
    expect(() => emitter.emit("nonexistent", {})).not.toThrow();
  });

  it("should not throw when off() is called for unregistered event", () => {
    const emitter = createEmitter();
    expect(() => emitter.off("nonexistent", () => {})).not.toThrow();
  });

  it("should isolate events between different emitters", () => {
    const e1 = createEmitter();
    const e2 = createEmitter();
    const h1 = vi.fn();
    const h2 = vi.fn();
    e1.on("shared", h1);
    e2.on("shared", h2);
    e1.emit("shared", "only e1");
    expect(h1).toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it("should pass payload through emit correctly", () => {
    const emitter = createEmitter();
    const handler = vi.fn();
    emitter.on("data", handler);
    emitter.emit("data", { a: 1, b: [2, 3] });
    expect(handler).toHaveBeenCalledWith({ a: 1, b: [2, 3] });
  });

  it("should handle multiple events on same emitter", () => {
    const emitter = createEmitter();
    const h1 = vi.fn();
    const h2 = vi.fn();
    emitter.on("a", h1);
    emitter.on("b", h2);
    emitter.emit("a", 1);
    emitter.emit("b", 2);
    expect(h1).toHaveBeenCalledWith(1);
    expect(h2).toHaveBeenCalledWith(2);
  });
});

describe("diffDaysEmitter singleton", () => {
  it("should be an emitter created via createEmitter", () => {
    expect(diffDaysEmitter).toHaveProperty("on");
    expect(diffDaysEmitter).toHaveProperty("off");
    expect(diffDaysEmitter).toHaveProperty("emit");
  });

  it("should emit and receive events", () => {
    const handler = vi.fn();
    diffDaysEmitter.on("diffDays", handler);
    diffDaysEmitter.emit("diffDays", true);
    expect(handler).toHaveBeenCalledWith(true);
    diffDaysEmitter.off("diffDays", handler);
  });

  it("should be a singleton (same reference on re-import)", async () => {
    const { diffDaysEmitter: reImported } = await import("../../utils/emitter");
    expect(reImported).toBe(diffDaysEmitter);
  });
});
