import HTTP from "./client";

export function authGetImage(id) {
  return HTTP.post("/AlmacenImagenes/getmain", null, {
    params: { idProducto: id }
  });
}

export function authGetImages(id) {
  return HTTP.get("/AlmacenImagenes/Productos/" + id);
}
