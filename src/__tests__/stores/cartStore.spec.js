import { describe, it, expect, beforeEach } from "vitest";
import { cartStore } from "../../stores/cartStore";
import { storageService } from "../../utils/storageService";

describe("cartStore", () => {
  beforeEach(() => {
    cartStore.reset();
    localStorage.clear();
  });

  it("should start with empty cart", () => {
    expect(cartStore.count).toBe(0);
    expect(cartStore.items).toEqual([]);
  });

  it("should refresh from storage", () => {
    const cart = [{ id: 1, name: "Item 1", tipo: "rent" }];
    storageService.setCart(cart);
    cartStore.refresh();
    expect(cartStore.items).toEqual(cart);
    expect(cartStore.count).toBe(1);
  });

  it("should update count", () => {
    cartStore.update();
    expect(cartStore.count).toBe(1);
    cartStore.update();
    expect(cartStore.count).toBe(2);
  });

  it("should reset to initial state", () => {
    cartStore.update();
    cartStore.items = [{ id: 1 }];
    cartStore.reset();
    expect(cartStore.count).toBe(0);
    expect(cartStore.items).toEqual([]);
  });

  it("should set items", () => {
    const items = [{ id: 1 }, { id: 2 }];
    cartStore.items = items;
    expect(cartStore.items).toEqual(items);
  });

  it("should set count", () => {
    cartStore.count = 5;
    expect(cartStore.count).toBe(5);
  });
});
