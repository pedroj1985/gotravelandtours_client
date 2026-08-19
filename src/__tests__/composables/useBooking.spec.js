import { describe, it, expect } from "vitest";
import { useBooking, MIN_NIGHTS, MAX_NIGHTS } from "../../composables/useBooking";
import dayjs from "dayjs";

const initial = {
  hotel: { nombre: "Melia Cohiba", id: 1 },
  checkin: dayjs("2026-08-10").toDate(),
  checkout: dayjs("2026-08-13").toDate(),
  nights: 3,
  adults: 2,
  children: 1
};

describe("useBooking", () => {
  it("should return initial state", () => {
    const booking = useBooking(initial);
    expect(booking.state.hotel.nombre).toBe("Melia Cohiba");
    expect(booking.hotel.value.nombre).toBe("Melia Cohiba");
    expect(booking.checkin.value.toISOString()).toBe(
      dayjs("2026-08-10").toDate().toISOString()
    );
    expect(booking.checkout.value.toISOString()).toBe(
      dayjs("2026-08-13").toDate().toISOString()
    );
    expect(booking.nights.value).toBe(3);
    expect(booking.adults.value).toBe(2);
    expect(booking.children.value).toBe(1);
  });

  it("should set hotel", () => {
    const booking = useBooking(initial);
    const hotel = { nombre: "Tryp Habana Libre", id: 2 };
    booking.setHotel(hotel);
    expect(booking.hotel.value).toEqual(hotel);
  });

  it("should setCheckin keeping a valid range", () => {
    const booking = useBooking(initial);
    booking.setCheckin(dayjs("2026-08-12").toDate());
    expect(dayjs(booking.checkin.value).format("YYYY-MM-DD")).toBe("2026-08-12");
    expect(dayjs(booking.checkout.value).format("YYYY-MM-DD")).toBe("2026-08-15");
    expect(booking.nights.value).toBe(3);
  });

  it("should adjust checkout when checkin is after checkout", () => {
    const booking = useBooking(initial);
    booking.setCheckin(dayjs("2026-08-20").toDate());
    expect(dayjs(booking.checkout.value).isAfter(dayjs(booking.checkin.value))).toBe(true);
    expect(booking.nights.value).toBeGreaterThanOrEqual(MIN_NIGHTS);
    expect(booking.nights.value).toBeLessThanOrEqual(MAX_NIGHTS);
    expect(dayjs(booking.checkout.value).diff(dayjs(booking.checkin.value), "day")).toBe(
      booking.nights.value
    );
  });

  it("should setCheckin with nights outside range and clamp them", () => {
    const booking = useBooking({
      ...initial,
      checkin: dayjs("2026-08-10").toDate(),
      checkout: dayjs("2026-09-20").toDate() // 41 days
    });
    booking.setCheckin(dayjs("2026-08-10").toDate());
    expect(booking.nights.value).toBe(MAX_NIGHTS);
    expect(dayjs(booking.checkout.value).diff(dayjs(booking.checkin.value), "day")).toBe(
      MAX_NIGHTS
    );
  });

  it("should adjust checkout when checkin equals checkout", () => {
    const booking = useBooking(initial);
    booking.setCheckout(dayjs("2026-08-10").toDate());
    expect(dayjs(booking.checkout.value).isAfter(dayjs(booking.checkin.value))).toBe(true);
    expect(booking.nights.value).toBeGreaterThanOrEqual(MIN_NIGHTS);
  });

  it("should adjust checkout when checkout is before checkin", () => {
    const booking = useBooking(initial);
    booking.setCheckout(dayjs("2026-08-01").toDate());
    expect(dayjs(booking.checkout.value).isAfter(dayjs(booking.checkin.value))).toBe(true);
    expect(dayjs(booking.checkout.value).diff(dayjs(booking.checkin.value), "day")).toBe(
      booking.nights.value
    );
    expect(booking.nights.value).toBeGreaterThanOrEqual(MIN_NIGHTS);
  });

  it("should setNights and recompute checkout", () => {
    const booking = useBooking(initial);
    booking.setNights(7);
    expect(booking.nights.value).toBe(7);
    expect(dayjs(booking.checkout.value).diff(dayjs(booking.checkin.value), "day")).toBe(7);
    expect(dayjs(booking.checkout.value).format("YYYY-MM-DD")).toBe("2026-08-17");
  });

  it("should clamp nights to range on setNights", () => {
    const booking = useBooking(initial);
    booking.setNights(2);
    expect(booking.nights.value).toBe(MIN_NIGHTS);
    booking.setNights(100);
    expect(booking.nights.value).toBe(MAX_NIGHTS);
  });

  it("should clamp visitors to 0-10", () => {
    const booking = useBooking(initial);
    booking.setAdults(-3);
    expect(booking.adults.value).toBe(0);
    booking.setChildren(99);
    expect(booking.children.value).toBe(10);
  });

  it("should force at least 1 adult when both counters are zero", () => {
    const booking = useBooking(initial);
    booking.setChildren(0);
    booking.setAdults(0);
    expect(booking.adults.value).toBe(1);
    expect(booking.children.value).toBe(0);
  });

  it("should return a formatted summary", () => {
    const booking = useBooking(initial);
    const summary = booking.getSummary();
    expect(summary.hotel).toBe("Melia Cohiba");
    expect(summary.checkin).toBe("10 Aug 2026");
    expect(summary.checkout).toBe("13 Aug 2026");
    expect(summary.nights).toBe(3);
    expect(summary.adults).toBe(2);
    expect(summary.children).toBe(1);
  });

  it("should handle hotel as plain string in summary", () => {
    const booking = useBooking({ ...initial, hotel: "Melia Varadero" });
    expect(booking.getSummary().hotel).toBe("Melia Varadero");
  });
});
