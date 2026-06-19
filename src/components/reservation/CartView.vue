<template>
  <div id="reserve-cart" class="custom-padding-top-2-navbar">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <GttVerificationModal
      v-if="deleteModal"
      @closeModal="closeDeleteModal"
      @next="deleteItem(tempItemToDelete.uID)"
    ></GttVerificationModal>
    <component
      :is="currentModalComponent"
      v-if="editModal"
      :filterData="currentFilterData"
      @cancel="closeEditModal"
      @editedItem="editOrder"
      :age="age"
    ></component>
    <div class="reserve-nav custom-padding">
      <div class="reserve-nav-text hn-bdcn font24 to-uppercase">
        Reserva segura. ¡En solo dos minutos!
      </div>
    </div>
    <div class="reserve-content custom-margin" v-if="allTypesOrders.length > 0">
      <div class="reserve-cancelation-info"></div>
      <div class="reserve-two-rows row">
        <div class="reserve-left-row col-md-3 col-sm-5">
          <div id="reserve-total-preview" class="pr-30">
            <div class="background-yellow br-10 pad-15">
              <div
                class="
                  reserve-title
                  text-center
                  hn-roman
                  gtt-first-color
                  font24
                  general-text-opt
                "
              >
                Usted ha reservado:
              </div>
              <div
                class="reserve-card"
                v-for="item in allTypesOrders"
                :key="item.uID"
              >
                <template v-if="item.tipo == 'rent'">
                  <div class="img-wrapper">
                    <img :src="item.imagen" :alt="item.nombre" />
                  </div>
                  <div class="reserve-card-info pad-5 bg-white">
                    <div
                      class="
                        reserve-card-item-name
                        hn-roman
                        font14
                        gtt-text-color
                      "
                    >
                      {{ item.nombre }}
                    </div>
                    <div
                      class="
                        reserve-card-item-price
                        hn-roman
                        font16
                        gtt-text-color
                      "
                    >
                      {{ styledPrice(item.precio).intPart }} USD
                    </div>
                  </div>
                </template>
                <template v-if="item.tipo == 'lodging'">
                  <div class="img-wrapper">
                    <img :src="item.images[0]" :alt="item.name" />
                  </div>
                  <div class="reserve-card-info pad-5 bg-white">
                    <div
                      class="
                        reserve-card-item-name
                        hn-roman
                        font14
                        gtt-text-color
                      "
                    >
                      {{ item.name }}
                    </div>
                    <div
                      class="
                        reserve-card-item-price
                        hn-roman
                        font16
                        gtt-text-color
                      "
                    >
                      {{
                        styledPrice(item.reservedRooms.combinacion.total)
                          .intPart
                      }}
                      USD
                    </div>
                  </div>
                </template>
                <template v-if="item.tipo == 'pakage'">
                  <div class="img-wrapper">
                    <img :src="item.images[0]" :alt="item.name" />
                  </div>
                  <div class="reserve-card-info pad-5 bg-white">
                    <div
                      class="
                        reserve-card-item-name
                        hn-roman
                        font14
                        gtt-text-color
                      "
                    >
                      {{ item.name }}
                    </div>
                    <div
                      class="
                        reserve-card-item-price
                        hn-roman
                        font16
                        gtt-text-color
                      "
                    >
                      {{
                        styledPrice(item.reservedRooms.combinacion.total)
                          .intPart
                      }}
                      USD
                    </div>
                  </div>
                </template>
              </div>
              <div class="reserve-total-to-pay">
                <span
                  class="
                    total-to-pay-text
                    hn-roman
                    font18
                    gtt-first-color
                    to-uppercase
                    general-text-opt
                  "
                  >Total a pagar</span
                >
                <span class="antonio-light gtt-first-color font48">
                  {{ styledPrice(priceTotal).intPart }} USD
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="reserve-right-row col-md-9 col-sm-7">
          <div class="verify-step">
            <div
              class="
                verify-step-title
                gtt-first-color
                general-text-opt
                hn-bdcn
                font24
                pad-15
              "
            >
              <span> <i class="mdi mdi-bed"></i> Paso 1: </span>
              <span>Verificar datos de su reservación</span>
            </div>
            <div
              v-for="order in allTypesOrders"
              :key="order.uID"
              :id="order.uID"
              class="verify-step-content pt-30 pr-15 pl-15 pb-15"
            >
              <LodgingReservationView
                class="lrv"
                v-if="order.tipo == 'lodging'"
                :item="order"
                :can="true"
                @remove="showDeleteModal"
                @edit="showEditModal"
              ></LodgingReservationView>
              <!-- TODO: extra day :overDay="extraDay" -->
              <RentReservationView
                class="rrv"
                v-if="order.tipo == 'rent'"
                :item="order"
                @remove="showDeleteModal"
                @edit="showEditModal"
              ></RentReservationView>
            </div>
          </div>
          <div class="create-order-step">
            <div
              class="
                create-order-step-title
                gtt-first-color
                general-text-opt
                hn-bdcn
                font24
                pad-15
              "
            >
              <span> <i class="mdi mdi-account"></i> Paso 2: </span>
              <span>Datos del o los pasajero(s) y crear orden</span>
              <div class="create-order-step-content pt-30 pl-30 pb-30">
                <!-- TODO cartview data -->
                <InfoRow
                  :name="clientName"
                  :lastname="clienteLastName"
                  :pasaporte="clientePasaporte"
                  :phone="clientePhone"
                  :nacimiento="clienteNacimiento"
                  :hasCar="checkIfRentExist"
                  @inputName="updateName"
                  @inputLastname="updateLastname"
                  @inputPasaporte="updatePasaporte"
                  @inputPhone="updatePhone"
                  @inputNacimiento="updateNacimiento"
                >
                </InfoRow>

                <RentInfoRow
                  :pickUp="horaLanding"
                  :deliver="horaTakeoff"
                  @inputDeliveryPlace="updateDeliveryPlace"
                  @inputPickUpPlace="updatePickUpPlace"
                  @inputPickUp="updateHoraLanding"
                  @inputDeliver="updateHoraTakeoff"
                  :editable="editTime"
                  v-if="checkIfRentExist"
                >
                </RentInfoRow>

                <FlightInfoRow
                  class="fir"
                  :aerolinea_landing="aerolineaLanding"
                  :aerolinea_takeoff="aerolineaTakeoff"
                  :nvuelo_landing="nvueloLanding"
                  :nvuelo_takeoff="nvueloTakeoff"
                  @inputAerolineaLanding="updateAerolineaLanding"
                  @inputAerolineaTakeoff="updateAerolineaTakeoff"
                  @inputNvueloLanding="updateNvueloLanding"
                  @inputNvueloTakeoff="updateNvueloTakeoff"
                ></FlightInfoRow>
              </div>

              <!-- TODO v-if="checkIfRentExist" revisar que mande el pasaporte a la api -->
              <div class="form-actions text-right">
                <button
                  :disabled="!editTime"
                  type="button"
                  @click="reserve"
                  class="reserveButton antonio-regular"
                >
                  <template v-if="!isReserving">Crear Orden</template>
                  <span
                    class="gtt-spinner gtt-spinner-sm loading-spinner"
                    v-else
                  ></span>
                </button>
              </div>
              <div
                id="reservation-extra-info"
                class="hn-roman font14 pl-30"
                style="color: #ff0000; margin-top: 15px"
              >
                <span>
                  Si los datos introducidos no son correctos, nuestra agencia no
                  se hace responsable de las consecuencias que esto traiga para
                  la correcta realización del servicio o los servicios
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <GttEmptyState>
        <template #icon><i class="mdi mdi-cart-outline"></i></template>
        <template #title>Tu carrito está vacío</template>
        Agrega alojamientos o renta de autos para comenzar tu reservación.
      </GttEmptyState>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"
import RentReservationView from "./RentReservationView.vue";
import LodgingReservationView from "./LodgingReservationView.vue";
import InfoRow from "./InfoRow.vue";
import RentInfoRow from "./RentInfoRow.vue";
import FlightInfoRow from "./FlightInfoRow.vue";
import {
  authReserve,
  authCreateQbEstimated,
  authUpdOnlyInDbQbEstimated,
  authUpdateCar,
  authLog,
  hotetecCloseReserve,
  hotetecUpdateDataOnGtt,
  authUpdateStatus
} from "../../utils/auth";
import GttEditLodgingModal from "../custom-elements/GttEditLodgingModal.vue";
import GttVerificationModal from "../custom-elements/GttVerificationModal.vue";
import GttEmptyState from "../shared/GttEmptyState.vue";
import NavBar2 from "../shared/NavBar2.vue";
import { menuLinks } from "../../menu";
import GttEditRentModal from "../custom-elements/GttEditRentModal.vue";
import { transmissionTypes } from "../../utils/utils";
import { cleanVO } from "../../composables/useCleanup";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { verifyDifferentsDatesNoCartReturnBoolean } from "../../utils/utils";
import _ from "lodash";
import moment from "moment";
import { orderStatusList } from "../../utils/constant";
import { hotelecSessionService } from "../../utils/hotelecSessionService";
import { useCartStore } from "../../stores/cartStore";
import { helpers } from "../../utils/helpers";

const $helpers = helpers
const router = useRouter()

const edadCliente = ref(0)
const extraDay = ref(0)
const deleteModal = ref(false)
const editModal = ref(false)
const currentModalComponent = ref("")
const currentFilterData = ref<any>(null)
const tempItemToDelete = ref<any>(null)
const tempItemToEdit = ref<any>(null)
const allTypesOrders = ref<any[]>([])
const priceTotal = ref(0)
const clientName = ref("")
const clienteLastName = ref("")
const clientePasaporte = ref("")
const clientePhone = ref("")
const clienteNacimiento = ref("")
const horaLanding = ref("")
const aerolineaLanding = ref("")
const nvueloLanding = ref("")
const horaTakeoff = ref("")
const aerolineaTakeoff = ref("")
const nvueloTakeoff = ref("")
const editTime = ref(true)
const clientPickUpPlace = ref<any[]>([])
const clientDeliveryPlace = ref<any[]>([])
const isReserving = ref(false)
const mMenuLinks = ref<any[]>([])
const selectedPickUpPlace = ref<any>(null)
const selectedDeliveryPlace = ref<any>(null)

const age = computed(() => {
  if (!clienteNacimiento.value) return 0
  var temp = clienteNacimiento.value.split("-")
  var date = new Date(Number(temp[0]), Number(temp[1]), Number(temp[2]))
  var cur = new Date()
  var diff = cur.getTime() - date.getTime()
  var currentAge = Math.floor(diff / 31557600000)
  return currentAge
})

const checkIfRentExist = computed(() => {
  return allTypesOrders.value.some((i: any) => i.tipo == "rent")
})

onMounted(() => {
  mMenuLinks.value = menuLinks
  updateCart()
})

watch(horaLanding, async (newTime: string) => {
  editTime.value = false
  if (horaTakeoff.value != "" && horaLanding.value != "") {
    let order: any = {}
    for (const item of allTypesOrders.value) {
      if ("orderVehiculo" in item) {
        order = item
      }
    }
    let { data } = await authUpdateCar({
      FechaRecogida: order.orderVehiculo.FechaRecogida,
      FechaEntrega: order.orderVehiculo.FechaEntrega,
      EdadCliente: age.value,
      Marca: { MarcaId: order.marcaid, Nombre: order.marca },
      TipoTransmision: order.transmision,
      Cliente: { ClienteId: localStorage.getItem("cliente") },
      ProductoId: order.id,
      DistribuidorId: order.distribuidorId,
      HoraEntrega: horaTakeoff.value,
      HoraRecogida: horaLanding.value
    })
    data.FechaEntrega = order.orderVehiculo.FechaEntrega
    data.DistribuidorId = order.orderVehiculo.DistribuidorId
    let fixData = cleanDataFn(data)
    order.orderVehiculo = fixData
    order.precio = order.orderVehiculo.PrecioOrden
    tempItemToEdit.value = { uID: order.uID }
    let item = { nI: order, pItemId: order.id, tipo: "rent" }
    editOrder(item)
    var leave = new Date("1970-01-01T" + horaTakeoff.value)
    var arrive = new Date("1970-01-01T" + horaLanding.value)
    if (leave > arrive) {
      extraDay.value = 1
      toast("Departure Time is greater than the Arrival Time. An extra day was charged to your vehicle order!", {
        type: "warning", position: "top-center", autoClose: false, closeButton: true
      })
    } else {
      extraDay.value = 0
    }
  }
  editTime.value = true
})

function gttValidate() {
  return [
    { rules: ["required"], name: "gttName", value: clientName.value, lang: "es" },
    { rules: ["required"], name: "gttApellido", value: clienteLastName.value, lang: "es" },
    { rules: ["required"], name: "gttPasaporte", value: clientePasaporte.value, lang: "es" },
    { rules: ["required"], name: "gttPhone", value: clientePhone.value, lang: "es" }
  ]
}

function constructSpacedVal(f: string, s: string, separator = " ") {
  let splittedName = f.split(" ")
  let name = splittedName.map((i: string) => _.capitalize(i)).join(" ")
  let splittedLastName = s.split(" ")
  let lastname = splittedLastName.map((i: string) => _.capitalize(i)).join(" ")
  return `${name}${separator}${lastname}`
}

function updateCart() {
  let lsCart = localStorage.getItem("gttCart")
  if (lsCart) {
    allTypesOrders.value = JSON.parse(lsCart)
    calculatePrice(allTypesOrders.value)
  }
}

function deleteItem(id: string) {
  $helpers.shoppingCartRemoveOne(id)
  updateCart()
  useCartStore().refresh()
  tempItemToDelete.value = null
  deleteModal.value = false
}

async function reserve() {
  let iv = gttIsValid(gttValidate(), {} as any)
  if (getValid(iv)) {
    let createInHotetec: any = {}
    let listaVehiculosOrden = getListaVehiculosOrden()
    let listaAlojamientosOrden = getListaAlojamientosOrden()
    listaAlojamientosOrden.forEach((ao: any) => {
      ao.NombreCliente = constructSpacedVal(clientName.value, clienteLastName.value)
    })
    listaVehiculosOrden.forEach((vo: any) => {
      vo.NombreCliente = constructSpacedVal(clientName.value, clienteLastName.value)
      vo.FechaRecogida = vo.FechaRecogida.split("T")[0]
      vo.FechaInicio = vo.FechaRecogida
      vo.FechaEntrega = vo.FechaEntrega.split("T")[0]
      vo.FechaFin = vo.FechaEntrega
      vo.FechaNacimiento = clienteNacimiento.value
      vo.HoraInicio = horaLanding.value
      vo.HoraFin = horaTakeoff.value
      vo.InformacionLlegada = aerolineaLanding.value
      vo.NumeroVueloEntrada = nvueloLanding.value
      vo.InformacionSalida = aerolineaTakeoff.value
      vo.NumeroVueloSalida = nvueloTakeoff.value
      vo.LugarRecogida = clientPickUpPlace.value
      vo.LugarEntrega = clientDeliveryPlace.value
    })
    let orden: any = { ListaVehiculosOrden: listaVehiculosOrden, ListaAlojamientoOrden: listaAlojamientosOrden }
    fillReserveInfo(orden)
    try {
      isReserving.value = true
      let ordenSaveIt = await authReserve(orden)
      authLog({
        OrdenId: ordenSaveIt.data.OrdenId,
        FuncionCreador: "CreateOrderComponent",
        DetalleError: JSON.stringify(ordenSaveIt.data),
        Fecha: moment().format(),
        Usuario: ordenSaveIt.data.Creador.Username,
        Tipo: "Info",
        FuncionParam: JSON.stringify(orden)
      })
      let onlyOrdenId = { OrdenId: ordenSaveIt.data.OrdenId }
      try {
        let createQB = await authCreateQbEstimated(onlyOrdenId)
        onlyOrdenId["EstimatedCreated"] = true
        authLog({
          OrdenId: ordenSaveIt.data.OrdenId,
          FuncionCreador: "createEstimateQB",
          DetalleError: JSON.stringify(createQB.data),
          Fecha: moment().format(),
          Usuario: ordenSaveIt.data.Creador.Username,
          Tipo: "Info",
          FuncionParam: JSON.stringify(onlyOrdenId)
        })
        let updateQB = await authUpdOnlyInDbQbEstimated(onlyOrdenId)
        authLog({
          OrdenId: ordenSaveIt.data.OrdenId,
          FuncionCreador: "updateEstimateQB",
          DetalleError: JSON.stringify(updateQB.data),
          Fecha: moment().format(),
          Usuario: ordenSaveIt.data.Creador.Username,
          Tipo: "Info",
          FuncionParam: JSON.stringify(onlyOrdenId)
        })
        createInHotetec = await createOrderInHotelect(onlyOrdenId)
        authLog({
          OrdenId: ordenSaveIt.data.OrdenId,
          FuncionCreador: "createInHotetec",
          DetalleError: JSON.stringify(updateQB.data),
          Fecha: moment().format(),
          Usuario: ordenSaveIt.data.Creador.Username,
          Tipo: "Info",
          FuncionParam: JSON.stringify(onlyOrdenId)
        })
      } catch (error) {
        authLog({
          OrdenId: ordenSaveIt.data.OrdenId,
          FuncionCreador: "EstimateQB",
          DetalleError: JSON.stringify(error),
          Fecha: moment().format(),
          Usuario: ordenSaveIt.data.Creador.Username,
          Tipo: "Error",
          FuncionParam: JSON.stringify(onlyOrdenId)
        })
      }
      $helpers.shoppingCartDeleteAll()
      isReserving.value = false
      let msg = "Orden creada y confirmada con éxito. Puede proceder al pago."
      let msgType = "success"
      if (createInHotetec.Estado !== orderStatusList.confirmed) {
        msg = "Orden creada con éxito. Pendiente de aceptación por la administración."
        msgType = "info"
      }
      toast(msg, { type: msgType, duration: 5000 })
      useCartStore().refresh()
      router.push({ name: "myreservations" })
    } catch (error) {
      authLog({
        FuncionCreador: "CreateOrderComponent",
        DetalleError: JSON.stringify(error),
        Fecha: moment().format(),
        Usuario: orden.Creador.Usuario,
        Tipo: "Error",
        FuncionParam: JSON.stringify(orden)
      })
      isReserving.value = false
      toast("Ha ocurrido un problema con la orden", { type: "error" })
    }
  } else {
    renderValid(iv, {} as any)
  }
}

async function createOrderInHotelect(order: any) {
  const userData = JSON.parse(localStorage.getItem("usuarioObjeto") || "{}")
  let closeReserve: any = {
    Accion: "F",
    Codtou: "HTI",
    Refage: "17162",
    Ideses: hotelecSessionService.getSessionId()
  }
  let person: any = {
    Id: "1",
    Nombre: userData.name,
    Tel: clientePhone.value,
    Mai: userData.clienteCorreo,
    Priape: userData.clienteNombre
  }
  closeReserve.Percon = person
  try {
    const res = await hotetecCloseReserve(closeReserve)
    hotelecSessionService.clearSessionId()
    const NumeroConfirmacionHotetec = res.data.Locata[0]
    const Cupest = res.data.Cupest
    let orderStatus: any = {}
    if (NumeroConfirmacionHotetec !== null && Cupest !== null && Cupest === orderStatusList.cm) {
      const orderData = {
        OrdenId: order.OrdenId,
        EstadoHotetec: orderStatusList.close,
        NumeroConfirmacionHotetec: NumeroConfirmacionHotetec
      }
      await hotetecUpdateDataOnGtt(orderData)
      orderStatus = { OrdenId: order.OrdenId, Estado: orderStatusList.confirmed }
      await authUpdateStatus(orderStatus)
      return orderStatus
    }
  } catch (error) {
    console.log(error)
    hotelecSessionService.clearSessionId()
  }
}

function fillReserveInfo(orden: any) {
  let dateInterval = findDateInterval()
  let id = localStorage.getItem("userid")
  let user = localStorage.getItem("nombre")
  let clienteid = localStorage.getItem("cliente")
  orden.Estado = "Open"
  orden.NombreClienteFinal = constructSpacedVal(clientName.value, clienteLastName.value)
  orden.NumeroPasaporte = clientePasaporte.value
  orden.NumeroTelefono = clientePhone.value
  orden.NombreOrden = constructSpacedVal(clientName.value, clienteLastName.value)
  orden.FechaInicio = dateInterval.min
  orden.FechaFin = dateInterval.max
  orden.Creador = { UsuarioId: id, Username: user }
  orden.ClienteId = clienteid
  const ordenData = orden.ListaAlojamientoOrden.reduce(
    (acc: any, alojamiento: any) => {
      acc.CantidadAdulto += alojamiento.CantAdulto || 0
      acc.CantidadNino += alojamiento.CantNino || 0
      acc.CantidadInfante += alojamiento.CantInfante || 0
      return acc
    },
    { CantidadAdulto: 0, CantidadNino: 0, CantidadInfante: 0 }
  )
  orden.CantidadAdulto = ordenData.CantidadAdulto
  orden.CantidadNino = ordenData.CantidadNino
  orden.CantidadInfante = ordenData.CantidadInfante
  orden.IsActive = true
  orden.PrecioGeneralOrden = priceTotal.value
  orden.Notas = ""
  orden.PrecioGeneralOrdenTasa = orden.PrecioGeneralOrden
  orden.EstadoHotetec = "Blocked"
  orden.IntercomConferceNumber = orden.NumeroTelefono
}

function getListaVehiculosOrden() {
  return allTypesOrders.value
    .filter((item: any) => item.tipo == "rent")
    .map((i: any) => i.orderVehiculo)
}

function getListaAlojamientosOrden() {
  let lao: any[] = []
  allTypesOrders.value
    .filter((item: any) => item.tipo == "lodging")
    .forEach((i: any) => {
      i.reservedRooms.combinacion.listado.forEach((j: any) => {
        let po = j.precioObjOne
        console.log("precio object", po)
        po.Alojamiento = { ProductoId: po.Alojamiento.ProductoId, Nombre: i.name, SKU: j.Habitacion.SKU }
        po.FechaInicio = po.FechaInicio.split("T")[0]
        po.FechaFin = po.FechaFin.split("T")[0]
        po.Checkin = po.Checkin.split("T")[0]
        po.Checkout = po.Checkout.split("T")[0]
        po.OrdenAlojamientoId = 0
        po.CantNino = j.cantidadMenoresPorHabitacion
        po.CantInfante = 0
        po.PlanesAlimenticiosId = j.planAlimenticio.PlanesAlimenticiosId
        po.PlanAlimenticio = j.planAlimenticio
        po.Habitacion = { HabitacionId: j.Habitacion.HabitacionId, Nombre: j.Habitacion.Nombre }
        po.Distribuidor = { DistribuidorId: po.Distribuidor ? po.Distribuidor.DistribuidorId : 46, Nombre: "Hotetec" }
        po.DistribuidorId = po.Distribuidor ? po.Distribuidor.DistribuidorId : 46
        po.Sobreprecio = { SobreprecioId: po.Sobreprecio.SobreprecioId }
        po.HotetecIdeses = po.DisponibilidadHotelRespuesta.Ideses
        po.EstadoHotetec = "Blocked"
        po.ListaPrecioAlojamientos = []
        for (let index = 0; index < j.cantidad; index++) {
          lao.push(po)
        }
      })
    })
  return lao
}

function findDateInterval() {
  let startDates: any[] = []
  let endDates: any[] = []
  allTypesOrders.value.forEach((item: any) => {
    let fechaEntrada = item.entrada?.split("T")[0]
    let FechaFin = item.salida?.split("T")[0]
    if (item.tipo == "rent") {
      startDates.push(item.orderVehiculo.FechaRecogida)
      endDates.push(item.orderVehiculo.FechaEntrega)
    }
    if (item.tipo == "lodging") {
      startDates.push(fechaEntrada)
      endDates.push(FechaFin)
    }
  })
  return { min: _.min(startDates), max: _.max(endDates) }
}

function calculatePrice(value: any[]) {
  priceTotal.value = value.reduce((total: number, item: any) => {
    if (item.tipo == "rent") return total + item.precio
    if (item.tipo == "lodging") return total + item.reservedRooms.combinacion.total
    return total
  }, 0)
}

function styledPrice(number: number) {
  let n = number.toFixed(2)
  let intPart = Math.ceil(Number(n))
  let r = (Number(n) - intPart).toFixed(2)
  let decimalPart = (Number(r) * 100).toFixed(2)
  if (decimalPart == "0") decimalPart = "00"
  return { intPart, decimalPart }
}

function updateDeliveryPlace(value: any) { clientDeliveryPlace.value = value }
function updatePickUpPlace(value: any) { clientPickUpPlace.value = value }
function updateName(value: string) { clientName.value = value }
function updateLastname(value: string) { clienteLastName.value = value }
function updatePasaporte(value: string) { clientePasaporte.value = value }
function updatePhone(value: string) { clientePhone.value = value }
function updateNacimiento(value: string) { clienteNacimiento.value = value }
function updateHoraLanding(value: string) { horaTakeoff.value = value; horaLanding.value = value }
function updateHoraTakeoff(value: string) { horaTakeoff.value = value }
function updateAerolineaLanding(value: string) { aerolineaLanding.value = value }
function updateAerolineaTakeoff(value: string) { aerolineaTakeoff.value = value }
function updateNvueloLanding(value: string) { nvueloLanding.value = value }
function updateNvueloTakeoff(value: string) { nvueloTakeoff.value = value }
function closeDeleteModal() { deleteModal.value = false; tempItemToDelete.value = null }
function showDeleteModal(item: any) { deleteModal.value = true; tempItemToDelete.value = item }
function closeEditModal() { editModal.value = false; currentFilterData.value = null; tempItemToEdit.value = null }
function showEditModal(item: any) {
  if (item.tipo == "rent") {
    currentModalComponent.value = "GttEditRentModal"
    currentFilterData.value = constructFilterDataObj(item)
  } else if (item.tipo == "lodging") {
    currentModalComponent.value = "GttEditLodgingModal"
    currentFilterData.value = constructFilterDataObj(item)
  }
  editModal.value = true
  tempItemToEdit.value = item
}

function constructFilterDataObj(item: any) {
  if (item.tipo == "rent") {
    let transmision = transmissionTypes.find((i: any) => i.nombre == item.transmision)
    return {
      propPickUpDate: item.orderVehiculo.FechaRecogida,
      propDeliveryDate: item.orderVehiculo.FechaEntrega,
      propPickUpPlace: item.orderVehiculo.LugarRecogida,
      propDeliveryPlace: item.orderVehiculo.LugarEntrega,
      propCarCategory: { marcaid: item.marcaid, nombre: item.marca, type: "marca" },
      ProductoId: item.id,
      DistribuidorId: item.orderVehiculo.DistribuidorId,
      HoraEntrega: horaTakeoff.value,
      HoraRecogida: horaLanding.value,
      propTransmission: transmision,
      id: item.id,
      name: item.nombre
    }
  } else if (item.tipo == "lodging") {
    return {
      name: item.name,
      id: item.uID,
      item: item,
      propDateIn: item.entrada,
      propDateOut: item.salida,
      propVisitantes: item.acomodation || item.roomL,
      needPre: item.acomodation != null
    }
  }
}

function editOrder(item: any) {
  console.log("objeto a editar: ", item)
  if (item.tipo == "rent") {
    if (!verifyDifferentsDatesNoCartReturnBoolean(
      { FechaRecogida: item.nI.orderVehiculo.FechaRecogida, FechaEntrega: item.nI.orderVehiculo.FechaEntrega },
      allTypesOrders.value.filter((i: any) => i.uID != tempItemToEdit.value.uID)
    )) {
      console.log("actualiza")
      updateSelectedEdit(item.nI)
      tempItemToEdit.value.orderVehiculo = item.nI.orderVehiculo
      revertFn(tempItemToEdit.value.orderVehiculo)
      calculatePrice(allTypesOrders.value)
      $helpers.shoppingCartUpdate(allTypesOrders.value)
      updateCart()
      closeEditModal()
      toast("Elemento editado con éxito", { type: "success" })
    } else {
      toast("Ya tiene un auto reservado dentro de esa misma fecha", { type: "error" })
    }
  }
}

function revertFn(o: any) {
  if (o.LugarRecogida) {
    o.LugarRecogida = { nombre: o.LugarRecogida.nombre, puntointeresid: o.LugarRecogida.PuntoInteresId }
  }
  if (o.LugarEntrega) {
    o.LugarEntrega = { nombre: o.LugarEntrega.nombre, puntointeresid: o.LugarEntrega.PuntoInteresId }
  }
}

function updateSelectedEdit(item: any) {
  if (!tempItemToEdit.value) return
  tempItemToEdit.value.nombre = item.nombre
  tempItemToEdit.value.cancelation = item.cancelation
  tempItemToEdit.value.descripcion = item.descripcion
  tempItemToEdit.value.distribuidor = item.distribuidor
  tempItemToEdit.value.distribuidorId = item.distribuidorId
  tempItemToEdit.value.id = item.id
  tempItemToEdit.value.imagen = item.imagen
  tempItemToEdit.value.marca = item.marca
  tempItemToEdit.value.modeloId = item.modeloId
  tempItemToEdit.value.plazas = item.plazas
  tempItemToEdit.value.precio = item.precio
  tempItemToEdit.value.provider = item.provider
  tempItemToEdit.value.providerImage = item.providerImage
  tempItemToEdit.value.tipo = item.tipo
  tempItemToEdit.value.transmision = item.transmision
}

function cleanDataFn(item: any) {
  item.ListaPreciosRentaAutos = [{ PrecioRentaAutos: { PrecioRentaAutosId: item.ListaPreciosRentaAutos[0].PrecioRentaAutos.PrecioRentaAutosId } }]
  item.Distribuidor = { DistribuidorId: item.Distribuidor.DistribuidorId }
  item.Vehiculo = { ProductoId: item.Vehiculo.ProductoId }
  item.Sobreprecio = { SobreprecioId: item.Sobreprecio.SobreprecioId }
  return item
}
</script>

<style scoped>
.create-order-step {
  padding-right: 20px !important;
}
</style>
