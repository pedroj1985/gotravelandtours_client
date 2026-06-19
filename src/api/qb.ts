import HTTP from "./client";

export function authCreateQbEstimated(orden: Record<string, unknown>) {
  return HTTP.post("/QBIntegracion/createEstimated", orden);
}

export function authUpdateQbEstimated(orden: Record<string, unknown>) {
  return HTTP.post("/QBIntegracion/updateEstimated", orden);
}

export function authUpdOnlyInDbQbEstimated(orden: Record<string, unknown>) {
  return HTTP.post("/Ordens/UpdEstimated", orden);
}
