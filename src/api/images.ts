import HTTP from "./client";

export function authGetImage(id: string | number) {
  return HTTP.post("/AlmacenImagenes/getmain", null, {
    params: { idProducto: id }
  });
}

export function authGetImages(id: string | number) {
  return HTTP.get("/AlmacenImagenes/Productos/" + id);
}
