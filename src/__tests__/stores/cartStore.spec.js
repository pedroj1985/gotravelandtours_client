import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "../../stores/cartStore";
import { storageService } from "../../utils/storageService";

describe("cartStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useCartStore().reset();
    localStorage.clear();
  });

  it("should start with empty cart", () => {
    expect(useCartStore().count).toBe(0);
    expect(useCartStore().items).toEqual([]);
  });

  it("should refresh from storage", () => {
    const cart = [{ id: 1, name: "Item 1", tipo: "rent" }];
    storageService.setCart(cart);
    useCartStore().refresh();
    expect(useCartStore().items).toEqual(cart);
    expect(useCartStore().count).toBe(1);
  });

  it("should update count", () => {
    useCartStore().update();
    expect(useCartStore().count).toBe(1);
    useCartStore().update();
    expect(useCartStore().count).toBe(2);
  });

  it("should reset to initial state", () => {
    useCartStore().update();
    useCartStore().items = [{ id: 1 }];
    useCartStore().reset();
    expect(useCartStore().count).toBe(0);
    expect(useCartStore().items).toEqual([]);
  });

  it("should set items", () => {
    const items = [{ id: 1 }, { id: 2 }];
    useCartStore().items = items;
    expect(useCartStore().items).toEqual(items);
  });

  it("should set count", () => {
    useCartStore().count = 5;
    expect(useCartStore().count).toBe(5);
  });
});
