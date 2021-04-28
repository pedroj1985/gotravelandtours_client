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
                class="reserve-title text-center hn-roman gtt-first-color font24 general-text-opt"
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
                      class="reserve-card-item-name hn-roman font14 gtt-text-color"
                    >
                      {{ item.nombre }}
                    </div>
                    <div
                      class="reserve-card-item-price hn-roman font16 gtt-text-color"
                    >
                      {{ styledPrice(item.precio).intPart }}.
                      <sup>
                        {{ styledPrice(item.precio).decimalPart }}
                      </sup>
                      USD
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
                      {{
                        styledPrice(item.reservedRooms.combinacion.total)
                          .intPart
                      }}.
                      <sup>
                        {{
                          styledPrice(item.reservedRooms.combinacion.total)
                            .decimalPart
                        }}
                      </sup>
                      USD
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
                  {{ styledPrice(priceTotal).intPart }}.
                  <sup>
                    {{ styledPrice(priceTotal).decimalPart }}
                  </sup>
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
              class="create-order-step-title gtt-first-color general-text-opt hn-bdcn font24 pad-15"
            >
              <span> <i class="mdi mdi-account"></i> Paso 2: </span>
              <span>Datos del o los pasajero(s) y crear orden</span>
              <div class="create-order-step-content pt-30 pl-30 pb-30">
                <div ref="gttName">
                  <InfoRow
                    :name="clientName"
                    :lastname="clienteLastName"
                    @inputName="updateName"
                    @inputLastname="updateLastname"
                  >
                    <span slot="error" class="gtt-errors"></span>
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
              <div
                id="reservation-extra-info"
                class="hn-roman font14 pl-30"
                style="color: #ff0000; margin-top: 15px;"
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
import LodgingReservationView from "./LodgingReservationView";
import InfoRow from "./InfoRow";
import FlightInfoRow from "./FlightInfoRow";
import {
  authReserve,
  authCreateQbEstimated,
  authUpdOnlyInDbQbEstimated
} from "../../utils/auth";
import GttEditLodgingModal from "../custom-elements/GttEditLodgingModal";
import GttVerificationModal from "../custom-elements/GttVerificationModal";
import NavBar2 from "../shared/NavBar2";
import { menuLinks } from "../../menu";
import GttEditRentModal from "../custom-elements/GttEditRentModal";
import { transmissionTypes } from "../../utils/utils";
import { cleanVoMixin } from "../../mixins/cleanVoMixin";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { verifyDifferentsDatesNoCartReturnBoolean } from "../../utils/utils";
import _ from "lodash";

export default {
  created() {
    this.menuLinks = menuLinks;
    this.updateCart();
  },
  mixins: [cleanVoMixin],
  components: {
    LodgingReservationView,
    RentReservationView,
    InfoRow,
    FlightInfoRow,
    GttVerificationModal,
    NavBar2,
    GttEditLodgingModal
  },
  computed: {
    checkIfRentExist() {
      return this.allTypesOrders.some(i => {
        return i.tipo == "rent";
      });
    }
  },
  methods: {
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
    constructSpacedVal(f, s, separator = " ") {
      let splittedName = f.split(" ");
      let name = splittedName
        .map(i => {
          return _.capitalize(i);
        })
        .join(" ");
      let splittedLastName = s.split(" ");
      let lastname = splittedLastName
        .map(i => {
          return _.capitalize(i);
        })
        .join(" ");
      return `${name}${separator}${lastname}`;
    },
    updateCart() {
      let lsCart = localStorage.getItem("gttCart");
      if (lsCart) {
        this.allTypesOrders = JSON.parse(lsCart);
        console.log(this.allTypesOrders);
        this.calculatePrice(this.allTypesOrders);
      }
    },
    deleteItem(id) {
      this.$helpers.shoppingCartRemoveOne(id);
      this.updateCart();
      this.$eventCartBus.$emit("updateCart");
      this.tempItemToDelete = null;
      this.deleteModal = false;
    },
    async reserve() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        let listaVehiculosOrden = this.getListaVehiculosOrden();
        let listaAlojamientosOrden = this.getListaAlojamientosOrden();
        listaAlojamientosOrden.forEach(ao => {
          ao.NombreCliente = this.constructSpacedVal(
            this.clientName,
            this.clienteLastName
          );
        });
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
          ListaVehiculosOrden: listaVehiculosOrden,
          ListaAlojamientoOrden: listaAlojamientosOrden
        };
        this.fillReserveInfo(orden);
        try {
          this.isReserving = true;
          console.log(orden);
          let ordenSaveIt = await authReserve(orden);
          let onlyOrdenId = {
            OrdenId: ordenSaveIt.data.OrdenId
          };
          console.log("orden abajo");
          console.log(onlyOrdenId);
          try {
            await authCreateQbEstimated(onlyOrdenId);
            onlyOrdenId["EstimatedCreated"] = true;
            await authUpdOnlyInDbQbEstimated(onlyOrdenId);
          } catch (error) {
            console.log(error);
          }
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
      } else {
        renderValid(iv, this);
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
      orden.NombreOrden = this.constructSpacedVal(
        this.clientName,
        this.clienteLastName
      );
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
    getListaAlojamientosOrden() {
      let lao = [];
      this.allTypesOrders
        .filter(item => {
          return item.tipo == "lodging";
        })
        .map(i => {
          i.reservedRooms.combinacion.listado.map(j => {
            let po = j.precioObjOne;
            po.Alojamiento = {
              ProductoId: po.Alojamiento.ProductoId
            };
            po.CantAdulto = j.tipoHabitacion;
            po.CantNino = j.cantidadMenoresPorHabitacion;
            po.CantInfante = 0;
            // po.PlanesAlimenticiosId = i.reservedRooms.planAlimenticio
            // po.PlanAlimenticio = {
            //   PlanesAlimenticiosId: i.reservedRooms.planAlimenticio
            // }
            po.PlanesAlimenticiosId = j.planAlimenticio;
            po.PlanAlimenticio = {
              PlanesAlimenticiosId: j.planAlimenticio
            };
            po.Habitacion = {
              HabitacionId: po.Habitacion.HabitacionId
            };
            po.Distribuidor = {
              DistribuidorId: po.Distribuidor.DistribuidorId
            };
            po.DistribuidorId = po.Distribuidor.DistribuidorId;
            po.Sobreprecio = {
              SobreprecioId: po.Sobreprecio.SobreprecioId
            };
            po.ListaPrecioAlojamientos = po.ListaPrecioAlojamientos.map(lpa => {
              let p = {
                PrecioAlojamientoId: lpa.PrecioAlojamiento.PrecioAlojamientoId
              };

              return {
                PrecioAlojamiento: p
              };
            });
            for (let index = 0; index < j.cantidad; index++) {
              lao.push(po);
            }
          });
        });

      return lao;
    },
    findDateInterval() {
      let startDates = [];
      let endDates = [];

      this.allTypesOrders.forEach(item => {
        if (item.tipo == "rent") {
          startDates.push(item.orderVehiculo.FechaRecogida);
          endDates.push(item.orderVehiculo.FechaEntrega);
        }
        if (item.tipo == "lodging") {
          startDates.push(item.entrada);
          endDates.push(item.salida);
        }
      });

      return {
        min: this.lodash.min(startDates),
        max: this.lodash.max(endDates)
      };
    },
    calculatePrice(value) {
      this.priceTotal = value.reduce((total, item) => {
        if (item.tipo == "rent") return total + item.precio;
        if (item.tipo == "lodging")
          return total + item.reservedRooms.combinacion.total;
      }, 0);
      console.log(this.priceTotal);
    },
    styledPrice(number) {
      let n = number.toFixed(2);
      let intPart = Math.floor(n);
      let r = (n - intPart).toFixed(2);
      let decimalPart = (r * 100).toFixed(2);

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
    closeDeleteModal() {
      this.deleteModal = false;
      this.tempItemToDelete = null;
    },
    showDeleteModal(item) {
      this.deleteModal = true;
      this.tempItemToDelete = item;
    },
    closeEditModal() {
      this.editModal = false;
      this.currentFilterData = null;
      this.tempItemToEdit = null;
    },
    showEditModal(item) {
      if (item.tipo == "rent") {
        this.currentModalComponent = "GttEditRentModal";
        this.currentFilterData = this.constructFilterDataObj(item);
      } else if (item.tipo == "lodging") {
        console.log(item)
        console.log('elementa a editar')
        this.currentModalComponent = "GttEditLodgingModal";
        this.currentFilterData = this.constructFilterDataObj(item);
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
          name: item.nombre
        };
      } else if (item.tipo == "lodging") {
        console.log(item);
        return {
          name: item.name,
          id: item.uID,
          item: item,
          propDateIn: item.entrada,
          propDateOut: item.salida,
          propVisitantes: item.acomodation || item.roomL,
          needPre: item.acomodation != null
        };
      }
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
              return i.uID != this.tempItemToEdit.uID;
            })
          )
        ) {
          this.updateSelectedEdit(item.nI);
          this.tempItemToEdit.orderVehiculo = item.nI.orderVehiculo;
          this.revert(this.tempItemToEdit.orderVehiculo);
          this.calculatePrice(this.allTypesOrders);
          this.$helpers.shoppingCartUpdate(this.allTypesOrders);
          this.updateCart();
          // this.$helpers.shoppingCartRemoveOne(item.pItemId)
          // this.$helpers.shoppingCartAdd(item.nI)
          // this.updateCart()
          this.closeEditModal();
          this.$toasted.show("Elemento editado con éxito", {
            type: "success"
          });
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
    }
  },
  data() {
    return {
      deleteModal: false,
      editModal: false,
      currentModalComponent: "",
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
