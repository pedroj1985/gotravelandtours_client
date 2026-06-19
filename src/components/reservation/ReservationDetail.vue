<template>
  <div id="reservation-detail">
    <GttVerificationModal
      v-if="deleteModal"
      @closeModal="closeDeleteModal"
      @next="deleteItem(tempIdToDelete)"
    ></GttVerificationModal>
    <GttVerificationModal
      v-if="cancelationModal"
      @closeModal="closeCancelationModal"
      @next="cancelateOrder()"
    >
      <template v-slot:question>
        <span>{{ $helpers.traducir("cancelateQuestion") }}</span>
      </template>
    </GttVerificationModal>
    <component
      :is="currentModalComponent"
      v-if="editModal"
      :filterData="currentFilterData"
      @cancel="closeEditModal"
      @editedItem="editOrder"
    ></component>
    <div class="reserve-two-rows row">
      <div class="reserve-left-row col-md-3 col-sm-5">
        <div id="reserve-total-preview" class="pr-30">
          <div class="background-yellow br-10 pad-15">
            <div
              class="reserve-title text-center hn-roman gtt-first-color font24 general-text-opt"
            >
              Usted ha reservado:
            </div>
            <div
              class="reserve-card"
              v-for="item in allTypesOrders"
              :key="item.id"
            >
              <template v-if="item.tipo == 'rent'">
                <div class="img-wrapper">
                  <img :src="item.imagen" :alt="item.nombre" />
                </div>
                <div class="reserve-card-info pad-5 bg-white">
                  <div
                    class="reserve-card-item-name hn-roman font14 gtt-text-color"
                  >
                    {{ item.nombre }}
                  </div>
                  <div
                    class="reserve-card-item-price hn-roman font16 gtt-text-color"
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
                    class="reserve-card-item-name hn-roman font14 gtt-text-color"
                  >
                    {{ item.name }}
                  </div>
                  <div
                    class="reserve-card-item-price hn-roman font16 gtt-text-color"
                  >
                    {{ getTotal(item) }} USD
                  </div>
                </div>
              </template>
            </div>
            <div class="reserve-total-to-pay">
              <span
                class="total-to-pay-text hn-roman font18 gtt-first-color to-uppercase general-text-opt"
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
            class="verify-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15 flex-wrapper"
          >
            <span class="to-uppercase">Detalles orden </span
            ><span class="ml-auto">No.{{ numeroOrden }}</span>
            <span
              class="to-uppercase ml-auto font18 state-label"
              :class="'state-' + state.toLowerCase()"
              >{{ $helpers.traducir(state) }}</span
            >
          </div>
          <div
            class="verify-step-content pt-30 pr-15 pl-15 pb-15"
            v-for="(orden, index) in allTypesOrders"
            :key="orden.id"
          >
            <LodgingReservationView2
              class="lrv"
              v-if="orden.tipo == 'lodging'"
              :item="orden"
              :state="state"
              :item-index="index"
              @open-modal-to-pay="openModalToPay"
            >
            </LodgingReservationView2>
            <RentReservationView
              v-if="orden.tipo == 'rent'"
              class="rrv"
              :ordenId="orden.orderVehiculo.OrdenId"
              :hasVoucher="order.HasVoucher"
              :item="orden"
              :can="state == 'Open'"
              @remove="showDeleteModal"
              @edit="showEditModal"
            ></RentReservationView>
          </div>
        </div>
        <div v-if="isOpenModalToPay" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header centered-title">
              <span class="to-uppercase">¿Cómo quieres pagar?</span>
            </div>
            <button class="modal-close" @click="closeModal">×</button>
            <div class="modal-footer">
              <button
                type="button"
                class="antonio-regular btn-blue"
                @click="confirmExternalPay(order.tipo, ordenAlojamiento)"
              >
                Confirmar pago externo
              </button>
              <button
                type="button"
                class="antonio-regular btn-green"
                @click="tropipayPayment(order.tipo, ordenAlojamiento, false)"
              >
                Pagar con Tropipay
              </button>
              <div class="email-input-container">
                <input
                  type="email"
                  v-model="email"
                  placeholder="Ingresar correo"
                  class="email-input"
                />
              </div>
              <button
                type="button"
                class="antonio-regular btn-orange"
                @click="sendPaymentLinkByEmail(order.tipo, ordenAlojamiento)"
              >
                Enviar link de pago
              </button>
            </div>
          </div>
        </div>
        <div class="create-order-step">
          <div
            class="create-order-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15"
          >
            <div class="flex-wrapper">
              <span>Datos del pasajero</span>
              <button
                v-if="state == 'Open'"
                type="button"
                @click="updateEditing"
                class="gtt-button edit-button ml-auto"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
            </div>
            <div class="create-order-step-content pt-30 pl-30 pb-30">
              <div ref="gttName">
                <InfoRow
                  :name="clientName"
                  @inputName="updateName"
                  :nacimiento="clientNacimiento"
                  :pasaporte="clientPasaporte"
                  :onlyOne="true"
                  :editable="editing"
                >
                  <template v-slot:error>
                    <span class="gtt-errors"> </span>
                  </template>
                </InfoRow>
              </div>
              <FlightInfoRow
                class="fir"
                :hora_landing="horaLanding"
                :hora_takeoff="horaTakeoff"
                :aerolinea_landing="aerolineaLanding"
                :aerolinea_takeoff="aerolineaTakeoff"
                :nvuelo_landing="nvueloLanding"
                :nvuelo_takeoff="nvueloTakeoff"
                :editable="editing"
                @inputHoraLanding="updateHoraLanding"
                @inputHoraTakeoff="updateHoraTakeoff"
                @inputAerolineaLanding="updateAerolineaLanding"
                @inputAerolineaTakeoff="updateAerolineaTakeoff"
                @inputNvueloLanding="updateNvueloLanding"
                @inputNvueloTakeoff="updateNvueloTakeoff"
                v-if="checkIfRentExist"
              ></FlightInfoRow>
            </div>
            <div class="form-actions text-right">
              <button
                v-if="somethingChanged && state == 'Open'"
                @click="reserve"
                type="button"
                class="reserveButton antonio-regular"
              >
                <template v-if="!isReserving">GUARDAR</template>
                <span
                  class="gtt-spinner gtt-spinner-sm loading-spinner"
                  v-else
                ></span>
              </button>
            </div>
            <div
              v-if="isVisibleCancelButton"
              id="reservation-cancelation-info"
              class="hn-roman font14 gtt-first-color pl-30 pb-15"
            >
              <span
                >Si cambias de planes, puedes
                <span class="cancelate-button" @click="showCancelationModal"
                  >CANCELAR</span
                >
                esta reservación.</span
              >
            </div>
            <div
              id="reservation-extra-info"
              class="hn-roman font14 pl-30"
              style="color: #ff0000"
            >
              <span
                >Si los datos introducidos no son correctos, nuestra agencia no
                se hace responsable de las consecuencias que esto traiga para la
                correcta realización del servicio o los servicios</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import {
  authGetOrder,
  authGetImage,
  authSearchMarca,
  authSearchProvider,
  authPutReserve,
  authDeleteCarOrder,
  authUpdateQbEstimated,
  hotetecStateSession,
  hotetecOpenSession,
  hotetecCancelReserve,
  authUpdateStatus,
  hotetecUpdateDataOnGtt,
  updateIsPagadoAlojamiento,
  getTropiPayToken,
  generatePaymentPage,
} from "../../utils/auth";
import { useHelpers } from "../../composables/useHelpers";
import RentReservationView from "./RentReservationView.vue";
import LodgingReservationView2 from "./LodgingReservationView2.vue";
import InfoRow from "./InfoRow.vue";
import FlightInfoRow from "./FlightInfoRow.vue";
import GttVerificationModal from "../custom-elements/GttVerificationModal.vue";
import GttEditRentModal from "../custom-elements/GttEditRentModal.vue";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { transmissionTypes } from "../../utils/utils";
import { verifyDifferentsDatesNoCartReturnBoolean } from "../../utils/utils";
import { paymentData, orderStatusList } from "../../utils/constant";
import { useCartStore } from "../../stores/cartStore";
import { PaymentLinkRequest } from "../../utils/paymentLinkRequest";
import { ClientRequest } from "../../utils/clientRequest";
import { helpers } from "../../utils/helpers";
import _ from "lodash";
import moment from "moment";

const $helpers = helpers;
const emit = defineEmits(["adminPanelInfo"]);
const route = useRoute();
const router = useRouter();
const { calculatePrice, constructSpacedVal, styledPrice } = useHelpers();

const cancelationModal = ref(false);
const deleteModal = ref(false);
const editModal = ref(false);
const currentModalComponent = ref("");
const currentFilterData = ref<any>(null);
const tempItemToEdit = ref<any>(null);
const order = ref<any>(null);
const orderIndex = ref<number | null>(null);
const allTypesOrders = ref<any[]>([]);
const idsToDelete = ref<any[]>([]);
const numeroOrden = ref("");
const priceTotal = ref(0);
const editing = ref(false);
const clientName = ref("");
const clientPasaporte = ref("");
const clientNacimiento = ref("");
const horaLanding = ref("");
const horaTakeoff = ref("");
const aerolineaLanding = ref("");
const aerolineaTakeoff = ref("");
const nvueloLanding = ref("");
const nvueloTakeoff = ref("");
const state = ref("");
const isReserving = ref(false);
const somethingChanged = ref(false);
const tempIdToDelete = ref(-1);
const isOpenModalToPay = ref(false);
const email = ref<string | null>(null);
const emailError = ref<string | null>(null);
const local_data = reactive({
  Cliente: {} as any,
  NombreClienteFinal: "",
});
const ordenAlojamiento = ref<any>({});
const tropiPayToken = ref<any>(null);
const isVisibleCancelButton = ref(false);
const gttName = ref<HTMLElement | null>(null);

const checkIfRentExist = computed(() => {
  return allTypesOrders.value.some((i: any) => i.tipo == "rent");
});

function getTotal(item: any) {
  let total = 0;
  item.reservedRooms.map((x: any) => {
    total += x.CantidadHabitaciones * x.PrecioOrden;
  });
  return total;
}

watch(isOpenModalToPay, (newVal) => {
  if (newVal === false) {
    email.value = "";
    emailError.value = null;
    order.value = {};
    ordenAlojamiento.value = {};
    orderIndex.value = -1;
  }
});

emit("adminPanelInfo", "reservation-detail");
let id = route.params.id;
let { data } = await authGetOrder(id);
if (import.meta.env.DEV) {
  console.log("thisAll: ", data);
}
order.value = data;
clientPasaporte.value = data.NumeroPasaporte;
numeroOrden.value = order.value.NumeroOrden;
state.value = order.value.Estado;
local_data.Cliente = data.Cliente;
local_data.NombreClienteFinal = data.NombreClienteFinal;

isVisibleCancelButton.value = [
  orderStatusList.open,
  orderStatusList.confirmed,
  orderStatusList.pending,
].includes(state.value);

await preproccesingLists(order.value.ListaVehiculosOrden);
await preproccesingLists(order.value.ListaAlojamientoOrden, "lodging");
calculatePrice(allTypesOrders.value);
updateName(order.value.NombreClienteFinal);

if (!tropiPayToken.value) {
  fetchTropiPayToken();
}

if (hasListaVehiculosOrden()) {
  let nacimiento = data.ListaVehiculosOrden[0].FechaNacimiento.split("T");
  clientNacimiento.value = nacimiento[0];
  updateHoraLanding(order.value.ListaVehiculosOrden[0].HoraInicio);
  updateHoraTakeoff(order.value.ListaVehiculosOrden[0].HoraFin);
  updateAerolineaLanding(order.value.ListaVehiculosOrden[0].InformacionLlegada);
  updateNvueloLanding(order.value.ListaVehiculosOrden[0].NumeroVueloEntrada);
  updateAerolineaTakeoff(order.value.ListaVehiculosOrden[0].InformacionSalida);
  updateNvueloTakeoff(order.value.ListaVehiculosOrden[0].NumeroVueloSalida);
}

function getOrderId() {
  return order.value;
}

function editOrder(item: any) {
  if (item.tipo == "rent") {
    if (
      !verifyDifferentsDatesNoCartReturnBoolean(
        {
          FechaRecogida: item.nI.orderVehiculo.FechaRecogida,
          FechaEntrega: item.nI.orderVehiculo.FechaEntrega,
        },
        allTypesOrders.value.filter((i: any) => {
          return (
            i.orderVehiculo.OrdenVehiculoId !=
            tempItemToEdit.value.orderVehiculo.OrdenVehiculoId
          );
        }),
      )
    ) {
      let OrdenId = tempItemToEdit.value.orderVehiculo.OrdenId;
      let OrdenVehiculoId = tempItemToEdit.value.orderVehiculo.OrdenVehiculoId;

      updateSelectedEdit(item.nI);
      tempItemToEdit.value.orderVehiculo = item.nI.orderVehiculo;
      revert(tempItemToEdit.value.orderVehiculo);
      tempItemToEdit.value.orderVehiculo.OrdenId = OrdenId;
      tempItemToEdit.value.orderVehiculo.OrdenVehiculoId = OrdenVehiculoId;
      calculatePrice(allTypesOrders.value);
      somethingChanged.value = true;
      closeEditModal();
    } else {
      toast("Ya tiene un auto reservado dentro de esa misma fecha", {
        type: "error",
      });
    }
  }
}

function revert(o: any) {
  if (o.LugarRecogida) {
    o.LugarRecogida = {
      nombre: o.LugarRecogida.nombre,
      puntointeresid: o.LugarRecogida.PuntoInteresId,
    };
  }
  if (o.LugarEntrega) {
    o.LugarEntrega = {
      nombre: o.LugarEntrega.nombre,
      puntointeresid: o.LugarEntrega.PuntoInteresId,
    };
  }
}

function updateSelectedEdit(item: any) {
  tempItemToEdit.value.nombre = item.nombre;
  tempItemToEdit.value.cancelation = item.cancelation;
  tempItemToEdit.value.descripcion = item.descripcion;
  tempItemToEdit.value.distribuidor = item.distribuidor;
  tempItemToEdit.value.distribuidorId = item.distribuidorId;
  tempItemToEdit.value.id = item.id;
  tempItemToEdit.value.imagen = item.imagen;
  tempItemToEdit.value.marca = item.marca;
  tempItemToEdit.value.modeloId = item.modeloId;
  tempItemToEdit.value.plazas = item.plazas;
  tempItemToEdit.value.precio = item.precio;
  tempItemToEdit.value.provider = item.provider;
  tempItemToEdit.value.providerImage = item.providerImage;
  tempItemToEdit.value.tipo = item.tipo;
  tempItemToEdit.value.transmision = item.transmision;
}

function closeEditModal() {
  editModal.value = false;
  currentFilterData.value = null;
}

function showEditModal(item: any) {
  if (item.tipo == "rent") {
    currentFilterData.value = constructFilterDataObj(item);
    currentModalComponent.value = "GttEditRentModal";
  }
  editModal.value = true;
  tempItemToEdit.value = item;
}

function constructFilterDataObj(item: any) {
  if (item.tipo == "rent") {
    let transmision = transmissionTypes.find((i: any) => {
      return i.nombre == item.transmision;
    });

    return {
      propPickUpDate: item.orderVehiculo.FechaRecogida,
      propDeliveryDate: item.orderVehiculo.FechaEntrega,
      propPickUpPlace: item.orderVehiculo.LugarRecogida,
      propDeliveryPlace: item.orderVehiculo.LugarEntrega,
      propCarCategory: {
        marcaid: item.marcaid,
        nombre: item.marca,
        type: "marca",
      },
      propTransmission: transmision,
      id: item.id,
      orderId: item.orderVehiculo.OrdenVehiculoId,
      name: item.nombre,
    };
  }
}

function gttValidate() {
  let validator = [
    {
      rules: ["required"],
      name: "gttName",
      value: clientName.value,
      lang: "es",
    },
  ];

  return validator;
}

async function cancelateOrder() {
  if (state.value === orderStatusList.confirmed) {
    return cancelOnHotetec();
  }
  let listaVehiculosOrden = getListaVehiculosOrden();

  listaVehiculosOrden.forEach((vo: any) => {
    cleanVO(vo);
  });
  try {
    order.value.Estado = orderStatusList.rejected;
    let ordenSaveIt = await authPutReserve(route.params.id, order.value);
    toast("Orden cancelada con éxito.", {
      type: "success",
    });
    router.push({ name: "myreservations" });
  } catch (error) {
    isReserving.value = false;
    if (import.meta.env.DEV) {
      console.log(error);
    }
    toast("Ha ocurrido un problema con la orden", {
      type: "error",
    });
  }
}

async function cancelOnHotetec() {
  await $helpers.shoppingCartDeleteAll(true);
  useCartStore().refresh();
  try {
    console.info("order->", order.value);
    const response = await hotetecOpenSession();
    if (response && response.data && response.data.Ideses) {
      const currentHotelec = response.data.Ideses;
      let cancelHotetecReserve: any = {};
      cancelHotetecReserve.Accion = "C";
      cancelHotetecReserve.Codtou = "HTT";
      cancelHotetecReserve.Locata = order.value.NumeroConfirmacionHotetec;
      cancelHotetecReserve.Ideses = currentHotelec;

      hotetecCancelReserve(cancelHotetecReserve)
        .then(async (res: any) => {
          if (!res.data.Coderr) {
            const orderData = {
              OrdenId: order.value.OrdenId,
              EstadoHotetec: "Cancel",
              NumeroConfirmacionHotetec: order.value.NumeroConfirmacionHotetec,
            };
            const orderStatus = {
              OrdenId: order.value.OrdenId,
              Estado: orderStatusList.rejected,
            };
            try {
              await hotetecUpdateDataOnGtt(orderData);
              await authUpdateStatus(orderStatus);
              toast("Orden cancelada con éxito.", {
                type: "success",
              });
              router.push({ name: "myreservations" });
            } catch (error) {
              if (import.meta.env.DEV) {
                console.log(error);
              }
            }
          } else {
            toast(res.data.Txterr, {
              type: "error",
            });
          }
        })
        .catch((error: any) => {
          if (import.meta.env.DEV) {
            console.log(error);
          }
        })
        .finally(() => {
          cancelationModal.value = false;
        });
    }
  } catch (error: any) {
    console.error(
      "Error occurred while fetching or processing data:",
      error.message,
    );
  }
}

function showCancelationModal() {
  cancelationModal.value = true;
}

function showDeleteModal(id: any) {
  deleteModal.value = true;
  tempIdToDelete.value = id;
}

function closeCancelationModal() {
  cancelationModal.value = false;
}

function closeDeleteModal() {
  deleteModal.value = false;
  tempIdToDelete.value = -1;
}

function updateEditing() {
  editing.value = true;
  somethingChanged.value = true;
}

function hasListaVehiculosOrden() {
  return order.value.ListaVehiculosOrden.length > 0 ? true : false;
}

function updateName(value: string) {
  clientName.value = value;
}

function updateHoraLanding(value: string) {
  horaLanding.value = value;
}

function updateHoraTakeoff(value: string) {
  horaTakeoff.value = value;
}

function updateAerolineaLanding(value: string) {
  aerolineaLanding.value = value;
}

function updateAerolineaTakeoff(value: string) {
  aerolineaTakeoff.value = value;
}

function updateNvueloLanding(value: string) {
  nvueloLanding.value = value;
}

function updateNvueloTakeoff(value: string) {
  nvueloTakeoff.value = value;
}

async function preproccesingLists(list: any, type = "rent") {
  if (type == "lodging") {
    let t = _.groupBy(list, function (j: any) {
      return j.AlojamientoId + "+" + j.FechaInicio + "+" + j.FechaFin;
    });
    for (let [key, i] of Object.entries(t)) {
      let images = await authGetImage(i[0].Alojamiento.ProductoId);
      let total = _.sumBy(i, function (p: any) {
        return p.PrecioOrden;
      });

      let temp: any = {
        tipo: "lodging",
        entrada: i[0].FechaInicio,
        salida: i[0].FechaFin,
        name: i[0].Alojamiento.Nombre,
        stars: i[0].Alojamiento.NumeroEstrellas,
        location: i[0].Alojamiento.Direccion,
        lodging: i[0].Alojamiento,
        images: [images.data.ImageContent],
        total: total,
        reservedRooms: i,
      };

      allTypesOrders.value.push(temp);
    }
  }
  if (type == "rent") {
    for (let item of list) {
      let image = await authGetImage(item.Vehiculo.ProductoId);
      let marca = await authSearchMarca(item.Vehiculo.MarcaId);
      let provider = await authSearchProvider(item.Vehiculo.ProveedorId);

      let temp: any = {
        nombre: item.Vehiculo.Nombre,
        tipo: "rent",
        id: item.Vehiculo.ProductoId,
        plazas: item.Vehiculo.CantidadPlazas,
        descripcion: item.Vehiculo.Descripcion,
        cancelation: item.Vehiculo.DescripcionCorta,
        transmision: item.Vehiculo.TipoTransmision,
        modeloId: item.Vehiculo.ModeloId,
        marca: marca.data.Nombre,
        marcaid: marca.data.MarcaId,
        seguro: item.Vehiculo.TieneSeguro,
        precio: item.PrecioOrden,
        distribuidor: item.Distribuidor.Nombre,
        distribuidorId: item.Distribuidor.DistribuidorId,
        imagen: image.data.ImageContent,
        provider: provider.data.Nombre,
        providerImage: provider.data.ImageContent,
        orderVehiculo: item,
      };
      if (temp.orderVehiculo.LugarRecogida) {
        temp.orderVehiculo.LugarRecogida = {
          nombre: temp.orderVehiculo.LugarRecogida.Nombre,
          puntointeresid: temp.orderVehiculo.LugarRecogida.PuntoInteresId,
        };
      }
      if (temp.orderVehiculo.LugarEntrega) {
        temp.orderVehiculo.LugarEntrega = {
          nombre: temp.orderVehiculo.LugarEntrega.Nombre,
          puntointeresid: temp.orderVehiculo.LugarEntrega.PuntoInteresId,
        };
      }

      allTypesOrders.value.push(temp);
    }
  }
}

function getListaVehiculosOrden() {
  let lvo = allTypesOrders.value
    .filter((item: any) => {
      return item.tipo == "rent";
    })
    .map((i: any) => {
      return i.orderVehiculo;
    });

  return lvo;
}

function cleanVO(orderParam: any) {
  orderParam.DistribuidorId = orderParam.Distribuidor.DistribuidorId;
  orderParam.Distribuidor = {
    DistribuidorId: orderParam.Distribuidor.DistribuidorId,
  };
  orderParam.Vehiculo = {
    ProductoId: orderParam.Vehiculo.ProductoId,
  };
  orderParam.Sobreprecio = {
    SobreprecioId: orderParam.Sobreprecio.SobreprecioId,
  };
  if (orderParam.LugarRecogida) {
    orderParam.LugarRecogida = {
      nombre: orderParam.LugarRecogida.nombre,
      PuntoInteresId: orderParam.LugarRecogida.puntointeresid,
    };
  }
  if (orderParam.LugarEntrega) {
    orderParam.LugarEntrega = {
      nombre: orderParam.LugarEntrega.nombre,
      PuntoInteresId: orderParam.LugarEntrega.puntointeresid,
    };
  }
  let arrLPRA = new Array();
  orderParam.ListaPreciosRentaAutos.forEach((item: any) => {
    item.PrecioRentaAutos = {
      PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId,
    };
    arrLPRA.push({
      PrecioRentaAutos: {
        PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId,
      },
    });
  });
  orderParam.ListaPreciosRentaAutos = arrLPRA;
}

async function reserve() {
  let iv = gttIsValid(gttValidate(), {} as any);
  if (getValid(iv)) {
    let listaVehiculosOrden = getListaVehiculosOrden();
    listaVehiculosOrden.forEach((vo: any) => {
      vo.NombreCliente = clientName.value
        .split(" ")
        .map((i: string) => {
          return _.capitalize(i);
        })
        .join(" ");
      vo.HoraInicio = horaLanding.value;
      vo.HoraFin = horaTakeoff.value;
      vo.InformacionLlegada = constructSpacedVal(
        aerolineaLanding.value,
        nvueloLanding.value,
        " - ",
      );
      vo.InformacionSalida = constructSpacedVal(
        aerolineaTakeoff.value,
        nvueloTakeoff.value,
        " - ",
      );
      cleanVO(vo);
    });
    fillReserveInfo(order.value, listaVehiculosOrden);
    try {
      for (let i of idsToDelete.value) {
        if (i.tipo == "rent")
          await authDeleteCarOrder(i.orderVehiculo.OrdenVehiculoId);
      }
      idsToDelete.value = [];
      isReserving.value = true;
      let ordenSaveIt = await authPutReserve(route.params.id, order.value);
      let onlyOrdenId = {
        OrdenId: ordenSaveIt.data.OrdenId,
      };
      try {
        await authUpdateQbEstimated(onlyOrdenId);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.log(error);
        }
      }
      isReserving.value = false;
      toast("Orden editada con éxito.", {
        type: "success",
      });
      router.push({ name: "myreservations" });
    } catch (error) {
      isReserving.value = false;
      if (import.meta.env.DEV) {
        console.log(error);
      }
      toast("Ha ocurrido un problema con la orden", {
        type: "error",
      });
    }
  } else {
    renderValid(iv, {} as any);
  }
}

function deleteItem(i: any) {
  allTypesOrders.value = allTypesOrders.value.filter((item: any) => {
    return item.id != i.id;
  });
  calculatePrice(allTypesOrders.value);
  idsToDelete.value.push(i);
  somethingChanged.value = true;
  deleteModal.value = false;
  tempIdToDelete.value = -1;
}

function findDateInterval() {
  let startDates: any[] = [];
  let endDates: any[] = [];

  allTypesOrders.value.forEach((item: any) => {
    startDates.push(item.orderVehiculo.FechaRecogida);
    endDates.push(item.orderVehiculo.FechaEntrega);
  });

  return {
    min: _.min(startDates),
    max: _.max(endDates),
  };
}

function fillReserveInfo(
  orden: any,
  lvo: any[] = [],
  lao: any[] = [],
  lalo: any[] = [],
  lto: any[] = [],
) {
  let dateInterval = findDateInterval();

  orden.NombreClienteFinal = clientName.value
    .split(" ")
    .map((i: string) => {
      return _.capitalize(i);
    })
    .join(" ");
  orden.NombreOrden = clientName.value
    .split(" ")
    .map((i: string) => {
      return _.capitalize(i);
    })
    .join(" ");
  orden.FechaInicio = dateInterval.min;
  orden.FechaFin = dateInterval.max;
  orden.CantidadAdulto = 1;
  orden.CantidadNino = 0;
  orden.CantidadInfante = 0;
  orden.isActive = true;
  orden.PrecioGeneralOrden = priceTotal.value;
  orden.ListaVehiculosOrden = lvo;
  orden.ListaActividadOrden = lao;
  orden.ListaAlojamientoOrden = lalo;
  orden.ListaTrasladoOrden = lto;
}

function openModalToPay(orderParam: any, room: any, orderIdx: number) {
  isOpenModalToPay.value = true;
  ordenAlojamiento.value = room;
  order.value = orderParam;
  orderIndex.value = orderIdx;
  if (!ordenAlojamiento.value.IsPagado) {
    isOpenModalToPay.value = true;
  } else {
    toast("Este alojamiento ya ha sido pagado.", {
      type: "info",
    });
  }
}

function closeModal() {
  isOpenModalToPay.value = false;
}

function confirmExternalPay(type: string, room: any) {
  let idx = allTypesOrders.value[orderIndex.value!].reservedRooms.findIndex(
    (r: any) => {
      return r.OrdenAlojamientoId == room.OrdenAlojamientoId;
    },
  );
  let isPaid = false;
  switch (type) {
    case paymentData.accomodation:
      if (!room.IsPagado) {
        isPaid = true;
        let payData = {
          CantidadHabitaciones: room.CantidadHabitaciones,
          IsPagado: !room.IsPagado,
          FormaPago: paymentData.paymentMethod.EXT,
          OrdenAlojamientoId: room.OrdenAlojamientoId,
        };
        updateIsPagadoAlojamiento(payData)
          .then((v: any) => {
            allTypesOrders.value[orderIndex.value!].reservedRooms[
              idx
            ].IsPagado = true;
            allTypesOrders.value[orderIndex.value!].reservedRooms[
              idx
            ].FormaPago = paymentData.paymentMethod.EXT;
          })
          .catch((error: any) => {
            console.error(
              "Error confirming external payment for accommodation:",
              error,
            );
          });
      }
      if (isPaid) {
        toast("Pago confirmado con éxito.", {
          type: "success",
        });
      } else {
        toast("Este alojamiento ya ha sido pagado.", {
          type: "info",
        });
      }
      closeModal();
      break;
    default:
  }
}

function sendPaymentLinkByEmail(type: string, orderParam: any) {
  validateEmail();
  if (!emailError.value) {
    if (import.meta.env.DEV) {
      console.log(`Enviando correo a: ${email.value}`);
    }
    tropipayPayment(type, orderParam, true);
  } else {
    toast(emailError.value, {
      type: "error",
    });
  }
}

function tropipayPayment(
  type: string,
  orderParam: any,
  sendPaymentLInk: boolean,
) {
  let id = 0;
  let description = "";
  console.info("order ", orderParam);
  let fi = orderParam.FechaInicio.split("T")[0];
  let ff = orderParam.FechaFin.split("T")[0];

  switch (type) {
    case paymentData.accomodation:
      id = orderParam.OrdenAlojamientoId;
      description =
        orderParam.Alojamiento.Nombre +
        "-" +
        orderParam.Habitacion.Nombre +
        "-" +
        orderParam.TipoHabitacion.Nombre +
        " reservation " +
        " from " +
        fi +
        " to " +
        ff;
      break;
    default:
  }
  let typeCode = "";
  let typeLabel = "";
  paymentData.productTypeFilter.forEach((item: any) => {
    if (item.value === type) {
      typeCode = item.id;
      typeLabel = item.label;
    }
  });

  let request = new PaymentLinkRequest();
  let price =
    orderParam.CurrencyUsada === paymentData.currency[1].code
      ? parseInt(orderParam.PrecioOrdenTasa + "00")
      : parseInt(orderParam.PrecioOrden + "00");
  request.amount = price;
  request.concept = "Rent a " + typeLabel;
  request.currency = orderParam.CurrencyUsada;
  request.TipoOrden = typeCode;
  request.OrdenProductoId = id;
  request.EnviarLinkDePago = sendPaymentLInk;
  request.description = description;
  request.directPayment = false;
  request.expirationDays = 1;

  let ttpClient = new ClientRequest();
  ttpClient.address = local_data?.Cliente?.Direccion || "000000";
  let textoSinEspaciosExtras = (local_data?.NombreClienteFinal || "")
    .replace(/\s+/g, " ")
    .trim();
  const tmpName = textoSinEspaciosExtras.split(" ");
  ttpClient.name = tmpName[0] || "";
  ttpClient.lastName =
    tmpName.length > 1 ? tmpName.slice(1).join(" ") : tmpName[0] || "";
  ttpClient.email = sendPaymentLInk
    ? email.value
    : local_data?.Cliente?.Correo || "";
  ttpClient.phone = local_data?.Cliente?.Telefono || "000000";
  ttpClient.termsAndConditions = "true";
  request.client = ttpClient;
  request.favorite = true;
  request.lang = "es";
  request.paymentMethods = [];

  request.reasonId = 0;
  request.reference = "carvel_viajes_colibri";
  request.serviceDate = moment().format();
  request.singleUse = true;
  request.urlNotification =
    "http://gottours-001-site4.mtempurl.com/publicEliecer/api//ApiTropiPay/Callback/" +
    typeCode +
    "/" +
    id;
  request.urlSuccess =
    "https://admin.gotravelandtours.com/#/payment-success?amount=" +
    orderParam.PrecioOrden +
    "&currency=" +
    orderParam.CurrencyUsada +
    "&description=" +
    encodeURIComponent(description);
  request.urlFailed =
    "https://admin.gotravelandtours.com/#/payment-error?amount=" +
    orderParam.PrecioOrden +
    "&currency=" +
    orderParam.CurrencyUsada +
    "&description=" +
    encodeURIComponent(description);
  request.access_token = tropiPayToken.value;

  generatePaymentPage(request)
    .then((v: any) => {
      let shortUrl = v.data.shortUrl || v.shortUrl;
      if (!sendPaymentLInk) {
        if (shortUrl) {
          window.open(shortUrl, "_blank");
        } else {
          toast("No se pudo obtener el enlace de pago de TropiPay.", {
            type: "error",
          });
        }
      } else {
        if (email.value === "") {
          toast(
            "Correo electrónico no proporcionado. El enlace de pago se abrirá en una nueva pestaña.",
            {
              type: "info",
              duration: 5000,
            },
          );
          window.open(shortUrl, "_blank");
        } else if (email.value !== "") {
          toast(`Enlace de pago enviado a ${email.value}: ${shortUrl}`, {
            type: "info",
            duration: 5000,
          });
        }
      }
      isOpenModalToPay.value = false;
      useCartStore().refresh();
    })
    .catch((error: any) => {
      if (window) {
        window.close();
      }
      if (import.meta.env.DEV) {
        console.log("Error al generar el link de pago:", error);
      }
      toast("Error al generar el link de pago.", {
        type: "error",
      });
    });
}

function fetchTropiPayToken() {
  getTropiPayToken()
    .then((res: any) => {
      tropiPayToken.value = res.data.access_token;
    })
    .catch((error: any) => {
      console.error("Error fetching TropiPay token:", error);
      toast("Error al obtener el token de TropiPay.", {
        type: "error",
      });
    });
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = "El correo electrónico es obligatorio.";
  } else if (!emailRegex.test(email.value)) {
    emailError.value = "El correo electrónico no es válido.";
  } else {
    emailError.value = null;
  }
}
</script>

<style scoped>
.cancelate-button {
  text-decoration-line: underline;
  color: var(--color-primary);
}

.cancelate-button:hover {
  cursor: pointer;
  color: rgba(188, 208, 29, 0.7);
}

.state-label {
  border-radius: 5px;
  padding: 5px;
  color: white;
}

.state-pending {
  background: #c88d00;
}

.state-open {
  background: #0000ff;
}

.state-confirmed {
  background: #307000;
}

.state-rejected {
  background: #ff0000;
}

.state-closed {
  background: #212f3d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative; /* Necesario para posicionar el botón de cerrar */
  background-color: #ffffff;
  border-radius: 8px;
  width: 450px;
  max-width: 90%;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  font-size: 14px;
}

.modal-header .to-uppercase {
  font-size: 20px;
  font-weight: bold;
  color: #212f3d;
}

.modal-close {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6c757d;
}

.modal-close:hover {
  color: #000;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  justify-content: center;
  gap: 4px;
}

.btn-blue {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-orange {
  background-color: #fd7e14;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-green {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-gray:hover,
.btn-blue:hover,
.btn-orange:hover,
.btn-green:hover {
  opacity: 0.9;
}
</style>
