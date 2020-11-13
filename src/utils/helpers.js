import { es } from "../lang/es";
import { en } from "../lang/en";

export const helpers = {
  traducir: (data, locale = "es") => {
    if (locale == "es") {
      return es[data] || data;
    }
    return en[data] || data;
  },
  findTransmissionLocale(str) {
    if (str == "Automatico S/Seguro") {
      return "AutomaticoSinSeguro";
    }

    return str;
  },
  getCartItems() {
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      return temp.length;
    }

    return 0;
  },
  shoppingCartAdd(value) {
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      temp.push(value);
      localStorage.setItem("gttCart", JSON.stringify(temp));
    } else {
      localStorage.setItem("gttCart", JSON.stringify([value]));
    }
  },
  shoppingCartRemoveOne(id) {
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      let tempWithoutElement = temp.filter(item => {
        return item.id != id;
      });
      localStorage.setItem("gttCart", JSON.stringify(tempWithoutElement));
    }
  },
  shoppingCartDeleteAll() {
    localStorage.removeItem("gttCart");
  }
};
