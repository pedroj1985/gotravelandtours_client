import HTTP from "./client";

export function hotetecOpenSession() {
  return HTTP.post("/ApiDisponibilidadHotetec/SesionAbrirPeticion", {});
}

export function hotetecStateSession(idSession: string | number) {
  return HTTP.post("/ApiDisponibilidadHotetec/SesionEstado", {
    ideses: idSession
  });
}

export function hotetecBlockProduct(blockProduct: Record<string, unknown>) {
  return HTTP.post("/ApiDisponibilidadHotetec/Bloqueo", blockProduct);
}

export function hotetecCloseReserve(reserveData: Record<string, unknown>) {
  return HTTP.post("/ApiDisponibilidadHotetec/ReservaCerrar", reserveData);
}

export function hotetecCancelReserve(reserveData: Record<string, unknown>) {
  return HTTP.post("/ApiDisponibilidadHotetec/CancelarReserva", reserveData);
}

export function hotetecUpdateDataOnGtt(reserveData: Record<string, unknown>) {
  return HTTP.post("/OrdenAlojamientoes/UpdateDatosHotetec", reserveData);
}
