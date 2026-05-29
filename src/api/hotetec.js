import HTTP from "./client";

export function hotetecOpenSession() {
  return HTTP.post("/ApiDisponibilidadHotetec/SesionAbrirPeticion", {});
}

export function hotetecStateSession(idSession) {
  return HTTP.post("/ApiDisponibilidadHotetec/SesionEstado", {
    ideses: idSession
  });
}

export function hotetecBlockProduct(blockProduct) {
  return HTTP.post("/ApiDisponibilidadHotetec/Bloqueo", blockProduct);
}

export function hotetecCloseReserve(reserveData) {
  return HTTP.post("/ApiDisponibilidadHotetec/ReservaCerrar", reserveData);
}

export function hotetecCancelReserve(reserveData) {
  return HTTP.post("/ApiDisponibilidadHotetec/CancelarReserva", reserveData);
}

export function hotetecUpdateDataOnGtt(reserveData) {
  return HTTP.post("/OrdenAlojamientoes/UpdateDatosHotetec", reserveData);
}
