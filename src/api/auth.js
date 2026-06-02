import HTTP from "./client";
import { cartStore } from "../stores/cartStore";

export function authCheck() {
  return localStorage.getItem("token") != null;
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("usuarioObjeto"));
  } catch {
    return null;
  }
}

export function authGetUser(id) {
  return HTTP.get("/Clientes/" + id);
}

export function authLogin(user) {
  return HTTP.post("/Login", user);
}

export function authRegister(user, head) {
  return HTTP.post("/Usuarios", user, { headers: head });
}

export function authLog(log) {
  return HTTP.post("/logs", log);
}

export function closeSession(vueInstance) {
  const saveVersion = JSON.parse(localStorage.getItem("version"));
  localStorage.clear();
  localStorage.setItem("version", JSON.stringify(saveVersion));
  cartStore.refresh();
  vueInstance.$router.push({ name: "index" });
}

export function updateHeader() {}

export function getVoucher() {}

export function authSearchCountries() {
  const axios = require("axios");
  return axios.get("https://restcountries.eu/rest/v2/all?fields=name");
}
