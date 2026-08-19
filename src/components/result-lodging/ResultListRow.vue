<template>
  <div>
    <div class="item-children">
      <div class="children-wrapper">
        <div class="item-children-header">
          <div class="item-children-info-btn">
            <button
              type="button"
              class="btn-children-info gtt-tooltip"
              :data-tooltip="'Descripción'"
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
                class="item-children-section-item gtt-tooltip"
                :data-tooltip="child.planAlimenticioNombre"
              >
                {{ child.planAlimenticioCodigo }}
              </div>
              <div
                class="item-children-section-item item-children-section-icon gtt-tooltip"
                data-tooltip="Confirmación Inmediata o a Solicitud"
              >
                <i class="mdi mdi-phone-check"></i>
              </div>
              <div
                class="item-children-section-item item-children-section-icon item-children-info-btn"
              >
                <button
                  type="button"
                  class="btn-children-info gtt-tooltip"
                  data-tooltip="Precios"
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
                      amoung,
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
              <button
                type="submit"
                :disabled="disabled"
                class="antonio-regular inverse btn-cart"
                @click="addToCart"
              >
                <i class="mdi mdi-cart"></i>
              </button>
              <button
                type="submit"
                :disabled="disabled"
                class="antonio-regular btn-reservar"
                @click="reserve"
              >
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLodging } from "../../composables/useLodging";
import {
  authGetRoomPrice,
  authGetRoomTypes,
  authLog,
  hotetecBlockProduct,
} from "../../utils/auth";
import { helpers } from "@/utils/helpers";
import { hotelecSessionService } from "../../utils/hotelecSessionService";

const { habitacionPorCantidadPersonas, checkIsAvailable } = useLodging();
const $helpers = helpers;

const props = defineProps<{
  child: any;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "loading", val: boolean): void;
  (e: "listReserve", child: any, amoung: number): void;
  (e: "reserve", child: any, amoung: number): void;
}>();

const amoung = ref(1);
const selectedInfo = ref("");
const todosTiposHabitaciones = ref<any[]>([]);

onMounted(async () => {
  let tth = await authGetRoomTypes();
  todosTiposHabitaciones.value = tth.data;
});

async function addToCart() {
  emit("loading", true);
  let currentHotelec = await hotelecSessionService.getOrCreateSession();
  const hotelectData = await checkIsAvailable(props.child);
  props.child.hotelectData = hotelectData;
  let { Adl, Nin } = helpers.generatePassageList(props.child.combinacion);
  let allIds: number[] = [];
  Adl.forEach((adult: any) => {
    allIds.push(adult.Id);
  });
  Nin.forEach((minor: any) => {
    allIds.push(minor.Id);
  });

  let blockProduct = {
    Accion: "A",
    Codtou: "HTT",
    Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: {
      Id: 1,
      Dissmo: [
        {
          Pasid: allIds,
          Id: props.child.hotelectData.HotetecInfoHabId,
          Numuni: amoung.value.toString(),
        },
      ],
    },
  };

  let unblockProduct = {
    Accion: "E",
    Codtou: "HTT",
    Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: {
      Id: 1,
      Dissmo: [
        {
          Pasid: allIds,
          Id: props.child.hotelectData.HotetecInfoHabId,
          Numuni: amoung.value.toString(),
        },
      ],
    },
  };

  if (import.meta.env.DEV) {
    console.log("blockProduct", props.child);
  }

  hotetecBlockProduct(blockProduct)
    .then((res: any) => {
      if (res.data.Tiperr === null) {
        props.child["unblockRequest"] = unblockProduct;
        emit("listReserve", props.child, amoung.value);
      }
    })
    .finally(() => {
      emit("loading", false);
    });
}

async function reserve() {
  emit("loading", true);
  let currentHotelec = await hotelecSessionService.getOrCreateSession();
  const hotelectData = await checkIsAvailable(props.child);
  props.child.hotelectData = hotelectData;
  let { Adl, Nin } = helpers.generatePassageList(props.child.combinacion);
  let allIds: number[] = [];
  Adl.forEach((adult: any) => {
    allIds.push(adult.Id);
  });
  Nin.forEach((minor: any) => {
    allIds.push(minor.Id);
  });

  let blockProduct = {
    Accion: "A",
    Codtou: "HTT",
    Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: {
      Id: 1,
      Dissmo: [
        {
          Pasid: allIds,
          Id: props.child.hotelectData.HotetecInfoHabId,
          Numuni: amoung.value.toString(),
        },
      ],
    },
  };

  let unblockProduct = {
    Accion: "E",
    Codtou: "HTT",
    Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: {
      Id: 1,
      Dissmo: [
        {
          Pasid: allIds,
          Id: props.child.hotelectData.HotetecInfoHabId,
          Numuni: amoung.value.toString(),
        },
      ],
    },
  };

  hotetecBlockProduct(blockProduct)
    .then((res: any) => {
      if (res.data.Tiperr === null) {
        props.child["unblockRequest"] = unblockProduct;
        emit("reserve", props.child, amoung.value);
      }
    })
    .finally(() => {
      emit("loading", false);
    });
}

function validate() {
  if (amoung.value === 0) amoung.value = 1;
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart = Math.round((number - intPart) * 100);
  if (decimalPart == 0) decimalPart = "00";
  return { intPart, decimalPart };
}

function selectInfo(section: string) {
  if (selectedInfo.value == section) {
    selectedInfo.value = "";
  } else {
    selectedInfo.value = section;
  }
}

function findPrecio(item: any, listadoPrecios: any[]) {
  let tipoHabitacion = habitacionPorCantidadPersonas(
    item.CantAdult,
    todosTiposHabitaciones.value,
  );
  let r = listadoPrecios.find((i: any) => {
    return i.tipoHabitacion == tipoHabitacion.TipoHabitacionId;
  });
  return r?.price;
}
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

.btn-reservar {
  font-size: 22px;
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
