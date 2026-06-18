import { describe, it, expect } from "vitest";
import {
  existenCombinacionesEnHabitacion,
  existeAcomodacion,
  isRoomCombinationAvailable,
  validateRoomLayout,
  canFulfillAccommodations
} from "../../utils/accommodationValidator";

describe("existeAcomodacion", () => {
  const availableList = [
    { CantAdult: 2, CantNino: 0, hab: "Doble" },
    { CantAdult: 2, CantNino: 1, hab: "Doble" },
    { CantAdult: 1, CantNino: 0, hab: "Sencilla" },
    { CantAdult: 3, CantNino: 0, hab: "Triple" }
  ];

  it("should find doble without kids", () => {
    expect(existeAcomodacion({ hab: "Doble", kids: 0 }, availableList)).toBe(true);
  });

  it("should find doble with kids", () => {
    expect(existeAcomodacion({ hab: "Doble", kids: 1 }, availableList)).toBe(true);
  });

  it("should find sencilla", () => {
    expect(existeAcomodacion({ hab: "Sencilla", kids: 0 }, availableList)).toBe(true);
  });

  it("should not find Triple con 1 nino if not available", () => {
    expect(existeAcomodacion({ hab: "Triple", kids: 1 }, availableList)).toBe(false);
  });

  it("should return false for unknown room type", () => {
    expect(existeAcomodacion({ hab: "Suite", kids: 0 }, availableList)).toBe(false);
  });

  it("should handle empty list", () => {
    expect(existeAcomodacion({ hab: "Doble", kids: 0 }, [])).toBe(false);
  });
});

describe("existenCombinacionesEnHabitacion", () => {
  const availableList = [
    { CantAdult: 2, CantNino: 0, hab: "Doble" },
    { CantAdult: 1, CantNino: 0, hab: "Sencilla" }
  ];

  it("should return true when all accommodations exist", () => {
    const request = [
      { hab: "Doble", kids: 0 },
      { hab: "Sencilla", kids: 0 }
    ];
    expect(existenCombinacionesEnHabitacion(request, availableList)).toBe(true);
  });

  it("should return false when one accommodation is missing", () => {
    const request = [
      { hab: "Doble", kids: 0 },
      { hab: "Triple", kids: 0 }
    ];
    expect(existenCombinacionesEnHabitacion(request, availableList)).toBe(false);
  });

  it("should return true for empty request", () => {
    expect(existenCombinacionesEnHabitacion([], availableList)).toBe(true);
  });
});

describe("isRoomCombinationAvailable", () => {
  const combos = [
    { CantAdult: 2, CantNino: 0 },
    { CantAdult: 2, CantNino: 1 },
    { CantAdult: 1, CantNino: 0 }
  ];

  it("should return true for available combo", () => {
    expect(isRoomCombinationAvailable(2, 0, combos)).toBe(true);
    expect(isRoomCombinationAvailable(1, 0, combos)).toBe(true);
  });

  it("should return false for unavailable combo", () => {
    expect(isRoomCombinationAvailable(3, 0, combos)).toBe(false);
    expect(isRoomCombinationAvailable(2, 2, combos)).toBe(false);
  });

  it("should return false for empty combos", () => {
    expect(isRoomCombinationAvailable(2, 0, [])).toBe(false);
  });
});

describe("validateRoomLayout", () => {
  it("should return true if layout has adults > 0", () => {
    expect(validateRoomLayout({ adults: 2, kids: 0 })).toBe(true);
    expect(validateRoomLayout({ adults: 1 })).toBe(true);
  });

  it("should return false if layout is null/undefined", () => {
    expect(validateRoomLayout(null)).toBe(false);
    expect(validateRoomLayout(undefined)).toBe(false);
  });

  it("should return false if adults is 0 or missing", () => {
    expect(validateRoomLayout({ adults: 0 })).toBe(false);
    expect(validateRoomLayout({ kids: 2 })).toBe(false);
    expect(validateRoomLayout({})).toBe(false);
  });
});

describe("canFulfillAccommodations", () => {
  it("should fulfill matching accommodations", () => {
    const requested = [
      { hab: "Doble", kids: 0 },
      { hab: "Sencilla", kids: 1 }
    ];
    const available = [
      { hab: "Doble", kids: 0 },
      { hab: "Sencilla", kids: 1 }
    ];
    expect(canFulfillAccommodations(requested, available)).toBe(true);
  });

  it("should not fulfill if room types mismatch", () => {
    const requested = [{ hab: "Triple", kids: 0 }];
    const available = [{ hab: "Doble", kids: 0 }];
    expect(canFulfillAccommodations(requested, available)).toBe(false);
  });

  it("should not fulfill if kids capacity insufficient", () => {
    const requested = [{ hab: "Doble", kids: 2 }];
    const available = [{ hab: "Doble", kids: 1 }];
    expect(canFulfillAccommodations(requested, available)).toBe(false);
  });

  it("should handle empty requested array", () => {
    expect(canFulfillAccommodations([], [{ hab: "Doble", kids: 0 }])).toBe(true);
  });

  it("should not reuse rooms", () => {
    const requested = [
      { hab: "Doble", kids: 0 },
      { hab: "Doble", kids: 0 }
    ];
    const available = [{ hab: "Doble", kids: 0 }];
    expect(canFulfillAccommodations(requested, available)).toBe(false);
  });
});
