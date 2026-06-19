import { describe, it, expect } from "vitest";
import { cleanVO, useCleanup } from "../../composables/useCleanup";

describe("cleanVO", () => {
  it("should restructure order object", () => {
    const order = {
      DistribuidorId: "orig",
      Distribuidor: { DistribuidorId: 123 },
      Vehiculo: { ProductoId: 456 },
      ListaPreciosRentaAutos: []
    };
    cleanVO(order);
    expect(order.DistribuidorId).toBe(123);
    expect(order.Distribuidor).toEqual({ DistribuidorId: 123 });
    expect(order.Vehiculo).toEqual({ ProductoId: 456 });
  });

  it("should handle Sobreprecio if present", () => {
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      Sobreprecio: { SobreprecioId: 789 },
      ListaPreciosRentaAutos: []
    };
    cleanVO(order);
    expect(order.Sobreprecio).toEqual({ SobreprecioId: 789 });
  });

  it("should skip Sobreprecio if absent", () => {
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      ListaPreciosRentaAutos: []
    };
    expect(() => cleanVO(order)).not.toThrow();
  });

  it("should set pickUpPlace if provided", () => {
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      ListaPreciosRentaAutos: []
    };
    const pickUpPlace = { nombre: "Airport", puntointeresid: 99 };
    cleanVO(order, pickUpPlace);
    expect(order.LugarRecogida).toEqual({
      nombre: "Airport",
      PuntoInteresId: 99
    });
  });

  it("should set DeliveryPlace if provided", () => {
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      ListaPreciosRentaAutos: []
    };
    const deliveryPlace = { nombre: "Hotel", puntointeresid: 55 };
    cleanVO(order, null, deliveryPlace);
    expect(order.LugarEntrega).toEqual({
      nombre: "Hotel",
      PuntoInteresId: 55
    });
  });

  it("should restructure ListaPreciosRentaAutos", () => {
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      ListaPreciosRentaAutos: [
        {
          PrecioRentaAutos: { PrecioRentaAutosId: 10 }
        },
        {
          PrecioRentaAutos: { PrecioRentaAutosId: 20 }
        }
      ]
    };
    cleanVO(order);
    expect(order.ListaPreciosRentaAutos).toHaveLength(2);
    expect(order.ListaPreciosRentaAutos[0]).toEqual({
      PrecioRentaAutos: { PrecioRentaAutosId: 10 }
    });
  });
});

describe("useCleanup", () => {
  it("should return cleanVO function", () => {
    const { cleanVO: fn } = useCleanup();
    expect(typeof fn).toBe("function");
    const order = {
      Distribuidor: { DistribuidorId: 1 },
      Vehiculo: { ProductoId: 2 },
      ListaPreciosRentaAutos: []
    };
    expect(() => fn(order)).not.toThrow();
  });
});
