import { describe, it, expect, beforeEach } from "vitest";
import { scrollStore } from "../../stores/scrollStore";

describe("scrollStore", () => {
  beforeEach(() => {
    scrollStore.activeSection = null;
  });

  it("should start with no active section", () => {
    expect(scrollStore.activeSection).toBeNull();
  });

  it("should scroll to a section", () => {
    scrollStore.scrollTo("section-1");
    expect(scrollStore.activeSection).toBe("section-1");
  });

  it("should update active section on multiple scrolls", () => {
    scrollStore.scrollTo("first");
    scrollStore.scrollTo("second");
    expect(scrollStore.activeSection).toBe("second");
  });

  it("should set active section directly", () => {
    scrollStore.activeSection = "direct-set";
    expect(scrollStore.activeSection).toBe("direct-set");
  });
});
