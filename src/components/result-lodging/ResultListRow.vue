<template>
  <div>
    <div class="item-children">
      <div class="children-wrapper">
        <div class="item-children-header">
          <div class="item-children-info-btn">
            <button
              type="button"
              v-b-tooltip.hover
              title="Descripción"
              class="btn-children-info"
              :class="{ selected: selectedInfo == 'info' }"
              @click="selectInfo('info')"
            >
              <i class="mdi mdi-clipboard-text"></i>
            </button>
          </div>
          <div class="item-children-name hn-roman">
            <slot name="itemChildrenNameSlot" v-bind:child="child">
              <span class="font16" @click="selectInfo('roomLayout')">{{
                child.name
              }}</span>
              <!-- <span class="dist">{{child.combinacion.display}}</span> -->
            </slot>
          </div>
          <slot name="itemChildren" v-bind:child="child">
            <div class="item-children-section hn-roman">
              <div
                class="item-children-section-item"
                v-b-tooltip.hover
                :title="child.planAlimenticioNombre"
              >
                {{ child.planAlimenticioCodigo }}
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
                  v-b-tooltip.hover
                  title="Precios"
                  class="btn-children-info"
                  :class="{ selected: selectedInfo == 'roomLayout' }"
                  @click="selectInfo('roomLayout')"
                >
                  <i class="mdi mdi-floor-plan"></i>
                </button>
              </div>
            </div>
          </slot>
          <div class="item-children-right-part">
            <div class="item-children-price hn-roman">
              <!-- v-bind:child="child" -->
              <slot name="itemChildrenPriceSlot">
                {{
                  styledPrice(
                    child.combinacion.listado[0].precioObjOne.PrecioOrden *
                      amoung
                  ).intPart
                }}
                USD
              </slot>
              <div class="ir-info-name font14">Cantidad</div>
              <div class="gtt__form">
                <!-- TODO  agregar condicion de no menor de 1   -->
                <button
                  :class="{ disabled: amoung <= 1 }"
                  :disabled="amoung <= 1"
                  v-on:click="amoung--"
                  type="submit"
                  class="gtt__picker_button "
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
                  class="gtt__picker_button "
                >
                  <i class="mdi mdi-plus"></i>
                </button>
              </div>
            </div>
            <div class="item-children-reserve form-actions">
              <button
                type="submit"
                class="antonio-regular inverse btn-cart"
                @click="addToCart"
              >
                <i class="mdi mdi-cart"></i>
              </button>
              <button type="submit" class="antonio-regular" @click="reserve">
                Reservar
              </button>
            </div>
          </div>
        </div>
        <div class="item-children-content hn-roman">
          <div class="item-children-content-info" v-if="selectedInfo == 'info'">
            <slot name="itemContentInfoSlot" v-bind:child="child">
              <div class="hn-roman" v-html="child.habitacion.Descripcion"></div>
            </slot>
          </div>
          <slot name="item-room-layout" v-bind:extraInfo="child">
            <div
              class="item-children-content-info pd-15"
              v-if="selectedInfo == 'roomLayout'"
            >
              <div class="pt-30">
                <div
                  v-for="distribution in child.combinacion.listado"
                  :key="distribution.id"
                >
                  <div class="flex-wrapper">
                    <span class="flex-left-side"
                      >{{ distribution.tipoHabitacionNombre }} x{{
                        distribution.cantidad
                      }}</span
                    >
                    <span class="flex-right-side">
                      {{ styledPrice(distribution.price.value).intPart }}
                      USD
                    </span>
                  </div>
                </div>
              </div>
              <!-- <pre class="hn-roman">{{child.roomLayout}}</pre> -->
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import { authGetRoomTypes } from "../../utils/auth";
export default {
  mixins: [lodgingUtilsMixin],
  data() {
    return {
      amoung: 1,
      selectedInfo: "",
      todosTiposHabitaciones: [],
    };
  },
  async created() {
    let tth = await authGetRoomTypes();
    this.todosTiposHabitaciones = tth.data;
  },
  props: {
    child: Object,
  },
  methods: {
    addToCart() {
      this.$emit("listReserve", this.child, this.amoung);
    },
    async reserve() {
      this.$emit("reserve", this.child, this.amoung);
    },
    // TODO validar valor del numero mayot que 0
    validate() {
      if (this.amoung === 0) this.amoung = 1;
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = Math.round((number - intPart) * 100);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    selectInfo(section) {
      if (this.selectedInfo == section) {
        this.selectedInfo = "";
      } else {
        this.selectedInfo = section;
      }
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
  font-size: 24px;
  display: flex;
}

.item-children-section-item {
  padding-right: 25px;
  align-self: center;
  font-size: 30px !important;
}
.item-children-section-icon {
  font-size: 30px !important;
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
  font-size: 18px;
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.gtt__form {
  display: inline-flex;
}
.ir-input {
  width: 30px;
  height: 30px;
}
</style>
