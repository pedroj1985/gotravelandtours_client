<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <div id="twoColumn">
      <div class="left-column-filter-wrapper">
        <LeftColumnFilters :filters="filters"></LeftColumnFilters>
      </div>
      <div
        class="right-column-list-wrapper position-relative"
        id="right-column-list-wrapper"
      >
        <div v-if="isLoading" class="text-center w-100">
          <div class="skeleton-list">
            <div class="skeleton-item d-flex" v-for="n in 3" :key="n">
              <GttSkeleton
                type="rect"
                :width="30"
                height="180px"
                class="skeleton-image"
              ></GttSkeleton>
              <div class="skeleton-info flex-grow-1">
                <GttSkeleton
                  type="text"
                  :width="60"
                  height="1.2em"
                ></GttSkeleton>
                <GttSkeleton type="text" :width="40" height="1em"></GttSkeleton>
                <GttSkeleton type="text" :width="80" height="1em"></GttSkeleton>
                <GttSkeleton type="text" :width="50" height="1em"></GttSkeleton>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="hasError" class="text-center w-100">
          <GttErrorState :retryable="true" @retry="retrySearch"></GttErrorState>
        </div>
        <div
          v-else-if="dataLoaded && resultList.length === 0"
          class="text-center w-100"
        >
          <GttEmptyState>
            <template #icon><i class="mdi mdi-bed-outline"></i></template>
            <template #title>Sin alojamientos disponibles</template>
            No se encontraron alojamientos para los filtros seleccionados.
          </GttEmptyState>
        </div>
        <div v-else-if="dataLoaded">
          <div class="map-wrapper">
            <div class="left-side-map">
              <div class="custom-line-1">
                <img
                  src="../../../public/img/icopaq_alojamiento_black.svg"
                  alt="alojamiento"
                />
                <div class="result-search">
                  <div class="result-search-text-title antonio-regular">
                    Hemos encontrado en {{ filters.Region.RegionNombre }}
                    {{ resultList.length }} sitios para alojarse.
                  </div>
                  <div class="result-search-text hn-roman">
                    Del
                    {{
                      toMoment(filters.Entrada)
                        .locale("es")
                        .format("DD MMM YYYY")
                    }}
                    al
                    {{
                      toMoment(filters.Salida)
                        .locale("es")
                        .format("DD MMM YYYY")
                    }}, para
                    {{ constructDisplay(filters.Visitantes) }}
                  </div>
                </div>
              </div>
              <div class="custom-line-2">
                <div class="organizedBySelect">
                  <GttSelect
                    :options="organizedBy"
                    :twoRows="false"
                    v-model="selectedOrganizeType"
                  >
                    <template #iconSelectedValue>
                      <i class="mdi mdi-swap-vertical"></i>
                    </template>
                    <template #placeholder>Organizar por</template>
                    <template #option="option">{{
                      option.option.displayName
                    }}</template>
                    <template #selectedValue="selectedValue">
                      <span id="selectedPickUp">
                        {{ selectedValue.selectedValue.displayName }}
                      </span>
                    </template>
                  </GttSelect>
                </div>
              </div>
            </div>
            <div class="right-side-map">
              <img src="../../../public/img/icomap.svg" alt="mapa" />
            </div>
          </div>
          <RightColumnList
            :filters="filters"
            :todosTipo="todosTipo"
            :resultList="resultList"
            class="right-column-content"
            @resultSize="setResultTotal"
            :perPage="10"
            :order="selectedOrganizeType"
          ></RightColumnList>
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
import LeftColumnFilters from "./LeftColumnFilters.vue";
import RightColumnList from "./RightColumnList.vue";
import Breadcrumb from "../shared/Breadcrumb.vue";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSkeleton from "../shared/GttSkeleton.vue";
import GttEmptyState from "../shared/GttEmptyState.vue";
import GttErrorState from "../shared/GttErrorState.vue";
import { useLodging } from "../../composables/useLodging";
import moment from "moment";
import { authGetRoomTypes } from "../../utils/auth";
import { constructDisplay } from "../../utils/utils";

const { searchResult, searchPrev, roomCombination } = useLodging();
const route = useRoute();

const dataLoaded = ref(false);
const isLoading = ref(false);
const hasError = ref(false);
const roomComb = ref<any>({});
const roomComb2 = ref<any>({});
const todosTipo = ref<any[]>([]);
const resultList = ref<any[]>([]);
const organizedBy = ref([
  { displayName: "Precio (asc)", code: "price_asc" },
  { displayName: "Precio (desc)", code: "price_desc" },
]);
const selectedOrganizeType = ref({
  displayName: "Precio (asc)",
  code: "price_asc",
});
const resultTotal = ref(0);
const filters = ref<any>({});
const breadcrumbList = ["Inicio", "Alojamientos", "Resultados de la búsqueda"];
const menuLinks = ref([
  { name: "index", displayName: "Inicio", id: "home-logged-banner" },
  { name: "lodging", displayName: "alojamientos", id: "home-logged-banner" },
]);

onMounted(async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    let t = await authGetRoomTypes();
    todosTipo.value = t.data;
    let f = localStorage.getItem("searchLodgingFilters");
    if (f) {
      filters.value = JSON.parse(f);
    }
    let r = route.params["searchResult"] as any;
    if (r) {
      let temp = r;
      createList(temp);
      resultTotal.value = resultList.value.length;
    } else {
      let temp = await searchCResult();
      if (temp) {
        createList(temp);
        resultTotal.value = resultList.value.length;
      } else {
        dataLoaded.value = true;
      }
    }
  } catch (error) {
    hasError.value = true;
    dataLoaded.value = true;
  } finally {
    isLoading.value = false;
  }
});

function toMoment(date: string) {
  return moment(date);
}

async function searchCResult() {
  try {
    if (roomComb.value != "ERROR") {
      let ff = {
        Region: filters.value.Region,
        Cliente: filters.value.Cliente,
        Entrada: filters.value.Entrada,
        Salida: filters.value.Salida,
      };
      let result = await searchResult(ff, roomComb.value, roomComb2.value);
      return result;
    } else {
      toast("Demasiados niños", { type: "error" });
      return null;
    }
  } catch (error) {
    toast("El servicio no está disponible en estos momentos", {
      type: "error",
    });
    return null;
  }
}

function setResultTotal(value: number) {
  resultTotal.value = value;
}

function createList(list: any[]) {
  resultList.value = list || [];
  dataLoaded.value = true;
}

async function retrySearch() {
  isLoading.value = true;
  hasError.value = false;
  dataLoaded.value = false;
  try {
    let temp = await searchCResult();
    if (temp) {
      createList(temp);
      resultTotal.value = resultList.value.length;
    } else {
      dataLoaded.value = true;
    }
  } catch (error) {
    hasError.value = true;
    dataLoaded.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>
