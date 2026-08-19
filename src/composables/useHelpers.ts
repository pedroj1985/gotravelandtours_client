interface ListItem {
  tipo: "rent" | "lodging";
  precio?: number;
  reservedRooms?: Array<{ CantidadHabitaciones: number; PrecioOrden: number }>;
}

export function useHelpers() {
  function constructSpacedVal(f: string, s: string, separator = " ") {
    return `${f}${separator}${s}`;
  }

  function calculatePrice(value: ListItem[]) {
    return value.reduce((total, item) => {
      if (item.tipo === "rent") {
        return total + (item.precio ?? 0);
      }
      if (item.tipo === "lodging") {
        let totalItem = 0;
        item.reservedRooms?.forEach(x => {
          total += x.CantidadHabitaciones * x.PrecioOrden;
        });
        return total + totalItem;
      }
      return total;
    }, 0);
  }

  function styledPrice(number: number) {
    const intPart = Math.ceil(number);
    const decimalPart = (number - intPart).toFixed(2);
    return {
      intPart,
      decimalPart: Number(decimalPart) === 0 ? "00" : Number(decimalPart)
    };
  }

  return { constructSpacedVal, calculatePrice, styledPrice };
}
