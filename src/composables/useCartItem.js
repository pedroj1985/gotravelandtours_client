import { cartStore } from "../stores/cartStore";

export function addToCartItem(item, i, cant, helpers) {
  i.combinacion.listado[0].precioObjOne.OrdenAlojamientoId = 0;
  if (cant > 1) {
    i.combinacion.listado[0].precioObjOne.CantidadHabitaciones = cant;
    i.combinacion.total = i.combinacion.total * cant;
    i.combinacion.listado[0].precioObjOne["sameRoom"] = true;
  } else {
    i.combinacion.listado[0].precioObjOne["sameRoom"] = false;
  }
  item["reservedRooms"] = i;
  helpers.shoppingCartAdd(item);
  cartStore.refresh();
}

export function reserveItem(router, item, i, cant, helpers) {
  addToCartItem(item, i, cant, helpers);
  router.push({ name: "reservation" });
}
