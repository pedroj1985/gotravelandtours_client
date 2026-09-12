import HTTP from "./client";
import type { PriceSearchObj } from "../types/api";

export function authSearchLodging(searchItem: Record<string, unknown>) {
  return HTTP.post("/Alojamientoes/BuscarOrden", searchItem);
}

export function authGetLodging(id: string | number) {
  return HTTP.get("/Alojamientoes/" + id);
}

export function authGetLodgings() {
  return HTTP.get("/Alojamientoes");
}

export function authGetLodgingsAll() {
  return HTTP.get("/Alojamientoes/Todos");
}

export function authGetRoomPrice(searchRoomPrice: Record<string, unknown>) {
  return HTTP.post("/Alojamientoes/BuscarOrdenPrecio", searchRoomPrice);
}

export function authSearchRoomsByLodging(id: string | number) {
  return HTTP.get("/Habitacions/Producto/" + id);
}

export function authGetRoomTypes() {
  return HTTP.get("/TipoHabitacions?col=-1");
}

export function authGetLodgingEatingPlan() {
  return HTTP.get("/PlanesAlimenticios?col=-1");
}

export function authGetLodgingEatingPlanOne(id: string | number) {
  return HTTP.get("/PlanesAlimenticios/" + id);
}

export function authGetHotelList() {
  return HTTP.get("/Alojamientoes/GetHotelList");
}

export function authSearchRegions() {
  return HTTP.get("/Regions?col=-1");
}

export function authSearchPuntosInteres() {
  return HTTP.get("/PuntoInteres?col=-1");
}

export function getPackages(searchRoomPrice: PriceSearchObj) {
  return HTTP.post("/Paquetes/BuscarOrden", searchRoomPrice);
}
