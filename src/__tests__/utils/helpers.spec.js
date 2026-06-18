import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock vue-uuid
vi.mock("vue-uuid", () => ({
  uuid: { v4: () => "mocked-uuid-12345" }
}));

// Mock hotetecBlockProduct from auth
vi.mock("@/utils/auth", () => ({
  hotetecBlockProduct: vi.fn().mockResolvedValue(true)
}));

import { helpers } from "../../utils/helpers";
import { storageService } from "../../utils/storageService";
import * as auth from "@//utils/auth";

describe("helpers.traducir", () => {
  it("should translate ES strings", () => {
    expect(helpers.traducir("yes", "es")).toBe("Si");
    expect(helpers.traducir("Economico", "es")).toBe("Económico");
  });

  it("should translate EN strings", () => {
    expect(helpers.traducir("yes", "en")).toBe("Yes");
    expect(helpers.traducir("Economico", "en")).toBe("Economic");
  });

  it("should return original string if not found", () => {
    expect(helpers.traducir("nonexistent", "es")).toBe("nonexistent");
    expect(helpers.traducir("nonexistent", "en")).toBe("nonexistent");
  });

  it("should default to ES locale", () => {
    expect(helpers.traducir("yes")).toBe("Si");
  });
});

describe("helpers.findTransmissionLocale", () => {
  it("should convert 'Automatico S/Seguro'", () => {
    expect(helpers.findTransmissionLocale("Automatico S/Seguro")).toBe("AutomaticoSinSeguro");
  });

  it("should return other strings unchanged", () => {
    expect(helpers.findTransmissionLocale("Manual")).toBe("Manual");
    expect(helpers.findTransmissionLocale("Automatico")).toBe("Automatico");
  });
});

describe("helpers.getCartItems / getCartItemsList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return empty list when no cart", () => {
    expect(helpers.getCartItemsList()).toEqual([]);
    expect(helpers.getCartItems()).toBe(0);
  });

  it("should return cart from storage", () => {
    const cart = [{ id: 1, tipo: "rent" }];
    storageService.setCart(cart);
    expect(helpers.getCartItemsList()).toEqual(cart);
    expect(helpers.getCartItems()).toBe(1);
  });
});

describe("helpers.shoppingCartAdd", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add item with uID to cart", () => {
    helpers.shoppingCartAdd({ name: "Item", tipo: "rent" });
    const cart = storageService.getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].uID).toBe("mocked-uuid-12345");
    expect(cart[0].name).toBe("Item");
  });

  it("should append to existing cart", () => {
    helpers.shoppingCartAdd({ name: "A", tipo: "rent" });
    helpers.shoppingCartAdd({ name: "B", tipo: "rent" });
    const cart = storageService.getCart();
    expect(cart).toHaveLength(2);
  });
});

describe("helpers.shoppingCartRemoveOne", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should remove item by uID", () => {
    helpers.shoppingCartAdd({ name: "Item1", tipo: "rent" });
    helpers.shoppingCartAdd({ name: "Item2", tipo: "rent" });
    const cart = storageService.getCart();
    const uidToRemove = cart[0].uID;
    helpers.shoppingCartRemoveOne(uidToRemove);
    const updatedCart = storageService.getCart();
    expect(updatedCart).toHaveLength(1);
    expect(updatedCart[0].uID).not.toBe(uidToRemove);
  });

  it("should not throw when removing non-existent uID", () => {
    expect(() => helpers.shoppingCartRemoveOne("nonexistent")).not.toThrow();
  });
});

describe("helpers.toFixed", () => {
  it("should round numbers correctly", () => {
    expect(helpers.toFixed(10.5, 0)).toBe("11");
    expect(helpers.toFixed(10.4, 0)).toBe("11");
  });

  it("should format with specified decimals", () => {
    expect(helpers.toFixed(10.1234, 2)).toBe("10.13");
    expect(helpers.toFixed(10.1, 2)).toBe("10.11");
  });
});

describe("helpers.habitacionPorCantidadPersonas", () => {
  const roomTypes = [
    { Nombre: "Sencilla", TipoHabitacionId: 1 },
    { Nombre: "Doble", TipoHabitacionId: 2 },
    { Nombre: "Triple", TipoHabitacionId: 3 },
    { Nombre: "Familiar", TipoHabitacionId: 4 }
  ];

  it("should find room by capacity", () => {
    expect(helpers.habitacionPorCantidadPersonas(1, roomTypes).Nombre).toBe("Sencilla");
    expect(helpers.habitacionPorCantidadPersonas(2, roomTypes).Nombre).toBe("Doble");
    expect(helpers.habitacionPorCantidadPersonas(3, roomTypes).Nombre).toBe("Triple");
  });

  it("should return Familiar for unknown capacity", () => {
    expect(helpers.habitacionPorCantidadPersonas(5, roomTypes).Nombre).toBe("Familiar");
  });

  it("should return undefined when no match", () => {
    expect(helpers.habitacionPorCantidadPersonas(1, [])).toBeUndefined();
  });
});

describe("helpers.getTotalRooms", () => {
  it("should sum room types", () => {
    expect(helpers.getTotalRooms({ dobles: 2, triples: 1, sencillas: 0 })).toBe(3);
  });
});

describe("helpers.roomCombination", () => {
  it("should return all sencillas for 1 adult", () => {
    const result = helpers.roomCombination(1);
    expect(result.sencillas).toBe(1);
    expect(result.kids2Room).toBe(false);
    expect(result.kids).toBe(0);
  });

  it("should handle adults with kids overflow", () => {
    const result = helpers.roomCombination(2, 3);
    expect(result.kids).toBe(3);
    // Kids overflow triggers recalculation
    expect(result.kids2Room).toBe(false);
  });
});

describe("helpers.roomCombinationV2", () => {
  it("should return null when kids exceed room capacity", () => {
    const result = helpers.roomCombinationV2(1, 5);
    expect(result).toBeNull();
  });

  it("should calculate valid combination", () => {
    const result = helpers.roomCombinationV2(2, 0);
    expect(result.dobles).toBe(1);
    expect(result.sencillas).toBe(0);
    expect(result.kids).toBe(0);
  });

  it("should handle kids within capacity", () => {
    const result = helpers.roomCombinationV2(2, 1);
    expect(result).not.toBeNull();
    expect(result.kids).toBe(1);
  });
});

describe("helpers.roomCombination2kids", () => {
  it("should return layout with kids2Room flag", () => {
    const result = helpers.roomCombination2kids(2, 2);
    expect(result.kids2Room).toBe(true);
    expect(result.totalkids2RoomFill).toBe(1);
  });

  it("should return ERROR when kids rooms exceed adults", () => {
    const result = helpers.roomCombination2kids(1, 4);
    expect(result).toBe("ERROR");
  });
});

describe("helpers.generateDateOFBirth", () => {
  it("should generate date in DD/MM/YYYY format", () => {
    const dob = helpers.generateDateOFBirth(30);
    const parts = dob.split("/");
    expect(parts).toHaveLength(3);
    expect(Number(parts[0])).toBeGreaterThanOrEqual(1);
    expect(Number(parts[0])).toBeLessThanOrEqual(28);
    expect(Number(parts[2])).toBeGreaterThan(0);
  });
});

describe("helpers.generatePassageList", () => {
  it("should generate passenger lists from combination", () => {
    const combination = {
      listado: [
        { cantidad: 2, tipoHabitacion: 2, cantidadMenoresPorHabitacion: 0 },
        { cantidad: 1, tipoHabitacion: 1, cantidadMenoresPorHabitacion: 1 }
      ]
    };
    const result = helpers.generatePassageList(combination);
    expect(result.Adl.length).toBeGreaterThan(0);
    expect(result.Nin.length).toBeGreaterThan(0);
  });

  it("should handle empty combination", () => {
    const combination = { listado: [] };
    const result = helpers.generatePassageList(combination);
    expect(result.Adl).toHaveLength(0);
    expect(result.Nin).toHaveLength(0);
  });
});

describe("helpers.orderList", () => {
  it("should order rent items by FechaRecogida", () => {
    const list = [
      { tipo: "rent", orderVehiculo: { FechaRecogida: "2026-06-20" } },
      { tipo: "rent", orderVehiculo: { FechaRecogida: "2026-06-18" } }
    ];
    const ordered = helpers.orderList(list);
    expect(ordered[0].orderVehiculo.FechaRecogida).toBe("2026-06-18");
    expect(ordered[1].orderVehiculo.FechaRecogida).toBe("2026-06-20");
  });

  it("should handle mixed types", () => {
    const list = [
      { tipo: "lodging", entrada: "2026-06-20" },
      { tipo: "rent", orderVehiculo: { FechaRecogida: "2026-06-18" } }
    ];
    const ordered = helpers.orderList(list);
    expect(ordered).toHaveLength(2);
  });
});

describe("helpers.shoppingCartDeleteAll", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should clear cart from localStorage", async () => {
    storageService.setCart([{ id: 1 }]);
    expect(storageService.getCart()).toHaveLength(1);
    await helpers.shoppingCartDeleteAll();
    expect(storageService.getCart()).toEqual([]);
  });

  it("should call hotetecBlockProduct when cancelBefore is true", async () => {
    const item = {
      tipo: "lodging",
      reservedRooms: { unblockRequest: { roomId: 1 } }
    };
    storageService.setCart([item]);
    await helpers.shoppingCartDeleteAll(true);
    expect(auth.hotetecBlockProduct).toHaveBeenCalled();
  });
});
