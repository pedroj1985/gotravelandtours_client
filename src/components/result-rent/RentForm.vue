<template>
  <div id="lodging-form">
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <div slot="image">
        <img src="/img/icopaq_renta_color.svg" alt="" />
      </div>
      <div slot="searching-text" class="searching-text">
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
    <div class="cleft">
      <gtt-select
        :openedLodging.sync="pickUpOpened"
        @click.native="loadPickUpPlaces"
        :options="pickUpDeliveryOptions"
        class="cleft"
        v-model="selectedPickUpPlace"
      >
        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
        <span slot="placeholder">Punto de recogida</span>
        <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
        <template v-slot:option="option">{{ option.option.nombre }}</template>
        <template v-slot:selectedValue="selectedValue">
          <span class="gtt-tooltip" :data-tooltip="selectedValue.selectedValue.nombre">
            {{ overflowText(selectedValue.selectedValue.nombre, 21) }}
          </span>
        </template>
        <span slot="error" class="gtt-errors"></span>
      </gtt-select>
    </div>

    <div class="cleft">
      <gtt-select
        :openedLodging.sync="deliveryOpened"
        @click.native="loadDeliveryPlaces"
        :options="pickUpDeliveryOptions"
        v-model="selectedDeliveryPlace"
      >
        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
        <span slot="placeholder">Punto de entrega</span>
        <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
        <template v-slot:option="option">{{ option.option.nombre }}</template>
        <template v-slot:selectedValue="selectedValue">
          <span class="gtt-tooltip" :data-tooltip="selectedValue.selectedValue.nombre">
            {{ overflowText(selectedValue.selectedValue.nombre, 21) }}
          </span>
        </template>
        <span slot="error" class="gtt-errors"></span>
      </gtt-select>
    </div>

    <div ref="gttPickUpDate">
      <gtt-select-date v-model="selectedPickUpDate" :mode="'single'">
        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
        <span slot="placeholder" class="required-field">Fecha de recogida</span>
      </gtt-select-date>
    </div>
    <div ref="gttDeliveryDate">
      <gtt-select-date v-model="selectedDeliveryDate" :mode="'single'">
        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
        <span slot="placeholder" class="required-field">Fecha de entrega</span>
        <span slot="error"></span>
      </gtt-select-date>
    </div>
    <div ref="gttTransmision">
      <gtt-select
        :options="transmissionTypes()"
        v-model="selectedTransmissionType"
      >
        <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
        <span slot="placeholder" class="required-field"
          >Tipo de transmisión</span
        >
        <span slot="selectedPlaceholder">¿Qué transmisión desea?</span>
        <template v-slot:selectedValue="selectedValue">{{
          selectedValue.selectedValue.display
        }}</template>
        <template v-slot:option="option">{{ option.option.display }}</template>
        <span slot="error" class="gtt-errors"></span>
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
      <span slot="placeholder">Categoría</span>
      <span slot="selectedPlaceholder">¿Cómo desea el auto?</span>
      <template v-slot:option="option">{{ option.option.nombre }}</template>
      <template v-slot:selectedValue="selectedValue">{{
        selectedValue.selectedValue.nombre
      }}</template>
    </gtt-select>
    <gtt-select :options="countries" v-model="selectedNationality">
      <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
      <span slot="placeholder">Nacionalidad</span>
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

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider
} from "../../utils/auth";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";
import {
  constructDate,
  calculateNights,
  overflowText,
  transmissionTypes
} from "../../utils/utils";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { cleanVO } from "../../composables/useCleanup";
import moment from "moment";

const router = useRouter()

const props = defineProps<{
  propPickUpDate?: any
  propDeliveryDate?: any
  propPickUpPlace?: any
  propDeliveryPlace?: any
  propCarCategory?: any
  propTransmission?: any
  propNationality?: any
}>()

const isModalActive = ref(false)
const pickUpOpened = ref(false)
const deliveryOpened = ref(false)
const categoriesOpened = ref(false)
const selectedPickUpPlace = ref(props.propPickUpPlace)
const selectedDeliveryPlace = ref(props.propDeliveryPlace)
const selectedNationality = ref(props.propNationality)
const selectedPickUpDate = ref(new Date(props.propPickUpDate))
const selectedDeliveryDate = ref(new Date(props.propDeliveryDate))
const selectedTransmissionType = ref(props.propTransmission)
const selectedCarCategory = ref(props.propCarCategory)
const pickUpDeliveryOptions = ref<any[]>([])
const carsCategories = ref<any[]>([])
const defaultFlagImgPath = ref("img/flags/")
const countries = ref([
  { nombre: "Afganistán", flag: "flag_afganistan.jpg" },
  { nombre: "Albania", flag: "flag_albania.jpg" },
  { nombre: "Alemania", flag: "flag_alemania.jpg" },
  { nombre: "Estados Unidos", flag: "flag_estadosunidos.jpg" }
])

watch(() => props.propNationality, (sn: any) => {
  selectedNationality.value = sn
})

watch(selectedPickUpPlace, (val: any) => {
  selectedDeliveryPlace.value = val
})

function cleanOrder(order: any, pickUpPlace: any, DeliveryPlace: any) {
  cleanVO(order, pickUpPlace || selectedPickUpPlace.value, DeliveryPlace || selectedDeliveryPlace.value)
}

function gttValidate() {
  return [
    { rules: ["required", "dateAfter:selectedPickUpDate"], name: "gttDeliveryDate", value: selectedDeliveryDate.value, lang: "es" },
    { rules: ["required"], name: "gttPickUpDate", value: selectedPickUpDate.value, lang: "es" },
    { rules: ["required"], name: "gttTransmision", value: selectedTransmissionType.value, lang: "es" }
  ]
}

async function activateModal() {
  let iv = gttIsValid(gttValidate(), { $el: null, $refs: {} } as any)
  if (getValid(iv)) {
    try {
      isModalActive.value = true
      let marca = null
      if (selectedCarCategory.value || selectedCarCategory.value != "ALL_ITEMS") {
        marca = { MarcaId: selectedCarCategory.value.marcaid, Nombre: selectedCarCategory.value.nombre }
      } else {
        marca = { MarcaId: undefined, Nombre: undefined }
      }
      let cliente = { ClienteId: localStorage.getItem("cliente") }
      let transmissionType = selectedTransmissionType.value.nombre
      let searchItem = {
        FechaRecogida: selectedPickUpDate.value,
        FechaEntrega: selectedDeliveryDate.value,
        Marca: marca,
        TipoTransmision: transmissionType,
        Cliente: cliente
      }
      let resultList: any[] = []
      let { data } = await authSearchCars(searchItem)
      await Promise.all(
        data.filter((j: any) => j.ValorSobreprecioAplicado > 0).map(async (item: any) => {
          let image = await authGetImage(item.Vehiculo.ProductoId)
          let marca = await authSearchMarca(item.Vehiculo.MarcaId)
          let provider = await authSearchProvider(item.Vehiculo.ProveedorId)
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
          })
          cleanOrder(item, selectedPickUpPlace.value, selectedDeliveryPlace.value)
        })
      )
      isModalActive.value = false
      let filtersToStorage = {
        marca: selectedCarCategory.value,
        transmision: selectedTransmissionType.value,
        pickUpPlace: selectedPickUpPlace.value,
        deliveryPlace: selectedDeliveryPlace.value,
        pickUpDate: selectedPickUpDate.value,
        deliveryDate: selectedDeliveryDate.value,
        nationality: selectedNationality.value
      }
      localStorage.setItem("searchRentFilters", JSON.stringify(filtersToStorage))
      router.push({
        name: "rentResultHolder",
        params: {
          searchResult: resultList,
          filters: filtersToStorage
        }
      })
    } catch (error) {
      if (import.meta.env.DEV) { console.log(error) }
      isModalActive.value = false
      toast("El servicio no está disponible en estos momentos", { type: "error" })
    }
  } else {
    renderValid(iv, { $el: null, $refs: {} } as any)
  }
}

async function loadMarcas() {
  if (categoriesOpened.value == true) {
    let { data } = await authSearchMarcas()
    let totalResult: any[] = []
    data.forEach((item: any) => {
      totalResult = totalResult.concat({ nombre: item.Nombre, marcaid: item.MarcaId, type: "marca" })
    })
    carsCategories.value = totalResult
  }
}

async function loadPickUpPlaces() {
  if (pickUpOpened.value == true) {
    let { data } = await authSearchPuntosInteres()
    let totalResult: any[] = []
    data.forEach((item: any) => {
      totalResult = totalResult.concat({ nombre: item.Nombre, regionid: item.RegionId, puntointeresid: item.PuntoInteresId, type: "punto-interes" })
    })
    pickUpDeliveryOptions.value = totalResult
  }
}

async function loadDeliveryPlaces() {
  if (deliveryOpened.value == true) {
    let { data } = await authSearchPuntosInteres()
    let totalResult: any[] = []
    data.forEach((item: any) => {
      totalResult = totalResult.concat({ nombre: item.Nombre, regionid: item.RegionId, puntointeresid: item.PuntoInteresId, type: "punto-interes" })
    })
    pickUpDeliveryOptions.value = totalResult
  }
}
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
