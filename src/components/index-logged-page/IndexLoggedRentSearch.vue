<template>
  <div id="index-logged-rent-search">
    <div class="home-logged-rent-img">
      <img src="img/homelogin_img_form_renta.jpg" alt="" />
    </div>
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
        <div v-if="selectedDates">
          entre el {{ constructDate(selectedDates.start) }} y el
          {{ constructDate(selectedDates.end) }} ({{
            calculateNights(selectedDates.end, selectedDates.start)
          }}
          días)
        </div>
        <div v-if="selectedCarCategory">{{ selectedCarCategory.nombre }}</div>
      </div>
    </GttModalSearch>
    <div class="custom-text-form custom-margin">
      <div class="custom-form">
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
              <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
              <template v-slot:option="option">
                {{ option.option.nombre }}
              </template>
              <template v-slot:selectedValue="selectedValue">
                <span id="selectedPickUp">{{
                  overflowText(selectedValue.selectedValue.nombre)
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
                {{ overflowText(selectedValue.selectedValue.nombre) }}
              </template>
            </gtt-select>
          </div>
          <gtt-select-date v-model="selectedDates" :day="true">
            <span slot="placeholder" class="required-field"> Fecha de entrada y salida</span>
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
          </gtt-select-date>
          <div class="selects-inline">
              <div ref="gttTransmision"
                   class="cleft"
                   style="width: 100%;"
                    >
                <gtt-select
                  :options="transmissionTypes"
                  v-model="selectedTransmissionType"
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
                  <span slot="error" class="gtt-errors">
                  </span>
                </gtt-select>
              </div>
              <gtt-select
                :openedLodging.sync="categoriesOpened"
                @click.native="loadMarcas"
                :options="carsCategories"
                :nullable="true"
                v-model="selectedCarCategory"
              >
              <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
              <span slot="placeholder"> Categoría</span>
              <span slot="selectedPlaceholder">¿Cómo desea que sea el auto?</span>
              <template v-slot:option="option">
                {{ option.option.nombre }}
              </template>
              <template v-slot:selectedValue="selectedValue">
                {{ overflowText(selectedValue.selectedValue.nombre) }}
              </template>
            </gtt-select>
          </div>
          <div class="selects-inline">
            <gtt-select
              :options="countries"
              v-model="selectedNationality"
              class="select-countries"
              style="width: 50%; !important;"
            >
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
            <div class="form-actions text-right">
              <button
                type="submit"
                @click="activateModal"
                class="lodging-searchButton antonio-regular"
              >
                Buscar
              </button>
            </div>
          </div>
          <p class="required-note"><b>NOTA:</b> Los campos con <span style="color: red;">*</span> son
                                    requeridos.</p>
      </div>
      <div class="custom-text antonio-light">
        <span class="yellow-words antonio-bold">Renta de autos</span
        ><span class="bannerText">
          en más de 600 puntos del territorio nacional</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttModalSearch from "../custom-elements/GttModalSearch";
import moment from "moment";
import { constructDate, calculateNights } from "../../utils/utils";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authGetImage,
  authSearchProvider,
  authSearchMarca
} from "../../utils/auth";
import {gttIsValid,
        renderValid,
        getValid} from '../../utils/validation'
import { cleanVoMixin } from "../../mixins/cleanVoMixin";

export default {
  components: {
    GttSelect,
    GttSelectDate,
    GttModalSearch
  },
  mixins: [cleanVoMixin],
  created() {
    this.searchCountriesPlaceholder();
  },
  mounted(){
    this.gttValidate()
  },
  watch: {
    selectedPickUpPlace: function(val) {
      this.selectedDeliveryPlace = val
      console.log(this.selectedDeliveryPlace)
    }
  },
  methods: {
    gttValidate(){
      let validator = [
        {
          rules: ['required'],
          name: 'gttTransmision',
          value: this.selectedTransmissionType,
          lang: 'es'
        }
      ]

      return validator
    },
    async activateModal() {
      let iv = gttIsValid(this.gttValidate())
      if(getValid(iv))
      {
        try {
          this.isModalActive = true;
          // let otherData = {
          //     pickUpPlace: this.selectedPickUpPlace,
          //     deliveryPlace: this.selectedDeliveryPlace,
          // }
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
            FechaRecogida: this.selectedDates.start,
            FechaEntrega: this.selectedDates.end,
            Marca: marca,
            TipoTransmision: transmissionType,
            Cliente: cliente
          };
          let resultList = [];
          let { data } = await authSearchCars(searchItem);

          for (let item of data) {
            let image = await authGetImage(item.Vehiculo.ProductoId);
            let marca = await authSearchMarca(item.Vehiculo.MarcaId);
            console.log(marca)
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
          this.desactivateModal();
          let filtersToStorage = {
            marca: this.selectedCarCategory,
            transmision: this.selectedTransmissionType,
            pickUpPlace: this.selectedPickUpPlace,
            deliveryPlace: this.selectedDeliveryPlace,
            pickUpDate: this.selectedDates.start,
            deliveryDate: this.selectedDates.end,
            nationality: this.selectedNationality
          };
          localStorage.setItem(
            "searchRentFilters",
            JSON.stringify(filtersToStorage)
          );
          this.$router.push({
            name: "resultRent",
            params: {
              searchResult: resultList,
            }
          });
        } catch (error) {
          this.desactivateModal();
          this.$toasted.show("El servicio no está disponible en estos momentos", {
            type: "error"
          });
        }
      }
      else{
        renderValid(iv, this)
      }
    },
    desactivateModal() {
      this.isModalActive = false;
    },
    constructDate(date) {
      return constructDate(date);
    },
    calculateNights(min, max) {
      return calculateNights(min, max);
    },
    overflowText(text, l = 30) {
      if (text.length > l) {
        return `${text.substring(0, l)}...`;
      }
      return text;
    },
    searchCountriesPlaceholder() {
      let usa = this.countries.find(el => {
        return el.nombre == "Estados Unidos";
      });

      if (usa) {
        this.selectedNationality = usa;
      } else {
        this.selectedNationality = this.countries[0];
      }
    },
    // async loadCountries(){
    //     let {data} = await authSearchCountries()
    //     let totalResult = []
    //     data.forEach(item=>{
    //         totalResult = totalResult.concat({
    //             value: item.name,
    //             flag: `flag_${item.name.toLowerCase()}.jpg`
    //         })
    //     })
    //     console.log(data)
    //     this.countries = totalResult
    // },
    async loadMarcas() {
      if (this.categoriesOpened == true) {
        try {
          let { data } = await authSearchMarcas();
          let totalResult = [];
          data.forEach(item => {
            totalResult = totalResult.concat({
              nombre: item.Nombre,
              marcaid: item.MarcaId,
              type: "marca"
            });
          });
          console.log(data);
          this.carsCategories = totalResult;
        } catch (error) {
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
        }
      }
    },
    async loadPickUpPlaces() {
      if (this.pickUpOpened == true) {
        try {
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
          console.log(totalResult);
          this.pickUpDeliveryOptions = totalResult;
        } catch (error) {
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
        }
      }
    },
    async loadDeliveryPlaces() {
      if (this.deliveryOpened == true) {
        try {
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
          console.log(totalResult);
          this.pickUpDeliveryOptions = totalResult;
        } catch (error) {
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
        }
      }
    }
  },
  data() {
    return {
      pickUpOpened: false,
      deliveryOpened: false,
      categoriesOpened: false,
      countriesOpened: false,
      isModalActive: false,
      defaultFlagImgPath: "img/flags/",
      selectedDates: {
        start: new Date(moment()),
        end: new Date(moment().add(1, "days"))
      },
      selectedPickUpPlace: null,
      selectedDeliveryPlace: null,
      selectedCarCategory: "",
      selectedNationality: null,
      selectedTransmissionType: null,
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
      ],
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
      pickUpDeliveryOptions: []
    };
  }
};
</script>

<style scoped>
#index-logged-rent-search {
  width: 100%;
  position: relative;
}
#index-logged-rent-search .home-logged-rent-img img {
  width: 100%;
  height: 100%;
}

.custom-form{
  padding-bottom: 10px;
}

.custom-text {
  text-align: left;
  margin-left: 30px;
}

.form-actions{
  margin-left: auto;
}

@media (max-width: 1440px) {
  #index-logged-rent-search {
    height: auto;
  }
}
</style>