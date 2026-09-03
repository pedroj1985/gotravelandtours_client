import { useCartStore } from "../stores/cartStore";

interface Helpers {
  shoppingCartAdd: (item: any) => void;
}

export function addToCartItem(item: Record<string, unknown>, i: { combinacion: { listado: Array<{ precioObjOne: Record<string, unknown> }>; total: number } }, cant: number, helpers: Helpers) {
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
  useCartStore().refresh();
}

export function reserveItem(router: { push: (route: { name: string }) => void }, item: Record<string, unknown>, i: { combinacion: { listado: Array<{ precioObjOne: Record<string, unknown> }>; total: number } }, cant: number, helpers: Helpers) {
  addToCartItem(item, i, cant, helpers);
  router.push({ name: "reservation" });
}
