import axios from "axios";

let headers = {
  "Content-Type": "application/json",
};
export const HTTP = axios.create({
  baseURL: "https://admin.gotravelandtours.com/publicEliecer/api",
  //baseURL: "http://localhost:5000/api",
  timeout: 60000,
});
export function authCheck() {
  if (localStorage.getItem("token") == null) {
    return false;
  }
  return true;
}

export function getVoucher() {
  // URL = "https://admin.gotravelandtours.com/#/dasboard/admin"
  // return HTTP.get("/Clientes/" + id, null, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // /voucher?id=3836&type=Vehicle&position=0
}

export function getUser() {
  let storageUser = JSON.parse(localStorage.getItem("usuarioObjeto"));
  // if (s && u && id) {
  //   return { name: u, clienteId: id };
  // }
  return storageUser;
}

export function authGetUser(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Clientes/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authLogin(user) {
  console.log(user);
  return HTTP.post("/Login", user, headers);
}

export function authRegister(user, head) {
  console.log("header : ", headers);
  console.log("user :", user);
  console.log("head :", head);

  return HTTP.post("/Usuarios", user, { headers: head });
}

export function authSearchLodging(searchItem) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Alojamientoes/BuscarOrden", searchItem, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetLodging(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Alojamientoes/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetLodgings() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Alojamientoes", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetLodgingsAll() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Alojamientoes/Todos", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetRoomPrice(searchRoomPrice) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Alojamientoes/BuscarOrdenPrecio", searchRoomPrice, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchRoomsByLodging(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Habitacions/Producto/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetRoomTypes() {
  let token = localStorage.getItem("token");
  return HTTP.get("/TipoHabitacions?col=-1", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetLodgingEatingPlan() {
  let token = localStorage.getItem("token");
  return HTTP.get("/PlanesAlimenticios?col=-1", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function authGetLodgingEatingPlanOne(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/PlanesAlimenticios/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchRegions() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Regions?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchPuntosInteres() {
  let token = localStorage.getItem("token");
  return HTTP.get("/PuntoInteres?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchMarcas() {
  let token = localStorage.getItem("token");
  return HTTP.get("/Marcas?col=-1", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchMarca(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Marcas/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchProvider(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Proveedors/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authSearchCars(searchItem) {
  let token = localStorage.getItem("token");
  console.log(searchItem);
  return HTTP.post("/Vehiculoes/BuscarOrden", searchItem, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authUpdateCar(searchItem) {
  let token = localStorage.getItem("token");
  console.log(searchItem);
  return HTTP.post("/Vehiculoes/CambiarPrecio", searchItem, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetCar(id) {
  let token = localStorage.getItem("token");
  const resp = HTTP.get("/Vehiculoes/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(resp);
  return resp;
}

export function authDeleteCarOrder(id) {
  let token = localStorage.getItem("token");
  return HTTP.delete("/OrdenVehiculoes/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authReserve(orden) {
  let token = localStorage.getItem("token");
  console.log("orden: ", orden);
  return HTTP.post("/Ordens", orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authCreateQbEstimated(orden) {
  let token = localStorage.getItem("token");
  return HTTP.post("/QBIntegracion/createEstimated", orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function authUpdateQbEstimated(orden) {
  let token = localStorage.getItem("token");
  return HTTP.post("/QBIntegracion/updateEstimated", orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function authUpdOnlyInDbQbEstimated(orden) {
  let token = localStorage.getItem("token");
  return HTTP.post("/Ordens/UpdEstimated", orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authPutReserve(id, orden) {
  let token = localStorage.getItem("token");
  return HTTP.put("/Ordens/" + id, orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetImage(id) {
  let token = localStorage.getItem("token");
  return HTTP.post("/AlmacenImagenes/getmain", null, {
    params: { idProducto: id },
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function authGetImages(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/AlmacenImagenes/Productos/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function authGetOrders(searchItem) {
  let token = localStorage.getItem("token");
  try {
    return HTTP.post("/Ordens/Buscar", searchItem, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.log(error);
  }
}

export function authGetOrdersCount(searchItem) {
  let token = localStorage.getItem("token");
  console.log("parametro", searchItem);
  try {
    const data = HTTP.post("/Ordens/Count", searchItem, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response-DATA", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export function authGetOrder(id) {
  let token = localStorage.getItem("token");
  return HTTP.get("/Ordens/" + id, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function subscribe(email) {
  return HTTP.get("/Usuarios/Mail", null, {
    params: {
      email: email,
    },
  });
}

export function voucher(id) {
  return HTTP.get("/VoucherOrdens/Orden/" + id);
}

export function authSearchCountries() {
  return axios.get("https://restcountries.eu/rest/v2/all?fields=name");
}

export function updateHeader(token) {
  headers = {
    ...headers,
    ...{
      Authorization: `Bearer ${token}`,
    },
  };
}

export function closeSession(vueInstance) {
  const saveVersion = JSON.parse(localStorage.getItem("version"));
  localStorage.clear();
  localStorage.setItem("version", JSON.stringify(saveVersion));
  vueInstance.$eventCartBus.$emit("updateCart");
  vueInstance.$router.push({ name: "index" });
}
