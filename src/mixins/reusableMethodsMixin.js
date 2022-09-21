export const reusableMethodsMixin = {
  methods: {
    constructSpacedVal(f, s, separator = " ") {
      return `${f}${separator}${s}`;
    },
    calculatePrice(value) {
      this.priceTotal = value.reduce((total, item) => {
        if (item.tipo == "rent") {
          return total + item.precio;
        }
        if (item.tipo == "lodging") {
          let totalItem = 0;
          item.reservedRooms.map((x) => {
            total += x.CantidadHabitaciones * x.PrecioOrden;
          });
          return total + totalItem;
        }
      }, 0);
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = (number - intPart).toFixed(2) * 100;

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    overflowText(text, l = 30) {
      if (text.length > l) {
        return `${text.substring(0, l)}...`;
      }
      return text;
    },
  },
};
