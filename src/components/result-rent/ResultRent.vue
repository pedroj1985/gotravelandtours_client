<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <div id="twoColumn">
      <div class="left-column-filter-wrapper">
        <div id="left-column-filters">
          <RentForm
            :propPickUpDate="filter.pickUpDate"
            :propDeliveryDate="filter.deliveryDate"
            :propPickUpPlace="filter.pickUpPlace"
            :propDeliveryPlace="filter.deliveryPlace"
            :propCarCategory="filter.marca"
            :propTransmission="filter.transmision"
            :propNationality="filter.nationality"
          ></RentForm>
        </div>
      </div>
      <div class="right-column-list-wrapper">
        <RentRightColumnList
          :onlyToSelect="onlyToSelect"
          v-if="dataLoaded"
          :perPage="8"
          :resultTotal="resultTotal"
          :list="resultList"
          class="right-column-content"
        ></RentRightColumnList>
        <div v-else class="text-center">
          <!-- <span
            class="gtt-spinner"
            style="width: 5rem; height: 5rem;"
          ></span>-->
          <div class="loader">
            <div class="balls-loader">
              <img
                src="../../../public/img/preloadSERVICIOrenta_bolas_verde.svg"
                alt="bolas cargando"
              />
            </div>
            <div class="icon-loader">
              <img
                src="../../../public/img/preloadSERVICIOrenta_icono_verde.svg"
                alt="auto cargando"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import NavBar2 from "../shared/NavBar2.vue";
import RentForm from "./RentForm.vue";
import Breadcrumb from "../shared/Breadcrumb.vue";
import RentRightColumnList from "./RentRightColumnList.vue";
import { useFiltersStore } from "../../stores/filtersStore";
import { cleanVO } from "../../composables/useCleanup";
import { constructDisplay } from "../../utils/utils";
import {
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider,
} from "../../utils/auth";
import _ from "lodash";

const route = useRoute();

const onlyToSelect = ref(false);
const selectedNationality = ref<any>({});
const dataLoaded = ref(false);
const resultList = ref<any[]>([]);
const filter = ref<any>({});
const resultTotal = ref(0);
const breadcrumbList = ["Inicio", "Renta", "Resultados de la búsqueda"];
const menuLinks = ref([
  { name: "index", displayName: "Inicio", id: "home-logged-banner" },
  { name: "lodging", displayName: "alojamientos", id: "home-logged-banner" },
]);

onMounted(async () => {
  let f = localStorage.getItem("searchRentFilters");
  if (f) {
    filter.value = JSON.parse(f);
    useFiltersStore().update(filter.value);
  }
  let rt = route.params["searchResult"] as any;
  if (rt) {
    let temp = rt as any[];
    resultTotal.value = temp.length;
    temp = _.orderBy(temp, (o: any) => o.precio, "asc");
    createList(temp);
  } else {
    let temp = await searchResultFn();
    resultTotal.value = temp.length;
    temp = _.orderBy(temp, (o: any) => o.precio, "asc");
    createList(temp);
  }
});

async function searchResultFn() {
  try {
    let marca = {
      MarcaId: filter.value.marca.marcaid,
      Nombre: filter.value.marca.nombre,
    };
    let cliente = { ClienteId: localStorage.getItem("cliente") };
    let transmissionType = filter.value.transmision.nombre;
    let searchItem = {
      FechaRecogida: filter.value.pickUpDate,
      FechaEntrega: filter.value.deliveryDate,
      Marca: marca,
      TipoTransmision: transmissionType,
      Cliente: cliente,
    };
    let resultListData: any[] = [];
    let { data } = await authSearchCars(searchItem);
    await Promise.all(
      data
        .filter((j: any) => j.ValorSobreprecioAplicado > 0)
        .map(async (item: any) => {
          let image = await authGetImage(item.Vehiculo.ProductoId);
          let marcaData = await authSearchMarca(item.Vehiculo.MarcaId);
          let provider = await authSearchProvider(item.Vehiculo.ProveedorId);
          resultListData.push({
            nombre: item.Vehiculo.Nombre,
            tipo: "rent",
            id: item.Vehiculo.ProductoId,
            plazas: item.Vehiculo.CantidadPlazas,
            descripcion: item.Vehiculo.Descripcion,
            cancelation: item.Vehiculo.DescripcionCorta,
            transmision: item.Vehiculo.TipoTransmision,
            modeloId: item.Vehiculo.ModeloId,
            marca: marcaData.data.Nombre,
            marcaid: marcaData.data.MarcaId,
            precio: item.PrecioOrden,
            seguro: item.Vehiculo.TieneSeguro,
            distribuidor: item.Distribuidor.Nombre,
            distribuidorId: item.Distribuidor.DistribuidorId,
            imagen: image.data.ImageContent,
            provider: provider.data.Nombre,
            providerImage: provider.data.ImageContent,
            orderVehiculo: item,
          });
          cleanVO(item, filter.value.pickUpPlace, filter.value.deliveryPlace);
        }),
    );
    return resultListData;
  } catch (error) {
    toast("El servicio no está disponible en estos momentos", {
      type: "error",
    });
    return [];
  }
}

function createList(temp: any[]) {
  resultList.value = temp;
  dataLoaded.value = true;
}

function setResultTotal(value: number) {
  resultTotal.value = value;
}

function listenEventFilterRent() {
  return useFiltersStore().filters;
}
</script>
