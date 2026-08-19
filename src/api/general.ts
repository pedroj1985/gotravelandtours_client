import HTTP from "./client";

export function subscribe(email: string) {
  return HTTP.get("/Usuarios/Mail", {
    params: { email }
  });
}

export function authGetAirlines() {
  return HTTP.get("/TipoAerolineas?col=-1");
}
