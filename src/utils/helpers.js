import { es } from "../lang/es";
import { en } from "../lang/en";
import {uuid} from "vue-uuid"

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
  shoppingCartUpdate(list){
    this.shoppingCartDeleteAll()
    localStorage.setItem("gttCart", JSON.stringify(list))
  },
  shoppingCartAdd(value) {
    value["uID"] = uuid.v4()
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      temp.push(value);
      localStorage.setItem("gttCart", JSON.stringify(temp));
    } else {
      localStorage.setItem("gttCart", JSON.stringify([value]));
    }
  },
  shoppingCartRemoveOne(uID) {
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      let tempWithoutElement = temp.filter(item => {
        return item.uID != uID;
      });
      localStorage.setItem("gttCart", JSON.stringify(tempWithoutElement));
    }
  },
  // shoppingCartEditOne(id, itemEdited){
  //   if (localStorage.getItem("gttCart")) {
  //     let temp = JSON.parse(localStorage.getItem("gttCart"));
  //     let tempOneToEdit = temp.find( item => {
  //       return item.id == id
  //     })
  //     tempOneToEdit = itemEdited.orderVehiculo
  //     console.log(tempOneToEdit)
  //     console.log(temp)
  //     // localStorage.setItem("gttCart", JSON.stringify(tempWithoutElement));
  //   }
  // },
  shoppingCartDeleteAll() {
    localStorage.removeItem("gttCart");
  }
};
