<template>
  <div id="lodging-form">
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <template #image>
        <img src="/img/icopaq_renta_color.svg" alt="" />
      </template>
      <template #searching-text>
        <div class="searching-text">
          <span class="antonio-light">Buscando disponibilidad de</span>
          <span class="antonio-bold text-highlight pl-1">autos en renta</span>
          <span class="antonio-light">
            en
            <span v-if="selectedPickUpPlace">
              {{ selectedPickUpPlace.nombre }}
            </span>
            <span v-else>cualquier lugar</span>
          </span>
        </div>
      </template>
      <template #searching-fields>
        <div class="searching-fields">
          <div v-if="selectedPickUpDate && selectedDeliveryDate">
            entre el {{ constructDate(selectedPickUpDate) }} y el
            {{ constructDate(selectedDeliveryDate) }} ({{
              calculateNights(selectedDeliveryDate, selectedPickUpDate)
            }}
            días)
          </div>
          <div v-if="selectedCarCategory">{{ selectedCarCategory.nombre }}</div>
        </div>
      </template>
    </GttModalSearch>
    <div class="cleft">
      <gtt-select
        v-model:openedLodging="pickUpOpened"
        :options="pickUpDeliveryOptions"
        class="cleft"
        v-model="selectedPickUpPlace"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-map-marker"></i>
        </template>
        <template #placeholder>Punto de recogida</template>
        <template #selectedPlaceholder>¿Dónde desea rentar el auto?</template>
        <template #option="option">{{ option.option.nombre }}</template>
        <template #selectedValue="selectedValue">
          <span class="gtt-tooltip" :data-tooltip="selectedValue.selectedValue.nombre">
            {{ overflowText(selectedValue.selectedValue.nombre, 21) }}
          </span>
        </template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select>
    </div>

    <div class="cleft">
      <gtt-select
        v-model:openedLodging="deliveryOpened"
        :options="pickUpDeliveryOptions"
        v-model="selectedDeliveryPlace"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-map-marker"></i>
        </template>
        <template #placeholder>Punto de entrega</template>
        <template #selectedPlaceholder>¿Dónde entregaría el auto?</template>
        <template #option="option">{{ option.option.nombre }}</template>
        <template #selectedValue="selectedValue">
          <span class="gtt-tooltip" :data-tooltip="selectedValue.selectedValue.nombre">
            {{ overflowText(selectedValue.selectedValue.nombre, 21) }}
          </span>
        </template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select>
    </div>

    <div ref="gttPickUpDate">
      <gtt-select-date v-model="selectedPickUpDate" :mode="'single'">
        <template #iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Fecha de recogida</span>
        </template>
      </gtt-select-date>
    </div>
    <div ref="gttDeliveryDate">
      <gtt-select-date v-model="selectedDeliveryDate" :mode="'single'">
        <template #iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Fecha de entrega</span>
        </template>
        <template #error></template>
      </gtt-select-date>
    </div>
    <div ref="gttTransmision">
      <gtt-select
        :options="transmissionTypes()"
        v-model="selectedTransmissionType"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-earth"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Tipo de transmisión</span>
        </template>
        <template #selectedPlaceholder>¿Qué transmisión desea?</template>
        <template #selectedValue="selectedValue">{{
          selectedValue.selectedValue.display
        }}</template>
        <template #option="option">{{ option.option.display }}</template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select>
    </div>
    <gtt-select
      v-model:openedLodging="categoriesOpened"
      :options="carsCategories"
      class="cleft"
      v-model="selectedCarCategory"
      :nullable="true"
    >
      <template #iconSelectedValue>
        <i class="mdi mdi-car-estate"></i>
      </template>
      <template #placeholder>Categoría</template>
      <template #selectedPlaceholder>¿Cómo desea el auto?</template>
      <template #option="option">{{ option.option.nombre }}</template>
      <template #selectedValue="selectedValue">{{
        selectedValue.selectedValue.nombre
      }}</template>
    </gtt-select>
    <gtt-select :options="countries" v-model="selectedNationality">
      <template #iconSelectedValue>
        <i class="mdi mdi-earth"></i>
      </template>
      <template #placeholder>Nacionalidad</template>
      <template #selectedValue="selectedValue">
        <img
          :src="defaultFlagImgPath + selectedValue.selectedValue.flag"
          :alt="selectedValue.selectedValue.nombre + 'flag'"
          class="select-flag"
        />
        {{ selectedValue.selectedValue.nombre }}
      </template>
      <template #option="option">
        <img
          :src="defaultFlagImgPath + option.option.flag"
          :alt="option.option.nombre + 'flag'"
          class="select-flag"
        />
        {{ option.option.nombre }}
      </template>
      <template #selectedPlaceholder>
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
import {
  constructDate,
  calculateNights,
  overflowText,
  transmissionTypes
} from "../../utils/utils";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { cleanVoMixin } from "../../mixins/cleanVoMixin";
import { useModal } from "../../composables/useModal";
import moment from "moment";

export default {
  mixins: [cleanVoMixin],
  components: {
    GttSelect,
    GttSelectDate,
    GttModalSearch
  },
  beforeCreate() {
    this.modal = useModal(this);
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
    pickUpOpened(val) {
      if (val) this.loadPickUpPlaces();
    },
    deliveryOpened(val) {
      if (val) this.loadDeliveryPlaces();
    },
    categoriesOpened(val) {
      if (val) this.loadMarcas();
    },
    propNationality: function(sn) {
      this.selectedNationality = sn;
    },
    selectedPickUpPlace: function(val) {
      this.selectedDeliveryPlace = val;
    }
  },
  // mounted(){
  //     this.gttValidate()
  // },
  methods: {
    transmissionTypes() {
      return transmissionTypes;
    },
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
          this.modal.open();
          // let otherData = {
          //     pickUpPlace: this.selectedPickUpPlace,
          //     deliveryPlace: this.selectedDeliveryPlace,
          // }
          let marca = null;
          if (
            this.selectedCarCategory ||
            this.selectedCarCategory != "ALL_ITEMS"
          ) {
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
          let { data } = await authSearchCars(searchItem);
          await Promise.all(
            data
              .filter(j => {
                return j.ValorSobreprecioAplicado > 0;
              })
              .map(async item => {
                let image = await authGetImage(item.Vehiculo.ProductoId);
                let marca = await authSearchMarca(item.Vehiculo.MarcaId);
                let provider = await authSearchProvider(
                  item.Vehiculo.ProveedorId
                );
                resultList.push({
                  nombre: item.Vehiculo.Nombre,
                  tipo: "rent",
                  id: item.Vehiculo.ProductoId,
                  plazas: item.Vehiculo.CantidadPlazas,
                  descripcion: item.Vehiculo.Descripcion,
                  cancelation: item.Vehiculo.DescripcionCorta,
                  transmision: item.Vehiculo.TipoTransmision,
                  modeloId: item.Vehiculo.ModeloId,
                  seguro: item.Vehiculo.TieneSeguro,
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
              })
          );
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
          console.log(error);
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
      this.modal.close();
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
