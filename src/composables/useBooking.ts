import { reactive, toRefs } from "vue";
import dayjs from "dayjs";

export const MIN_NIGHTS = 3;
export const MAX_NIGHTS = 30;
export const MAX_VISITORS = 10;

export type Hotel = string | { nombre: string; [key: string]: unknown } | null;

export interface BookingInitial {
  hotel?: Hotel;
  checkin?: Date | string | null;
  checkout?: Date | string | null;
  nights?: number;
  adults?: number;
  children?: number;
}

export interface BookingState {
  hotel: Hotel;
  checkin: Date | null;
  checkout: Date | null;
  nights: number;
  adults: number;
  children: number;
}

export interface BookingSummary {
  hotel: string;
  checkin: string | null;
  checkout: string | null;
  nights: number;
  adults: number;
  children: number;
}

type DateInput = Date | string | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d.toDate() : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Estado centralizado del formulario de reserva de alojamiento.
 * Centraliza las reglas de negocio y garantiza la sincronización
 * entre los campos: destino, fechas, noches y visitantes.
 */
export function useBooking(initial: BookingInitial = {}) {
  const state = reactive<BookingState>({
    hotel: initial.hotel ?? null,
    checkin: toDate(initial.checkin) ?? dayjs().add(4, "day").toDate(),
    checkout:
      toDate(initial.checkout) ?? dayjs().add(MIN_NIGHTS, "day").toDate(),
    nights: clamp(initial.nights ?? MIN_NIGHTS, MIN_NIGHTS, MAX_NIGHTS),
    adults: clamp(initial.adults ?? 1, 0, MAX_VISITORS),
    children: clamp(initial.children ?? 0, 0, MAX_VISITORS)
  });

  /**
   * Reglas de negocio comunes a setCheckin/setCheckout:
   * 1. checkout debe ser siempre mayor que checkin (mínimo 1 día de diferencia).
   * 2. nights siempre dentro de [MIN_NIGHTS, MAX_NIGHTS].
   * 3. Al forzar nights, checkout se ajusta a checkin + nights.
   */
  function recalcDates(): void {
    if (!state.checkin) return;

    if (
      !state.checkout ||
      dayjs(state.checkout).isSame(dayjs(state.checkin)) ||
      dayjs(state.checkout).isBefore(dayjs(state.checkin))
    ) {
      state.checkout = dayjs(state.checkin).add(1, "day").toDate();
    }

    const diff = dayjs(state.checkout).diff(dayjs(state.checkin), "day");
    state.nights = clamp(diff, MIN_NIGHTS, MAX_NIGHTS);
    state.checkout = dayjs(state.checkin).add(state.nights, "day").toDate();
  }

  function normalizeVisitors(): void {
    state.adults = clamp(Number(state.adults) || 0, 0, MAX_VISITORS);
    state.children = clamp(Number(state.children) || 0, 0, MAX_VISITORS);
    if (state.adults === 0 && state.children === 0) {
      state.adults = 1;
    }
  }

  function setHotel(hotel: Hotel): void {
    state.hotel = hotel;
  }

  function setCheckin(date: DateInput): void {
    const d = toDate(date);
    if (!d) return;
    state.checkin = d;
    recalcDates();
  }

  function setCheckout(date: DateInput): void {
    const d = toDate(date);
    if (!d) return;
    state.checkout = d;
    recalcDates();
  }

  function setNights(n: number | string): void {
    const value = Number(n);
    if (Number.isNaN(value)) return;
    if (!state.checkin) return;
    state.nights = clamp(value, MIN_NIGHTS, MAX_NIGHTS);
    state.checkout = dayjs(state.checkin).add(state.nights, "day").toDate();
  }

  function setAdults(n: number): void {
    state.adults = n;
    normalizeVisitors();
  }

  function setChildren(n: number): void {
    state.children = n;
    normalizeVisitors();
  }

  function getSummary(): BookingSummary {
    const hotel =
      state.hotel && typeof state.hotel === "object"
        ? state.hotel.nombre
        : state.hotel;
    return {
      hotel: hotel ?? "Sin seleccionar",
      checkin: state.checkin
        ? dayjs(state.checkin).format("DD MMM YYYY")
        : null,
      checkout: state.checkout
        ? dayjs(state.checkout).format("DD MMM YYYY")
        : null,
      nights: state.nights,
      adults: state.adults,
      children: state.children
    };
  }

  return {
    state,
    ...toRefs(state),
    setHotel,
    setCheckin,
    setCheckout,
    setNights,
    setAdults,
    setChildren,
    getSummary
  };
}