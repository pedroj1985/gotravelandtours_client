<template>
  <div
    id="lodging-detail"
    class="custom-padding-top-2-navbar"
    style="margin-top: 30px;"
  >
    <GttLodgingDetailNewSearchModal
      :inDate="inDate"
      :outDate="outDate"
      :sRL="selectedRoomLayout"
      :tR="totalRooms"
      :item="item"
      :clickedItem="clickedItem"
      v-if="isModalLodgingActive"
      @modalCancel="isModalLodgingActive = false"
      @searched="updateResult"
      @errorC="errorSearch"
    ></GttLodgingDetailNewSearchModal>
    <div v-if="isModalGalleryActive" class="gtt-lightbox-overlay" @click="isModalGalleryActive = false">
      <div class="gtt-lightbox-content" @click.stop>
        <button class="gtt-lightbox-nav gtt-lightbox-prev" @click="prevImage">&lsaquo;</button>
        <img :src="currentGalleryImage" alt="Imagen del alojamiento" />
        <button class="gtt-lightbox-nav gtt-lightbox-next" @click="nextImage">&rsaquo;</button>
        <button class="gtt-lightbox-close" @click="isModalGalleryActive = false">&times;</button>
      </div>
    </div>
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <div class="row lodging-detail-wrapper">
      <div class="col-md-3 col-sm-5 left-side-wrapper">
        <div class="left-side">
          <div class="lodging-form">
            <LodgingForm
              ref="lodgingForm"
              :propLodgingDestinyValue="filters.Destiny"
              :propArriveDate="filters.Entrada"
              :propDepartureDate="filters.Salida"
              :propRoomLayout="filters.Visitantes"
              :propNationality="filters.Nacionalidad"
            ></LodgingForm>
          </div>
          <div class="selected-rooms hn-roman gtt-first-color">
            <div class="selected-rooms-title hn-bdcn font18">
              Habitaciones a reservar
            </div>
            <div
              class="selected-rooms-empty font12 gtt-text-color"
              v-if="roomsToReserve.length == 0"
            >
              --No hay seleccionada ninguna habitación--
            </div>
            <SelectedRoom
              v-for="item in roomsToReserve"
              :key="item.id"
              :item="item"
              @removeFromList="removeFromToReserve"
            ></SelectedRoom>
            <div class="form-actions selected-rooms-footer flex-wrapper">
              <template v-if="roomsToReserve.length > 0">
                <button
                  type="button"
                  class="selected-rooms-btn btn-reserve"
                  @click="reserve"
                >
                  Reservar
                </button>
                <!-- <button
                  type="button"
                  @click="addToGeneralCart"
                  class=" selected-rooms-btn antonio-regular inverse btn-cart">
                  <i class="mdi mdi-cart"></i>
                </button> -->
              </template>
              <div
                class="total-to-pay font18 flex-right-side to-uppercase hn-bdcn"
              >
                Total: {{ styledPrice(totalPay).intPart }} USD
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9 col-sm-7" v-if="item != null">
        <div class="lodging-detail-header">
          <div class="row">
            <div class="col-md-1 header-star">
              <div class="star-wrapper">
                <i class="mdi mdi-star icon"></i>
                <span class="total-stars">{{
                  item.lodging.NumeroEstrellas
                }}</span>
              </div>
            </div>
            <div class="col-md-6 antonio-regular gtt-first-color">
              <div class="header-name  font24">{{ item.lodging.Nombre }}</div>
              <div class="header-info hn-roman font14 gtt-text-color">
                Del
                {{
                  toMoment(filters.Entrada)
                    .locale("es")
                    .format("DD MMM YYYY")
                }}
                al
                {{
                  toMoment(filters.Salida)
                    .locale("es")
                    .format("DD MMM YYYY")
                }}
              </div>
              <div class="headers-buttons form-actions">
                <button
                  type="button"
                  class="to-uppercase inverse antonio-regular"
                  @click="document.getElementById('pai')?.scrollIntoView({ behavior: 'smooth' })"
                >
                  Precios e información
                </button>
              </div>
            </div>
            <div class="col-md-4 header-map"></div>
          </div>
        </div>
        <div class="lodging-detail-info flex-wrapper">
          <div class="lodging-info-carousel">
            <swiper
              :slides-per-view="1"
              :navigation="true"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              :modules="swiperModules"
              class="lic-carousel"
            >
              <swiper-slide
                class="result-images-carousel"
                v-for="destinyImage in item.images"
                :key="destinyImage"
              >
                <img
                  v-bind:src="destinyImage"
                  :alt="'Imagen de ' + item.lodging.Nombre"
                  @click="isModalGalleryActive = true"
                />
                <div class="w-100 h-100 position-absolute bgHolder"></div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="lodging-info-info">
            <div class="lodging-info-name hn-ltcn font24 gtt-text-color">
              {{ item.lodging.Nombre }}
            </div>
            <div class="lodging-info-stars">
              <div class="item-hotel-stars">
                <ul class="stars font24">
                  <li v-for="i in item.lodging.NumeroEstrellas" :key="i">
                    <i class="mdi mdi-star"></i>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="lodging-info-location gtt-text-color hn-roman general-text-opt pt-30"
            >
              <div class="font14">ubicación:</div>
              <div class="font16">{{ item.lodging.Direccion }}</div>
            </div>
            <div
              class="lodging-info-schedule gtt-text-color hn-roman general-text-opt pt-15"
            >
              <div class="font14">horario:</div>
              <div class="checkin font16">
                <span class="check-sp">Check-In:</span>
                <span>{{ item.lodging.CheckIn }}</span>
              </div>
              <div class="checkout font16">
                <span class="check-sp">Check-Out:</span>
                <span>{{ item.lodging.CheckOut }}</span>
              </div>
            </div>
            <!-- <div class="lodging-info-lang gtt-text-color hn-roman"></div> -->
            <div
              class="lodging-info-contacts gtt-text-color hn-roman general-text-opt pt-15"
            >
              <div class="font14">contactos del hotel:</div>
              <div class="font16">
                <span>{{ item.lodging.Telefono }}</span>
              </div>
            </div>
          </div>
        </div>
        <div id="pai" class="pt-30">
          <div class="verify-step-title pb-30 hn-bdcn font24 gtt-first-color">
            Precios e información
          </div>
          <div class="info-box pt-15">
            <div class="about pl-15 pr-15 pb-30 hn-roman">
              <div class="gtt-first-color font18 pb-15">Acerca del hotel</div>
              <div
                v-html="item.lodging.Descripcion"
                class="font16 gtt-text-color"
              ></div>
            </div>
            <div class="rooms-disponibility hn-roman">
              <div class="gtt-first-color font18 pl-15 pb-15">
                Habitaciones y disponibilidad
              </div>
              <!-- <div
                class="flex-wrapper rooms-disponibility-form pl-15 pr-15"
                @click="openModal"
              >
                <GttSelectDate
                  :mode="'single'"
                  v-model="inDate"
                  :dsb="roomsToReserve.length > 0"
                  class="room-form-item"
                  :clickable="false"
                  @click.native="changeClicked('fecha-entrada')"
                >
                  <i
                    slot="iconSelectedValue"
                    class="mdi mdi-calendar-today"
                  ></i>
                  <span slot="placeholder">
                    Fecha de entrada
                  </span>
                </GttSelectDate>
                <GttSelectDate
                  :mode="'single'"
                  v-model="outDate"
                  :dsb="roomsToReserve.length > 0"
                  class="room-form-item"
                  :clickable="false"
                  @click.native="changeClicked('fecha-salida')"
                >
                  >
                  <i
                    slot="iconSelectedValue"
                    class="mdi mdi-calendar-today"
                  ></i>
                  <span slot="placeholder">
                    Fecha de salida
                  </span>
                </GttSelectDate>
                <GttSelectForm2
                  :options="roomLayout"
                  class="room-form-item"
                  v-model="selectedRoomLayout"
                  :rooms="totalRooms.value"
                  :dsb="roomsToReserve.length > 0"
                  :clickable="false"
                  @click.native="changeClicked('visitantes')"
                >
                  <span slot="iconSelectedValue"
                    ><i class="mdi mdi-account"></i
                  ></span>
                  <span slot="placeholder">Visitantes</span>
                </GttSelectForm2>
                <GttSelect
                  :options="roomsOpt"
                  v-model="totalRooms"
                  :isDisabled="roomsToReserve.length > 0"
                  :clickable="false"
                  @click.native="changeClicked('habitaciones')"
                  class="room-form-item last"
                >
                  <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
                  <span slot="placeholder"> Habitaciones</span>
                  <template v-slot:option="option">
                    {{ option.option.display }}
                  </template>
                  <template v-slot:selectedValue="selectedValue">
                    {{ selectedValue.selectedValue.display }}
                  </template>
                </GttSelect>
                <div class="form-actions prices-info-search-btn">
                  <button
                    type="submit"
                    class="antonio-regular inverse"
                    @click="changeClicked('')"
                  >
                    Buscar
                  </button>
                </div>
              </div> -->
            </div>
            <div class="rooms-result" v-if="roomsSelecting">
              <div
                class="list-item-select gtt-first-color hn-bdcn"
                v-if="roomsResult.length > 0"
              >
                <span class="result-text">Resultados para: </span>
                <div class="buscando flex-wrapper">
                  <div
                    v-for="(rl, index) in this.selectedRoomLayout"
                    :key="rl.id"
                  >
                    <span><i v-if="index != 0">, </i>Hab. {{ rl.room }} </span>
                    (<AdultsKidsIcons
                      :adults="getAdults(rl)"
                      :kids="getKids(rl)"
                      :id="'room_' + rl.room"
                    ></AdultsKidsIcons
                    >)
                  </div>
                </div>
              </div>
              <div
                v-else
                class="text-center d-flex align-items-center justify-content-center mb-2 alert-state info"
                role="status"
              >
                <i class="mdi mdi-cloud-search-outline"></i>
                <span>Buscando disponibilidad...</span>
              </div>
              <div class="list-item-children">
                <ResultListRow2
                  v-for="child in roomsResult"
                  :key="child.id"
                  :child="child"
                  :roomSelectedToDis="roomSelectedToDis"
                  @listReserve="addToCart"
                  @reserveOne="addOneToCart"
                >
                </ResultListRow2>
              </div>
            </div>
            <div v-else>
              <div
                v-if="roomsResult.length == 0"
                class="text-center d-flex align-items-center justify-content-center mb-2 alert-state warning"
                role="alert"
              >
                <i class="mdi mdi-alert-circle-outline"></i>
                <span>No existe disponibilidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router"
import {
  authGetLodging,
  authGetImages,
  authSearchRoomsByLodging,
  authGetRoomPrice,
  authGetLodgingEatingPlanOne,
  hotetecBlockProduct
} from "../../utils/auth";
import { hotelecSessionService } from "../../utils/hotelecSessionService";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css"
import GttLodgingDetailNewSearchModal from "../custom-elements/GttLodgingDetailNewSearchModal.vue";
import ResultListRow2 from "../result-lodging/ResultListRow2.vue";
import moment from "moment";
import SelectedRoom from "./SelectedRoom.vue";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import AdultsKidsIcons from "./AdultsKidsIcons.vue";
import LodgingForm from "./LodgingForm.vue";
import NavBar2 from "../shared/NavBar2.vue";
import { useLodging } from "../../composables/useLodging";
import { useCartStore } from "../../stores/cartStore";
import { helpers } from "../../utils/helpers";

const $helpers = helpers
const router = useRouter()
const route = useRoute()

const swiperModules = [Navigation, Pagination, Autoplay]
const item = ref<any>(null)
const clickedItem = ref("")
const isModalLodgingActive = ref(false)
const isModalGalleryActive = ref(false)
const currentGalleryIndex = ref(0)
const totalToPay = ref(0)
const filters = ref<any>(null)
const totalRooms = ref<any>(null)
const roomsOpt = ref<any[]>([])
const selectedRoomLayout = ref<any[]>([])
const roomsToReserve = ref<any[]>([])
const roomsSelecting = ref(false)
const selectingWizardStep = ref(0)
const inDate = ref<any>(null)
const outDate = ref<any>(null)
const loading = ref(false)
const roomsResult = ref<any[]>([])
const roomSelectedToDis = ref<any[]>([])
const amoung = ref(1)
const roomLayout = ref([
  { code: "adults", label: "Adultos", display: "Adulto(s)", default: 1 },
  { code: "kids", label: "Niños", display: "Niño(s)", default: 0 }
])
const menuLinks = ref([
  { name: "index", displayName: "Inicio", id: "home-logged-banner" },
  { name: "lodging", displayName: "alojamientos", id: "home-logged-banner" }
])

const totalPay = computed(() => {
  return _.sumBy(roomsToReserve.value, (i: any) => {
    return i.habitacion.PrecioOrden * i.habitacion.CantidadHabitaciones
  })
})

const imagesTreated = computed(() => {
  if (item.value)
    return item.value.images.map((i: string) => ({ src: i, thumb: i }))
  return []
})

const currentGalleryImage = computed(() => {
  const images = imagesTreated.value
  return images[currentGalleryIndex.value]?.src || ""
})

watch(() => route.params.id, async () => {
  if (import.meta.env.DEV) { console.log("id changed") }
  await initializeData()
}, { immediate: true })

onBeforeRouteUpdate(async () => {
  await initializeData()
})

async function initializeData() {
  totalRooms.value = { value: 1, display: "1 habitación" }
  let f = JSON.parse(localStorage.getItem("searchLodgingFilters") || "null")
  filters.value = f
  let a = JSON.parse(localStorage.getItem("searchLodgingAcomodation") || "null")
  fillRoomLayout(a)
  inDate.value = new Date(filters.value.Entrada)
  outDate.value = new Date(filters.value.Salida)
  let id = route.params.id
  let { data } = await authGetLodging(id)
  console.info("dataDetail", data)
  let imgs = await authGetImages(id)
  let imgs_array = imgs.data.map((i: any) => i.ImageContent)
  item.value = { images: imgs_array, lodging: data }
  try {
    roomsSelecting.value = true
    if (import.meta.env.DEV) { console.log("sR init") }
    await sR()
    if (import.meta.env.DEV) { console.log("sR init done") }
    if (roomsResult.value.length == 0) {
      roomsSelecting.value = false
    }
    emit("searchingFinished", false)
  } catch (e) {
    if (import.meta.env.DEV) { console.log(e) }
  }
}

const emit = defineEmits<{
  (e: "searchingFinished", val: boolean): void
  (e: "listReserve", item: any, amoung: number): void
  (e: "loading", val: boolean): void
}>()

function prevImage() {
  const total = imagesTreated.value.length
  currentGalleryIndex.value = (currentGalleryIndex.value - 1 + total) % total
}

function nextImage() {
  const total = imagesTreated.value.length
  currentGalleryIndex.value = (currentGalleryIndex.value + 1) % total
}

function changeClicked(item: string) {
  clickedItem.value = item
}

function openModal() {
  if (roomsToReserve.value.length == 0) isModalLodgingActive.value = true
}

function fillRoomLayout(acomodation: any[]) {
  if (!acomodation) return
  let total = _.sumBy(acomodation, (i: any) => i.cantidad)
  totalRooms.value = {
    value: total,
    display: total > 1 ? `${total} habitaciones` : `${total} habitación`
  }
  let count = 1
  let a: any[] = []
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
    selectedRoomLayout.value = a
  }
}

function toMoment(date: string) {
  return moment(date)
}

function getAdults(item: any) {
  return item.layout.find((i: any) => i.code == "adults").value
}

function getKids(item: any) {
  return item.layout.find((i: any) => i.code == "kids").value
}

function refreshLayout() {
  selectedRoomLayout.value = [{
    room: 1,
    layout: [
      { code: "adults", display: "Adulto(s)", label: "Adultos", value: 1 },
      { code: "kids", display: "Niño(s)", label: "Niños", value: 0 }
    ]
  }]
  totalRooms.value = { value: 1, display: "1 habitación" }
}

function removeFromToReserve(item: any) {
  let indexR = roomsToReserve.value.findIndex((i: any) => i.id == item.id)
  roomsToReserve.value.splice(indexR, 1)
  let index = roomSelectedToDis.value.findIndex((o: any) => o == item.rn)
  roomSelectedToDis.value.splice(index, 1)
}

function errorSearch() {
  roomsResult.value = []
  roomsSelecting.value = false
  isModalLodgingActive.value = false
}

function updateResult(r: any) {
  roomsSelecting.value = true
  roomsResult.value = r.result
  inDate.value = r.filters.inDate
  outDate.value = r.filters.outDate
  selectedRoomLayout.value = r.filters.selectedRoomLayout
  totalRooms.value = r.filters.totalRooms
  isModalLodgingActive.value = false
}

async function addToGeneralCart() {
  let listado: any[] = []
  let hotelectData: any = {}
  let currentHotelec = await hotelecSessionService.getOrCreateSession()
  for (const i of roomsToReserve.value) {
    listado.push({
      precioObjOne: i.habitacion,
      tipoHabitacion: i.habitacion.TipoHabitacion.TipoHabitacionId,
      cantidadMenoresPorHabitacion: i.CantidadMenores,
      planAlimenticioId: i.PA.PlanesAlimenticiosId,
      planAlimenticio: i.PA,
      price: { value: i.habitacion.PrecioOrden },
      HabitacionId: i.Habitacion.HabitacionId,
      Habitacion: i.Habitacion,
      cantidad: i.habitacion.CantidadHabitaciones
    })
    let so = {
      Cliente: { ClienteId: localStorage.getItem("cliente") },
      PlanAlimenticio: { PlanesAlimenticiosId: i.PA.PlanesAlimenticiosId },
      Alojamiento: { ProductoId: item.value.lodging.ProductoId },
      TipoHabitacion: { TipoHabitacionId: i.CantAdultos },
      CantidadAdultos: i.CantAdultos,
      CantidadMenores: i.CantidadMenores,
      CantidadInfantes: 0,
      CantidadHabitaciones: 1,
      HotetecIdeses: currentHotelec,
      IsSinContrato: true,
      Habitacion: { HabitacionId: i.Habitacion.HabitacionId },
      Entrada: inDate.value,
      Salida: outDate.value
    }
    hotelectData = await authGetRoomPrice(so)
  }
  let total = _.sumBy(roomsToReserve.value, (j: any) => {
    return j.habitacion.PrecioOrden * roomsToReserve.value[0].habitacion.CantidadHabitaciones
  })

  roomsToReserve.value.combinacion = { listado, total }
  roomsToReserve.value.planAlimenticio = listado[0].planAlimenticio
  roomsToReserve.value.habitacion = {
    ProductoId: item.value.lodging.ProductoId,
    HabitacionId: listado[0].HabitacionId
  }
  roomsToReserve.value.IsSinContrato = listado[0].precioObjOne.IsSinContrato
  roomsToReserve.value.hotelectData = hotelectData

  let { Adl, Nin } = $helpers.generatePassageList(roomsToReserve.value.combinacion)
  let allIds: number[] = []
  Adl.forEach((adult: any) => allIds.push(adult.Id))
  Nin.forEach((minor: any) => allIds.push(minor.Id))

  let blockProduct = {
    Accion: "A", Codtou: "HTI", Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: { Id: 1, Dissmo: [{ Pasid: allIds, Id: roomsToReserve.value.hotelectData.HotetecInfoHabId, Numuni: amoung.value.toString() }] }
  }

  let unblockProduct = {
    Accion: "E", Codtou: "HTI", Ideses: currentHotelec,
    Pasage: { Adl, Nin },
    Bloser: { Id: 1, Dissmo: [{ Pasid: allIds, Id: roomsToReserve.value.hotelectData.HotetecInfoHabId, Numuni: amoung.value.toString() }] }
  }

  hotetecBlockProduct(blockProduct)
    .then((res: any) => {
      if (res.data.Tiperr === null) {
        roomsToReserve.value["unblockRequest"] = unblockProduct
        emit("listReserve", roomsToReserve.value, amoung.value)
      }
    })
    .finally(() => {
      emit("loading", false)
    })

  let l = {
    tipo: "lodging",
    entrada: inDate.value,
    salida: outDate.value,
    name: item.value.lodging.Nombre,
    stars: item.value.lodging.NumeroEstrellas,
    images: item.value.images,
    location: item.value.lodging.Direccion,
    lodging: item.value.lodging,
    roomL: selectedRoomLayout.value,
    reservedRooms: { combinacion: { listado, total } }
  }

  refreshLayout()
  $helpers.shoppingCartAdd(l)
  useCartStore().refresh()
  roomSelectedToDis.value = []
  roomsToReserve.value = []
  roomsResult.value = []
}

async function reserve() {
  await addToGeneralCart()
  router.push({ name: "reservation" })
}

function addOneToCart(item: any) {
  console.info("item4", item)
  roomsToReserve.value.push(item)
  roomSelectedToDis.value.push(item.rn)
}

async function addToCart(item: any) {
  item.l.forEach((i: any) => {
    i.Habitacion = item.rO
    roomsToReserve.value.push(i)
    roomSelectedToDis.value.push(i.rn)
  })
  if (import.meta.env.DEV) { console.log("item5", item) }
}

async function btnSearch() {
  roomsSelecting.value = true
  loading.value = true
  try {
    await sR()
  } catch (e) {
    if (import.meta.env.DEV) { console.log(e) }
  }
}

async function sR() {
  let currentHotelec = await hotelecSessionService.getOrCreateSession()
  roomsResult.value = []
  let listaPlanesAlimenticios = item.value.lodging.ListaPlanesAlimenticios
  let rooms = await authSearchRoomsByLodging(item.value.lodging.ProductoId)
  let active_rooms = rooms.data.filter((i: any) => i.IsActiva == true)
  try {
    await Promise.all(
      active_rooms.map(async (j: any) => {
        if (import.meta.env.DEV) { console.log("--- j ---", j) }
        await Promise.all(
          listaPlanesAlimenticios.map(async (i: any) => {
            if (import.meta.env.DEV) { console.log("--- i ---", i) }
            let pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId)
            let noDisp = false
            let c = 0
            let temp: any[] = []
            while (!noDisp && c < selectedRoomLayout.value.length) {
              let el = selectedRoomLayout.value[c]
              let ca = el.layout.find((p: any) => p.code == "adults").value
              let cm = el.layout.find((p: any) => p.code == "kids").value
              let so = {
                Cliente: { ClienteId: localStorage.getItem("cliente") },
                PlanAlimenticio: { PlanesAlimenticiosId: i.PlanesAlimenticiosId },
                Alojamiento: { ProductoId: item.value.lodging.ProductoId },
                TipoHabitacion: { TipoHabitacionId: ca },
                CantidadAdultos: ca,
                CantidadMenores: cm,
                CantidadInfantes: 0,
                CantidadHabitaciones: 1,
                HotetecIdeses: currentHotelec,
                IsSinContrato: true,
                Habitacion: { HabitacionId: j.HabitacionId },
                Entrada: inDate.value,
                Salida: outDate.value
              }
              try {
                let precioA = await authGetRoomPrice(so)
                let data = precioA.data[0]
                data.TipoHabitacion = so.TipoHabitacion
                console.info("precioData", data)
                if (precioA.data.length != 0 && data.PrecioOrden != 0 && data.HotetecIsAvailable === true) {
                  temp.push({
                    name: j.Nombre,
                    habitacion: data || -1,
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
              }
              c++
            }
            if (!noDisp) {
              console.info("roomsResult", [j, pa.data, temp])
              roomsResult.value.push({ rO: j, pA: pa.data, l: temp })
            }
          })
        )
      })
    )
  } catch (e) {
    if (import.meta.env.DEV) { console.log(e) }
  }
  loading.value = false
}

async function searchRooms(room: any) {
  roomsResult.value = []
  let atLeastOne = false
  let listaPlanesAlimenticios = item.value.lodging.ListaPlanesAlimenticios
  let ca = room.layout.find((p: any) => p.code == "adults").value
  let cm = room.layout.find((p: any) => p.code == "kids").value
  let rooms = await authSearchRoomsByLodging(item.value.lodging.ProductoId)
  let active_rooms = rooms.data.filter((i: any) => i.IsActiva == true)
  await Promise.all(
    active_rooms.map(async (j: any) => {
      await Promise.all(
        listaPlanesAlimenticios.map(async (i: any) => {
          let pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId)
          let sf = {
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            PlanAlimenticio: { PlanAlimenticioId: i.PlanesAlimenticiosId },
            Alojamiento: { ProductoId: item.value.lodging.ProductoId },
            TipoHabitacion: { TipoHabitacionId: ca },
            CantidadAdultos: ca,
            CantidadMenores: cm,
            CantidadInfantes: 0,
            CantidadHabitaciones: 1,
            Habitacion: { HabitacionId: j.HabitacionId },
            Entrada: inDate.value,
            Salida: outDate.value
          }
          try {
            let r = await authGetRoomPrice(sf)
            if (r.data.length != 0 && r.data[0].PrecioOrden != 0) {
              atLeastOne = true
              roomsResult.value.push({
                habitacion: r.data[0],
                CantAdultos: ca,
                CantidadMenores: cm,
                PA: pa.data,
                id: uuidv4()
              })
            }
          } catch (e) {
            if (import.meta.env.DEV) { console.log(e) }
          }
        })
      )
    })
  )
  if (!atLeastOne) {
    roomsSelecting.value = false
  }
  loading.value = false
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number)
  let decimalPart = Math.round((number - intPart) * 100)
  if (decimalPart == 0) decimalPart = "00"
  return { intPart, decimalPart }
}
</script>

<style scoped>
.gtt-lightbox-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gtt-lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}
.gtt-lightbox-content img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
}
.gtt-lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 36px;
  cursor: pointer;
  line-height: 1;
}
.gtt-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 48px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 1;
  transition: background 0.2s;
}
.gtt-lightbox-nav:hover {
  background: rgba(255,255,255,0.4);
}
.gtt-lightbox-prev { left: -60px; }
.gtt-lightbox-next { right: -60px; }
</style>
