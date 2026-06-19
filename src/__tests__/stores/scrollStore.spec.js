import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useScrollStore } from "../../stores/scrollStore";

describe("scrollStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useScrollStore().activeSection = null;
  });

  it("should start with no active section", () => {
    expect(useScrollStore().activeSection).toBeNull();
  });

  it("should scroll to a section", () => {
    useScrollStore().scrollTo("section-1");
    expect(useScrollStore().activeSection).toBe("section-1");
  });

  it("should update active section on multiple scrolls", () => {
    useScrollStore().scrollTo("first");
    useScrollStore().scrollTo("second");
    expect(useScrollStore().activeSection).toBe("second");
  });

  it("should set active section directly", () => {
    useScrollStore().activeSection = "direct-set";
    expect(useScrollStore().activeSection).toBe("direct-set");
  });
});
