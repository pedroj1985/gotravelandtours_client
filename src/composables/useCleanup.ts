export function cleanVO(order: Record<string, unknown>, pickUpPlace: Record<string, unknown> | null = null, DeliveryPlace: Record<string, unknown> | null = null) {
  const dist = order.Distribuidor as Record<string, unknown>;
  order.DistribuidorId = dist.DistribuidorId;
  order.Distribuidor = {
    DistribuidorId: dist.DistribuidorId
  };
  const veh = order.Vehiculo as Record<string, unknown>;
  order.Vehiculo = {
    ProductoId: veh.ProductoId
  };
  if (order.Sobreprecio) {
    const sp = order.Sobreprecio as Record<string, unknown>;
    order.Sobreprecio = {
      SobreprecioId: sp.SobreprecioId
    };
  }
  if (pickUpPlace) {
    order.LugarRecogida = {
      nombre: pickUpPlace.nombre,
      PuntoInteresId: pickUpPlace.puntointeresid
    };
  }
  if (DeliveryPlace) {
    order.LugarEntrega = {
      nombre: DeliveryPlace.nombre,
      PuntoInteresId: DeliveryPlace.puntointeresid
    };
  }
  const arrLPRA: Array<Record<string, unknown>> = [];
  const list = order.ListaPreciosRentaAutos as Array<Record<string, unknown>>;
  list.forEach(item => {
    const pra = item.PrecioRentaAutos as Record<string, unknown>;
    item.PrecioRentaAutos = {
      PrecioRentaAutosId: pra.PrecioRentaAutosId
    };
    arrLPRA.push({
      PrecioRentaAutos: {
        PrecioRentaAutosId: pra.PrecioRentaAutosId
      }
    });
  });
  order.ListaPreciosRentaAutos = arrLPRA;
}

export function useCleanup() {
  return { cleanVO };
}
