import axios from "axios";

let headers = {
  "Content-Type": "application/json"
};
export const HTTP = axios.create({
  baseURL: "https://admin.gotravelandtours.com/publicEliecer/api",
  timeout: 30000
});
export function authCheck() {
  if (localStorage.getItem("token") == null) {
    return false;
  }
  return true;
}

export function getUser() {
  let s = localStorage.getItem("token");
  let u = localStorage.getItem("nombre");
  let id = localStorage.getItem("cliente");
  if (s && u && id) {
    return { name: u, clienteId: id };
  }
  return null;
}

export function authLogin(user) {
  return HTTP.post("/Login", user, headers);
}

export function authRegister(user, head) {
  console.log(headers);
  return HTTP.post("/Usuarios", user, { headers: head });
}

export function authSearchLodging(searchItem) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Alojamientoes/BuscarOrden", searchItem, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchRegions() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Regions?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchPuntosInteres() {
  let token = localStorage.getItem("token");
  return HTTP.get("/PuntoInteres?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchMarcas() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Marcas?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchMarca(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Marcas/" + id, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchProvider(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Proveedors/" + id, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authSearchCars(searchItem) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Vehiculoes/BuscarOrden", searchItem, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authGetCar(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Vehiculoes/" + id, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authDeleteCarOrder(id) {
  let token = localStorage.getItem("token");
  return HTTP.delete("/OrdenVehiculoes/" + id, null, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function authReserve(orden) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Ordens", orden, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authCreateQbEstimated(orden){
  let token = localStorage.getItem("token");
  return HTTP.post("/QBIntegracion/createEstimated", orden, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
export function authUpdateQbEstimated(orden){
  let token = localStorage.getItem("token");
  return HTTP.post("/QBIntegracion/updateEstimated", orden, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authPutReserve(id, orden) {
  let token = localStorage.getItem("token");
  return HTTP.put("/Ordens/" + id, orden, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authGetImage(id) {
  let token = localStorage.getItem("token");
  return HTTP.post("/AlmacenImagenes/getmain", null, {
    params: { idProducto: id },
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authGetOrders(searchItem) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Ordens/Buscar", searchItem, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authGetOrdersCount(searchItem) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Ordens/Count", searchItem, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function authGetOrder(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Ordens/" + id, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function subscribe(email) {
  return HTTP.get("/Usuarios/Mail", null, {
    params: {
      email: email
    }
  });
}

export function authSearchCountries() {
  return axios.get("https://restcountries.eu/rest/v2/all?fields=name");
}

export function updateHeader(token) {
  headers = {
    ...headers,
    ...{
      Authorization: `Bearer ${token}`
    }
  };
}

export function closeSession(vueInstance) {
  localStorage.clear();
  vueInstance.$eventCartBus.$emit("updateCart");
  vueInstance.$router.push({ name: "index" });
}