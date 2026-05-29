import HTTP from "./client";

export function subscribe(email) {
  return HTTP.get("/Usuarios/Mail", null, {
    params: { email }
  });
}

export function authGetAirlines() {
  return HTTP.get("/TipoAerolineas?col=-1");
}
