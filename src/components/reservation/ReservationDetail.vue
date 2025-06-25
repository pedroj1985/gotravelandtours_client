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
      <span slot="question">{{ $helpers.traducir("cancelateQuestion") }}</span>
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
              :key="item.id"
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
                    {{ getTotal(item) }} USD
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
              flex-wrapper
            "
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
              <button type="button" class="antonio-regular btn-blue" @click="confirmExternalPay(order.tipo, ordenAlojamiento)">Confirmar pago externo</button>
              <button type="button" class="antonio-regular btn-green" @click="tropipayPayment(order.tipo, ordenAlojamiento, false)">Pagar con Tropipay</button>
              <div class="email-input-container">
                <input
                  type="email"
                  v-model="email"
                  placeholder="Ingresar correo"
                  class="email-input"
                />
              </div>
              <button type="button" class="antonio-regular btn-orange" @click="sendPaymentLinkByEmail(order.tipo, ordenAlojamiento)">Enviar link de pago</button>
            </div>
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
                  <span slot="error" class="gtt-errors"> </span>
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
                <b-spinner
                  small
                  class="loading-spinner"
                  label="Text Centered"
                  v-else
                ></b-spinner>
              </button>
            </div>
            <div
              v-if="state == 'Open' || state == 'Confirmed'"
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

<script>
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

import { reusableMethodsMixin } from "../../mixins/reusableMethodsMixin";
import RentReservationView from "./RentReservationView";
import LodgingReservationView2 from "./LodgingReservationView2";
import InfoRow from "./InfoRow";
import FlightInfoRow from "./FlightInfoRow";
import GttVerificationModal from "../custom-elements/GttVerificationModal";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { transmissionTypes } from "../../utils/utils";
import GttEditRentModal from "../custom-elements/GttEditRentModal";
import { verifyDifferentsDatesNoCartReturnBoolean } from "../../utils/utils";
import { paymentData, orderStatusList } from "../../utils/constant";

import { PaymentLinkRequest } from "../../utils/paymentLinkRequest";
import { ClientRequest } from "../../utils/clientRequest";

import _ from "lodash";
import moment from 'moment';

export default {
  components: {
    RentReservationView,
    InfoRow,
    FlightInfoRow,
    GttVerificationModal,
    GttEditRentModal,
    LodgingReservationView2
  },
  watch: {
    isOpenModalToPay(newVal) {
      if (newVal === false) {
        this.email = ''; // Limpiar el campo de correo electrónico después de enviar
        this.emailError = null;
        this.order = {}; // Limpiar la orden después de enviar el enlace
        this.ordenAlojamiento = {}; // Limpiar la orden de alojamiento después de enviar el enlace
        this.orderIndex = -1; // Reiniciar el índice de orden
      }
    }
  },
  computed: {
    checkIfRentExist() {
      return this.allTypesOrders.some(i => {
        return i.tipo == "rent";
      });
    },
    getTotal() {
      return item => {
        let total = 0;
        item.reservedRooms.map(x => {
          total += x.CantidadHabitaciones * x.PrecioOrden;
        });
        return total;
      };
    }
  },
  mixins: [reusableMethodsMixin],
  async created() {
    this.$emit("adminPanelInfo", "reservation-detail");
    let id = this.$route.params.id;
    let { data } = await authGetOrder(id);
    console.log("thisAll: ", data);
    this.order = data;
    this.clientPasaporte = data.NumeroPasaporte;
    this.numeroOrden = this.order.NumeroOrden;
    this.state = this.order.Estado;
    this.local_data.Cliente = data.Cliente;
    this.local_data.NombreClienteFinal = data.NombreClienteFinal;

    await this.preproccesingLists(this.order.ListaVehiculosOrden);
    await this.preproccesingLists(this.order.ListaAlojamientoOrden, "lodging");
    this.calculatePrice(this.allTypesOrders);
    this.updateName(this.order.NombreClienteFinal);

    if (!this.tropiPayToken) {
      this.getTropiPayToken();
    }
    /*
      TODO Validar si se puede dividir
    */
    if (this.hasListaVehiculosOrden()) {
      let nacimiento = data.ListaVehiculosOrden[0].FechaNacimiento.split("T");
      this.clientNacimiento = nacimiento[0];
      this.updateHoraLanding(this.order.ListaVehiculosOrden[0].HoraInicio);
      this.updateHoraTakeoff(this.order.ListaVehiculosOrden[0].HoraFin);

      this.updateAerolineaLanding(
        this.order.ListaVehiculosOrden[0].InformacionLlegada
      );
      this.updateNvueloLanding(
        this.order.ListaVehiculosOrden[0].NumeroVueloEntrada
      );
      this.updateAerolineaTakeoff(
        this.order.ListaVehiculosOrden[0].InformacionSalida
      );
      this.updateNvueloTakeoff(
        this.order.ListaVehiculosOrden[0].NumeroVueloSalida
      );
    }
  },
  data() {
    return {
      cancelationModal: false,
      deleteModal: false,
      editModal: false,
      currentModalComponent: "",
      currentFilterData: null,
      tempItemToEdit: null,
      order: null,
      orderIndex: null,
      allTypesOrders: [],
      idsToDelete: [],
      numeroOrden: "",
      priceTotal: 0,
      editing: false,
      clientName: "",
      clientPasaporte: "",
      clientNacimiento: "",
      horaLanding: "",
      horaTakeoff: "",
      aerolineaLanding: "",
      aerolineaTakeoff: "",
      nvueloLanding: "",
      nvueloTakeoff: "",
      state: "",
      isReserving: false,
      somethingChanged: false,
      tempIdToDelete: -1,
      isOpenModalToPay: false,
      emailError: null,
      email: null,
      local_data: {
        Cliente: {},
        NombreClienteFinal: '',
      },
      ordenAlojamiento: {},
      tropiPayToken: null,
    };
  },
  methods: {
    getOrderId() {
      return this.order;
    },
    editOrder(item) {
      if (item.tipo == "rent") {
        if (
          !verifyDifferentsDatesNoCartReturnBoolean(
            {
              FechaRecogida: item.nI.orderVehiculo.FechaRecogida,
              FechaEntrega: item.nI.orderVehiculo.FechaEntrega
            },
            this.allTypesOrders.filter(i => {
              return (
                i.orderVehiculo.OrdenVehiculoId !=
                this.tempItemToEdit.orderVehiculo.OrdenVehiculoId
              );
            })
          )
        ) {
          let OrdenId = this.tempItemToEdit.orderVehiculo.OrdenId;
          let OrdenVehiculoId = this.tempItemToEdit.orderVehiculo
            .OrdenVehiculoId;

          this.updateSelectedEdit(item.nI);
          this.tempItemToEdit.orderVehiculo = item.nI.orderVehiculo;
          this.revert(this.tempItemToEdit.orderVehiculo);
          this.tempItemToEdit.orderVehiculo.OrdenId = OrdenId;
          this.tempItemToEdit.orderVehiculo.OrdenVehiculoId = OrdenVehiculoId;
          this.calculatePrice(this.allTypesOrders);
          this.somethingChanged = true;
          this.closeEditModal();
        } else {
          this.$toasted.show(
            "Ya tiene un auto reservado dentro de esa misma fecha",
            {
              type: "error"
            }
          );
        }
      }
    },
    revert(o) {
      if (o.LugarRecogida) {
        o.LugarRecogida = {
          nombre: o.LugarRecogida.nombre,
          puntointeresid: o.LugarRecogida.PuntoInteresId
        };
      }
      if (o.LugarEntrega) {
        o.LugarEntrega = {
          nombre: o.LugarEntrega.nombre,
          puntointeresid: o.LugarEntrega.PuntoInteresId
        };
      }
    },
    updateSelectedEdit(item) {
      this.tempItemToEdit.nombre = item.nombre;
      this.tempItemToEdit.cancelation = item.cancelation;
      this.tempItemToEdit.descripcion = item.descripcion;
      this.tempItemToEdit.distribuidor = item.distribuidor;
      this.tempItemToEdit.distribuidorId = item.distribuidorId;
      this.tempItemToEdit.id = item.id;
      this.tempItemToEdit.imagen = item.imagen;
      this.tempItemToEdit.marca = item.marca;
      this.tempItemToEdit.modeloId = item.modeloId;
      this.tempItemToEdit.plazas = item.plazas;
      this.tempItemToEdit.precio = item.precio;
      this.tempItemToEdit.provider = item.provider;
      this.tempItemToEdit.providerImage = item.providerImage;
      this.tempItemToEdit.tipo = item.tipo;
      this.tempItemToEdit.transmision = item.transmision;
    },
    closeEditModal() {
      this.editModal = false;
      this.currentFilterData = null;
    },
    showEditModal(item) {
      if (item.tipo == "rent") {
        this.currentFilterData = this.constructFilterDataObj(item);
        this.currentModalComponent = "GttEditRentModal";
      }
      this.editModal = true;
      this.tempItemToEdit = item;
    },
    constructFilterDataObj(item) {
      if (item.tipo == "rent") {
        let transmision = transmissionTypes.find(i => {
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
            type: "marca"
          },
          propTransmission: transmision,
          id: item.id,
          orderId: item.orderVehiculo.OrdenVehiculoId,
          name: item.nombre
        };
      }
    },
    gttValidate() {
      let validator = [
        {
          rules: ["required"],
          name: "gttName",
          value: this.clientName,
          lang: "es"
        }
      ];

      return validator;
    },
    async cancelateOrder() {
      if (this.state === "Confirmed") {
        return this.cancelOnHotetec();
      }
      let listaVehiculosOrden = this.getListaVehiculosOrden();

      listaVehiculosOrden.forEach(vo => {
        this.cleanVO(vo);
      });
      try {
        this.order.Estado = "Rejected";
        let ordenSaveIt = await authPutReserve(
          this.$route.params.id,
          this.order
        );
        this.$toasted.show("Orden cancelada con éxito.", {
          type: "success"
        });
        this.$router.push({ name: "myreservations" });
      } catch (error) {
        this.isReserving = false;
        console.log(error);
        this.$toasted.show("Ha ocurrido un problema con la orden", {
          type: "error"
        });
      }
    },
    cancelOnHotetec: async function() {
      await this.$helpers.shoppingCartDeleteAll(true);
      this.$eventCartBus.$emit("updateCart");
      try {
        console.info('this->', this);
        console.info('this.order->', this.order);
        const response = await hotetecOpenSession();
        if (response && response.data && response.data.Ideses) {
          const currentHotelec = response.data.Ideses;
          let cancelHotetecReserve = {};
          cancelHotetecReserve.Accion = "C";
          cancelHotetecReserve.Codtou = "HTT";
          cancelHotetecReserve.Locata = this.order.NumeroConfirmacionHotetec;
          cancelHotetecReserve.Ideses = currentHotelec;

          hotetecCancelReserve(cancelHotetecReserve)
            .then(async res => {
              if (!res.data.Coderr) {
                const orderData = {
                  OrdenId: this.order.OrdenId,
                  EstadoHotetec: "Cancel",
                  NumeroConfirmacionHotetec: this.order.NumeroOrden
                };
                const orderStatus = {
                  OrdenId: this.order.OrdenId,
                  Estado: orderStatusList.cancel
                };
                try {
                  await hotetecUpdateDataOnGtt(orderData);
                  await authUpdateStatus(orderStatus);
                  this.$toasted.show("Orden cancelada con éxito.", {
                    type: "success"
                  });
                  this.$router.push({ name: "myreservations" });
                } catch (error) {
                  console.log(error);
                }
              } else {
                this.$toasted.show(res.data.Txterr, {
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.cancelationModal = false;
            });
        }
      } catch (error) {
        console.error(
          "Error occurred while fetching or processing data:",
          error.message
        );
      }
    },
    showCancelationModal() {
      this.cancelationModal = true;
    },
    showDeleteModal(id) {
      this.deleteModal = true;
      this.tempIdToDelete = id;
    },
    closeCancelationModal() {
      this.cancelationModal = false;
    },
    closeDeleteModal() {
      this.deleteModal = false;
      this.tempIdToDelete = -1;
    },
    updateEditing() {
      this.editing = true;
      this.somethingChanged = true;
    },
    hasListaVehiculosOrden() {
      return this.order.ListaVehiculosOrden.length > 0 ? true : false;
    },
    updateName(value) {
      this.clientName = value;
    },
    updateHoraLanding(value) {
      this.horaLanding = value;
    },
    updateHoraTakeoff(value) {
      this.horaTakeoff = value;
    },
    updateAerolineaLanding(value) {
      this.aerolineaLanding = value;
    },
    updateAerolineaTakeoff(value) {
      this.aerolineaTakeoff = value;
    },
    updateNvueloLanding(value) {
      this.nvueloLanding = value;
    },
    updateNvueloTakeoff(value) {
      this.nvueloTakeoff = value;
    },
    async preproccesingLists(list, type = "rent") {
      if (type == "lodging") {
        let t = _.groupBy(list, function(j) {
          return j.AlojamientoId + "+" + j.FechaInicio + "+" + j.FechaFin;
        });
        for (let [key, i] of Object.entries(t)) {
          let images = await authGetImage(i[0].Alojamiento.ProductoId);
          let total = _.sumBy(i, function(p) {
            return p.PrecioOrden;
          });

          let temp = {
            tipo: "lodging",
            entrada: i[0].FechaInicio,
            salida: i[0].FechaFin,
            name: i[0].Alojamiento.Nombre,
            stars: i[0].Alojamiento.NumeroEstrellas,
            location: i[0].Alojamiento.Direccion,
            lodging: i[0].Alojamiento,
            images: [images.data.ImageContent],
            total: total,
            reservedRooms: i
          };

          this.allTypesOrders.push(temp);
        }
      }
      if (type == "rent") {
        for (let item of list) {
          let image = await authGetImage(item.Vehiculo.ProductoId);
          let marca = await authSearchMarca(item.Vehiculo.MarcaId);
          let provider = await authSearchProvider(item.Vehiculo.ProveedorId);

          let temp = {
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
            orderVehiculo: item
          };
          if (temp.orderVehiculo.LugarRecogida) {
            temp.orderVehiculo.LugarRecogida = {
              nombre: temp.orderVehiculo.LugarRecogida.Nombre,
              puntointeresid: temp.orderVehiculo.LugarRecogida.PuntoInteresId
            };
          }
          if (temp.orderVehiculo.LugarEntrega) {
            temp.orderVehiculo.LugarEntrega = {
              nombre: temp.orderVehiculo.LugarEntrega.Nombre,
              puntointeresid: temp.orderVehiculo.LugarEntrega.PuntoInteresId
            };
          }

          this.allTypesOrders.push(temp);
        }
      }
    },
    getListaVehiculosOrden() {
      let lvo = this.allTypesOrders
        .filter(item => {
          return item.tipo == "rent";
        })
        .map(i => {
          return i.orderVehiculo;
        });

      return lvo;
    },
    cleanVO(order) {
      order.DistribuidorId = order.Distribuidor.DistribuidorId;
      order.Distribuidor = {
        DistribuidorId: order.Distribuidor.DistribuidorId
      };
      order.Vehiculo = {
        ProductoId: order.Vehiculo.ProductoId
      };
      order.Sobreprecio = {
        SobreprecioId: order.Sobreprecio.SobreprecioId
      };
      if (order.LugarRecogida) {
        order.LugarRecogida = {
          nombre: order.LugarRecogida.nombre,
          PuntoInteresId: order.LugarRecogida.puntointeresid
        };
      }
      if (order.LugarEntrega) {
        order.LugarEntrega = {
          nombre: order.LugarEntrega.nombre,
          PuntoInteresId: order.LugarEntrega.puntointeresid
        };
      }
      let arrLPRA = new Array();
      order.ListaPreciosRentaAutos.forEach(item => {
        item.PrecioRentaAutos = {
          PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
        };
        arrLPRA.push({
          PrecioRentaAutos: {
            PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
          }
        });
      });
      order.ListaPreciosRentaAutos = arrLPRA;
    },
    async reserve() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        let listaVehiculosOrden = this.getListaVehiculosOrden();
        listaVehiculosOrden.forEach(vo => {
          vo.NombreCliente = this.clientName
            .split(" ")
            .map(i => {
              return _.capitalize(i);
            })
            .join(" ");
          vo.HoraInicio = this.horaLanding;
          vo.HoraFin = this.horaTakeoff;
          vo.InformacionLlegada = this.constructSpacedVal(
            this.aerolineaLanding,
            this.nvueloLanding,
            " - "
          );
          vo.InformacionSalida = this.constructSpacedVal(
            this.aerolineaTakeoff,
            this.nvueloTakeoff,
            " - "
          );
          this.cleanVO(vo);
        });
        this.fillReserveInfo(this.order, listaVehiculosOrden);
        try {
          for (let i of this.idsToDelete) {
            if (i.tipo == "rent")
              await authDeleteCarOrder(i.orderVehiculo.OrdenVehiculoId);
          }
          this.idsToDelete = [];
          this.isReserving = true;
          let ordenSaveIt = await authPutReserve(
            this.$route.params.id,
            this.order
          );
          let onlyOrdenId = {
            OrdenId: ordenSaveIt.data.OrdenId
          };
          try {
            await authUpdateQbEstimated(onlyOrdenId);
          } catch (error) {
            console.log(error);
          }
          this.isReserving = false;
          this.$toasted.show("Orden editada con éxito.", {
            type: "success"
          });
          this.$router.push({ name: "myreservations" });
        } catch (error) {
          this.isReserving = false;
          console.log(error);
          this.$toasted.show("Ha ocurrido un problema con la orden", {
            type: "error"
          });
        }
      } else {
        renderValid(iv, this);
      }
    },
    deleteItem(i) {
      this.allTypesOrders = this.allTypesOrders.filter(item => {
        return item.id != i.id;
      });
      this.calculatePrice(this.allTypesOrders);
      this.idsToDelete.push(i);
      this.somethingChanged = true;
      this.deleteModal = false;
      this.tempIdToDelete = -1;
    },
    findDateInterval() {
      let startDates = [];
      let endDates = [];

      this.allTypesOrders.forEach(item => {
        startDates.push(item.orderVehiculo.FechaRecogida);
        endDates.push(item.orderVehiculo.FechaEntrega);
      });

      return {
        min: this.lodash.min(startDates),
        max: this.lodash.max(endDates)
      };
    },
    fillReserveInfo(orden, lvo = [], lao = [], lalo = [], lto = []) {
      let dateInterval = this.findDateInterval();

      orden.NombreClienteFinal = this.clientName
        .split(" ")
        .map(i => {
          return _.capitalize(i);
        })
        .join(" ");
      orden.NombreOrden = this.clientName
        .split(" ")
        .map(i => {
          return _.capitalize(i);
        })
        .join(" ");
      orden.FechaInicio = dateInterval.min;
      orden.FechaFin = dateInterval.max;
      orden.CantidadAdulto = 1;
      orden.CantidadNino = 0;
      orden.CantidadInfante = 0;
      orden.isActive = true;
      orden.PrecioGeneralOrden = this.priceTotal;
      orden.ListaVehiculosOrden = lvo;
      orden.ListaActividadOrden = lao;
      orden.ListaAlojamientoOrden = lalo;
      orden.ListaTrasladoOrden = lto;
    },
    openModalToPay(order, room, orderIndex) {
      this.isOpenModalToPay = true;
      this.ordenAlojamiento = room;
      this.order = order;
      this.orderIndex = orderIndex;
      console.info('this', this);
      if (!this.ordenAlojamiento.IsPagado) {
        this.isOpenModalToPay = true;
      } else {
        this.$toasted.show('Este alojamiento ya ha sido pagado.', {
          type: 'info'
        });
      }
    },
    closeModal() {
      this.isOpenModalToPay = false;
    },
    confirmExternalPay(type, room) {
      console.info('params', type, room);
      let idx = this.allTypesOrders[this.orderIndex].reservedRooms.findIndex(r => {
        return r.OrdenAlojamientoId == room.OrdenAlojamientoId;
      });
      let isPaid = false;
      switch (type) {
        /* case paymentData.vehicle:
          let vehicleOrder = {
            IsPagado: !order.IsPagado,
            FormaPago: !order.IsPagado ? paymentData.paymentMethod.EXT : null,
            OrdenVehiculoId: order.OrdenVehiculoId
          };
          this.externalServices.confirmExernalPaymentVehicle(vehicleOrder)
            .then((response) => {
              this.allTypesOrders[i].orderVehiculo.IsPagado = response.IsPagado;
              this.allTypesOrders[i].orderVehiculo.FormaPago = response.FormaPago;
            })
            .catch((error) => {
              console.error('Error confirming external payment for vehicle:', error);
            });
          break; */
        case paymentData.accomodation:
          if (!room.IsPagado) {
            isPaid = true;
            let payData = {
              CantidadHabitaciones: room.CantidadHabitaciones,
              IsPagado: !room.IsPagado,
              FormaPago: paymentData.paymentMethod.EXT,
              OrdenAlojamientoId: room.OrdenAlojamientoId
            };
            updateIsPagadoAlojamiento(payData)
              .then((v) => {
                this.allTypesOrders[this.orderIndex].reservedRooms[idx].IsPagado = true;
                this.allTypesOrders[this.orderIndex].reservedRooms[idx].FormaPago = paymentData.paymentMethod.EXT;
              })
              .catch((error) => {
                console.error('Error confirming external payment for accommodation:', error);
              });
          }
          if (isPaid) {
            this.$toasted.show('Pago confirmado con éxito.', {
              type: 'success'
            });
          } else {
            this.$toasted.show('Este alojamiento ya ha sido pagado.', {
            type: 'info'
            });
          }
          this.closeModal();
        break;
        /* case paymentData.activity:
          let activityOrder = {
            IsPagado: !order.IsPagado,
            FormaPago: !order.IsPagado ? paymentData.paymentMethod.EXT : null,
            OrdenActividadId: order.OrdenActividadId
          };
          this.externalServices.confirmExernalPaymentActivity(activityOrder)
            .then((response) => {
              this.allTypesOrders[i].IsPagado = response.IsPagado;
              this.allTypesOrders[i].FormaPago = response.FormaPago;
            })
            .catch((error) => {
              console.error('Error confirming external payment for activity:', error);
            });
          break;
        case paymentData.service:
          let serviceOrder = {
            IsPagado: !order.IsPagado,
            FormaPago: !order.IsPagado ? paymentData.paymentMethod.EXT : null,
            OrdenServicioAdicionalId: order.OrdenServicioAdicionalId
          };
          this.externalServices.confirmExernalPaymentService(serviceOrder)
            .then((response) => {
              this.allTypesOrders[i].IsPagado = response.IsPagado;
              this.allTypesOrders[i].FormaPago = response.FormaPago;
            })
            .catch((error) => {
              console.error('Error confirming external payment for service:', error);
            });
          break;
        case paymentData.transportation:
          let t = {
            IsPagado: !order.IsPagado,
            FormaPago: !order.IsPagado ? paymentData.paymentMethod.EXT : null,
            OrdenTrasladoId: order.OrdenTrasladoId
          };
          this.externalServices.confirmExernalPaymentTransfer(t)
            .then((response) => {
              this.allTypesOrders[i].IsPagado = response.IsPagado;
              this.allTypesOrders[i].FormaPago = response.FormaPago;
            })
            .catch((error) => {
              console.error('Error confirming external payment for transportation:', error);
            });
          break; */
        default:
        // El usuario canceló la acción
      }
    },
    sendPaymentLinkByEmail(type, order) {
      this.validateEmail();
      if (!this.emailError) {
        console.log(`Enviando correo a: ${this.email}`);
        this.tropipayPayment(type, order, true);
      } else {
        this.$toasted.show(this.emailError, {
          type: "error"
        });
      }
    },
    tropipayPayment(type, order, sendPaymentLInk) {
      let id = 0
      let description = ''
      console.info('order ', order);
      let fi = order.FechaInicio.split('T')[0];
      let ff = order.FechaFin.split('T')[0];
      /* getTropiPayToken().then((res) => {console.info('res', res.data);
        this.tropiPayToken = res.data.access_token;
      }).catch((error) => {
        console.error('Error fetching TropiPay token:', error);
      }); */

      switch (type) {
        /*case paymentData.vehicle:
          id = order.OrdenVehiculoId
          description = 'Rent the ' + order.Vehiculo.Nombre + ' from ' + fi + ' to ' + ff
          break;*/
        case paymentData.accomodation:
          id = order.OrdenAlojamientoId
          description = order.Alojamiento.Nombre + '-' + order.Habitacion.Nombre + '-'
            + order.TipoHabitacion.Nombre + ' reservation ' + ' from ' + fi + ' to ' + ff
          break;
        /*case paymentData.activity:
          id = order.OrdenActividadId
          description = order.Actividad.Nombre + ' for the day ' + fi
          break;
        case paymentData.service:
          id = order.OrdenServicioAdicionalId
          description = order.ServicioAdicional.Nombre + ' from ' + fi + ' to ' + ff
          break;
        case paymentData.transportation:
          id = order.OrdenTrasladoId
          description = order.Traslado.Nombre + ' from ' + order.PuntoOrigen.Nombre + ' to ' + order.PuntoOrigen.PuntoDestino + ' for the day ' + fi
          break;*/
        default:
        // El usuario canceló la acción
      }
      let typeCode = ''
      let typeLabel = ''
      paymentData.productTypeFilter.forEach((item) => {
        if (item.value === type) {
          typeCode = item.id
          typeLabel = item.label
        }
      });

      let request = new PaymentLinkRequest();
      let price = order.CurrencyUsada === paymentData.currency[1].code
        ? parseInt(order.PrecioOrdenTasa + '00')
        : parseInt(order.PrecioOrden + '00');
      request.amount = price;
      request.concept = 'Rent a ' + typeLabel;
      request.currency = order.CurrencyUsada;
      request.TipoOrden = typeCode;
      request.OrdenProductoId = id;
      request.EnviarLinkDePago = sendPaymentLInk;
      request.description = description;
      request.directPayment = false;
      request.expirationDays = 1;

      let ttpClient = new ClientRequest();
      ttpClient.address = this.local_data?.Cliente?.Direccion || '000000';
      let textoSinEspaciosExtras = (this.local_data?.NombreClienteFinal || '').replace(/\s+/g, ' ').trim();
      const tmpName = textoSinEspaciosExtras.split(" ");
      ttpClient.name = tmpName[0] || '';
      ttpClient.lastName = tmpName.length > 1 ? tmpName.slice(1).join(' ') : tmpName[0] || '';
      ttpClient.email = sendPaymentLInk
        ? this.email
        : (this.local_data?.Cliente?.Correo || '');
      ttpClient.phone = this.local_data?.Cliente?.Telefono || '000000';
      ttpClient.termsAndConditions = 'true';
      request.client = ttpClient;
      request.favorite = true;
      request.lang = 'es';
      request.paymentMethods = [];

      request.reasonId = 0;
      request.reference = 'carvel_viajes_colibri';
      request.serviceDate = moment().format();
      request.singleUse = true;
      request.urlNotification = 'https://admin.gotravelandtours.com/publicEliecer/api/ApiTropiPay/Callback/' + typeCode + '/' + id;
      request.urlSuccess = 'https://admin.gotravelandtours.com/#/payment-success?amount=' + order.PrecioOrden + '&currency=' + order.CurrencyUsada + '&description=' + encodeURIComponent(description);
      request.urlFailed = 'https://admin.gotravelandtours.com/#/payment-error?amount=' + order.PrecioOrden + '&currency=' + order.CurrencyUsada + '&description=' + encodeURIComponent(description);
      request.access_token = this.tropiPayToken;

      generatePaymentPage(request)
        .then((v) => {
          let shortUrl = v.data.shortUrl || v.shortUrl;
          if (!sendPaymentLInk) {
            if (shortUrl) {
              window.open(shortUrl, '_blank');
            } else {
              this.$toasted.show('No se pudo obtener el enlace de pago de TropiPay.', {
                type: 'error'
              });
            }
          } else {
            if (this.email === '') {
              this.$toasted.show('Correo electrónico no proporcionado. El enlace de pago se abrirá en una nueva pestaña.', {
                type: 'info',
                duration: 5000
              });
              window.open(shortUrl, '_blank');
            } else if (this.email !== '') {
              this.$toasted.show(`Enlace de pago enviado a ${this.email}: ${shortUrl}`, {
                type: 'info',
                duration: 5000
              });
            }
          }
          this.isOpenModalToPay = false;
          this.$eventCartBus.$emit('updateCart');
        })
        .catch((error) => {
          if (window) {
            window.close();
          }
          console.log('Error al generar el link de pago:', error);
          this.$toasted.show('Error al generar el link de pago.', {
            type: 'error'
          });
        });
    },
    getTropiPayToken(){
      getTropiPayToken()
        .then((res) => {
          this.tropiPayToken = res.data.access_token;
      })
      .catch((error) => {
        console.error('Error fetching TropiPay token:', error);
        this.$toasted.show('Error al obtener el token de TropiPay.', {
          type: 'error'
        });
      });
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.emailError = "El correo electrónico es obligatorio.";
      } else if (!emailRegex.test(this.email)) {
        this.emailError = "El correo electrónico no es válido.";
      } else {
        this.emailError = null;
      }
    }
  }
};
</script>

<style scoped>
.cancelate-button {
  text-decoration-line: underline;
  color: #bcd01d;
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
