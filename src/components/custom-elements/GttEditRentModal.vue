<template>
  <div>
    <div class="c-modal-backdrop">
      <div class="c-modal custom-margin">
        <div class="c-modal-body">
          <RentEditList
            :currentCar="filterData.name"
            @selectedElementEdit="handleSelected"
            :resultList="result"
            v-if="showResult"
            @close="showResult = false"
          ></RentEditList>
          <!-- <div class="custom-form"> -->
          <div class="c-form" v-else>
            <div
              style="margin-bottom: 30px;"
              class="current-car font16 hn-roman gtt-first-color text-center"
            >
              <b>Auto actual:</b>
              <span>{{ displayName(filterData.name) }}</span>
            </div>
            <div class="selects-inline">
              <gtt-select
                :openedLodging.sync="pickUpOpened"
                @click.native="loadPickUpPlaces"
                :options="pickUpDeliveryOptions"
                class="cleft"
                v-model="selectedPickUpPlace"
              >
                <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                <span slot="placeholder"> Punto de recogida</span>
                <span slot="selectedPlaceholder"
                  >¿Dónde desea rentar el auto?</span
                >
                <template v-slot:option="option">
                  {{ option.option.nombre }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  <span id="selectedPickUp">{{
                    overflowText(selectedValue.selectedValue.nombre, 50)
                  }}</span>
                  <b-tooltip target="selectedPickUp" triggers="hover">
                    {{ selectedValue.selectedValue.nombre }}
                  </b-tooltip>
                </template>
              </gtt-select>
              <gtt-select
                :openedLodging.sync="deliveryOpened"
                @click.native="loadDeliveryPlaces"
                :options="pickUpDeliveryOptions"
                v-model="selectedDeliveryPlace"
              >
                <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                <span slot="placeholder"> Punto de entrega</span>
                <span slot="selectedPlaceholder"
                  >¿Dónde entregaría el auto?</span
                >
                <template v-slot:option="option">
                  {{ option.option.nombre }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  {{ overflowText(selectedValue.selectedValue.nombre, 50) }}
                </template>
              </gtt-select>
            </div>
            <div ref="gttPickUpDate">
              <gtt-select-date v-model="selectedPickUpDate" :mode="'single'">
                <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                <span slot="placeholder" class="required-field">
                  Fecha de recogida
                </span>
              </gtt-select-date>
            </div>
            <div ref="gttDeliveryDate">
              <gtt-select-date v-model="selectedDeliveryDate" :mode="'single'">
                <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                <span slot="placeholder" class="required-field">
                  Fecha de entrega
                </span>
              </gtt-select-date>
            </div>
            <div class="selects-inline">
              <div ref="gttTransmision" class="cleft" style="width: 100%;">
                <gtt-select
                  :options="transmissionTypes"
                  v-model="selectedTransmissionType"
                  :isDisabled="useSameCar"
                >
                  <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
                  <span slot="placeholder" class="required-field"> Tipo de transmisión</span>
                  <span slot="selectedPlaceholder"
                    >¿Qué tipo de transmisión desea?</span
                  >
                  <template v-slot:selectedValue="selectedValue">
                    {{ selectedValue.selectedValue.display }}
                  </template>
                  <template v-slot:option="option">
                    {{ option.option.display }}
                  </template>
                  <span slot="error" class="gtt-errors"> </span>
                </gtt-select>
              </div>
              <gtt-select
                :openedLodging.sync="categoriesOpened"
                @click.native="loadMarcas"
                :options="carsCategories"
                v-model="selectedCarCategory"
                :isDisabled="useSameCar"
                :nullable="true"
              >
                <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
                <span slot="placeholder"> Categoría</span>
                <span slot="selectedPlaceholder"
                  >¿Cómo desea que sea el auto?</span
                >
                <template v-slot:option="option">
                  {{ option.option.nombre }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  {{ overflowText(selectedValue.selectedValue.nombre) }}
                </template>
              </gtt-select>
            </div>
            <div class="selects-inline">
              <b-form-checkbox id="checkbox-same-car" v-model="useSameCar">{{
                $helpers.traducir("sameCar")
              }}</b-form-checkbox>
              <div class="form-actions text-right ml-auto">
                <button
                  type="submit"
                  @click="searchResult"
                  class="lodging-searchButton antonio-regular"
                >
                  <template v-if="!isReserving">Buscar</template>
                  <b-spinner
                    small
                    class="loading-spinner"
                    label="Text Centered"
                    v-else
                  ></b-spinner>
                </button>
                <button
                  type="button"
                  @click="$emit('cancel')"
                  class="antonio-regular"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import moment from "moment";
import { reusableMethodsMixin } from "../../mixins/reusableMethodsMixin";
import { cleanVoMixin } from "../../mixins/cleanVoMixin";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider
} from "../../utils/auth";

import RentEditList from "../reservation/RentEditList";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";

export default {
  components: {
    GttSelect,
    GttSelectDate,
    RentEditList
  },
  mixins: [reusableMethodsMixin, cleanVoMixin],
  data() {
    return {
      result: [],
      showResult: false,
      isReserving: false,
      useSameCar: true,
      pickUpOpened: false,
      deliveryOpened: false,
      categoriesOpened: false,
      selectedPickUpPlace: this.filterData.propPickUpPlace,
      selectedDeliveryPlace: this.filterData.propDeliveryPlace,
      selectedPickUpDate: new Date(this.filterData.propPickUpDate),
      selectedDeliveryDate: new Date(this.filterData.propDeliveryDate),
      selectedTransmissionType: this.filterData.propTransmission,
      selectedCarCategory: this.filterData.propCarCategory,
      pickUpDeliveryOptions: [],
      carsCategories: [],
      transmissionTypes: [
        {
          nombre: "Automatico",
          display: "Automático"
        },
        {
          nombre: "Manual",
          display: "Manual"
        },
        {
          nombre: "Automatico S/Seguro",
          display: "Automático S/Seguro"
        },
        {
          nombre: "Manual S/Seguro",
          display: "Manual S/Seguro"
        }
      ]
    };
  },
  props: {
    filterData: {
      type: Object,
      default() {
        return {
          propPickUpDate: moment(),
          propDeliveryDate: moment().add(1, "days"),
          propPickUpPlace: null,
          propDeliveryPlace: null,
          propCarCategory: null,
          propTransmission: null,
          id: undefined,
          name: ""
        };
      }
    }
  },
  watch: {
    selectedPickUpPlace: function(val) {
      this.selectedDeliveryPlace = val
    }
  },
  methods: {
    gttValidate() {
      let validator = [
        {
          rules: ["required", "dateAfter:selectedPickUpDate"],
          name: "gttDeliveryDate",
          value: this.selectedDeliveryDate,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttPickUpDate",
          value: this.selectedPickUpDate,
          lang: "es"
        }
      ];

      return validator;
    },
    handleSelected(value) {
      this.edited(value);
    },
    displayName(data) {
      let data_splitted = data.split("-");
      let sp = data_splitted.slice(1, data_splitted.lenght);

      return sp.join("-");
    },
    async loadMarcas() {
      if (this.categoriesOpened == true) {
        let { data } = await authSearchMarcas();
        let totalResult = [];
        data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            marcaid: item.MarcaId,
            type: "marca"
          });
        });
        this.carsCategories = totalResult;
      }
    },
    async loadPickUpPlaces() {
      if (this.pickUpOpened == true) {
        let { data } = await authSearchPuntosInteres();
        let totalResult = [];
        data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            puntointeresid: item.PuntoInteresId,
            type: "punto-interes"
          });
        });
        this.pickUpDeliveryOptions = totalResult;
      }
    },
    async loadDeliveryPlaces() {
      if (this.deliveryOpened == true) {
        let { data } = await authSearchPuntosInteres();
        let totalResult = [];
        data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            puntointeresid: item.PuntoInteresId,
            type: "punto-interes"
          });
        });
        this.pickUpDeliveryOptions = totalResult;
      }
    },
    async searchResultSameCar() {
      try {
        let marca = {
          MarcaId: this.filterData.propCarCategory.marcaid,
          Nombre: this.filterData.propCarCategory.nombre
        };
        let cliente = { ClienteId: localStorage.getItem("cliente") };
        let transmissionType = this.filterData.propTransmission.nombre;
        let searchItem = {
          FechaRecogida: this.selectedPickUpDate,
          FechaEntrega: this.selectedDeliveryDate,
          Marca: marca,
          TipoTransmision: transmissionType,
          Cliente: cliente
          // ProductoId: this.filterData.id
        };
        this.isReserving = true;
        let { data } = await authSearchCars(searchItem);
        let car = this.findCarById(data, this.filterData.id);
        // TODO aqui cambiar la forma de ver si es el mismo carro
        if (car) {
          await this.editVehiculoOrder(car);
        } else {
          this.$toasted.show(
            "No hay disponibilidad para esta fecha con este auto",
            {
              type: "error"
            }
          );
        }
        this.isReserving = false;
      } catch (error) {
        this.isReserving = false;
        this.$toasted.show("El servicio no está disponible en estos momentos", {
          type: "error"
        });
      }
    },
    findCarById(list, id) {
      return list.find(item => {
        return item.Vehiculo.ProductoId == id;
      });
    },
    edited(value) {
      this.showResult = false;
      this.$emit("editedItem", {
        tipo: "rent",
        pItemId: this.filterData.id,
        nI: value
      });
    },
    async editVehiculoOrder(item) {
      let image = await authGetImage(item.Vehiculo.ProductoId);
      let marca = await authSearchMarca(item.Vehiculo.MarcaId);
      let provider = await authSearchProvider(item.Vehiculo.ProveedorId);

      let editedItem = {
        orderId: this.filterData.orderId,
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
        precio: item.PrecioOrden,
        distribuidor: item.Distribuidor.Nombre,
        distribuidorId: item.Distribuidor.DistribuidorId,
        imagen: image.data.ImageContent,
        provider: provider.data.Nombre,
        providerImage: provider.data.ImageContent,
        orderVehiculo: item
      };
      this.cleanVO(item);
      this.$emit("editedItem", {
        tipo: "rent",
        pItemId: this.filterData.id,
        nI: editedItem
      });
    },
    async searchResult() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        if (this.useSameCar) {
          this.searchResultSameCar();
        } else {
          try {
            let marca = null;
            if(this.selectedCarCategory || this.selectedCarCategory != "ALL_ITEMS")
            {
              marca = {
                MarcaId: this.selectedCarCategory.marcaid,
                Nombre: this.selectedCarCategory.nombre
              };
            } else {
              marca = { MarcaId: undefined, Nombre: undefined };
            }
            let cliente = { ClienteId: localStorage.getItem("cliente") };
            let transmissionType = this.selectedTransmissionType.nombre;
            let searchItem = {
              FechaRecogida: this.selectedPickUpDate,
              FechaEntrega: this.selectedDeliveryDate,
              Marca: marca,
              TipoTransmision: transmissionType,
              Cliente: cliente
            };
            let resultList = [];
            this.isReserving = true;
            let { data } = await authSearchCars(searchItem);

            for (let item of data) {
              let image = await authGetImage(item.Vehiculo.ProductoId);
              let marca = await authSearchMarca(item.Vehiculo.MarcaId);
              let provider = await authSearchProvider(
                item.Vehiculo.ProveedorId
              );
              resultList.push({
                orderId: this.filterData.orderId,
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
                precio: item.PrecioOrden,
                distribuidor: item.Distribuidor.Nombre,
                distribuidorId: item.Distribuidor.DistribuidorId,
                imagen: image.data.ImageContent,
                provider: provider.data.Nombre,
                providerImage: provider.data.ImageContent,
                orderVehiculo: item
              });
              this.cleanVO(item);
            }
            this.isReserving = false;
            this.result = resultList;
            this.showResult = true;
          } catch (error) {
            this.isReserving = false;
            this.$toasted.show(
              "El servicio no está disponible en estos momentos",
              {
                type: "error"
              }
            );
          }
        }
      } else {
        renderValid(iv, this);
      }
    }
  }
};
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

.c-modal .c-form {
  width: 50vw;
}
</style>