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
                  :nacimiento="clienteNacimiento"
                  :hasCar="checkIfRentExist"
                  @inputName="updateName"
                  @inputLastname="updateLastname"
                  @inputPasaporte="updatePasaporte"
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
    <div
      class="
        no-content
        font24
        hn-roman
        general-text-opt
        gtt-text-color
        text-center
      "
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
import RentInfoRow from "./RentInfoRow";
import FlightInfoRow from "./FlightInfoRow";
import {
  authReserve,
  authCreateQbEstimated,
  authUpdOnlyInDbQbEstimated,
  authUpdateCar,
  authLog
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
import moment from "moment";

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
    RentInfoRow,
    FlightInfoRow,
    GttVerificationModal,
    NavBar2,
    GttEditLodgingModal,
    GttEditRentModal
  },
  computed: {
    age: function() {
      var temp = this.clienteNacimiento.split("-");
      var date = new Date(temp[0], temp[1], temp[2]);
      var cur = new Date();
      var diff = cur - date;
      var currentAge = Math.floor(diff / 31557600000);
      return currentAge;
    },
    checkIfRentExist() {
      return this.allTypesOrders.some((i) => {
        console.log(i.tipo);
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
        },
        {
          rules: ["required"],
          name: "gttApellido",
          value: this.clienteLastName,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttPasaporte",
          value: this.clientePasaporte,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttLlegada",
          value:
            this.horaLanding +
            " - " +
            this.aerolineaLanding +
            " - " +
            this.nvueloLanding,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttSalida",
          value:
            this.horaTakeoff +
            " - " +
            this.aerolineaTakeoff +
            " - " +
            this.nvueloTakeoff,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttNacimiento",
          value: this.clienteNacimiento,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttPickUp",
          value: this.clientPickUpPlace,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttDelivery",
          value: this.clientDeliveryPlace,
          lang: "es"
        }
      ];

      return validator;
    },
    constructSpacedVal(f, s, separator = " ") {
      let splittedName = f.split(" ");
      let name = splittedName
        .map((i) => {
          return _.capitalize(i);
        })
        .join(" ");
      let splittedLastName = s.split(" ");
      let lastname = splittedLastName
        .map((i) => {
          return _.capitalize(i);
        })
        .join(" ");
      return `${name}${separator}${lastname}`;
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
      this.tempItemToDelete = null;
      this.deleteModal = false;
    },
    async reserve() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        let listaVehiculosOrden = this.getListaVehiculosOrden();
        let listaAlojamientosOrden = this.getListaAlojamientosOrden();
        listaAlojamientosOrden.forEach((ao) => {
          ao.NombreCliente = this.constructSpacedVal(
            this.clientName,
            this.clienteLastName
          );
        });
        listaVehiculosOrden.forEach((vo) => {
          vo.NombreCliente = this.constructSpacedVal(
            this.clientName,
            this.clienteLastName
          );

          vo.FechaRecogida = vo.FechaRecogida.split("T")[0];
          vo.FechaInicio = vo.FechaRecogida;
          vo.FechaEntrega = vo.FechaEntrega.split("T")[0];
          vo.FechaFin = vo.FechaEntrega;
          vo.FechaNacimiento = this.clienteNacimiento;
          vo.HoraInicio = this.horaLanding;
          vo.HoraFin = this.horaTakeoff;
          vo.InformacionLlegada = this.aerolineaLanding;
          vo.NumeroVueloEntrada = this.nvueloLanding;
          vo.InformacionSalida = this.aerolineaTakeoff;
          vo.NumeroVueloSalida = this.nvueloTakeoff;
          vo.LugarRecogida = this.clientPickUpPlace;
          vo.LugarEntrega = this.clientDeliveryPlace;
        });
        let orden = {
          ListaVehiculosOrden: listaVehiculosOrden,
          ListaAlojamientoOrden: listaAlojamientosOrden
        };
        this.fillReserveInfo(orden);
        try {
          this.isReserving = true;

          let ordenSaveIt = await authReserve(orden);

          authLog({
            OrdenId: ordenSaveIt.data.OrdenId,
            FuncionCreador: "CreateOrderComponent",
            DetalleError: JSON.stringify(ordenSaveIt.data),
            Fecha: moment().format(),
            Usuario: ordenSaveIt.data.Creador.Username,
            Tipo: "Info",
            FuncionParam: JSON.stringify(orden)
          });
          let onlyOrdenId = {
            OrdenId: ordenSaveIt.data.OrdenId
          };
          try {
            let createQB = await authCreateQbEstimated(onlyOrdenId);
            onlyOrdenId["EstimatedCreated"] = true;
            authLog({
              OrdenId: ordenSaveIt.data.OrdenId,
              FuncionCreador: "createEstimateQB",
              DetalleError: JSON.stringify(createQB.data),
              Fecha: moment().format(),
              Usuario: ordenSaveIt.data.Creador.Username,
              Tipo: "Info",
              FuncionParam: JSON.stringify(onlyOrdenId)
            });
            let updateQB = await authUpdOnlyInDbQbEstimated(onlyOrdenId);
            authLog({
              OrdenId: ordenSaveIt.data.OrdenId,
              FuncionCreador: "updateEstimateQB",
              DetalleError: JSON.stringify(updateQB.data),
              Fecha: moment().format(),
              Usuario: ordenSaveIt.data.Creador.Username,
              Tipo: "Info",
              FuncionParam: JSON.stringify(onlyOrdenId)
            });
          } catch (error) {
            authLog({
              OrdenId: ordenSaveIt.data.OrdenId,
              FuncionCreador: "EstimateQB",
              DetalleError: JSON.stringify(error),
              Fecha: moment().format(),
              Usuario: ordenSaveIt.data.Creador.Username,
              Tipo: "Error",
              FuncionParam: JSON.stringify(onlyOrdenId)
            });
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
          authLog({
            FuncionCreador: "CreateOrderComponent",
            DetalleError: JSON.stringify(error),
            Fecha: moment().format(),
            Usuario: orden.Creador.Usuario,
            Tipo: "Error",
            FuncionParam: JSON.stringify(orden)
          });
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
      let user = localStorage.getItem("nombre");
      let clienteid = localStorage.getItem("cliente");

      orden.Estado = "Open";
      orden.NombreClienteFinal = this.constructSpacedVal(
        this.clientName,
        this.clienteLastName
      );
      //TODO agregado numero de pasaporte a la orden
      orden.NumeroPasaporte = this.clientePasaporte;
      orden.NombreOrden = this.constructSpacedVal(
        this.clientName,
        this.clienteLastName
      );
      orden.FechaInicio = dateInterval.min;
      orden.FechaFin = dateInterval.max;
      orden.Creador = {
        UsuarioId: id,
        Usuario: user
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
        .filter((item) => {
          return item.tipo == "rent";
        })
        .map((i) => {
          return i.orderVehiculo;
        });

      return lvo;
    },
    getListaAlojamientosOrden() {
      let lao = [];
      this.allTypesOrders
        .filter((item) => {
          return item.tipo == "lodging";
        })
        .map((i) => {
          i.reservedRooms.combinacion.listado.map((j) => {
            let po = j.precioObjOne;
            po.Alojamiento = {
              ProductoId: po.Alojamiento.ProductoId
            };
            po.CantAdulto = j.tipoHabitacion;
            po.OrdenAlojamientoId = 0;
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
            po.ListaPrecioAlojamientos = po.ListaPrecioAlojamientos.map(
              (lpa) => {
                let p = {
                  PrecioAlojamientoId:
                  lpa.PrecioAlojamiento.PrecioAlojamientoId
                };

                return {
                  PrecioAlojamiento: p
                };
              }
            );
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

      this.allTypesOrders.forEach((item) => {
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
    },
    styledPrice(number) {
      let n = number.toFixed(2);
      let intPart = Math.ceil(n);
      let r = (n - intPart).toFixed(2);
      let decimalPart = (r * 100).toFixed(2);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    updateDeliveryPlace(value) {
      this.clientDeliveryPlace = value;
    },
    updatePickUpPlace(value) {
      this.clientPickUpPlace = value;
    },
    updateName(value) {
      this.clientName = value;
    },
    updateLastname(value) {
      this.clienteLastName = value;
    },
    updatePasaporte(value) {
      this.clientePasaporte = value;
    },
    updateNacimiento(value) {
      this.clienteNacimiento = value;
    },
    updateHoraLanding(value) {
      this.horaTakeoff = value;
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
      console.log(item);
      if (item.tipo == "rent") {
        this.currentModalComponent = "GttEditRentModal";
        this.currentFilterData = this.constructFilterDataObj(item);
      } else if (item.tipo == "lodging") {
        this.currentModalComponent = "GttEditLodgingModal";
        this.currentFilterData = this.constructFilterDataObj(item);
      }
      this.editModal = true;
      this.tempItemToEdit = item;
    },
    constructFilterDataObj(item) {
      if (item.tipo == "rent") {
        let transmision = transmissionTypes.find((i) => {
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
          /* TODO: agregar nuevos campos */
          ProductoId: item.id,
          DistribuidorId: item.orderVehiculo.DistribuidorId,
          HoraEntrega: this.horaTakeoff,
          HoraRecogida: this.horaLanding,
          propTransmission: transmision,
          id: item.id,
          name: item.nombre
        };
      } else if (item.tipo == "lodging") {
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
      console.log("objeto a editar: ", item);
      if (item.tipo == "rent") {
        if (
          !verifyDifferentsDatesNoCartReturnBoolean(
            {
              FechaRecogida: item.nI.orderVehiculo.FechaRecogida,
              FechaEntrega: item.nI.orderVehiculo.FechaEntrega
            },
            this.allTypesOrders.filter((i) => {
              return i.uID != this.tempItemToEdit.uID;
            })
          )
        ) {
          console.log("actualiza");
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
    },
    cleanData(item) {
      console.log("Item a limpiar: ", item);

      item.ListaPreciosRentaAutos = [
        {
          PrecioRentaAutos: {
            PrecioRentaAutosId:
            item.ListaPreciosRentaAutos[0].PrecioRentaAutos
              .PrecioRentaAutosId
          }
        }
      ];
      item.Distribuidor = {
        DistribuidorId: item.Distribuidor.DistribuidorId
      };
      item.Vehiculo = {
        ProductoId: item.Vehiculo.ProductoId
      };

      item.Sobreprecio = {
        SobreprecioId: item.Sobreprecio.SobreprecioId
      };
      return item;
    }
  },

  watch: {
    /* TODO: edad cliente */
    /*  horaTakeoff: async function(newTime) {
      this.editTime = false;
      if (this.horaTakeoff != "" && this.horaLanding != "") {
        let order = {};
        for (const item of this.allTypesOrders) {
          if ("orderVehiculo" in item) {
            order = item;
          }
        }

        let { data } = await authUpdateCar({
          FechaRecogida: order.orderVehiculo.FechaRecogida.split("T")[0],
          FechaEntrega: order.orderVehiculo.FechaEntrega.split("T")[0],
          EdadCliente: this.age,
          Marca: {
            MarcaId: order.marcaid,
            Nombre: order.marca,
          },
          TipoTransmision: order.transmision,
          Cliente: {
            ClienteId: localStorage.getItem("cliente"),
          },
          ProductoId: order.id,
          DistribuidorId: order.distribuidorId,
          HoraEntrega: this.horaTakeoff,
          HoraRecogida: this.horaLanding,
        });
        data.FechaEntrega = order.orderVehiculo.FechaEntrega;
        data.DistribuidorId = order.orderVehiculo.DistribuidorId;
        let fixData = this.cleanData(data);
        order.orderVehiculo = fixData;
        order.precio = order.orderVehiculo.PrecioOrden;
        this.tempItemToEdit = {
          uID: order.uID,
        };
        let item = {
          nI: order,
          pItemId: order.id,
          tipo: "rent",
        };

        this.editOrder(item);

        var leave = new Date("1970-01-01T" + this.horaTakeoff);
        var arrive = new Date("1970-01-01T" + this.horaLanding);
        if (leave > arrive) {
          this.extraDay = 1;
          this.$toasted.show(
            "Departure Time is greater than the Arrival Time. An extra day was charged to your vehicle order!",
            {
              type: "alert",
              position: "top-center",
              duration: null,
              action: {
                text: "Close",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                },
              },
            }
          );
        } else {
          this.extraDay = 0;
        }
      }
      this.editTime = true;
    }, */
    horaLanding: async function(newTime) {
      this.editTime = false;
      if (this.horaTakeoff != "" && this.horaLanding != "") {
        let order = {};
        for (const item of this.allTypesOrders) {
          if ("orderVehiculo" in item) {
            order = item;
          }
        }

        let { data } = await authUpdateCar({
          FechaRecogida: order.orderVehiculo.FechaRecogida,
          FechaEntrega: order.orderVehiculo.FechaEntrega,
          EdadCliente: this.age,
          Marca: {
            MarcaId: order.marcaid,
            Nombre: order.marca
          },
          TipoTransmision: order.transmision,
          Cliente: {
            ClienteId: localStorage.getItem("cliente")
          },
          ProductoId: order.id,
          DistribuidorId: order.distribuidorId,
          HoraEntrega: this.horaTakeoff,
          HoraRecogida: this.horaLanding
        });
        data.FechaEntrega = order.orderVehiculo.FechaEntrega;
        data.DistribuidorId = order.orderVehiculo.DistribuidorId;
        let fixData = this.cleanData(data);
        order.orderVehiculo = fixData;
        order.precio = order.orderVehiculo.PrecioOrden;
        this.tempItemToEdit = {
          uID: order.uID
        };
        let item = {
          nI: order,
          pItemId: order.id,
          tipo: "rent"
        };

        this.editOrder(item);

        var leave = new Date("1970-01-01T" + this.horaTakeoff);
        var arrive = new Date("1970-01-01T" + this.horaLanding);
        if (leave > arrive) {
          this.extraDay = 1;
          this.$toasted.show(
            "Departure Time is greater than the Arrival Time. An extra day was charged to your vehicle order!",
            {
              type: "alert",
              position: "top-center",
              duration: null,
              action: {
                text: "Close",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              }
            }
          );
        } else {
          this.extraDay = 0;
        }
      }
      this.editTime = true;
    }
  },
  data() {
    // TODO agregar al data de cart view el campo pasaporte
    return {
      edadCliente: 0,
      extraDay: 0,
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
      clientePasaporte: "",
      clienteNacimiento: "",
      horaLanding: "",
      aerolineaLanding: "",
      nvueloLanding: "",
      horaTakeoff: "",
      aerolineaTakeoff: "",
      nvueloTakeoff: "",
      editTime: true,
      clientPickUpPlace: [],
      clientDeliveryPlace: [],

      isReserving: false,
      menuLinks: []
    };
  }
};
</script>

<style scoped>
.create-order-step {
    padding-right: 20px !important;
}
</style>
