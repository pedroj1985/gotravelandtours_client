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
              style="margin-bottom: 30px"
              class="current-car font16 hn-roman gtt-first-color text-center"
            >
              <b>Auto actual:</b>
              <span>{{ displayName(filterData.name) }}</span>
            </div>
            <div class="selects-inline">
              <gtt-select
                v-model:openedLodging="pickUpOpened"
                @click.native="loadPickUpPlaces"
                :options="pickUpDeliveryOptions"
                class="cleft"
                v-model="selectedPickUpPlace"
              >
                <template v-slot:iconSelectedValue>
                  <i class="mdi mdi-map-marker"></i>
                </template>
                <template v-slot:placeholder>
                  <span> Punto de recogida</span>
                </template>
                <template v-slot:selectedPlaceholder>
                  <span>¿Dónde desea rentar el auto?</span>
                </template>
                <template v-slot:option="option">
                  {{ option.option.nombre }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  <span
                    class="gtt-tooltip"
                    :data-tooltip="selectedValue.selectedValue.nombre"
                    >{{
                      overflowText(selectedValue.selectedValue.nombre, 50)
                    }}</span
                  >
                </template>
              </gtt-select>
              <gtt-select
                v-model:openedLodging="deliveryOpened"
                @click.native="loadDeliveryPlaces"
                :options="pickUpDeliveryOptions"
                v-model="selectedDeliveryPlace"
              >
                <template v-slot:iconSelectedValue>
                  <i class="mdi mdi-map-marker"></i>
                </template>
                <template v-slot:placeholder>
                  <span> Punto de entrega</span>
                </template>
                <template v-slot:selectedPlaceholder>
                  <span>¿Dónde entregaría el auto?</span>
                </template>
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
                <template v-slot:iconSelectedValue>
                  <i class="mdi mdi-calendar-today"></i>
                </template>
                <template v-slot:placeholder>
                  <span class="required-field"> Fecha de recogida </span>
                </template>
              </gtt-select-date>
            </div>
            <div ref="gttDeliveryDate">
              <gtt-select-date v-model="selectedDeliveryDate" :mode="'single'">
                <template v-slot:iconSelectedValue>
                  <i class="mdi mdi-calendar-today"></i>
                </template>
                <template v-slot:placeholder>
                  <span class="required-field"> Fecha de entrega </span>
                </template>
              </gtt-select-date>
            </div>
            <div class="selects-inline">
              <div ref="gttTransmision" class="cleft" style="width: 100%">
                <gtt-select
                  :options="transmissionTypes()"
                  v-model="selectedTransmissionType"
                  :isDisabled="useSameCar"
                >
                  <template v-slot:iconSelectedValue>
                    <i class="mdi mdi-earth"></i>
                  </template>
                  <template v-slot:placeholder>
                    <span class="required-field"> Tipo de transmisión</span>
                  </template>
                  <template v-slot:selectedPlaceholder>
                    <span>¿Qué tipo de transmisión desea?</span>
                  </template>
                  <template v-slot:selectedValue="selectedValue">
                    {{ selectedValue.selectedValue.display }}
                  </template>
                  <template v-slot:option="option">
                    {{ option.option.display }}
                  </template>
                  <template v-slot:error>
                    <span class="gtt-errors"> </span>
                  </template>
                </gtt-select>
              </div>
              <gtt-select
                v-model:openedLodging="categoriesOpened"
                @click.native="loadMarcas"
                :options="carsCategories"
                v-model="selectedCarCategory"
                :isDisabled="useSameCar"
                :nullable="true"
              >
                <template v-slot:iconSelectedValue>
                  <i class="mdi mdi-car-estate"></i>
                </template>
                <template v-slot:placeholder>
                  <span> Categoría</span>
                </template>
                <template v-slot:selectedPlaceholder>
                  <span>¿Cómo desea que sea el auto?</span>
                </template>
                <template v-slot:option="option">
                  {{ option.option.nombre }}
                </template>
                <template v-slot:selectedValue="selectedValue">
                  {{ overflowText(selectedValue.selectedValue.nombre) }}
                </template>
              </gtt-select>
            </div>
            <div class="selects-inline">
              <label class="gtt-checkbox">
                <input type="checkbox" v-model="useSameCar" />
                {{ $helpers.traducir("sameCar") }}
              </label>
              <div class="form-actions text-right ml-auto">
                <button
                  type="submit"
                  @click="searchResult"
                  class="lodging-searchButton antonio-regular"
                >
                  <template v-if="!isReserving">Buscar</template>
                  <span
                    class="gtt-spinner gtt-spinner-sm loading-spinner"
                    v-else
                  ></span>
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

<script setup lang="ts">
import { ref, watch } from "vue";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import moment from "moment";
import { cleanVO } from "../../composables/useCleanup";
import {
  transmissionTypes as transmissionTypesUtil,
  overflowText,
} from "../../utils/utils";
import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider,
  authUpdateCar,
} from "../../utils/auth";
import RentEditList from "../reservation/RentEditList.vue";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import _ from "lodash";
import { toast } from "vue3-toastify";

const props = withDefaults(
  defineProps<{
    filterData?: any;
    age?: number;
  }>(),
  {
    filterData: () => ({
      propPickUpDate: moment(),
      propDeliveryDate: moment().add(1, "days"),
      propPickUpPlace: null,
      propDeliveryPlace: null,
      propCarCategory: null,
      propTransmission: null,
      id: undefined,
      name: "",
    }),
  },
);

const emit = defineEmits<{
  (e: "editedItem", val: any): void;
  (e: "cancel"): void;
}>();

const gttPickUpDate = ref<HTMLElement | null>(null);
const gttDeliveryDate = ref<HTMLElement | null>(null);

const result = ref<any[]>([]);
const showResult = ref(false);
const isReserving = ref(false);
const useSameCar = ref(true);
const pickUpOpened = ref(false);
const deliveryOpened = ref(false);
const categoriesOpened = ref(false);
const selectedPickUpPlace = ref(props.filterData?.propPickUpPlace ?? null);
const selectedDeliveryPlace = ref(props.filterData?.propDeliveryPlace ?? null);
const selectedPickUpDate = ref(new Date(props.filterData?.propPickUpDate));
const selectedDeliveryDate = ref(new Date(props.filterData?.propDeliveryDate));
const selectedTransmissionType = ref(
  props.filterData?.propTransmission ?? null,
);
const selectedCarCategory = ref(props.filterData?.propCarCategory ?? null);
const pickUpDeliveryOptions = ref<any[]>([]);
const carsCategories = ref<any[]>([]);

watch(selectedPickUpPlace, (val) => {
  selectedDeliveryPlace.value = val;
});

function cleanVOWrapper(order: any, pickUpPlace?: any, DeliveryPlace?: any) {
  cleanVO(
    order,
    pickUpPlace || selectedPickUpPlace.value,
    DeliveryPlace || selectedDeliveryPlace.value,
  );
}

function transmissionTypes() {
  return transmissionTypesUtil;
}

function gttValidate() {
  return [
    {
      rules: ["required", "dateAfter:selectedPickUpDate"],
      name: "gttDeliveryDate",
      value: selectedDeliveryDate.value,
      lang: "es",
    },
    {
      rules: ["required"],
      name: "gttPickUpDate",
      value: selectedPickUpDate.value,
      lang: "es",
    },
  ];
}

function handleSelected(value: any) {
  edited(value);
}

function displayName(data: string) {
  const data_splitted = data.split("-");
  const sp = data_splitted.slice(1, data_splitted.length);
  return sp.join("-");
}

async function loadMarcas() {
  if (categoriesOpened.value == true) {
    const { data } = await authSearchMarcas();
    const totalResult: any[] = [];
    data.forEach((item: any) => {
      totalResult.push({
        nombre: item.Nombre,
        marcaid: item.MarcaId,
        type: "marca",
      });
    });
    carsCategories.value = totalResult;
  }
}

async function loadPickUpPlaces() {
  if (pickUpOpened.value == true) {
    const { data } = await authSearchPuntosInteres();
    const totalResult: any[] = [];
    data.forEach((item: any) => {
      totalResult.push({
        nombre: item.Nombre,
        regionid: item.RegionId,
        puntointeresid: item.PuntoInteresId,
        type: "punto-interes",
      });
    });
    pickUpDeliveryOptions.value = totalResult;
  }
}

async function loadDeliveryPlaces() {
  if (deliveryOpened.value == true) {
    const { data } = await authSearchPuntosInteres();
    const totalResult: any[] = [];
    data.forEach((item: any) => {
      totalResult.push({
        nombre: item.Nombre,
        regionid: item.RegionId,
        puntointeresid: item.PuntoInteresId,
        type: "punto-interes",
      });
    });
    pickUpDeliveryOptions.value = totalResult;
  }
}

async function searchResultSameCar() {
  try {
    const marca = {
      MarcaId: props.filterData.propCarCategory.marcaid,
      Nombre: props.filterData.propCarCategory.nombre,
    };
    const cliente = { ClienteId: localStorage.getItem("cliente") };
    const transmissionType = props.filterData.propTransmission.nombre;

    const searchItem = {
      FechaRecogida: selectedPickUpDate.value,
      FechaEntrega: selectedDeliveryDate.value,
      Marca: marca,
      TipoTransmision: transmissionType,
      Cliente: cliente,
      EdadCliente: props.age,
      ProductoId: props.filterData.ProductoId,
      DistribuidorId: props.filterData.DistribuidorId,
      HoraEntrega:
        props.filterData.HoraEntrega == ""
          ? "00:00"
          : props.filterData.HoraEntrega,
      HoraRecogida:
        props.filterData.HoraRecogida == ""
          ? "00:00"
          : props.filterData.HoraRecogida,
    };
    isReserving.value = true;

    const { data } = await authUpdateCar(searchItem);
    data.FechaEntrega = selectedDeliveryDate.value;
    const car = data;
    if (car) {
      await editVehiculoOrder(car);
    } else {
      toast("No hay disponibilidad para esta fecha con este auto", {
        type: "error",
      });
    }
    isReserving.value = false;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.log("error en la busqueda: ", error);
    }
    isReserving.value = false;
    toast("El servicio no está disponible en estos momentos", {
      type: "error",
    });
  }
}

function findCarById(list: any[], id: any) {
  return list.find((item: any) => item.Vehiculo.ProductoId == id);
}

function edited(value: any) {
  showResult.value = false;
  emit("editedItem", {
    tipo: "rent",
    pItemId: props.filterData.id,
    nI: value,
  });
}

async function editVehiculoOrder(item: any) {
  const image = await authGetImage(item.Vehiculo.ProductoId);
  const marca = await authSearchMarca(item.Vehiculo.MarcaId);
  const provider = await authSearchProvider(item.Vehiculo.ProveedorId);

  const editedItem = {
    orderId: props.filterData.orderId,
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
    orderVehiculo: item,
  };
  cleanVOWrapper(item);
  emit("editedItem", {
    tipo: "rent",
    pItemId: props.filterData.id,
    nI: editedItem,
  });
}

async function searchResult() {
  const iv = gttIsValid(gttValidate(), null as any);
  if (getValid(iv)) {
    if (useSameCar.value) {
      await searchResultSameCar();
    } else {
      try {
        let marca = null;
        if (
          selectedCarCategory.value &&
          selectedCarCategory.value != "ALL_ITEMS"
        ) {
          marca = {
            MarcaId: selectedCarCategory.value.marcaid,
            Nombre: selectedCarCategory.value.nombre,
          };
        } else {
          marca = { MarcaId: undefined, Nombre: undefined };
        }
        const cliente = { ClienteId: localStorage.getItem("cliente") };
        const transmissionType = selectedTransmissionType.value.nombre;
        const searchItem = {
          FechaRecogida: selectedPickUpDate.value,
          FechaEntrega: selectedDeliveryDate.value,
          Marca: marca,
          TipoTransmision: transmissionType,
          Cliente: cliente,
        };
        const resultList: any[] = [];
        isReserving.value = true;
        const { data } = await authSearchCars(searchItem);
        await Promise.all(
          data
            .filter((i: any) => i.Sobreprecio)
            .map(async (item: any) => {
              const image = await authGetImage(item.Vehiculo.ProductoId);
              const marca = await authSearchMarca(item.Vehiculo.MarcaId);
              const provider = await authSearchProvider(
                item.Vehiculo.ProveedorId,
              );
              resultList.push({
                orderId: props.filterData.orderId,
                nombre: item.Vehiculo.Nombre,
                tipo: "rent",
                id: item.Vehiculo.ProductoId,
                plazas: item.Vehiculo.CantidadPlazas,
                descripcion: item.Vehiculo.Descripcion,
                cancelation: item.Vehiculo.DescripcionCorta,
                transmision: item.Vehiculo.TipoTransmision,
                modeloId: item.Vehiculo.ModeloId,
                marca: marca.data.Nombre,
                seguro: item.Vehiculo.TieneSeguro,
                marcaid: marca.data.MarcaId,
                precio: item.PrecioOrden,
                distribuidor: item.Distribuidor.Nombre,
                distribuidorId: item.Distribuidor.DistribuidorId,
                imagen: image.data.ImageContent,
                provider: provider.data.Nombre,
                providerImage: provider.data.ImageContent,
                orderVehiculo: item,
              });
              cleanVOWrapper(item);
            }),
        );
        result.value = _.orderBy(resultList, (o: any) => o.precio, "asc");
        isReserving.value = false;
        showResult.value = true;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.log(error);
        }
        if (import.meta.env.DEV) {
          console.log("error en el boton: ", error);
        }
        isReserving.value = false;
        toast("El servicio no está disponible en estos momentos", {
          type: "error",
        });
      }
    }
  } else {
    renderValid(iv, {
      $refs: {
        gttDeliveryDate: gttDeliveryDate.value,
        gttPickUpDate: gttPickUpDate.value,
      },
      $children: [],
    } as any);
  }
}
</script>

<style lang="scss" scoped>
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
