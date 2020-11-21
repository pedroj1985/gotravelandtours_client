<template>
  <div id="lodging-form">
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <div slot="image">
        <img src="img/icopaq_renta_color.svg" alt="" />
      </div>
      <div slot="searching-text" class="searching-text">
        <span class="antonio-light">Buscando disponibilidad de </span
        ><span class="antonio-bold text-highlight">autos en renta</span>
        <span class="antonio-light"
          >en
          <span v-if="selectedPickUpPlace">{{
            selectedPickUpPlace.nombre
          }}</span
          ><span v-else>cualquier lugar</span></span
        >
      </div>
      <div slot="searching-fields" class="searching-fields">
        <div v-if="selectedPickUpDate && selectedDeliveryDate">
          entre el {{ constructDate(selectedPickUpDate) }} y el
          {{ constructDate(selectedDeliveryDate) }} ({{
            calculateNights(selectedDeliveryDate, selectedPickUpDate)
          }}
          días)
        </div>
        <div v-if="selectedCarCategory">{{ selectedCarCategory.nombre }}</div>
      </div>
    </GttModalSearch>
    <gtt-select
      :openedLodging.sync="pickUpOpened"
      @click.native="loadPickUpPlaces"
      :options="pickUpDeliveryOptions"
      class="cleft"
      v-model="selectedPickUpPlace"
    >
      <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
      <span slot="placeholder"> Punto de recogida</span>
      <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
      <template v-slot:option="option">
        {{ option.option.nombre }}
      </template>
      <template v-slot:selectedValue="selectedValue">
        <span id="selectedPickUp">{{
          overflowText(selectedValue.selectedValue.nombre, 21)
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
      <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
      <template v-slot:option="option">
        {{ option.option.nombre }}
      </template>
      <template v-slot:selectedValue="selectedValue">
        <span id="selectedDelivery">{{
          overflowText(selectedValue.selectedValue.nombre, 21)
        }}</span>
        <b-tooltip target="selectedDelivery" triggers="hover">
          {{ selectedValue.selectedValue.nombre }}
        </b-tooltip>
      </template>
    </gtt-select>
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
        <span slot="error"> </span>
      </gtt-select-date>
    </div>
    <div ref="gttTransmision">
      <gtt-select :options="transmissionTypes" v-model="selectedTransmissionType">
        <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
        <span slot="placeholder" class="required-field"> Tipo de transmisión</span>
        <span slot="selectedPlaceholder">¿Qué transmisión desea?</span>
        <template v-slot:selectedValue="selectedValue">
          {{ selectedValue.selectedValue.display }}
        </template>
        <template v-slot:option="option">
          {{ option.option.display }}
        </template>
      </gtt-select>
    </div>
    <gtt-select
      :openedLodging.sync="categoriesOpened"
      @click.native="loadMarcas"
      :options="carsCategories"
      class="cleft"
      v-model="selectedCarCategory"
      :nullable="true"
    >
      <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
      <span slot="placeholder"> Categoría</span>
      <span slot="selectedPlaceholder">¿Cómo desea el auto?</span>
      <template v-slot:option="option">
        {{ option.option.nombre }}
      </template>
      <template v-slot:selectedValue="selectedValue">
        {{ selectedValue.selectedValue.nombre }}
      </template>
    </gtt-select>
    <gtt-select :options="countries" v-model="selectedNationality">
      <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
      <span slot="placeholder"> Nacionalidad</span>
      <template v-slot:selectedValue="selectedValue">
        <img
          :src="defaultFlagImgPath + selectedValue.selectedValue.flag"
          :alt="selectedValue.selectedValue.nombre + 'flag'"
          class="select-flag"
        />
        {{ selectedValue.selectedValue.nombre }}
      </template>
      <template v-slot:option="option">
        <img
          :src="defaultFlagImgPath + option.option.flag"
          :alt="option.option.nombre + 'flag'"
          class="select-flag"
        />
        {{ option.option.nombre }}
      </template>
      <template slot="selectedPlaceholder">
        <img
          :src="defaultFlagImgPath + selectedNationality.flag"
          :alt="selectedNationality.nombre + 'flag'"
          class="select-flag"
        />
        {{ selectedNationality.nombre }}
      </template>
    </gtt-select>
    <div class="form-actions lodging-form-search-btn">
      <button @click="activateModal" type="submit" class="antonio-regular">
        Buscar
      </button>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider
} from "../../utils/auth";
import GttModalSearch from "../custom-elements/GttModalSearch";
import { constructDate, calculateNights } from "../../utils/utils";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import {cleanVoMixin} from "../../mixins/cleanVoMixin"
import moment from "moment";

export default {
  mixins: [cleanVoMixin],
  components: {
    GttSelect,
    GttSelectDate,
    GttModalSearch
  },
  props: {
    propPickUpDate: {
      default: function() {
        return moment();
      }
    },
    propDeliveryDate: {
      default: function() {
        return moment().add(1, "days");
      }
    },
    propPickUpPlace: {
      default: null
    },
    propDeliveryPlace: {
      default: null
    },
    propCarCategory: {
      default: null
    },
    propTransmission: {
      default: null
    },
    propNationality: {
      default: function() {
        return {
          nombre: "Estados Unidos",
          flag: "flag_estadosunidos.jpg"
        };
      }
    }
  },
  watch: {
    propNationality: function(sn) {
      this.selectedNationality = sn;
    },
    selectedPickUpPlace: function(val) {
      this.selectedDeliveryPlace = val
    }
  },
  // mounted(){
  //     this.gttValidate()
  // },
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
        },
        {
          rules: ["required"],
          name: "gttTransmision",
          value: this.selectedTransmissionType,
          lang: "es"
        }
      ];

      return validator;
    },
    async activateModal() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        try {
          this.isModalActive = true;
          // let otherData = {
          //     pickUpPlace: this.selectedPickUpPlace,
          //     deliveryPlace: this.selectedDeliveryPlace,
          // }
          let marca = null;
          if (this.selectedCarCategory) {
            marca = {
              MarcaId: this.selectedCarCategory.marcaid,
              Nombre: this.selectedCarCategory.nombre
            };
          } else {
            marca = { MarcaId: undefined, Nombre: undefined };
          }
          console.log(marca);
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
          let { data } = await authSearchCars(searchItem);
          console.log(data);

          for (let item of data) {
            let image = await authGetImage(item.Vehiculo.ProductoId);
            let marca = await authSearchMarca(item.Vehiculo.MarcaId);
            let provider = await authSearchProvider(item.Vehiculo.ProveedorId);
            resultList.push({
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
            this.cleanVO(item);
          }
          this.desactivateModal();
          let filtersToStorage = {
            marca: this.selectedCarCategory,
            transmision: this.selectedTransmissionType,
            pickUpPlace: this.selectedPickUpPlace,
            deliveryPlace: this.selectedDeliveryPlace,
            pickUpDate: this.selectedPickUpDate,
            deliveryDate: this.selectedDeliveryDate,
            nationality: this.selectedNationality
          };
          localStorage.setItem(
            "searchRentFilters",
            JSON.stringify(filtersToStorage)
          );
          this.$router.push({
            name: "rentResultHolder",
            params: {
              searchResult: resultList,
              filters: {
                marca: this.selectedCarCategory,
                transmision: this.selectedTransmissionType,
                pickUpPlace: this.selectedPickUpPlace,
                deliveryPlace: this.selectedDeliveryPlace,
                pickUpDate: this.selectedPickUpDate,
                deliveryDate: this.selectedDeliveryDate,
                nationality: this.selectedNationality
              }
            }
          });
        } catch (error) {
          this.desactivateModal();
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
        }
      } else {
        renderValid(iv, this);
      }
    },
    desactivateModal() {
      this.isModalActive = false;
    },
    overflowText(text, l = 30) {
      if (text.length > l) {
        return `${text.substring(0, l)}...`;
      }
      return text;
    },
    constructDate(date) {
      return constructDate(date);
    },
    calculateNights(min, max) {
      return calculateNights(min, max);
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
    }
  },
  data() {
    return {
      isModalActive: false,
      pickUpOpened: false,
      deliveryOpened: false,
      categoriesOpened: false,
      selectedPickUpPlace: this.propPickUpPlace,
      selectedDeliveryPlace: this.propDeliveryPlace,
      selectedNationality: this.propNationality,
      selectedPickUpDate: new Date(this.propPickUpDate),
      selectedDeliveryDate: new Date(this.propDeliveryDate),
      selectedTransmissionType: this.propTransmission,
      selectedCarCategory: this.propCarCategory,
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
      ],
      defaultFlagImgPath: "img/flags/",
      countries: [
        {
          nombre: "Afganistán",
          flag: "flag_afganistan.jpg"
        },
        {
          nombre: "Albania",
          flag: "flag_albania.jpg"
        },
        {
          nombre: "Alemania",
          flag: "flag_alemania.jpg"
        },
        {
          nombre: "Estados Unidos",
          flag: "flag_estadosunidos.jpg"
        }
      ]
    };
  }
};
</script>

<style scoped>
#lodging-form {
  width: 100%;
  /* height: 100%; */
  padding: 15px;
  background-color: #bcd01b;
  border-radius: 10px;
}
.lodging-form-search-btn {
  text-align: right;
}
</style>
<style>
#lodging-form .gtt__toggle {
  margin-bottom: 15px;
}
</style>