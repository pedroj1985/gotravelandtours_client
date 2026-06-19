<template>
  <div>
    <div class="item-children">
      <div class="children-wrapper">
        <div class="item-children-header">
          <div class="item-children-info-btn">
            <button
              type="button"
              class="btn-children-info gtt-tooltip"
              data-tooltip="Descripción"
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
                class="item-children-section-item gtt-tooltip"
                :data-tooltip="child.pA.Nombre"
              >
                {{ child.pA.Codigo }}
              </div>
              <div
                class="item-children-section-item item-children-section-icon gtt-tooltip"
                data-tooltip="Confirmación Inmediata o a Solicitud"
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

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useLodging } from "../../composables/useLodging";
import { authGetRoomTypes } from "../../utils/auth";
import AdultsKidsIcons from "./AdultsKidsIcons.vue";
import _ from "lodash";

const { habitacionPorCantidadPersonas } = useLodging()

const props = defineProps<{
  child: any
  roomSelectedToDis: any[]
}>()

const emit = defineEmits<{
  (e: "listReserve", child: any): void
  (e: "reserveOne", one: any): void
}>()

const amoung = ref(1)
const selectedInfo = ref("")
const todosTiposHabitaciones = ref<any[]>([])
const totalPrecio = ref(0)

onMounted(async () => {
  let tth = await authGetRoomTypes()
  todosTiposHabitaciones.value = tth.data
  totalPrecio.value = _.sumBy(props.child.l, (i: any) => i.habitacion.PrecioOrden)
})

watch(() => props.child, (item: any) => {
  totalPrecio.value = _.sumBy(
    item.l,
    (i: any) => i.habitacion.PrecioOrden * amoung.value
  )
}, { deep: true })

function addToCart() {
  props.child.l[0].habitacion.CantidadHabitaciones = amoung.value
  emit("listReserve", props.child)
}

function addToCartOneRoom(one: any) {
  selectInfo("roomLayout")
  emit("reserveOne", one)
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number)
  let decimalPart = Math.round((number - intPart) * 100)
  if (decimalPart == 0) decimalPart = "00"
  return { intPart, decimalPart }
}

function isIn(n: number) {
  return props.roomSelectedToDis.includes(n)
}

function selectInfo(section: string) {
  if (selectedInfo.value == section) {
    selectedInfo.value = ""
  } else {
    selectedInfo.value = section
  }
}

function reserve() {
  if (import.meta.env.DEV) { console.log(props.child) }
}

function findPrecio(item: any, listadoPrecios: any[]) {
  let tipoHabitacion = habitacionPorCantidadPersonas(
    item.CantAdult,
    todosTiposHabitaciones.value
  )
  let r = listadoPrecios.find((i: any) => {
    return i.tipoHabitacion == tipoHabitacion.TipoHabitacionId
  })
  return r?.price
}
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
