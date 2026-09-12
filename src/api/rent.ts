import HTTP from "./client";

export function authSearchCars(searchItem: Record<string, unknown>) {
  return HTTP.post("/Vehiculoes/BuscarOrden", searchItem);
}

export function authUpdateCar(searchItem: Record<string, unknown>) {
  return HTTP.post("/Vehiculoes/CambiarPrecio", searchItem);
}

export function authGetCar(id: string | number) {
  return HTTP.get("/Vehiculoes/" + id);
}

export function authDeleteCarOrder(id: string | number) {
  return HTTP.delete("/OrdenVehiculoes/" + id);
}

export function authSearchMarcas() {
  return HTTP.get("/Marcas?col=-1");
}

export function authSearchMarca(id: string | number) {
  return HTTP.get("/Marcas/" + id);
}

export function authSearchProvider(id: string | number) {
  return HTTP.get("/Proveedors/" + id);
}
