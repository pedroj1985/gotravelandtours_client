import { describe, it, expect, vi, beforeEach } from "vitest";

// Import actual module (jsdom provides localStorage mock)
import { storageService, STORAGE_KEYS } from "../../utils/storageService";

describe("STORAGE_KEYS", () => {
  it("should define expected keys", () => {
    expect(STORAGE_KEYS.CART).toBe("gttCart");
    expect(STORAGE_KEYS.TOKEN).toBe("token");
    expect(STORAGE_KEYS.EXPIRY_DATE).toBe("fecha_exp");
    expect(STORAGE_KEYS.VERSION).toBe("version");
  });
});

describe("storageService (basic CRUD)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set and get an item", () => {
    const result = storageService.setItem("testKey", "testValue");
    expect(result).toBe(true);
    expect(storageService.getItem("testKey")).toBe("testValue");
  });

  it("should return null for non-existent key", () => {
    expect(storageService.getItem("nonexistent")).toBeNull();
  });

  it("should remove an item", () => {
    storageService.setItem("temp", "value");
    const result = storageService.removeItem("temp");
    expect(result).toBe(true);
    expect(storageService.getItem("temp")).toBeNull();
  });

  it("should clear all items", () => {
    storageService.setItem("a", "1");
    storageService.setItem("b", "2");
    const result = storageService.clear();
    expect(result).toBe(true);
    expect(storageService.getItem("a")).toBeNull();
    expect(storageService.getItem("b")).toBeNull();
  });

  it("should handle localStorage errors gracefully", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage full");
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(storageService.getItem("x")).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    getItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

describe("storageService (JSON operations)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should store and retrieve JSON objects", () => {
    const obj = { name: "test", items: [1, 2, 3] };
    const result = storageService.setJson("jsonKey", obj);
    expect(result).toBe(true);
    expect(storageService.getJson("jsonKey")).toEqual(obj);
  });

  it("should return default value for non-existent JSON key", () => {
    expect(storageService.getJson("missing", [])).toEqual([]);
    expect(storageService.getJson("missing")).toBeNull();
  });

  it("should return default value for malformed JSON", () => {
    storageService.setItem("badJson", "{broken");
    expect(storageService.getJson("badJson", "fallback")).toBe("fallback");
  });
});

describe("storageService (token operations)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set and get token", () => {
    storageService.setToken("my-auth-token");
    expect(storageService.getToken()).toBe("my-auth-token");
  });

  it("should return null when no token", () => {
    expect(storageService.getToken()).toBeNull();
  });
});

describe("storageService (cart operations)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set and get cart", () => {
    const cart = [{ id: 1, name: "Item 1" }];
    storageService.setCart(cart);
    expect(storageService.getCart()).toEqual(cart);
  });

  it("should return empty array when no cart", () => {
    expect(storageService.getCart()).toEqual([]);
  });
});

describe("storageService (expiry date)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set and get expiry date", () => {
    storageService.setExpiryDate("2026-12-31");
    expect(storageService.getExpiryDate()).toBe("2026-12-31");
  });

  it("should return null when no expiry date", () => {
    expect(storageService.getExpiryDate()).toBeNull();
  });
});

describe("storageService (version)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should set and get version", () => {
    storageService.setVersion("1.0.0");
    expect(storageService.getVersion()).toBe("1.0.0");
  });

  it("should return null when no version", () => {
    expect(storageService.getVersion()).toBeNull();
  });
});
