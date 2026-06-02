import HTTP from "./client";

export function getTropiPayToken() {
  return HTTP.get("/ApiTropiPay/GetToken");
}

export function generatePaymentPage(paymentData) {
  return HTTP.post("/ApiTropiPay/GenerarPaginaPago", paymentData);
}

export function updateIsPagadoAlojamiento(payData) {
  return HTTP.post("/OrdenAlojamientoes/UpdateIsPagado", payData);
}

export function updateIsPagadoVehiculo(payData) {
  return HTTP.post("/OrdenVehiculoes/UpdateIsPagado", payData);
}
