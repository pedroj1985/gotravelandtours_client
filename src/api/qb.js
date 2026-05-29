import HTTP from "./client";

export function authCreateQbEstimated(orden) {
  return HTTP.post("/QBIntegracion/createEstimated", orden);
}

export function authUpdateQbEstimated(orden) {
  return HTTP.post("/QBIntegracion/updateEstimated", orden);
}

export function authUpdOnlyInDbQbEstimated(orden) {
  return HTTP.post("/Ordens/UpdEstimated", orden);
}
