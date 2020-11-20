<template>
  <div id="reserve-cart" class="custom-padding-top-2-navbar">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <GttVerificationModal v-if="deleteModal" @closeModal="closeDeleteModal"
                                             @next="deleteItem(tempItemToDelete.id)"></GttVerificationModal>
    <component :is="currentModalComponent" 
                v-if="editModal" 
                :filterData="currentFilterData"
                @cancel="closeEditModal"
                @editedItem="editOrder"></component>
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
                class="reserve-title text-center hn-roman gtt-first-color font24 general-text-opt"
              >
                Usted ha reservado:
              </div>
              <div
                class="reserve-card"
                v-for="item in allTypesOrders"
                :key="item.id"
              >
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
                    {{ styledPrice(item.precio).intPart }}.<sup>{{
                      styledPrice(item.precio).decimalPart
                    }}</sup>
                    USD
                  </div>
                </div>
              </div>
              <div class="reserve-total-to-pay">
                <span
                  class="total-to-pay-text hn-roman font18 gtt-first-color to-uppercase general-text-opt"
                  >Total a pagar</span
                >
                <span class="antonio-light gtt-first-color font48">
                  {{ styledPrice(priceTotal).intPart }}.<sup>{{
                    styledPrice(priceTotal).decimalPart
                  }}</sup>
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="reserve-right-row col-md-9 col-sm-7">
          <div class="verify-step">
            <div
              class="verify-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15"
            >
              <span><i class="mdi mdi-bed"></i> Paso 1: </span
              ><span>Verificar datos de su reservación</span>
            </div>
            <div class="verify-step-content pt-30 pr-15 pl-15 pb-15">
              <RentReservationView
                class="rrv"
                v-for="order in allTypesOrders"
                :item="order"
                :key="order.id"
                @remove="showDeleteModal"
                @edit="showEditModal"
              ></RentReservationView>
            </div>
          </div>
          <div class="create-order-step">
            <div
              class="create-order-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15"
            >
              <span><i class="mdi mdi-account"></i> Paso 2: </span
              ><span>Datos del o los pasajero(s) y crear orden</span>
              <div class="create-order-step-content pt-30 pl-30 pb-30">
                <InfoRow
                  :name="clientName"
                  :lastname="clienteLastName"
                  @inputName="updateName"
                  @inputLastname="updateLastname"
                ></InfoRow>
                <FlightInfoRow
                  class="fir"
                  :hora_landing="horaLanding"
                  :hora_takeoff="horaTakeoff"
                  :aerolinea_landing="aerolineaLanding"
                  :aerolinea_takeoff="aerolineaTakeoff"
                  :nvuelo_landing="nvueloLanding"
                  :nvuelo_takeoff="nvueloTakeoff"
                  @inputHoraLanding="updateHoraLanding"
                  @inputHoraTakeoff="updateHoraTakeoff"
                  @inputAerolineaLanding="updateAerolineaLanding"
                  @inputAerolineaTakeoff="updateAerolineaTakeoff"
                  @inputNvueloLanding="updateNvueloLanding"
                  @inputNvueloTakeoff="updateNvueloTakeoff"
                ></FlightInfoRow>
              </div>
              <div class="form-actions text-right">
                <button
                  type="button"
                  @click="reserve"
                  class="reserveButton antonio-regular"
                >
                  <template v-if="!isReserving">Crear Orden</template>
                  <b-spinner
                    small
                    class="loading-spinner"
                    label="Text Centered"
                    v-else
                  ></b-spinner>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="no-content font24 hn-roman general-text-opt gtt-text-color text-center"
      v-else
    >
      No existen elementos en el carrito
    </div>
  </div>
</template>
<script>
import RentReservationView from "./RentReservationView";
import InfoRow from "./InfoRow";
import FlightInfoRow from "./FlightInfoRow";
import { authReserve } from "../../utils/auth";
import GttVerificationModal from "../custom-elements/GttVerificationModal"
import NavBar2 from "../shared/NavBar2"
import {menuLinks} from "../../menu"
import GttEditRentModal from "../custom-elements/GttEditRentModal"
import {transmissionTypes} from "../../utils/utils"
import { cleanVoMixin } from "../../mixins/cleanVoMixin";

export default {
  created() {
    this.menuLinks = menuLinks
    this.updateCart();
  },
  mixins: [cleanVoMixin],
  components: {
    RentReservationView,
    InfoRow,
    FlightInfoRow,
    GttVerificationModal,
    NavBar2,
    GttEditRentModal
  },
  methods: {
    constructSpacedVal(f, s, separator = " ") {
      return `${f}${separator}${s}`;
    },
    updateCart() {
      let lsCart = localStorage.getItem("gttCart");
      if (lsCart) {
        this.allTypesOrders = JSON.parse(lsCart);
        this.calculatePrice(this.allTypesOrders);
      }
    },
    deleteItem(id) {
      this.$helpers.shoppingCartRemoveOne(id);
      this.updateCart();
      this.$eventCartBus.$emit("updateCart");
      this.tempItemToDelete = null
      this.deleteModal = false
    },
    async reserve() {
      let listaVehiculosOrden = this.getListaVehiculosOrden();
      listaVehiculosOrden.forEach(vo => {
        vo.NombreCliente = this.constructSpacedVal(
          this.clientName,
          this.clienteLastName
        );
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
      });
      let orden = {
        ListaVehiculosOrden: listaVehiculosOrden
      };
      this.fillReserveInfo(orden);
      try {
        this.isReserving = true;
        let ordenSaveIt = await authReserve(orden);
        console.log(ordenSaveIt);
        this.$helpers.shoppingCartDeleteAll();
        this.isReserving = false;
        this.$toasted.show(
          "Orden creada con éxito. A espera de la administración para su aceptación.",
          {
            type: "success"
          }
        );
        this.$eventCartBus.$emit("updateCart");
        this.$router.push({ name: "myreservations" });
      } catch (error) {
        this.isReserving = false;
        this.$toasted.show("Ha ocurrido un problema con la orden", {
          type: "error"
        });
      }
    },
    fillReserveInfo(orden) {
      let dateInterval = this.findDateInterval();
      let id = localStorage.getItem("userid");
      let clienteid = localStorage.getItem("cliente");

      orden.Estado = "Open";
      orden.NombreClienteFinal = this.constructSpacedVal(
        this.clientName,
        this.clienteLastName
      );
      orden.NombreOrden = this.constructSpacedVal(this.clientName, this.clienteLastName)
      orden.FechaInicio = dateInterval.min;
      orden.FechaFin = dateInterval.max;
      orden.Creador = {
        UsuarioId: id
      };
      orden.ClienteId = clienteid;
      orden.CantidadAdulto = 1;
      orden.CantidadNino = 0;
      orden.CantidadInfante = 0;
      orden.isActive = true;
      orden.PrecioGeneralOrden = this.priceTotal;
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
    calculatePrice(value) {
      this.priceTotal = value.reduce((total, item) => {
        return total + item.precio;
      }, 0);
      console.log(this.total);
    },
    styledPrice(number) {
      let intPart = Math.floor(number);
      let decimalPart = (number - intPart).toFixed(2) * 100;

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    updateName(value) {
      this.clientName = value;
    },
    updateLastname(value) {
      this.clienteLastName = value;
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
    closeDeleteModal(){
      this.deleteModal = false
      this.tempItemToDelete = null
    },
    showDeleteModal(item){
      this.deleteModal = true
      this.tempItemToDelete = item
    },
    closeEditModal(){
      this.editModal = false
      this.currentFilterData = null
      this.tempItemToEdit = null
    },
    showEditModal(item){
      if(item.tipo == 'rent')
      {
        this.currentModalComponent = 'GttEditRentModal'
        this.currentFilterData = this.constructFilterDataObj(item)
      }
      this.editModal = true
      this.tempItemToEdit = item
    },
    constructFilterDataObj(item){
      if(item.tipo == 'rent'){

        let transmision = transmissionTypes.find(i => {
          return i.nombre == item.transmision
        })

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
          name: item.nombre
        }  
      }
    },
    editOrder(item){
      if(item.tipo == 'rent')
      {
        this.$helpers.shoppingCartRemoveOne(item.pItemId)
        this.$helpers.shoppingCartAdd(item.nI)
        this.updateCart()
        this.closeEditModal()
        this.$toasted.show("Elemento editado con éxito", {
            type: "success"
        });
      }
    }
  },
  data() {
    return {
      deleteModal: false,
      editModal: false,
      currentModalComponent: '',
      currentFilterData: null,
      tempItemToDelete: null,
      tempItemToEdit: null,
      allTypesOrders: [],
      priceTotal: 0,
      clientName: "",
      clienteLastName: "",
      horaLanding: "",
      aerolineaLanding: "",
      nvueloLanding: "",
      horaTakeoff: "",
      aerolineaTakeoff: "",
      nvueloTakeoff: "",
      isReserving: false,
      menuLinks: []
    };
  }
};
</script>

<style></style>
