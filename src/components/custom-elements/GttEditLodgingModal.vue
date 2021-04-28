<template>
  <div>
    <div class="c-modal-backdrop">
      <div class="c-modal custom-margin">
        <div class="c-modal-body">
          <!-- <RentEditList
            :currentCar="filterData.name"
            @selectedElementEdit="handleSelected"
            :resultList="result"
            v-if="showResult"
            @close="showResult = false"
          ></RentEditList>-->
          <!-- <div class="custom-form"> -->
          <div class="c-form">
            <div
              style="margin-bottom: 30px;"
              class="current-car font16 hn-roman gtt-first-color text-center"
            >
              <b>Alojamiento actual:</b>
              <span>{{ filterData.name }}</span>
            </div>
            <div class="d-flex">
              <gtt-select
                :openedLodging.sync="lodgingOpened"
                @click.native="loadDestinies"
                v-model="selectedDestiny"
                :options="destinies"
              >
                <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                <span slot="placeholder" class="required-field">Destino o Alojamiento</span>
                <span slot="selectedPlaceholder">¿Dónde desea alojarse?</span>
                <template v-slot:option="option">
                  {{
                  option.option.nombre
                  }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  {{
                  selectedValue.selectedValue.nombre
                  }}
                </template>
                <!-- <span slot="error" class="gtt-errors"></span> -->
              </gtt-select>
              <GttSelectDate :mode="'single'" v-model="dateIn" class="room-form-item">
                <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                <span slot="placeholder">Fecha de entrada</span>
              </GttSelectDate>
              <GttSelectDate :mode="'single'" v-model="dateOut" class="room-form-item">
                <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                <span slot="placeholder">Fecha de salida</span>
              </GttSelectDate>
              <GttSelectForm2
                :options="roomLayout"
                class="room-form-item"
                v-model="visitantes"
                :rooms="totalRooms.value"
                @roomAdded="addRoom"
                @roomRemoved="removeRoom"
              >
                <span slot="iconSelectedValue">
                  <i class="mdi mdi-account"></i>
                </span>
                <span slot="placeholder">Visitantes</span>
              </GttSelectForm2>
              <GttSelect :options="roomsOpt" v-model="totalRooms" class="room-form-item last">
                <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
                <span slot="placeholder">Habitaciones</span>
                <template v-slot:option="option">
                  {{
                  option.option.display
                  }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  {{
                  selectedValue.selectedValue.display
                  }}
                </template>
              </GttSelect>
            </div>

            <div class="selects-inline">
              <b-form-checkbox
                id="checkbox-same-car"
                v-model="useSameItem"
              >{{ $helpers.traducir("sameLodging") }}</b-form-checkbox>
              <div class="form-actions text-right ml-auto">
                <button
                  type="submit"
                  @click="searchResult"
                  class="lodging-searchButton antonio-regular"
                >
                  <template v-if="!isReserving">Buscar</template>
                  <b-spinner small class="loading-spinner" label="Text Centered" v-else></b-spinner>
                </button>
                <button type="button" @click="$emit('cancel')" class="antonio-regular">Cancelar</button>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttSelectForm2 from "../custom-elements/GttSelectForm2";
import moment from "moment";
import { reusableMethodsMixin } from "../../mixins/reusableMethodsMixin";

import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import {
  authSearchRoomsByLodging,
  authGetLodgingEatingPlanOne,
  authGetRoomPrice,
  authSearchRegions,
  authGetLodgingsAll
} from "../../utils/auth";
import _ from "lodash";

export default {
  components: {
    GttSelect,
    GttSelectDate,
    GttSelectForm2
  },
  mixins: [reusableMethodsMixin],
  created() {
    this.item = this.filterData.item;
    if (this.filterData.needPre)
      this.fillRoomLayout(this.filterData.propVisitantes);
    else {
      this.visitantes = this.filterData.propVisitantes;
      let total = this.visitantes.length;
      this.totalRooms = {
        value: total,
        display: total > 1 ? `${total} habitaciones` : `${total} habitación`
      };
    }
    this.roomsOpt = this.generateRooms();
  },
  data() {
    return {
      result: [],
      showResult: false,
      isReserving: false,
      useSameItem: true,
      roomLayout: [
        {
          code: "adults",
          label: "Adultos",
          display: "Adulto(s)",
          default: 1
        },
        {
          code: "kids",
          label: "Niños",
          display: "Niño(s)",
          default: 0
        }
      ],
      totalRooms: {},
      roomsOpt: [],
      item: null,
      dateIn: new Date(this.filterData.propDateIn),
      dateOut: new Date(this.filterData.propDateOut),
      visitantes: null,
      habitaciones: this.filterData.propHabitaciones,
      lodgingOpened: false,
      destinies: [],
      selectedDestiny: null
    };
  },
  props: {
    filterData: {
      type: Object,
      default() {
        return {
          propDateIn: moment(),
          propDateOut: moment().add(1, "day"),
          propVisitantes: {},
          propHabitaciones: {},
          id: undefined,
          item: {},
          name: "",
          needPre: true
        };
      }
    }
  },
  methods: {
    generateRooms() {
      let i = [];
      for (let key = 1; key <= 10; key++) {
        let d = ``;
        if (key == 1) d = `${key} habitación`;
        else d = `${key} habitaciones`;
        i.push({
          value: key,
          display: d
        });
      }

      return i;
    },
    addRoom() {
      let currrentValue = this.totalRooms.value;
      let v = this.roomsOpt.find(i => {
        return i.value == currrentValue + 1;
      });
      this.totalRooms = v;
    },
    refreshRoomLayout(roomLayout) {
      roomLayout.forEach((element, i) => {
        element.room = i + 1;
      });
    },
    removeRoom(indexRoomLayout) {
      this.visitantes.splice(indexRoomLayout, 1);
      this.refreshRoomLayout(this.visitantes);
      let currrentValue = this.totalRooms.value;
      let v = this.roomsOpt.find(i => {
        return i.value == currrentValue - 1;
      });
      this.totalRooms = v;
    },
    fillRoomLayout(acomodation) {
      let total = _.sumBy(acomodation, i => i.cantidad);
      this.totalRooms = {
        value: total,
        display: total > 1 ? `${total} habitaciones` : `${total} habitación`
      };
      let count = 1;
      let a = [];
      acomodation.forEach(i => {
        for (let t = 0; t < i.cantidad; t++) {
          a.push({
            room: count,
            layout: [
              {
                code: "adults",
                display: "Adulto(s)",
                label: "Adultos",
                value: i.adults
              },
              {
                code: "kids",
                display: "Niño(s)",
                label: "Niños",
                value: i.kids
              }
            ]
          });
          count++;
        }
      });

      if (a.length > 0) {
        this.visitantes = a;
      }
    },
    // gttValidate() {
    //   let validator = [
    //     {
    //       rules: ["required", "dateAfter:selectedPickUpDate"],
    //       name: "gttDeliveryDate",
    //       value: this.selectedDeliveryDate,
    //       lang: "es"
    //     },
    //     {
    //       rules: ["required"],
    //       name: "gttPickUpDate",
    //       value: this.selectedPickUpDate,
    //       lang: "es"
    //     }
    //   ];

    //   return validator;
    // },
    handleSelected(value) {
      this.edited(value);
    },
    async searchResultSameItem() {
      this.sR().then(v => {
        this.isReserving = false;
        let fr = v.filter(i => {
          return !i.l.some(u => u.habitacion.PrecioOrden < 0);
        });
        if (fr.length == 0) {
          this.$toasted.show("No hay disponibilidad para esta búsqueda", {
            type: "error"
          });
        }
        console.log(fr);
      });
    },
    edited(value) {
      this.showResult = false;
      this.$emit("editedItem", {
        tipo: "lodging",
        pItemId: this.filterData.id,
        nI: value
      });
    },
    async editVehiculoOrder(item) {},
    async searchResult() {
      this.isReserving = true;
      if (this.useSameItem) {
        console.log(this.item);
        // await this.searchResultSameItem();
      } else {
        let totalA = 0;
        let totalK = 0;
        this.visitantes.forEach(i => {
          let a = i.layout.find(j => {
            return j.code == "adults";
          }).value;
          totalA += a;
        });
        this.visitantes.forEach(i => {
          let k = i.layout.find(j => {
            return j.code == "kids";
          }).value;
          totalK += k;
        });
        let sl = {
          adults: {
            code: "adults",
            display: "Adulto(s)",
            label: "Adultos",
            value: totalA
          },
          kids: {
            code: "kids",
            display: "Niño(s)",
            label: "Niños",
            value: totalK
          }
        };
        let searchFilters = {
          // Destiny: this.selectedLodgingDestinyValue,
          Region: {
            RegionId: this.item.lodging.PuntoInteres.RegionId,
            RegionNombre: this.item.lodging.PuntoInteres.Nombre
          },
          Cliente: { ClienteId: localStorage.getItem("cliente") },
          Entrada: this.dateIn,
          Salida: this.dateOut,
          Visitantes: sl
        };
        localStorage.setItem(
          "searchLodgingFilters",
          JSON.stringify(searchFilters)
        );
        this.$helpers.shoppingCartRemoveOne(this.item.uID);
        this.$eventCartBus.$emit("updateCart");
        this.$router.push({
          name: "resultLodging"
        });
      }
    },
    async sR() {
      let roomsResult = [];
      let listaPlanesAlimenticios = this.item.lodging.ListaPlanesAlimenticios;
      let rooms = await authSearchRoomsByLodging(this.item.lodging.ProductoId);
      await Promise.all(
        rooms.data.map(async j => {
          await Promise.all(
            listaPlanesAlimenticios.map(async i => {
              let pa = await authGetLodgingEatingPlanOne(
                i.PlanesAlimenticiosId
              );
              let noDisp = false;
              let c = 0;
              let temp = [];
              while (!noDisp && c < this.visitantes.length) {
                let el = this.visitantes[c];
                let ca = el.layout.find(p => p.code == "adults").value;
                let cm = el.layout.find(p => p.code == "kids").value;
                let so = {
                  Cliente: { ClienteId: localStorage.getItem("cliente") },
                  PlanAlimenticio: {
                    PlanesAlimenticiosId: i.PlanesAlimenticiosId
                  },
                  Alojamiento: { ProductoId: this.item.lodging.ProductoId },
                  TipoHabitacion: { TipoHabitacionId: ca },
                  CantidadAdultos: ca,
                  CantidadMenores: cm,
                  CantidadInfantes: 0,
                  CantidadHabitaciones: 1,
                  Habitacion: { HabitacionId: j.HabitacionId },
                  Entrada: this.dateIn,
                  Salida: this.dateOut
                };
                try {
                  let result = await authGetRoomPrice(so);
                  if (
                    result.data.length != 0 &&
                    // && r.data[0].OrdenAlojamientoId != -1
                    result.data[0].PrecioOrden != 0
                  ) {
                    temp.push({
                      habitacion: result.data[0],
                      CantAdultos: ca,
                      CantidadMenores: cm,
                      PA: pa.data,
                      rn: el.room
                    });
                  } else {
                    noDisp = true;
                  }
                } catch (e) {
                  noDisp = true;
                  console.log(e);
                }

                c++;
              }

              if (!noDisp) {
                roomsResult.push({
                  rO: j,
                  pA: pa.data,
                  l: temp
                });
              }
            })
          );
        })
      );
      return roomsResult;
    },
    async loadDestinies() {
      if (this.lodgingOpened == true) {
        let { data } = await authSearchRegions();
        let totalResult = [];
        data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            type: "region"
          });
        });
        let l = await authGetLodgingsAll();
        l.data.forEach(i => {
          totalResult = totalResult.concat({
            nombre: i.Nombre,
            id: i.ProductoId,
            type: "alojamiento"
          });
        });
        this.destinies = totalResult;
      }
    }
  }
};
</script>

<style scoped>
.c-modal {
  height: auto;
  width: auto;
  font-size: 18px;
  border-radius: 10px;
  -webkit-transform: translate(-50%, 0);
}

.c-modal button {
  font-size: 16px;
  height: 40px;
  margin-left: 15px;
}

.c-modal .c-form {
  width: 50vw;
}
</style>
