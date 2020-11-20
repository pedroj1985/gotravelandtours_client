<template>
  <div
    id="reservation-detail"
  >
    <GttVerificationModal v-if="deleteModal" @closeModal="closeDeleteModal"
                                             @next="deleteItem(tempIdToDelete)"></GttVerificationModal>
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
            class="verify-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15 flex-wrapper"
          >
            <span class="to-uppercase">Detalles orden </span><span>No.{{ numeroOrden }}</span>
            <span class="to-uppercase ml-auto font18 state-label"
                  :class="'state-'+state.toLowerCase()">{{$helpers.traducir(state)}}</span>
          </div>
          <div class="verify-step-content pt-30 pr-15 pl-15 pb-15">
            <RentReservationView
              class="rrv"
              v-for="order in allTypesOrders"
              :item="order"
              :key="order.id"
              :can="state == 'Open'"
              @remove="showDeleteModal"
            ></RentReservationView>
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
              <InfoRow
                :name="clientName"
                @inputName="updateName"
                :onlyOne="true"
                :editable="editing"
              ></InfoRow>
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
  authDeleteCarOrder
} from "../../utils/auth";

import { reusableMethodsMixin } from "../../mixins/reusableMethodsMixin";
import RentReservationView from "./RentReservationView";
import InfoRow from "./InfoRow";
import FlightInfoRow from "./FlightInfoRow";
import GttVerificationModal from '../custom-elements/GttVerificationModal'

export default {
  components: {
    RentReservationView,
    InfoRow,
    FlightInfoRow,
    GttVerificationModal
  },
  mixins: [reusableMethodsMixin],
  async created() {
    this.$emit("adminPanelInfo", "reservation-detail");
    let id = this.$route.params.id;
    let { data } = await authGetOrder(id);

    this.order = data;
    this.numeroOrden = this.order.NumeroOrden;
    this.state = this.order.Estado;
    await this.preproccesingLists(this.order.ListaVehiculosOrden);
    console.log(this.order);
    this.calculatePrice(this.allTypesOrders);
    this.updateName(this.order.NombreClienteFinal);
    if (this.hasListaVehiculosOrden()) {
      this.updateHoraLanding(this.order.ListaVehiculosOrden[0].HoraInicio);
      this.updateHoraTakeoff(this.order.ListaVehiculosOrden[0].HoraFin);
      this.updateAerolineaLanding(
        this.order.ListaVehiculosOrden[0].InformacionLlegada.split(" - ")[0]
      );
      this.updateNvueloLanding(
        this.order.ListaVehiculosOrden[0].InformacionLlegada.split(" - ")[1]
      );
      this.updateAerolineaTakeoff(
        this.order.ListaVehiculosOrden[0].InformacionSalida.split(" - ")[0]
      );
      this.updateNvueloTakeoff(
        this.order.ListaVehiculosOrden[0].InformacionSalida.split(" - ")[1]
      );
    }
  },
  data() {
    return {
      deleteModal: false,
      order: null,
      allTypesOrders: [],
      idsToDelete: [],
      numeroOrden: "",
      priceTotal: 0,
      editing: false,
      clientName: "",
      horaLanding: "",
      horaTakeoff: "",
      aerolineaLanding: "",
      aerolineaTakeoff: "",
      nvueloLanding: "",
      nvueloTakeoff: "",
      state: "",
      isReserving: false,
      somethingChanged: false,
      tempIdToDelete: -1
    };
  },
  methods: {
    showDeleteModal(id){
      this.deleteModal = true
      this.tempIdToDelete = id
    },
    closeDeleteModal(){
      this.deleteModal = false
      this.tempIdToDelete = -1
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
      console.log(this.horaTakeoff);
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
      if (type == "rent") {
        for (let item of list) {
          let image = await authGetImage(item.Vehiculo.ProductoId);
          let marca = await authSearchMarca(item.Vehiculo.MarcaId);
          let provider = await authSearchProvider(item.Vehiculo.ProveedorId);

          this.allTypesOrders.push({
            nombre: item.Vehiculo.Nombre,
            tipo: "rent",
            id: item.Vehiculo.ProductoId,
            plazas: item.Vehiculo.CantidadPlazas,
            descripcion: item.Vehiculo.Descripcion,
            cancelation: item.Vehiculo.DescripcionCorta,
            transmision: item.Vehiculo.TipoTransmision,
            modeloId: item.Vehiculo.ModeloId,
            marca: marca.data.Nombre,
            precio: item.PrecioOrden,
            distribuidor: item.Distribuidor.Nombre,
            distribuidorId: item.Distribuidor.DistribuidorId,
            imagen: image.data.ImageContent,
            provider: provider.data.Nombre,
            providerImage: provider.data.ImageContent,
            orderVehiculo: item
          });
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
      let listaVehiculosOrden = this.getListaVehiculosOrden();
      console.log(listaVehiculosOrden)
      listaVehiculosOrden.forEach(vo => {
        vo.NombreCliente = this.clientName;
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
      console.log(this.order);
      try {
        for (let i of this.idsToDelete) {
          if(i.tipo == "rent")
            await authDeleteCarOrder(i.orderVehiculo.OrdenVehiculoId)
        }
        this.idsToDelete = []
        this.isReserving = true;
        let ordenSaveIt = await authPutReserve(
          this.$route.params.id,
          this.order
        );
        console.log(ordenSaveIt);
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
    },
    deleteItem(i){
      this.allTypesOrders = this.allTypesOrders.filter( item=>{
        return item.id != i.id
      })
      this.calculatePrice(this.allTypesOrders)
      this.idsToDelete.push(i)
      this.somethingChanged = true
      this.deleteModal = false
      this.tempIdToDelete = -1
      console.log(this.idsToDelete)
      console.log(this.tempIdToDelete)
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

      orden.NombreClienteFinal = this.clientName;
      orden.NombreOrden = this.clientName
      orden.FechaInicio = dateInterval.min;
      orden.FechaFin = dateInterval.max;
      orden.CantidadAdulto = 1;
      orden.CantidadNino = 0;
      orden.CantidadInfante = 0;
      orden.isActive = true;
      orden.PrecioGeneralOrden = this.priceTotal;
      orden.ListaVehiculosOrden = lvo
      orden.ListaActividadOrden = lao
      orden.ListaAlojamientoOrden = lalo
      orden.ListaTrasladoOrden = lto
    }
  }
}
</script>

<style scoped>

.state-label{
  border-radius: 5px;
  padding: 5px;
  color: white;
}

.state-pending{
  background: #c88d00;
}
.state-open{
  background: #0000ff;
}
.state-confirmed{
  background: #307000;
}
.state-rejected{
  background: #ff0000;
}
.state-closed{
  background: #212f3d;
}


</style>
