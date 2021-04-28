<template>
  <div>
    <div class="c-modal-backdrop">
      <div class="c-modal">
        <div class="c-modal-body">
          <div class="d-flex mb-3">
            <b-button-close @click="$emit('modalCancel', true)" class="bclose"></b-button-close>
          </div>
          <div class="d-flex">
            <GttSelectDate
              :mode="'single'"
              v-model="dateIn"
              class="room-form-item"
              :opened="cI == 'fecha-entrada'"
              @click.native="cI = ''"
            >
              <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
              <span slot="placeholder">Fecha de entrada</span>
            </GttSelectDate>
            <GttSelectDate
              :mode="'single'"
              v-model="dateOut"
              class="room-form-item"
              :opened="cI == 'fecha-salida'"
              @click.native="cI = ''"
            >
              <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
              <span slot="placeholder">Fecha de salida</span>
            </GttSelectDate>
            <GttSelectForm2
              :options="roomLayout"
              class="room-form-item"
              v-model="selectedRoomLayout"
              :rooms="totalRooms.value"
              :opened="cI == 'visitantes'"
              @click.native="cI = ''"
              @roomAdded="addRoom"
              @roomRemoved="removeRoom"
            >
              <span slot="iconSelectedValue">
                <i class="mdi mdi-account"></i>
              </span>
              <span slot="placeholder">Visitantes</span>
            </GttSelectForm2>
            <GttSelect
              :options="roomsOpt"
              v-model="totalRooms"
              :opened="cI == 'habitaciones'"
              class="room-form-item last"
              @click.native="cI = ''"
            >
              <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
              <span slot="placeholder">Habitaciones</span>
              <template v-slot:option="option">{{ option.option.display }}</template>
              <template
                v-slot:selectedValue="selectedValue"
              >{{ selectedValue.selectedValue.display }}</template>
            </GttSelect>
            <div class="form-actions prices-info-search-btn">
              <button type="submit" class="antonio-regular" @click="btnSearch">
                <template v-if="!loading">Buscar</template>
                <b-spinner small class="loading-spinner" label="Text Centered" v-else></b-spinner>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttSelectForm2 from "../custom-elements/GttSelectForm2";
import GttSelect from "../custom-elements/GttSelect";
import {
  authSearchRoomsByLodging,
  authGetRoomPrice,
  authGetLodgingEatingPlanOne
} from "../../utils/auth";
import { uuid } from "vue-uuid";

export default {
  components: {
    GttSelectDate,
    GttSelectForm2,
    GttSelect
  },
  created() {
    this.roomsOpt = this.generateRooms();
    this.selectedRoomLayout = this.sRL;
    this.totalRooms = this.tR;
    this.dateIn = this.inDate;
    this.dateOut = this.outDate;
    this.cI = this.clickedItem;
  },
  data() {
    return {
      roomsOpt: [],
      roomsResult: [],
      dateIn: null,
      dateOut: null,
      selectedRoomLayout: null,
      totalRooms: null,
      loading: false,
      cI: "",
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
      ]
    };
  },
  props: {
    item: Object,
    inDate: Date,
    outDate: Date,
    sRL: Array,
    tR: Object,
    clickedItem: {
      type: String,
      default: ""
    }
  },
  methods: {
    refreshRoomLayout(roomLayout) {
      roomLayout.forEach((element, i) => {
        element.room = i + 1;
      });
    },
    addRoom() {
      let currrentValue = this.totalRooms.value;
      let v = this.roomsOpt.find(i => {
        return i.value == currrentValue + 1;
      });
      this.totalRooms = v;
    },
    removeRoom(indexRoomLayout) {
      this.selectedRoomLayout.splice(indexRoomLayout, 1);
      this.refreshRoomLayout(this.selectedRoomLayout);
      let currrentValue = this.totalRooms.value;
      let v = this.roomsOpt.find(i => {
        return i.value == currrentValue - 1;
      });
      this.totalRooms = v;
    },
    async btnSearch() {
      this.loading = true;
      try {
        await this.sR();
      } catch (e) {
        console.log(e);
      }

      this.$emit("searched", {
        result: this.roomsResult,
        filters: {
          inDate: this.dateIn,
          outDate: this.dateOut,
          selectedRoomLayout: this.selectedRoomLayout,
          totalRooms: this.totalRooms
        }
      });
    },
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
    async sR() {
      this.roomsResult = [];
      let listaPlanesAlimenticios = this.item.lodging.ListaPlanesAlimenticios;
      let rooms = await authSearchRoomsByLodging(this.item.lodging.ProductoId);
      await Promise.all(
        rooms.data.map(async j => {
          listaPlanesAlimenticios.map(async i => {
            let pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId);
            let noDisp = false;
            let c = 0;
            let temp = [];
            while (!noDisp && c < this.selectedRoomLayout.length) {
              let el = this.selectedRoomLayout[c];
              let ca = el.layout.find(p => p.code == "adults").value;
              let cm = el.layout.find(p => p.code == "kids").value;
              let so = {
                Cliente: { ClienteId: localStorage.getItem("cliente") },
                PlanAlimenticio: { PlanAlimenticioId: i.PlanesAlimenticiosId },
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
                    rn: el.room,
                    id: uuid.v4()
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
              this.roomsResult.push({
                rO: j,
                pA: pa,
                l: temp
              });
            }
          });
        })
      );
      this.loading = false;
      console.log(this.roomsResult);
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

.c-modal .bclose {
  font-size: 24px;
  margin-left: 0;
}
.c-modal .bclose:focus {
  border: none;
  outline: none;
}

.c-modal .c-form {
  width: 50vw;
}

.c-modal-body .room-form-item {
  min-width: 250px;
}
</style>