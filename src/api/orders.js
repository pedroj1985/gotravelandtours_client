import HTTP from "./client";

export function authReserve(orden) {
  return HTTP.post("/Ordens", orden);
}

export function authUpdateStatus(orderStatus) {
  return HTTP.post("/Ordens/CambiarEstado", orderStatus);
}

export function authPutReserve(id, orden) {
  return HTTP.put("/Ordens/" + id, orden);
}

export function authGetOrders(searchItem) {
  return HTTP.post("/Ordens/Buscar", searchItem);
}

export function authGetOrdersCount(searchItem) {
  return HTTP.post("/Ordens/Count", searchItem);
}

export function authGetOrder(id) {
  return HTTP.get("/Ordens/" + id);
}

export function voucher(id) {
  return HTTP.get("/VoucherOrdens/Orden/" + id);
}
