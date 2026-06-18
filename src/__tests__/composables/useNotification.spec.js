import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useNotification } from "../../composables/useNotification";

describe("useNotification", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllTimers();
  });

  it("should start with null notification", () => {
    const { notification } = useNotification();
    expect(notification.value).toBeNull();
  });

  it("should show a notification", () => {
    const { notification, showNotification } = useNotification();
    showNotification("Hello", "info", 5000);
    expect(notification.value).toEqual({
      message: "Hello",
      type: "info"
    });
  });

  it("should use default type info", () => {
    const { notification, showNotification } = useNotification();
    showNotification("Test");
    expect(notification.value.type).toBe("info");
  });

  it("should auto-clear after duration", () => {
    const { notification, showNotification } = useNotification();
    showNotification("Temp", "warn", 3000);
    expect(notification.value).not.toBeNull();
    vi.advanceTimersByTime(3000);
    expect(notification.value).toBeNull();
  });

  it("should accept custom type", () => {
    const { notification, showNotification } = useNotification();
    showNotification("Error occurred", "error", 1000);
    expect(notification.value.type).toBe("error");
  });
});
