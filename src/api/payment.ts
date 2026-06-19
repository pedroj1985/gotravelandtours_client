import HTTP from "./client";
import type { PaymentRequest } from "../types/payment";

export function getTropiPayToken() {
  return HTTP.get("/ApiTropiPay/GetToken");
}

export function generatePaymentPage(paymentData: PaymentRequest) {
  return HTTP.post("/ApiTropiPay/GenerarPaginaPago", paymentData);
}

export function updateIsPagadoAlojamiento(payData: Record<string, unknown>) {
  return HTTP.post("/OrdenAlojamientoes/UpdateIsPagado", payData);
}

export function updateIsPagadoVehiculo(payData: Record<string, unknown>) {
  return HTTP.post("/OrdenVehiculoes/UpdateIsPagado", payData);
}
