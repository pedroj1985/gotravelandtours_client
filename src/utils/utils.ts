import moment from "moment";
import { diffDaysEmitter } from "./emitter";
import { storageService } from "./storageService";
import logger from "./logger";

interface DateRange {
  end: string;
  start: string;
}

interface CartItemWithDates {
  tipo: string;
  orderVehiculo?: { FechaEntrega: string; FechaRecogida: string };
  salida?: string;
  entrada?: string;
}

export function constructDate(date: string | Date): string {
  return moment(date).format("DD MMM YYYY");
}

export function calculateNights(min: string | Date, max: string | Date): number {
  return moment(min).diff(moment(max), "days");
}

export function constructDisplay(d: Record<string, { value: string; display: string }>): string {
  let s = "";
  Object.keys(d).forEach(element => {
    s = s + " · " + d[element].value + " " + d[element].display;
  });

  return s.substring(3);
}

export function verifyDifferentsDates(itemToCompare: { FechaEntrega: string; FechaRecogida: string }, tipo = "rent") {
  const cart = storageService.getCart<CartItemWithDates>();
  if (cart && cart.length > 0) {
    const list = cart.filter(i => {
      return i.tipo == tipo;
    });
    diffDaysEmitter.emit("diffDays", checkDifferentDates(itemToCompare, list));
  }
}

export function verifyDifferentsDatesNoCartReturnBoolean(itemToCompare: { FechaEntrega: string; FechaRecogida: string }, list: CartItemWithDates[]): boolean {
  return checkDifferentDates(itemToCompare, list);
}

export function checkDifferentDates(item: { FechaEntrega: string; FechaRecogida: string }, list: CartItemWithDates[]): boolean {
  const listDates: (DateRange | undefined)[] = list.map(i => {
    if (i.tipo == "rent") {
      return {
        end: i.orderVehiculo!.FechaEntrega,
        start: i.orderVehiculo!.FechaRecogida
      };
    }
    if (i.tipo == "lodging") {
      return {
        end: i.salida!,
        start: i.entrada!
      };
    }
    return undefined;
  });

  let n = false;
  let c = 0;
  while (!n && c < listDates.length) {
    const temp = listDates[c];

    if (!temp) {
      c += 1;
      continue;
    }

    if (
      inBetween(item.FechaEntrega, temp.start, temp.end) ||
      inBetween(item.FechaRecogida, temp.start, temp.end)
    ) {
      n = true;
    } else if (
      inBetween(temp.start, item.FechaRecogida, item.FechaEntrega) ||
      inBetween(temp.end, item.FechaRecogida, item.FechaEntrega)
    ) {
      n = true;
    } else if (
      item.FechaRecogida == temp.start &&
      item.FechaEntrega == temp.end
    ) {
      n = true;
    }

    c += 1;
  }

  return n;
}

function inBetween(item: string, start: string, end: string): boolean {
  return moment(item) > moment(start) && moment(item) < moment(end);
}

export function overflowText(text: string, l = 30): string {
  if (text.length > l) {
    return `${text.substring(0, l)}...`;
  }
  return text;
}

export function hasInsurance(text: string) {
  logger.info(text);
}

export const transmissionTypes = [
  {
    nombre: "Automatico",
    display: "Automático"
  },
  {
    nombre: "Manual",
    display: "Manual"
  }
];
