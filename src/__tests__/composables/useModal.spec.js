import { describe, it, expect } from "vitest";
import { useModal } from "../../composables/useModal";

describe("useModal", () => {
  it("should throw if context is missing", () => {
    expect(() => useModal()).toThrow("useModal requires a component context");
  });

  it("should throw if context is not an object", () => {
    expect(() => useModal("not-an-object")).toThrow(
      "useModal requires a component context"
    );
  });

  it("should start closed by default", () => {
    const context = {};
    const modal = useModal(context);
    expect(modal.isOpen).toBe(false);
  });

  it("should open modal", () => {
    const context = {};
    const modal = useModal(context);
    modal.open();
    expect(modal.isOpen).toBe(true);
  });

  it("should close modal", () => {
    const context = { isModalActive: true };
    const modal = useModal(context);
    modal.close();
    expect(modal.isOpen).toBe(false);
  });

  it("should toggle modal", () => {
    const context = {};
    const modal = useModal(context);
    modal.toggle();
    expect(modal.isOpen).toBe(true);
    modal.toggle();
    expect(modal.isOpen).toBe(false);
  });

  it("should set modal state", () => {
    const context = {};
    const modal = useModal(context);
    modal.set(true);
    expect(modal.isOpen).toBe(true);
    modal.set(false);
    expect(modal.isOpen).toBe(false);
  });

  it("should coerce set value to boolean", () => {
    const context = {};
    const modal = useModal(context);
    modal.set(1);
    expect(modal.isOpen).toBe(true);
    modal.set(0);
    expect(modal.isOpen).toBe(false);
  });

  it("should mutate the original context", () => {
    const context = {};
    const modal = useModal(context);
    modal.open();
    expect(context.isModalActive).toBe(true);
    modal.close();
    expect(context.isModalActive).toBe(false);
  });
});
