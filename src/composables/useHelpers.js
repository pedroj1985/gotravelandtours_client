export function useHelpers() {
  function constructSpacedVal(f, s, separator = " ") {
    return `${f}${separator}${s}`;
  }

  function calculatePrice(value) {
    return value.reduce((total, item) => {
      if (item.tipo === "rent") {
        return total + item.precio;
      }
      if (item.tipo === "lodging") {
        let totalItem = 0;
        item.reservedRooms.forEach(x => {
          total += x.CantidadHabitaciones * x.PrecioOrden;
        });
        return total + totalItem;
      }
      return total;
    }, 0);
  }

  function styledPrice(number) {
    const intPart = Math.ceil(number);
    const decimalPart = (number - intPart).toFixed(2) * 100;
    return {
      intPart,
      decimalPart: decimalPart === 0 ? "00" : decimalPart
    };
  }

  return { constructSpacedVal, calculatePrice, styledPrice };
}
