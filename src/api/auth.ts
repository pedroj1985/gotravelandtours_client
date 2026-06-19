import HTTP from "./client";
import { useCartStore } from "../stores/cartStore";
import type { LoginRequest, LoginResponse, User } from "../types/auth";

export function authCheck(): boolean {
  return localStorage.getItem("token") != null;
}

export function getUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem("usuarioObjeto") as string);
  } catch {
    return null;
  }
}

export function authGetUser(id: string | number) {
  return HTTP.get("/Clientes/" + id);
}

export function authLogin(user: LoginRequest) {
  return HTTP.post<LoginResponse>("/Login", user);
}

export function authRegister(user: Record<string, unknown>, head: Record<string, string>) {
  return HTTP.post("/Usuarios", user, { headers: head });
}

export function authLog(log: Record<string, unknown>) {
  return HTTP.post("/logs", log);
}

export function closeSession(vueInstance: { $router: { push: (route: { name: string }) => void } }) {
  const saveVersion = JSON.parse(localStorage.getItem("version") as string);
  localStorage.clear();
  localStorage.setItem("version", JSON.stringify(saveVersion));
  useCartStore().refresh();
  vueInstance.$router.push({ name: "index" });
}

export function updateHeader() {}

export function getVoucher() {}

export function authSearchCountries() {
  const axios = require("axios");
  return axios.get("https://restcountries.eu/rest/v2/all?fields=name");
}
