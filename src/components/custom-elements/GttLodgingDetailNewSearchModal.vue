<template>
  <div>
    <div class="c-modal-backdrop">
      <div class="c-modal">
        <div class="c-modal-body">
          <div class="d-flex mb-3">
            <button
              @click="$emit('modalCancel', true)"
              class="bclose"
              type="button"
            >&times;</button>
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
              <template v-slot:option="option">{{
                option.option.display
              }}</template>
              <template v-slot:selectedValue="selectedValue">{{
                selectedValue.selectedValue.display
              }}</template>
            </GttSelect>
            <div class="form-actions prices-info-search-btn">
              <button type="submit" class="antonio-regular" @click="btnSearch">
                <template v-if="!loading">Buscar</template>
                <span
                  class="gtt-spinner gtt-spinner-sm loading-spinner"
                  v-else
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import GttSelectDate from "../custom-elements/GttSelectDate.vue"
import GttSelectForm2 from "../custom-elements/GttSelectForm2.vue"
import GttSelect from "../custom-elements/GttSelect.vue"
import {
  authSearchRoomsByLodging,
  authGetRoomPrice,
  authGetLodgingEatingPlanOne
} from "../../utils/auth"
import { v4 as uuidv4 } from "uuid"

const props = withDefaults(defineProps<{
  item?: any
  inDate?: Date
  outDate?: Date
  sRL?: any[]
  tR?: any
  clickedItem?: string
}>(), {
  clickedItem: ""
})

const emit = defineEmits<{
  (e: "searched", val: any): void
  (e: "errorC"): void
}>()

const roomsOpt = ref<any[]>([])
const roomsResult = ref<any[]>([])
const dateIn = ref(props.inDate ?? null)
const dateOut = ref(props.outDate ?? null)
const selectedRoomLayout = ref(props.sRL ?? null)
const totalRooms = ref(props.tR ?? null)
const loading = ref(false)
const cI = ref(props.clickedItem)
const roomLayout = [
  { code: "adults", label: "Adultos", display: "Adulto(s)", default: 1 },
  { code: "kids", label: "Niños", display: "Niño(s)", default: 0 }
]

roomsOpt.value = generateRooms()
selectedRoomLayout.value = props.sRL ?? null
totalRooms.value = props.tR ?? null
dateIn.value = props.inDate ?? null
dateOut.value = props.outDate ?? null
cI.value = props.clickedItem

function refreshRoomLayout(roomLayout: any[]) {
  roomLayout.forEach((element, i) => {
    element.room = i + 1
  })
}

function addRoom() {
  const currrentValue = totalRooms.value.value
  const v = roomsOpt.value.find((i: any) => i.value == currrentValue + 1)
  totalRooms.value = v
}

function removeRoom(indexRoomLayout: number) {
  selectedRoomLayout.value.splice(indexRoomLayout, 1)
  refreshRoomLayout(selectedRoomLayout.value)
  const currrentValue = totalRooms.value.value
  const v = roomsOpt.value.find((i: any) => i.value == currrentValue - 1)
  totalRooms.value = v
}

async function btnSearch() {
  loading.value = true
  try {
    const r = await sR()
    if (import.meta.env.DEV) { console.log("resultado busqueda", r) }
    if (r.length > 0) {
      emit("searched", {
        result: r,
        filters: {
          inDate: dateIn.value,
          outDate: dateOut.value,
          selectedRoomLayout: selectedRoomLayout.value,
          totalRooms: totalRooms.value
        }
      })
    } else {
      emit("errorC")
    }
  } catch (e) {
    if (import.meta.env.DEV) { console.log(e) }
  }
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

async function sR() {
  const roomsResultArr: any[] = []
  const listaPlanesAlimenticios = props.item!.lodging.ListaPlanesAlimenticios
  const rooms = await authSearchRoomsByLodging(props.item!.lodging.ProductoId)
  const active_rooms = rooms.data.filter((i: any) => i.IsActiva == true)
  try {
    await Promise.all(
      active_rooms.map(async (j: any) => {
        await Promise.all(
          listaPlanesAlimenticios.map(async (i: any) => {
            const pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId)
            let noDisp = false
            let c = 0
            const temp: any[] = []
            while (!noDisp && c < selectedRoomLayout.value.length) {
              const el = selectedRoomLayout.value[c]
              const ca = el.layout.find((p: any) => p.code == "adults").value
              const cm = el.layout.find((p: any) => p.code == "kids").value
              const so = {
                Cliente: { ClienteId: localStorage.getItem("cliente") },
                PlanAlimenticio: { PlanesAlimenticiosId: i.PlanesAlimenticiosId },
                Alojamiento: { ProductoId: props.item!.lodging.ProductoId },
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
                if (import.meta.env.DEV) { console.log("get room price", result) }
                if (
                  result.data.length != 0 &&
                  result.data[0].PrecioOrden != 0
                ) {
                  temp.push({
                    habitacion: result.data[0],
                    CantAdultos: ca,
                    CantidadMenores: cm,
                    PA: pa.data,
                    rn: el.room,
                    id: uuidv4()
                  })
                } else {
                  noDisp = true
                }
              } catch (e) {
                noDisp = true
                if (import.meta.env.DEV) { console.log(e) }
              }
              c++
            }
            if (!noDisp) {
              roomsResultArr.push({ rO: j, pA: pa.data, l: temp })
            }
          })
        )
      })
    )
  } catch (e) {
    if (import.meta.env.DEV) { console.log(e) }
  }
  loading.value = false
  return roomsResultArr
}
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
