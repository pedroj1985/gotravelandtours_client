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
                    {{ styledPrice(item.precio).intPart }}. USD
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
                    {{ styledPrice(item.total).intPart }}. USD
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
                {{ styledPrice(priceTotal).intPart }}. USD
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
            ><span>No.{{ numeroOrden }}</span>
            <span
              class="to-uppercase ml-auto font18 state-label"
              :class="'state-' + state.toLowerCase()"
              >{{ $helpers.traducir(state) }}</span
            >
          </div>
          <div
            class="verify-step-content pt-30 pr-15 pl-15 pb-15"
            v-for="orden in allTypesOrders"
            :key="orden.id"
          >
            <LodgingReservationView2
              class="lrv"
              v-if="orden.tipo == 'lodging'"
              :item="orden"
            >
            </LodgingReservationView2>
            <RentReservationView
              v-if="orden.tipo == 'rent'"
              class="rrv"
              :ordenId="orden.orderVehiculo.OrdenId"
              :hasVoucher="orden.orderVehiculo.HasVoucher"
              :item="orden"
              :can="state == 'Open'"
              @remove="showDeleteModal"
              @edit="showEditModal"
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
              <div ref="gttName">
                <InfoRow
                  :name="clientName"
                  @inputName="updateName"
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
              v-if="state == 'Open'"
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
              style="color: #ff0000;"
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
    authUpdateQbEstimated
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
  import _ from "lodash";

  export default {
    components: {
      RentReservationView,
      InfoRow,
      FlightInfoRow,
      GttVerificationModal,
      GttEditRentModal,
      LodgingReservationView2
    },
    computed: {
      checkIfRentExist() {
        return this.allTypesOrders.some(i => {
          return i.tipo == "rent";
        });
      }
    },
    mixins: [reusableMethodsMixin],
    async created() {
      this.$emit("adminPanelInfo", "reservation-detail");
      let id = this.$route.params.id;
      let { data } = await authGetOrder(id);

      this.order = data;
      console.log(this.order);
      console.log("list alojamiento aqui");
      this.numeroOrden = this.order.NumeroOrden;
      this.state = this.order.Estado;
      await this.preproccesingLists(this.order.ListaVehiculosOrden);
      await this.preproccesingLists(
        this.order.ListaAlojamientoOrden,
        "lodging"
      );
      this.calculatePrice(this.allTypesOrders);
      this.updateName(this.order.NombreClienteFinal);
      /*
      TODO Validar si se puede dividir
    */
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
      console.log(this.allTypesOrders);
      console.log("lista aqui");
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
          console.log(item);
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
          console.log(ordenSaveIt);
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
            console.log(temp);
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
        console.log(this.idsToDelete);
        console.log(this.tempIdToDelete);
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
</style>
