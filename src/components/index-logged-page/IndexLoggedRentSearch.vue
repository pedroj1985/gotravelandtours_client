<template>
  <div id="index-logged-rent-search">
    <div class="home-logged-rent-img">
      <img src="/img/homelogin_img_form_renta.jpg" alt="Renta de autos" />
    </div>
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <template v-slot:image>
        <div>
          <img src="/img/icopaq_renta_color.svg" alt="" />
        </div>
      </template>
      <template v-slot:searching-text>
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
      <template v-slot:searching-fields>
        <div class="searching-fields">
          <div v-if="selectedStart && selectedEnd">
            entre el {{ constructDate(selectedStart) }} y el
            {{ constructDate(selectedEnd) }} ({{
              calculateNights(selectedEnd, selectedStart)
            }}
            días)
          </div>
          <div v-if="selectedCarCategory">{{ selectedCarCategory.nombre }}</div>
        </div>
      </template>
    </GttModalSearch>
    <div class="custom-text-form custom-margin">
      <div class="custom-form">
        <div class="selects-inline">
          <gtt-select
            v-model:openedLodging="pickUpOpened"
            @click="loadPickUpPlaces"
            :options="pickUpDeliveryOptions"
            class="cleft"
            v-model="selectedPickUpPlace"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-map-marker"></i>
            </template>
            <template v-slot:placeholder>
              <span>Punto de recogida</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span>¿Dónde desea rentar el auto?</span>
            </template>
            <template v-slot:option="option">{{
              option.option.nombre
            }}</template>
            <template v-slot:selectedValue="selectedValue">
              <span
                class="gtt-tooltip"
                :data-tooltip="selectedValue.selectedValue.nombre"
              >
                {{ overflowText(selectedValue.selectedValue.nombre) }}
              </span>
            </template>
          </gtt-select>
          <gtt-select
            v-model:openedLodging="deliveryOpened"
            @click="loadDeliveryPlaces"
            :options="pickUpDeliveryOptions"
            v-model="selectedDeliveryPlace"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-map-marker"></i>
            </template>
            <template v-slot:placeholder>
              <span>Punto de entrega</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span>¿Dónde entregaría el auto?</span>
            </template>
            <template v-slot:option="option">{{
              option.option.nombre
            }}</template>
            <template v-slot:selectedValue="selectedValue">{{
              overflowText(selectedValue.selectedValue.nombre)
            }}</template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <div ref="gttStartDate" class="w-100 cleft">
            <gtt-select-date
              v-model="selectedStart"
              :day="true"
              :mode="'single'"
            >
              <template v-slot:placeholder>
                <span class="required-field">Fecha de entrada</span>
              </template>
              <template v-slot:iconSelectedValue>
                <i class="mdi mdi-calendar-today"></i>
              </template>
            </gtt-select-date>
          </div>
          <div ref="gttEndDate" class="w-100 cleft">
            <gtt-select-date v-model="selectedEnd" :day="true" :mode="'single'">
              <template v-slot:placeholder>
                <span class="required-field">Fecha de salida</span>
              </template>
              <template v-slot:iconSelectedValue>
                <i class="mdi mdi-calendar-today"></i>
              </template>
            </gtt-select-date>
          </div>
          <div class="w-100">
            <gtt-select
              v-model="selectedNights"
              :options="[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
              ]"
              :search="false"
            >
              <template v-slot:placeholder>
                <span>Días</span>
              </template>
              <template v-slot:selectedPlaceholder>
                <span>¿Cuántos días?</span>
              </template>
              <template v-slot:option="option">
                {{ constructDisplayNights(option.option) }}
              </template>
              <template v-slot:selectedValue="selectedValue">
                {{ constructDisplayNights(selectedValue.selectedValue) }}
              </template>
            </gtt-select>
          </div>
        </div>
        <div class="selects-inline">
          <div ref="gttTransmision" class="cleft" style="width: 100%">
            <gtt-select
              :options="transmissionTypes()"
              v-model="selectedTransmissionType"
            >
              <template v-slot:iconSelectedValue>
                <i class="mdi mdi-earth"></i>
              </template>
              <template v-slot:placeholder>
                <span class="required-field">Tipo de transmisión</span>
              </template>
              <template v-slot:selectedPlaceholder>
                <span>¿Qué tipo de transmisión desea?</span>
              </template>
              <template v-slot:selectedValue="selectedValue">{{
                selectedValue.selectedValue.display
              }}</template>
              <template v-slot:option="option">{{
                option.option.display
              }}</template>
              <template v-slot:error>
                <span class="gtt-errors"></span>
              </template>
            </gtt-select>
          </div>
          <gtt-select
            v-model:openedLodging="categoriesOpened"
            @click="loadMarcas"
            :options="carsCategories"
            :nullable="true"
            v-model="selectedCarCategory"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-car-estate"></i>
            </template>
            <template v-slot:placeholder>
              <span>Categoría</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span>¿Cómo desea que sea el auto?</span>
            </template>
            <template v-slot:option="option">{{
              option.option.nombre
            }}</template>
            <template v-slot:selectedValue="selectedValue">{{
              overflowText(selectedValue.selectedValue.nombre)
            }}</template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <gtt-select
            :options="countries"
            v-model="selectedNationality"
            class="select-countries"
            style="width: 50%; !important;"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-earth"></i>
            </template>
            <template v-slot:placeholder>
              <span>Nacionalidad</span>
            </template>
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
            <template v-slot:selectedPlaceholder>
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
        <p class="required-note">
          <b>NOTA:</b> Los campos con <span style="color: red">*</span> son
          requeridos.
        </p>
      </div>
      <div class="custom-text antonio-light">
        <span class="yellow-words antonio-bold">Renta de autos</span>
        <span class="bannerText"
          >en más de 600 puntos del territorio nacional</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";
import moment from "moment";
import {
  constructDate,
  calculateNights,
  transmissionTypes,
  hasInsurance,
  overflowText,
} from "../../utils/utils";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authGetImage,
  authSearchProvider,
  authSearchMarca,
} from "../../utils/auth";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { cleanVO } from "../../composables/useCleanup";

const router = useRouter();

const gttStartDate = ref<HTMLElement | null>(null);
const gttEndDate = ref<HTMLElement | null>(null);
const gttTransmision = ref<HTMLElement | null>(null);

const pickUpOpened = ref(false);
const deliveryOpened = ref(false);
const categoriesOpened = ref(false);
const countriesOpened = ref(false);
const isModalActive = ref(false);
const defaultFlagImgPath = "img/flags/";
const selectedStart = ref(new Date(moment()));
const selectedEnd = ref(new Date(moment().add(1, "days")));
const selectedNights = ref(1);
const selectedPickUpPlace = ref(null);
const selectedDeliveryPlace = ref(null);
const selectedCarCategory = ref("");
const selectedNationality = ref(null);
const selectedTransmissionType = ref(null);
const countries = [
  {
    nombre: "Afganistán",
    flag: "flag_afganistan.jpg",
  },
  {
    nombre: "Albania",
    flag: "flag_albania.jpg",
  },
  {
    nombre: "Alemania",
    flag: "flag_alemania.jpg",
  },
  {
    nombre: "Estados Unidos",
    flag: "flag_estadosunidos.jpg",
  },
];
const carsCategories = ref<unknown[]>([]);
const pickUpDeliveryOptions = ref<unknown[]>([]);

watch(selectedPickUpPlace, (val) => {
  selectedDeliveryPlace.value = val;
  if (import.meta.env.DEV) {
    console.log(selectedDeliveryPlace.value);
  }
});

watch(selectedEnd, () => {
  let n = moment(selectedEnd.value).diff(selectedStart.value, "days");
  selectedNights.value = n;
});

watch(selectedStart, () => {
  let n = moment(selectedEnd.value).diff(selectedStart.value, "days");
  selectedNights.value = n;
});

watch(selectedNights, (item) => {
  selectedEnd.value = new Date(moment(selectedStart.value).add(item, "days"));
});

function cleanVOFn(
  order: unknown,
  pickUpPlace?: unknown,
  DeliveryPlace?: unknown,
) {
  cleanVO(
    order,
    pickUpPlace || selectedPickUpPlace.value,
    DeliveryPlace || selectedDeliveryPlace.value,
  );
}

function gttValidate() {
  let validator = [
    {
      rules: ["required"],
      name: "gttTransmision",
      value: selectedTransmissionType.value,
      lang: "es",
    },
    {
      rules: ["required"],
      name: "gttStartDate",
      value: selectedStart.value,
      lang: "es",
    },
    {
      rules: ["required", "dateAfter:selectedStart"],
      name: "gttEndDate",
      value: selectedEnd.value,
      lang: "es",
    },
  ];
  return validator;
}

async function activateModal() {
  let iv = gttIsValid(gttValidate(), {
    $refs: {
      gttTransmision: gttTransmision.value,
      gttStartDate: gttStartDate.value,
      gttEndDate: gttEndDate.value,
    },
    selectedStart: selectedStart.value,
  });
  if (getValid(iv)) {
    try {
      isModalActive.value = true;
      let marca = null;
      if (
        selectedCarCategory.value ||
        selectedCarCategory.value != "ALL_ITEMS"
      ) {
        marca = {
          MarcaId: selectedCarCategory.value.marcaid,
          Nombre: selectedCarCategory.value.nombre,
        };
      } else {
        marca = undefined;
      }
      let cliente = { ClienteId: localStorage.getItem("cliente") };
      let transmissionType = selectedTransmissionType.value.nombre;
      let searchItem = {
        FechaRecogida: moment(selectedStart.value).format("YYYY-MM-D"),
        FechaEntrega: moment(selectedEnd.value).format("YYYY-MM-D"),
        Marca: marca,
        TipoTransmision: transmissionType,
        Cliente: cliente,
      };
      let resultList: unknown[] = [];
      let { data } = await authSearchCars(searchItem);
      await Promise.all(
        data
          .filter((j: { ValorSobreprecioAplicado: number }) => {
            return j.ValorSobreprecioAplicado > 0;
          })
          .map(
            async (item: {
              Vehiculo: {
                ProductoId: unknown;
                Nombre: unknown;
                CantidadPlazas: unknown;
                Descripcion: unknown;
                DescripcionCorta: unknown;
                TieneSeguro: unknown;
                TipoTransmision: unknown;
                ModeloId: unknown;
                MarcaId: unknown;
                ProveedorId: unknown;
              };
              PrecioOrden: unknown;
              Distribuidor: { Nombre: unknown; DistribuidorId: unknown };
            }) => {
              let image = await authGetImage(item.Vehiculo.ProductoId);
              let marca = await authSearchMarca(item.Vehiculo.MarcaId);
              let provider = await authSearchProvider(
                item.Vehiculo.ProveedorId,
              );
              resultList.push({
                nombre: item.Vehiculo.Nombre,
                tipo: "rent",
                id: item.Vehiculo.ProductoId,
                plazas: item.Vehiculo.CantidadPlazas,
                descripcion: item.Vehiculo.Descripcion,
                cancelation: item.Vehiculo.DescripcionCorta,
                seguro: item.Vehiculo.TieneSeguro,
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
                orderVehiculo: item,
              });
              cleanVOFn(item);
            },
          ),
      );
      desactivateModal();
      let filtersToStorage = {
        marca: selectedCarCategory.value,
        transmision: selectedTransmissionType.value,
        pickUpPlace: selectedPickUpPlace.value,
        deliveryPlace: selectedDeliveryPlace.value,
        pickUpDate: selectedStart.value,
        deliveryDate: selectedEnd.value,
        nationality: selectedNationality.value,
      };
      localStorage.setItem(
        "searchRentFilters",
        JSON.stringify(filtersToStorage),
      );
      router.push({
        name: "resultRent",
        params: {
          searchResult: resultList,
        },
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log(error);
      }
      desactivateModal();
      toast("El servicio no está disponible en estos momentos", {
        type: "error",
      });
    }
  } else {
    renderValid(iv, {
      $refs: {
        gttTransmision: gttTransmision.value,
        gttStartDate: gttStartDate.value,
        gttEndDate: gttEndDate.value,
      },
      selectedStart: selectedStart.value,
    });
  }
}

function desactivateModal() {
  isModalActive.value = false;
}

function searchCountriesPlaceholder() {
  let usa = countries.find((el) => {
    return el.nombre == "Estados Unidos";
  });
  if (usa) {
    selectedNationality.value = usa;
  } else {
    selectedNationality.value = countries[0];
  }
}

async function loadMarcas() {
  if (categoriesOpened.value == true) {
    try {
      let { data } = await authSearchMarcas();
      let totalResult: unknown[] = [];
      if (import.meta.env.DEV) {
        console.log(totalResult);
      }
      data.forEach((item: { Nombre: unknown; MarcaId: unknown }) => {
        totalResult = totalResult.concat({
          nombre: item.Nombre,
          marcaid: item.MarcaId,
          type: "marca",
        });
      });
      carsCategories.value = totalResult;
    } catch (error) {
      toast("El servicio no está disponible en estos momentos", {
        type: "error",
      });
    }
  }
}

async function loadPickUpPlaces() {
  if (pickUpOpened.value == true) {
    try {
      let { data } = await authSearchPuntosInteres();
      let totalResult: unknown[] = [];
      data.forEach(
        (item: { Nombre: unknown; id: unknown; PuntoInteresId: unknown }) => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.id,
            puntointeresid: item.PuntoInteresId,
            type: "punto-interes",
          });
        },
      );
      pickUpDeliveryOptions.value = totalResult;
    } catch (error) {
      toast("El servicio no está disponible en estos momentos", {
        type: "error",
      });
    }
  }
}

async function loadDeliveryPlaces() {
  if (deliveryOpened.value == true) {
    try {
      let { data } = await authSearchPuntosInteres();
      let totalResult: unknown[] = [];
      data.forEach(
        (item: { Nombre: unknown; id: unknown; PuntoInteresId: unknown }) => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.id,
            puntointeresid: item.PuntoInteresId,
            type: "punto-interes",
          });
        },
      );
      pickUpDeliveryOptions.value = totalResult;
    } catch (error) {
      toast("El servicio no está disponible en estos momentos", {
        type: "error",
      });
    }
  }
}

function constructDisplayNights(n: number) {
  if (n == 1) {
    return `1 día`;
  }
  return `${n} días`;
}

onMounted(() => {
  searchCountriesPlaceholder();
  gttValidate();
});
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

.custom-form {
  padding-bottom: 10px;
}

.custom-text {
  text-align: left;
  margin-left: 30px;
}

.form-actions {
  margin-left: auto;
}

@media (max-width: 1440px) {
  #index-logged-rent-search {
    height: auto;
  }
}
</style>
