import HTTP from "./client";

export function authSearchCars(searchItem) {
  return HTTP.post("/Vehiculoes/BuscarOrden", searchItem);
}

export function authUpdateCar(searchItem) {
  return HTTP.post("/Vehiculoes/CambiarPrecio", searchItem);
}

export function authGetCar(id) {
  return HTTP.get("/Vehiculoes/" + id);
}

export function authDeleteCarOrder(id) {
  return HTTP.delete("/OrdenVehiculoes/" + id);
}

export function authSearchMarcas() {
  return HTTP.get("/Marcas?col=-1");
}

export function authSearchMarca(id) {
  return HTTP.get("/Marcas/" + id);
}

export function authSearchProvider(id) {
  return HTTP.get("/Proveedors/" + id);
}
