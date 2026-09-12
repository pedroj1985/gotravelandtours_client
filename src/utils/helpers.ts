import { es } from "../lang/es";
import { en } from "../lang/en";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";
import { hotetecBlockProduct } from "@/utils/auth";
import logger from "./logger";
import { storageService } from "./storageService";
import type { PassengerList } from "../types/order";

interface RoomLayoutResult {
  dobles: number;
  triples: number;
  sencillas: number;
  kids?: number;
  kids2Room?: boolean;
  totalkids2RoomFill?: number;
  [key: string]: unknown;
}

interface RoomTypeInfo {
  Nombre: string;
  TipoHabitacionId: number | string;
}

interface CartItem {
  tipo: string;
  uID?: string;
  orderVehiculo?: { FechaRecogida: string };
  reservedRooms?: unknown;
  [key: string]: unknown;
}

export const helpers = {
  traducir: (data: string, locale = "es"): string => {
    if (locale == "es") {
      return (es as Record<string, string>)[data] || data;
    }
    return (en as Record<string, string>)[data] || data;
  },
  findTransmissionLocale(str: string): string {
    if (str == "Automatico S/Seguro") {
      return "AutomaticoSinSeguro";
    }
    return str;
  },
  getCartItemsList(): CartItem[] {
    return storageService.getCart<CartItem>();
  },
  getCartItems(): number {
    const cart = storageService.getCart<CartItem>();
    return cart ? cart.length : 0;
  },
  shoppingCartUpdate(list: CartItem[]) {
    this.shoppingCartDeleteAll();
    list = this.orderList(list);
    storageService.setCart(list);
  },
  shoppingCartAdd(value: CartItem) {
    value["uID"] = uuidv4();
    const cart = storageService.getCart<CartItem>();
    cart.push(value);
    const orderedCart = this.orderList(cart);
    storageService.setCart(orderedCart);
  },
  generatePassageList(combination: { listado: Array<{ cantidad: number; tipoHabitacion: number; cantidadMenoresPorHabitacion: number }> }): PassengerList {
    let totalA = 0;
    let totalN = 0;

    combination.listado.forEach(i => {
      totalA = totalA + i.cantidad * i.tipoHabitacion;
      totalN = totalN + i.cantidad * i.cantidadMenoresPorHabitacion;
    });

    const adl: Array<{ Id: number; Fecnac: string }> = [];
    const nin: Array<{ Id: number; Fecnac: string }> = [];

    for (let i = 0; i < totalA; i++) {
      adl.push({
        Id: i + 1,
        Fecnac: this.generateDateOFBirth(Math.floor(Math.random() * 40) + 20)
      });
    }

    for (let i = 0; i < totalN; i++) {
      nin.push({
        Id: i + 1,
        Fecnac: this.generateDateOFBirth(Math.floor(Math.random() * 6) + 1)
      });
    }

    return { Adl: adl as unknown as PassengerList["Adl"], Nin: nin as unknown as PassengerList["Nin"] };
  },
  generateDateOFBirth(years: number): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = Math.floor(Math.random() * 28) + 1;

    return `${day}/${month}/${year - years}`;
  },
  shoppingCartRemoveOne(uID: string) {
    const cart = storageService.getCart<CartItem>();
    const filteredCart = cart.filter(item => item.uID != uID);
    storageService.setCart(filteredCart);
  },
  async shoppingCartDeleteAll(cancelBefore = false) {
    if (cancelBefore) {
      const temp: CartItem[] = JSON.parse(localStorage.getItem("gttCart") as string) || [];
      for (const tempElement of temp) {
        if (tempElement.tipo == "lodging") {
          const unblockRequest = (tempElement.reservedRooms as
            | { unblockRequest?: Record<string, unknown> }
            | null
            | undefined)?.unblockRequest;
          try {
            if (unblockRequest) {
              await hotetecBlockProduct(unblockRequest);
            }
          } catch (error) {
            logger.error(error);
          }
        }
      }
      localStorage.removeItem("currentHotelecIds");
    }
    localStorage.removeItem("gttCart");
  },
  orderList(list: CartItem[]): CartItem[] {
    return lodash.orderBy(
      list,
      function(i: CartItem) {
        if (i.tipo == "rent") {
          return i.orderVehiculo?.FechaRecogida;
        }
        return undefined;
      },
      "asc"
    );
  },
  habitacionPorCantidadPersonas(cantidadAdultos: number, todosTiposHabitaciones: RoomTypeInfo[]): RoomTypeInfo | undefined {
    switch (cantidadAdultos) {
      case 1:
        return todosTiposHabitaciones.find(i => i.Nombre == "Sencilla");
      case 2:
        return todosTiposHabitaciones.find(i => i.Nombre == "Doble");
      case 3:
        return todosTiposHabitaciones.find(i => i.Nombre == "Triple");
      default:
        return todosTiposHabitaciones.find(i => i.Nombre == "Familiar");
    }
  },
  toFixed(number: number, decimals: number) {
    const x = Math.pow(10, Number(decimals) + 1);
    return (Number(number) + 1 / x).toFixed(decimals);
  },
  getTotalRooms(obj: RoomLayoutResult): number {
    let totalDobles = obj.dobles;
    let totalTriples = obj.triples;
    let totalSencillas = obj.sencillas;

    return totalDobles + totalTriples + totalSencillas;
  },
  roomCombination2kids(adults: number, kids: number): RoomLayoutResult | string {
    let result: RoomLayoutResult | null = null;

    const totalDoblesKids = Math.floor(kids / 2);
    const totalSencillasKids = kids % 2;

    const totalRoomsKids = totalDoblesKids + totalSencillasKids;

    if (totalRoomsKids <= adults) {
      const doblesRest = Math.abs(adults - totalRoomsKids * 2);
      const tDobles = totalRoomsKids - doblesRest;
      const tSencillas = doblesRest;

      result = {
        dobles: tDobles,
        triples: 0,
        sencillas: tSencillas,
        kids: kids,
        kids2Room: true,
        totalkids2RoomFill: totalDoblesKids
      };

      return result;
    }

    return "ERROR";
  },
  roomCombinationV2(adults: number, kids = 0): RoomLayoutResult | null {
    const d = Math.floor(adults / 2);
    const s = adults % 2;

    const maxK = Math.floor(kids / 2) + (kids % 2);

    if (maxK > d + s) {
      return null;
    }

    const result: RoomLayoutResult = {
      dobles: d,
      triples: 0,
      sencillas: s,
      kids: kids
    };

    return result;
  },
  roomCombination(adults: number, kids = 0): RoomLayoutResult {
    let result: RoomLayoutResult;

    if (adults / 2 >= 1) {
      if (adults % 2 == 0) {
        result = {
          dobles: Math.floor(adults / 2),
          triples: 0,
          sencillas: 0
        };
      } else if (adults % 2 == 1) {
        result = {
          dobles: Math.floor(adults / 2) - 1,
          triples: 1,
          sencillas: 0
        };
      } else if (adults % 2 == 3) {
        result = {
          dobles: Math.floor(adults / 2),
          triples: 1,
          sencillas: 0
        };
      } else {
        result = {
          dobles: 0,
          triples: 0,
          sencillas: 1
        };
      }
    } else {
      result = {
        dobles: 0,
        triples: 0,
        sencillas: 1
      };
    }

    result["kids"] = kids;
    if (kids > this.getTotalRooms(result)) {
      const doblesRest = Math.abs(adults - kids * 2);
      const tDobles = kids - doblesRest;
      const tSencillas = doblesRest;

      result = {
        dobles: tDobles,
        triples: 0,
        sencillas: tSencillas,
        kids: kids
      };
    }

    result["kids2Room"] = false;

    return result;
  }
};
