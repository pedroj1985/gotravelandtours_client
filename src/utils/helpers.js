import { es } from "../lang/es";
import { en } from "../lang/en";
import {uuid} from "vue-uuid"
import lodash from 'lodash'


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
  getCartItemsList() {
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      return temp;
    }

    return 0;
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
    list = this.orderList(list);
    localStorage.setItem("gttCart", JSON.stringify(list))
  },
  shoppingCartAdd(value) {
    value["uID"] = uuid.v4()
    if (localStorage.getItem("gttCart")) {
      let temp = JSON.parse(localStorage.getItem("gttCart"));
      temp.push(value);
      temp = this.orderList(temp);
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
  },
  orderList(list){
    return lodash.orderBy(list, function(i){
      if(i.tipo == 'rent'){
        return i.orderVehiculo.FechaRecogida
      }
    }, 'asc');
  },
  habitacionPorCantidadPersonas(cantidadAdultos, todosTiposHabitaciones){
      switch (cantidadAdultos) {
          case 1:
              return todosTiposHabitaciones.find( i => i.Nombre == "Sencilla")
          case 2: 
              return todosTiposHabitaciones.find( i => i.Nombre == "Doble")
          case 3:
              return todosTiposHabitaciones.find( i => i.Nombre == "Triple")
          default:
              return todosTiposHabitaciones.find( i => i.Nombre == "Familiar")
      }
  },
  toFixed(number, decimals) {
    var x = Math.pow(10, Number(decimals) + 1);
    return (Number(number) + (1 / x)).toFixed(decimals)
  },
  getTotalRooms(obj){
      let totalDobles = obj.dobles
      let totalTriples = obj.triples
      let totalSencillas = obj.sencillas

      return totalDobles +
              totalTriples +
              totalSencillas
  },
  roomCombination2kids(adults, kids){
    let result = null;

    let totalDoblesKids = Math.floor(kids / 2);
    let totalSencillasKids = kids % 2

    let totalRoomsKids = totalDoblesKids + totalSencillasKids

    if(totalRoomsKids <= adults)
    {
      let doblesRest = Math.abs(adults - (totalRoomsKids * 2))
      let tDobles = totalRoomsKids - doblesRest
      let tSencillas = doblesRest

      result = {
          dobles: tDobles,
          triples: 0,
          sencillas: tSencillas,
          kids: kids,
          kids2Room: true,
          totalkids2RoomFill: totalDoblesKids
      }

      return result
    }

    return 'ERROR'
  },
  roomCombinationV2(adults, kids = 0){

    let d = Math.floor(adults / 2)
    let s = adults % 2

    let maxK = Math.floor(kids / 2) + kids%2

    if(maxK > d+s)
    {
      return null
    }

    let result = {
      dobles: d,
      triples: 0,
      sencillas: s,
      kids: kids
    }

    return result

  },
  roomCombination(adults, kids = 0){

            let result = null;

            if(adults / 2 >= 1){
                if(adults % 2 == 0){
                    result = {
                        dobles: Math.floor(adults / 2),
                        triples: 0,
                        sencillas: 0
                    }
                }
                else if(adults % 2 == 1){
                    result = {
                        dobles: Math.floor(adults / 2) - 1,
                        triples: 1,
                        sencillas: 0
                    }
                }
                else if(adults % 2 == 3){
                    result = {
                        dobles: Math.floor(adults / 2),
                        triples: 1,
                        sencillas: 0
                    }
                }
            }
            else{
              result = {
                  dobles: 0,
                  triples: 0,
                  sencillas: 1
              }
            }


            result['kids'] = kids
            if(kids > this.getTotalRooms(result)){
                    let doblesRest = Math.abs(adults - (kids * 2))
                    let tDobles = kids - doblesRest
                    let tSencillas = doblesRest

                    result = {
                        dobles: tDobles,
                        triples: 0,
                        sencillas: tSencillas,
                        kids: kids
                    }
            }

            result['kids2Room'] = false

            return result
  },
};
