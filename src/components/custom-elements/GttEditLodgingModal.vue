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
              <div class="row">
                <div class="col-12">
                  <div ref="gttLodging">
                    <gtt-select
                      :openedLodging.sync="lodgingOpened"
                      @click.native="loadDestinies"
                      v-model="selectedDestiny"
                      :options="destinies"
                      :alignLeft="true"
                    >
                      <i
                        slot="iconSelectedValue"
                        class="mdi mdi-map-marker"
                      ></i>
                      <span slot="placeholder" class="required-field"
                        >Destino o Alojamiento</span
                      >
                      <span slot="selectedPlaceholder"
                        >¿Dónde desea alojarse?</span
                      >
                      <template v-slot:option="option">
                        {{ option.option.nombre }}
                      </template>
                      <template v-slot:selectedValue="selectedValue">
                        {{ selectedValue.selectedValue.nombre }}
                      </template>
                      <span slot="error" class="gtt-errors"></span>
                    </gtt-select>
                  </div>
                </div>
                <div class="col-6">
                  <div ref="gttStartDate">
                    <GttSelectDate
                      :mode="'single'"
                      v-model="dateIn"
                      class="room-form-item"
                    >
                      <i
                        slot="iconSelectedValue"
                        class="mdi mdi-calendar-today"
                      ></i>
                      <span slot="placeholder" class="required-field"
                        >Fecha de entrada</span
                      >
                    </GttSelectDate>
                  </div>
                </div>
                <div class="col-6">
                  <div ref="gttEndDate">
                    <GttSelectDate
                      :mode="'single'"
                      v-model="dateOut"
                      class="room-form-item"
                    >
                      <i
                        slot="iconSelectedValue"
                        class="mdi mdi-calendar-today"
                      ></i>
                      <span slot="placeholder" class="required-field"
                        >Fecha de salida</span
                      >
                    </GttSelectDate>
                  </div>
                </div>
                <div class="col-6">
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
                    <span slot="placeholder" class="required-field"
                      >Visitantes</span
                    >
                  </GttSelectForm2>
                </div>
                <div class="col-6">
                  <GttSelect
                    :options="roomsOpt"
                    v-model="totalRooms"
                    class="room-form-item last"
                    :isDisabled="disableByRegion"
                  >
                    <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
                    <span slot="placeholder">Habitaciones</span>
                    <template v-slot:option="option">
                      {{ option.option.display }}
                    </template>
                    <template v-slot:selectedValue="selectedValue">
                      {{ selectedValue.selectedValue.display }}
                    </template>
                  </GttSelect>
                </div>
              </div>
            </div>

            <div class="selects-inline">
              <!-- <label class="gtt-checkbox">
                <input type="checkbox" v-model="useSameItem" />
                {{ $helpers.traducir("sameLodging") }}
              </label>-->
              <div class="form-actions text-right ml-auto">
                <button
                  type="submit"
                  @click="searchResult"
                  class="lodging-searchButton antonio-regular"
                >
                  <template v-if="!isReserving">Buscar</template>
                  <span
                    class="gtt-spinner gtt-spinner-sm loading-spinner"
                    v-else
                  ></span>
                </button>
                <button
                  type="button"
                  @click="$emit('cancel')"
                  class="antonio-regular"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import GttSelect from "../custom-elements/GttSelect.vue"
import GttSelectDate from "../custom-elements/GttSelectDate.vue"
import GttSelectForm2 from "../custom-elements/GttSelectForm2.vue"
import moment from "moment"
import { useLodging } from "../../composables/useLodging"
import { gttIsValid, renderValid, getValid } from "../../utils/validation"
import {
  authSearchRoomsByLodging,
  authGetLodgingEatingPlanOne,
  authGetRoomPrice,
  authGetHotelList
} from "../../utils/auth"
import _ from "lodash"
import { useCartStore } from "../../stores/cartStore"
import { toast } from "vue3-toastify"
import { helpers } from "../../utils/helpers"
import { visitantesToAcomodation } from "../../utils/visitorTransformer"

const props = withDefaults(defineProps<{
  filterData?: any
}>(), {
  filterData: () => ({
    propDateIn: moment(),
    propDateOut: moment().add(1, "day"),
    propVisitantes: {},
    propHabitaciones: {},
    id: undefined,
    item: {},
    name: "",
    needPre: true
  })
})

const emit = defineEmits<{
  (e: "editedItem", val: any): void
  (e: "cancel"): void
}>()

const router = useRouter()

const gttLodging = ref<HTMLElement | null>(null)
const gttStartDate = ref<HTMLElement | null>(null)
const gttEndDate = ref<HTMLElement | null>(null)

const result = ref<any[]>([])
const showResult = ref(false)
const isReserving = ref(false)
const useSameItem = ref(true)
const roomLayout = [
  { code: "adults", label: "Adultos", display: "Adulto(s)", default: 1 },
  { code: "kids", label: "Niños", display: "Niño(s)", default: 0 }
]
const totalRooms = ref<any>({})
const roomsOpt = ref<any[]>([])
const item = ref<any>(props.filterData.item)
const dateIn = ref(new Date(props.filterData.propDateIn))
const dateOut = ref(new Date(props.filterData.propDateOut))
const visitantes = ref<any>(null)
const lodgingOpened = ref(false)
const destinies = ref<any[]>([])
const selectedDestiny = ref<any>(null)
const disableByRegion = ref(false)

if (props.filterData.needPre) {
  fillRoomLayout(props.filterData.propVisitantes)
} else {
  visitantes.value = props.filterData.propVisitantes
  const total = visitantes.value.length
  totalRooms.value = {
    value: total,
    display: total > 1 ? `${total} habitaciones` : `${total} habitación`
  }
}
roomsOpt.value = generateRooms()
selectedDestiny.value = {
  nombre: item.value.lodging.Nombre,
  id: item.value.lodging.IdObjeto,
  type: item.value.lodging.TipoObjeto
}

watch(selectedDestiny, (item) => {
  if (item?.type == "RGN") {
    disableByRegion.value = true
  } else {
    disableByRegion.value = false
  }
})

async function performSearch(query: any) {
  const res = await useLodging().executeQuery(query)
  result.value = res
  return res
}

function generateRooms() {
  const i: any[] = []
  for (let key = 1; key <= 10; key++) {
    let d = ``
    if (key == 1) d = `${key} habitación`
    else d = `${key} habitaciones`
    i.push({ value: key, display: d })
  }
  return i
}

function addRoom() {
  const currrentValue = totalRooms.value.value
  const v = roomsOpt.value.find((i: any) => i.value == currrentValue + 1)
  totalRooms.value = v
}

function refreshRoomLayout(roomLayout: any[]) {
  roomLayout.forEach((element, i) => {
    element.room = i + 1
  })
}

function removeRoom(indexRoomLayout: number) {
  visitantes.value.splice(indexRoomLayout, 1)
  refreshRoomLayout(visitantes.value)
  const currrentValue = totalRooms.value.value
  const v = roomsOpt.value.find((i: any) => i.value == currrentValue - 1)
  totalRooms.value = v
}

function fillRoomLayout(acomodation: any[]) {
  const total = _.sumBy(acomodation, (i: any) => i.cantidad)
  totalRooms.value = {
    value: total,
    display: total > 1 ? `${total} habitaciones` : `${total} habitación`
  }
  let count = 1
  const a: any[] = []
  acomodation.forEach((i: any) => {
    for (let t = 0; t < i.cantidad; t++) {
      a.push({
        room: count,
        layout: [
          { code: "adults", display: "Adulto(s)", label: "Adultos", value: i.adults },
          { code: "kids", display: "Niño(s)", label: "Niños", value: i.kids }
        ]
      })
      count++
    }
  })
  if (a.length > 0) {
    visitantes.value = a
  }
}

function gttValidate() {
  return [
    { rules: ["required"], name: "gttLodging", value: selectedDestiny.value, lang: "es" },
    { rules: ["required"], name: "gttStartDate", value: dateIn.value, lang: "es" },
    { rules: ["required", "dateAfter:dateIn"], name: "gttEndDate", value: dateOut.value, lang: "es" }
  ]
}

function handleSelected(value: any) {
  edited(value)
}

async function searchResultSameItem() {
  const v = await sR()
  isReserving.value = false
  const fr = v.filter((i: any) => !i.l.some((u: any) => u.habitacion.PrecioOrden < 0))
  if (fr.length == 0) {
    toast("No hay disponibilidad para esta búsqueda", { type: "error" })
  }
}

function edited(value: any) {
  showResult.value = false
  emit("editedItem", {
    tipo: "lodging",
    pItemId: props.filterData.id,
    nI: value
  })
}

async function editVehiculoOrder(item: any) {}

async function searchResult() {
  const iv = gttIsValid(gttValidate(), null as any)
  if (getValid(iv)) {
    isReserving.value = true
    let totalA = 0
    let totalK = 0
    visitantes.value.forEach((i: any) => {
      const a = i.layout.find((j: any) => j.code == "adults").value
      totalA += a
    })
    visitantes.value.forEach((i: any) => {
      const k = i.layout.find((j: any) => j.code == "kids").value
      totalK += k
    })
    const sl = {
      adults: { code: "adults", display: "Adulto(s)", label: "Adultos", value: totalA },
      kids: { code: "kids", display: "Niño(s)", label: "Niños", value: totalK }
    }

    if (selectedDestiny.value.type == "HTL") {
      const r = visitantesToAcomodation(visitantes.value)
      const searchFilters = {
        Destiny: selectedDestiny.value,
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: dateIn.value,
        Salida: dateOut.value,
        Visitantes: sl
      }
      localStorage.setItem("searchLodgingFilters", JSON.stringify(searchFilters))
      localStorage.setItem("searchLodgingAcomodation", JSON.stringify(r))

      helpers.shoppingCartRemoveOne(item.value.uID)
      useCartStore().refresh()

      router.push({ name: "lodging-detail", params: { id: selectedDestiny.value.id } })
    } else {
      const searchFilters = {
        Destiny: selectedDestiny.value,
        Region: { RegionId: selectedDestiny.value.id, RegionNombre: selectedDestiny.value.nombre },
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: dateIn.value,
        Salida: dateOut.value,
        Visitantes: sl
      }
      localStorage.setItem("searchLodgingFilters", JSON.stringify(searchFilters))
      helpers.shoppingCartRemoveOne(item.value.uID)
      useCartStore().refresh()
      router.push({ name: "resultLodging" })
    }
  } else {
    renderValid(iv, {
      $refs: {
        gttLodging: gttLodging.value,
        gttStartDate: gttStartDate.value,
        gttEndDate: gttEndDate.value
      },
      $children: []
    } as any)
  }
}

async function sR() {
  const roomsResult: any[] = []
  const listaPlanesAlimenticios = item.value.lodging.ListaPlanesAlimenticios
  const rooms = await authSearchRoomsByLodging(item.value.lodging.ProductoId)
  await Promise.all(
    rooms.data.map(async (j: any) => {
      await Promise.all(
        listaPlanesAlimenticios.map(async (i: any) => {
          const pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId)
          let noDisp = false
          let c = 0
          const temp: any[] = []
          while (!noDisp && c < visitantes.value.length) {
            const el = visitantes.value[c]
            const ca = el.layout.find((p: any) => p.code == "adults").value
            const cm = el.layout.find((p: any) => p.code == "kids").value
            const so = {
              Cliente: { ClienteId: localStorage.getItem("cliente") },
              PlanAlimenticio: { PlanesAlimenticiosId: i.PlanesAlimenticiosId },
              Alojamiento: { ProductoId: item.value.lodging.ProductoId },
              TipoHabitacion: { TipoHabitacionId: ca },
              CantidadAdultos: ca,
              CantidadMenores: cm,
              CantidadInfantes: 0,
              CantidadHabitaciones: 1,
              Habitacion: { HabitacionId: j.HabitacionId },
              Entrada: dateIn.value,
              Salida: dateOut.value
            }
            try {
              const result = await authGetRoomPrice(so)
              if (result.data.length != 0 && result.data[0].PrecioOrden != 0) {
                temp.push({
                  habitacion: result.data[0],
                  CantAdultos: ca,
                  CantidadMenores: cm,
                  PA: pa.data,
                  rn: el.room
                })
              } else {
                noDisp = true
              }
            } catch (e) {
              noDisp = true
              console.log(e)
            }
            c++
          }
          if (!noDisp) {
            roomsResult.push({ rO: j, pA: pa.data, l: temp })
          }
        })
      )
    })
  )
  return roomsResult
}

async function loadDestinies() {
  if (lodgingOpened.value == true) {
    const totalResult: any[] = []
    const l = await authGetHotelList()
    l.data.forEach((i: any) => {
      totalResult.push({
        nombre: i.Nombre,
        id: i.IdObjeto,
        type: "HTL"
      })
    })
    destinies.value = totalResult
  }
}
</script>

<style lang="scss" scoped>
.c-modal {
  height: auto;
  width: auto;
  font-size: var(--font-size-lg);
  border-radius: var(--border-radius-lg);
  -webkit-transform: translate(-50%, 0);
}

.c-modal button {
  font-size: var(--font-size-md);
  height: 40px;
  margin-left: var(--spacing-md);
}

.c-modal .c-form {
  width: 30vw;
}
</style>
