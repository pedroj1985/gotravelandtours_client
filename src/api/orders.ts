import HTTP from "./client";

export function authReserve(orden: Record<string, unknown>) {
  return HTTP.post("/Ordens", orden);
}

export function authUpdateStatus(orderStatus: Record<string, unknown>) {
  return HTTP.post("/Ordens/CambiarEstado", orderStatus);
}

export function authPutReserve(id: string | number, orden: Record<string, unknown>) {
  return HTTP.put("/Ordens/" + id, orden);
}

export function authGetOrders(searchItem: Record<string, unknown>) {
  return HTTP.post("/Ordens/Buscar", searchItem);
}

export function authGetOrdersCount(searchItem: Record<string, unknown>) {
  return HTTP.post("/Ordens/Count", searchItem);
}

export function authGetOrder(id: string | number) {
  return HTTP.get("/Ordens/" + id);
}

export function voucher(id: string | number) {
  return HTTP.get("/VoucherOrdens/Orden/" + id);
}
