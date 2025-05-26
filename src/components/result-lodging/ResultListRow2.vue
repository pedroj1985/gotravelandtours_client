<template>
  <div>
    <div class="item-children">
      <div class="children-wrapper">
        <div class="item-children-header">
          <div class="item-children-info-btn">
            <button
              type="button"
              class="btn-children-info"
              v-b-tooltip.hover
              title="Descripción"
              :class="{ selected: selectedInfo == 'info' }"
              @click="selectInfo('info')"
            >
              <i class="mdi mdi-clipboard-text"></i>
            </button>
          </div>
          <div class="item-children-name hn-roman">
            <slot name="itemChildrenNameSlot" v-bind:child="child">
              <span class="font16" @click="selectInfo('roomLayout')">{{
                child.rO.Nombre
              }}</span>
              <!-- <span class="dist">{{child.combinacion.display}}</span> -->
            </slot>
          </div>
          <slot name="itemChildren" v-bind:child="child">
            <div class="item-children-section hn-roman">
              <div
                class="item-children-section-item"
                v-b-tooltip.hover
                :title="child.pA.Nombre"
              >
                {{ child.pA.Codigo }}
              </div>
              <div
                class="item-children-section-item item-children-section-icon"
                v-b-tooltip.hover
                title="Confirmación Inmediata o a Solicitud"
              >
                <i class="mdi mdi-phone-check"></i>
              </div>
              <div
                class="
                  item-children-section-item
                  item-children-section-icon
                  item-children-info-btn
                "
              >
                <button
                  type="button"
                  class="btn-children-info"
                  :class="{ selected: selectedInfo == 'roomLayout' }"
                  @click="selectInfo('roomLayout')"
                  v-b-tooltip.hover
                  title="Precios"
                >
                  <i class="mdi mdi-floor-plan"></i>
                </button>
              </div>
            </div>
          </slot>
          <div class="item-children-right-part">
            <div class="item-children-price hn-roman">
              <slot name="itemChildrenPriceSlot" v-bind:child="child">
                {{ styledPrice(totalPrecio).intPart * amoung }} USD
              </slot>

              <div class="ir-info-name font14">Cantidad</div>
              <div class="gtt__form">
                <!-- TODO  agregar condicion de no menor de 1   -->
                <button
                  :class="{ disabled: amoung <= 1 }"
                  :disabled="amoung <= 1"
                  v-on:click="amoung--"
                  type="submit"
                  class="gtt__picker_button"
                >
                  <i class="mdi mdi-minus"></i>
                </button>

                <input
                  :disabled="true"
                  type="number"
                  v-model="amoung"
                  class="ir-input font18"
                />

                <button
                  v-on:click="amoung++"
                  type="submit"
                  class="gtt__picker_button"
                >
                  <i class="mdi mdi-plus"></i>
                </button>
              </div>
            </div>

            <div class="item-children-reserve form-actions">
              <!-- <button type="submit" class="antonio-regular inverse btn-cart" @click="addToCart"><i class="mdi mdi-cart"></i></button> -->
              <button
                type="submit"
                class="antonio-regular"
                @click="addToCart"
                :disabled="roomSelectedToDis.length != 0"
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
        <div class="item-children-content hn-roman">
          <div class="item-children-content-info" v-if="selectedInfo == 'info'">
            <slot name="itemContentInfoSlot" v-bind:child="child">
              <div class="hn-roman" v-html="child.rO.Descripcion"></div>
            </slot>
          </div>
          <div
            class="item-children-content-info pd-15"
            v-if="selectedInfo == 'roomLayout'"
          >
            <div class="pt-30">
              <div v-for="room in child.l" :key="room.room">
                <div class="flex-wrapper" :class="{ dis: isIn(room.rn) }">
                  <span class="check-room" @click="addToCartOneRoom(room)">
                    <i class="mdi mdi-check-circle"></i>
                  </span>
                  <span class="flex-left-side">
                    Hab. {{ room.rn }} (
                    <AdultsKidsIcons
                      :adults="room.CantAdultos"
                      :kids="room.CantidadMenores"
                      :id="room.id"
                    ></AdultsKidsIcons
                    >)
                  </span>
                  <span class="flex-right-side">
                    {{ styledPrice(room.habitacion.PrecioOrden).intPart }} USD
                  </span>
                </div>
              </div>
            </div>
            <!-- <pre class="hn-roman">{{child.roomLayout}}</pre> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import { authGetRoomTypes } from "../../utils/auth";
import AdultsKidsIcons from "./AdultsKidsIcons";
import _ from "lodash";
export default {
  components: {
    AdultsKidsIcons,
  },
  mixins: [lodgingUtilsMixin],
  data() {
    return {
      amoung: 1,
      selectedInfo: "",
      todosTiposHabitaciones: [],
      totalPrecio: 0,
    };
  },
  async created() {
    let tth = await authGetRoomTypes();
    this.todosTiposHabitaciones = tth.data;
    this.totalPrecio = _.sumBy(this.child.l, (i) => i.habitacion.PrecioOrden);
  },
  props: {
    child: Object,
    roomSelectedToDis: Array,
  },
  watch: {
    child(item) {
      this.totalPrecio = _.sumBy(
        item.l,
        (i) => i.habitacion.PrecioOrden * this.amoung
      );
    },
  },
  methods: {
    addToCart() {
      // const Habitacion = this.child.rO;
      this.child.l[0].habitacion.CantidadHabitaciones = this.amoung;
      /* this.child.l.forEach((i) => {console.log('i-child', i);
        //i.habitacion.CantidadHabitaciones = 30;console.log('i-habitacion', Habitacion);
        i.Habitacion = Habitacion;
      });
      console.log('child', this.child); */
      this.$emit("listReserve", this.child);
    },
    addToCartOneRoom(one) {
      this.selectInfo("roomLayout");
      this.$emit("reserveOne", one);
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = Math.round((number - intPart) * 100);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    isIn(n) {
      return this.roomSelectedToDis.includes(n);
    },
    selectInfo(section) {
      if (this.selectedInfo == section) {
        this.selectedInfo = "";
      } else {
        this.selectedInfo = section;
      }
    },
    reserve() {
      console.log(this.child);
    },
    findPrecio(item, listadoPrecios) {
      let tipoHabitacion = this.habitacionPorCantidadPersonas(
        item.CantAdult,
        this.todosTiposHabitaciones
      );
      let r = listadoPrecios.find((i) => {
        return i.tipoHabitacion == tipoHabitacion.TipoHabitacionId;
      });
      return r.price;
    },
  },
};
</script>

<style scoped>
.gtt__picker_button {
  border-radius: 100%;
  border: 1px solid #212f3d;
  font-size: 14px;
  width: 25px;
  font-family: "Helvetica Neue LT Std-Roman";
  color: #212f3d;
}

.btn-cart {
  margin-right: 5px;
  width: 50px;
}
.children-wrapper {
  border-bottom: 1px solid #c4c4c4;
}
.item-children-header {
  padding-bottom: 5px;
  display: flex;
}
.item-children-content {
  padding-right: 230px;
  padding-left: 60px;
}
.item-children-content pre {
  font-size: 16px;
  color: #6d6d6d;
  white-space: pre-wrap;
}
.item-children {
  /* display: flex; */
}
.item-children-name {
  /* margin-right: auto; */
  color: #6d6d6d;
  font-size: 16px;
  width: 35%;
}
.item-children-name span:hover {
  cursor: pointer;
}
.dist {
  font-size: 12px;
}
.item-children-section {
  color: #6d6d6d;
  font-size: 18px;
  display: flex;
}

.item-children-section-item {
  padding-right: 25px;
  align-self: center;
  font-size: 24px !important;
}
.item-children-section-icon {
  font-size: 24px !important;
  color: #212f3d;
  align-self: center;
}
.item-children-right-part {
  margin-left: auto;
  display: flex;
}
.item-children-price {
  padding-right: 60px;
  color: #6d6d6d;
  font-size: 24px;
}
.item-children-info-btn {
  font-size: 24px;
  color: #212f3d;
  padding-right: 20px;
}
.item-children-info-btn button {
  border: none;
  background-color: transparent;
}
.item-children-info-btn button:hover {
  cursor: pointer;
}
.item-children-info-btn button:focus {
  border: none;
  outline: none;
}
.item-children-name,
.item-children-section,
.item-children-price,
.item-children-info-btn {
  align-self: center;
}
.selected {
  color: #c4c4c4;
}
.item-children-reserve button {
  font-size: 18px;
}
.check-room {
  margin-right: 10px;
}
.check-room:hover {
  cursor: pointer;
}
.dis span {
  pointer-events: none;
  color: #c4c4c4;
  border-color: #c4c4c4;
}
.dis span {
  color: #c4c4c4;
}

.gtt__form {
  display: inline-flex;
}

.ir-input {
  width: 50px;
  height: 30px;
  align-content: center;
  /* padding: 15px; */
}
</style>
