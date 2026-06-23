<template>
  <div id="home-logged-banner">
    <div class="home-logged-img">
      <img src="/img/homelogin_img_form_alojamiento.jpg" alt="Alojamientos" />
    </div>
    <div class="navs-wrapper">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
    </div>
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <template v-slot:image>
        <div>
          <img src="/img/icopaq_alojamiento_color.svg" alt="" />
        </div>
      </template>
      <template v-slot:searching-text>
        <div class="searching-text">
          <span class="antonio-light">Buscando disponibilidad de</span>
          <span class="antonio-bold text-highlight pl-1">alojamientos</span>
          <span class="antonio-light">
            en
            <span v-if="selectedLodgingDestinyValue">{{
              selectedLodgingDestinyValue.nombre
            }}</span>
            <span v-else>cualquier lugar</span>
          </span>
        </div>
      </template>
      <template v-slot:searching-fields>
        <div class="searching-fields">
          <div v-if="selectedStartDate && selectedEndDate">
            entre el {{ constructDate(selectedStartDate) }} y el
            {{ constructDate(selectedEndDate) }} ({{
              calculateNights(selectedStartDate, selectedEndDate)
            }}
            noches)
          </div>
          <div v-if="selectedRoomLayout">
            para
            <span class="pl-1">{{ constructDisplay(selectedRoomLayout) }}</span>
          </div>
        </div>
      </template>
    </GttModalSearch>
    <div class="lodging-text-form custom-margin">
      <div class="lodging-text antonio-light">
        <span class="bannerText">Tenemos los mejores</span>
        <span class="yellow-words antonio-bold">alojamientos</span>
        <span class="bannerText">para usted y su familia</span>
      </div>
      <div class="lodging-form">
        <div ref="gttDestinyLodging" style="width: 100%">
          <gtt-select
            v-model:openedLodging="lodgingOpened"
            @click="loadDestinies"
            v-model="selectedLodgingDestinyValue"
            :options="destinies"
            :alignLeft="true"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-map-marker"></i>
            </template>
            <template v-slot:placeholder>
              <span class="required-field">Destino o Alojamiento</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span>¿Dónde desea alojarse?</span>
            </template>
            <template v-slot:option="option">
              {{ option.option.nombre }}
            </template>
            <template v-slot:selectedValue="selectedValue">
              {{ selectedValue.selectedValue.nombre }}
            </template>
            <template v-slot:error>
              <span class="gtt-errors"></span>
            </template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <div ref="gttStartDate" class="w-100 cleft">
            <gtt-select-date
              v-model="selectedStartDate"
              :mode="'single'"
              :min-date="minStartDate"
            >
              <template v-slot:placeholder>
                <span class="required-field"> Fecha de entrada </span>
              </template>
              <template v-slot:iconSelectedValue>
                <i class="mdi mdi-calendar-today"></i>
              </template>
              <template v-slot:error>
                <span class="gtt-errors"></span>
              </template>
            </gtt-select-date>
          </div>
          <div ref="gttEndDate" class="w-100 cleft">
            <gtt-select-date
              v-model="selectedEndDate"
              :min-date="minEndDate"
              :mode="'single'"
            >
              <template v-slot:placeholder>
                <span class="required-field">Fecha de salida</span>
              </template>
              <template v-slot:iconSelectedValue>
                <i class="mdi mdi-calendar-today"></i>
              </template>
              <template v-slot:error>
                <span class="gtt-errors"></span>
              </template>
            </gtt-select-date>
          </div>
          <div class="w-100">
            <gtt-select
              v-model="selectedNights"
              :options="[
                3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
              ]"
              :search="false"
              :alignLeft="true"
            >
              <template v-slot:placeholder>
                <span>Noches</span>
              </template>
              <template v-slot:selectedPlaceholder>
                <span>¿Cuántas noches?</span>
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
          <gtt-select-form
            :options="roomLayout"
            class="cleft"
            v-model="selectedRoomLayout"
          >
            <template v-slot:iconSelectedValue>
              <span>
                <i class="mdi mdi-account"></i>
              </span>
            </template>
            <template v-slot:placeholder>
              <span class="required-field">Visitantes</span>
            </template>
          </gtt-select-form>
          <!--          <gtt-select
                      :options="countries"
                      v-model="selectedNationality"
                      class="select-countries"
                    >
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
                    </gtt-select>-->
        </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import NavBar2 from "../shared/NavBar2.vue";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectForm from "../custom-elements/GttSelectForm.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";
import moment from "moment";
import { useScrollStore } from "../../stores/scrollStore";
import { authGetRoomTypes, authGetHotelList } from "../../utils/auth";
import {
  constructDate,
  calculateNights,
  constructDisplay,
} from "../../utils/utils";
import { helpers } from "../../utils/helpers";
import { useLodging } from "../../composables/useLodging";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";

const router = useRouter();

const gttDestinyLodging = ref<HTMLElement | null>(null);
const gttStartDate = ref<HTMLElement | null>(null);
const gttEndDate = ref<HTMLElement | null>(null);

const {
  roomCombination,
  getTotalRooms,
  recursiveBuildRoom,
  buildComboV2,
  buildCombo,
  buildIdCombo,
  existenCombinaciones,
  existeAcomodacionEnLista,
  validateRoom,
  validateLayout,
  canFulfill,
  search,
  searchPrev,
  saveResult,
  executeQuery,
  getResults,
  clearResults,
  deleteDB,
  toAcomodation,
} = useLodging();

const menuLinks = [
  {
    name: "index",
    displayName: "Inicio",
    id: "home-logged-banner",
  },
  {
    name: "lodging",
    displayName: "alojamientos",
    id: "home-logged-banner",
  },
];
const isModalActive = ref(false);
const lodgingOpened = ref(false);
const defaultFlagImgPath = "img/flags/";
const todosTipo = ref<unknown[]>([]);
const selectedLodgingDestinyValue = ref("");
const selectedRoomLayout = ref(null);
const selectedStartDate = ref(new Date(moment().add(4, "days")));
const selectedEndDate = ref(new Date(moment().add(7, "days")));
const selectedNationality = ref(null);
const destinies = ref<unknown[]>([]);
const selectedNights = ref(3);
const roomComb = ref<unknown>(null);
const roomLayout = [
  {
    code: "adults",
    label: "Adultos",
    display: "Adulto(s)",
    default: 1,
  },
  {
    code: "kids",
    label: "Niños",
    display: "Niño(s)",
    default: 0,
  },
];
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

const minStartDate = computed(() => {
  return moment().add(4, "days").format("YYYY-MM-DD");
});

const minEndDate = computed(() => {
  let minEndDateVal = moment().add(7, "days").format("YYYY-MM-DD");
  if (selectedStartDate.value) {
    minEndDateVal = moment(selectedStartDate.value)
      .add(selectedNights.value, "days")
      .format("YYYY-MM-DD");
  }
  return minEndDateVal;
});

watch(selectedEndDate, () => {
  let n = moment(selectedEndDate.value).diff(selectedStartDate.value, "days");
  selectedNights.value = n;
});

watch(selectedStartDate, (item) => {
  selectedNights.value = 3;
  selectedEndDate.value = moment(item)
    .add(selectedNights.value, "days")
    .toDate();
  let n = moment(selectedEndDate.value).diff(selectedStartDate.value, "days");
  selectedNights.value = n;
});

watch(selectedNights, (item) => {
  selectedEndDate.value = new Date(
    moment(selectedStartDate.value).add(item, "days"),
  );
});

async function performSearch(query: Record<string, unknown>) {
  const res = await executeQuery(query);
  return res;
}

function gttValidate() {
  let validator = [
    {
      rules: ["required"],
      name: "gttDestinyLodging",
      value: selectedLodgingDestinyValue.value,
      lang: "es",
    },
    {
      rules: ["required", "dateAfter:selectedStartDate"],
      name: "gttEndDate",
      value: selectedEndDate.value,
      lang: "es",
    },
    {
      rules: ["required"],
      name: "gttStartDate",
      value: selectedStartDate.value,
      lang: "es",
    },
  ];
  return validator;
}

async function loadDestinies() {
  if (lodgingOpened.value == true) {
    let totalResult: unknown[] = [];
    let l = await authGetHotelList();
    l.data.forEach(
      (i: { Nombre: unknown; IdObjeto: unknown; TipoObjeto: unknown }) => {
        totalResult = totalResult.concat({
          nombre: i.Nombre,
          id: i.IdObjeto,
          type: i.TipoObjeto,
        });
      },
    );
    destinies.value = totalResult;
  }
}

function handleLodgingClose() {
  lodgingOpened.value = false;
}

function handleScroll() {
  const el = document.getElementById("home-logged-banner");
  if (!el) return;
  let height = window.innerHeight;
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo("lodging");
  }
}

function getRefsProxy() {
  return {
    $refs: {
      gttDestinyLodging: gttDestinyLodging.value,
      gttStartDate: gttStartDate.value,
      gttEndDate: gttEndDate.value,
    },
    $children: [],
  };
}

async function activateModal() {
  let iv = gttIsValid(gttValidate(), getRefsProxy());
  if (getValid(iv)) {
    isModalActive.value = true;
    await clearResults();
    if (selectedLodgingDestinyValue.value.type == "RGN") {
      if (import.meta.env.DEV) {
        console.log("RGN");
      }
      let region = {
        RegionId: selectedLodgingDestinyValue.value.id,
      };
      let cliente = { ClienteId: localStorage.getItem("cliente") };
      let searchItem = {
        Entrada: selectedStartDate.value,
        Salida: selectedEndDate.value,
        Region: region,
        Cliente: cliente,
      };
      let searchFilters = {
        Destiny: selectedLodgingDestinyValue.value,
        Region: {
          RegionId: selectedLodgingDestinyValue.value.id,
          RegionNombre: selectedLodgingDestinyValue.value.nombre,
        },
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: selectedStartDate.value,
        Salida: selectedEndDate.value,
        Visitantes: selectedRoomLayout.value,
        Nacionalidad: selectedNationality.value,
      };
      let resultList: unknown[] = [];
      try {
        if (
          searchFilters.Visitantes.adults.value >=
          searchFilters.Visitantes.kids.value
        ) {
          roomComb.value = helpers.roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        } else {
          roomComb.value = helpers.roomCombination2kids(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        }
        let roomComb2 = helpers.roomCombinationV2(
          searchFilters.Visitantes.adults.value,
          searchFilters.Visitantes.kids.value || 0,
        );
        if (roomComb.value != "ERROR") {
          resultList = await search(
            searchItem,
            roomComb.value,
            roomComb2,
            todosTipo.value,
            helpers,
          );
          localStorage.setItem(
            "searchLodgingFilters",
            JSON.stringify(searchFilters),
          );
          desactivateModal();
          router.push({
            name: "resultLodging",
            params: {
              searchResult: resultList,
            },
          });
        } else {
          desactivateModal();
          toast("Demasiados niños", {
            type: "error",
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.log(error);
        }
        desactivateModal();
        toast("El servicio no está disponible en estos momentos", {
          type: "error",
        });
      }
    } else if (selectedLodgingDestinyValue.value.type == "HTL") {
      if (import.meta.env.DEV) {
        console.log("HTL");
      }
      let searchFilters = {
        Destiny: selectedLodgingDestinyValue.value,
        NombreHotel: selectedLodgingDestinyValue.value.nombre,
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: selectedStartDate.value,
        Salida: selectedEndDate.value,
        Visitantes: selectedRoomLayout.value,
        Nacionalidad: selectedNationality.value,
      };
      try {
        if (
          searchFilters.Visitantes.adults.value >=
          searchFilters.Visitantes.kids.value
        ) {
          roomComb.value = helpers.roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        } else {
          roomComb.value = helpers.roomCombination2kids(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        }
        if (roomComb.value != "ERROR") {
          goToDetail(
            searchFilters,
            roomComb.value,
            selectedLodgingDestinyValue.value.id,
          );
        } else {
          desactivateModal();
          toast("Demasiados niños", {
            type: "error",
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.log(error);
        }
        desactivateModal();
        toast("El servicio no está disponible en estos momentos", {
          type: "error",
        });
      }
    }
  } else {
    renderValid(iv, getRefsProxy());
  }
}

function goToDetail(f: unknown, a: unknown, id: unknown) {
  localStorage.setItem("searchLodgingFilters", JSON.stringify(f));
  localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));
  router.push({
    name: "lodging-detail",
    params: {
      id: id,
    },
  });
}

function desactivateModal() {
  isModalActive.value = false;
}

function constructDisplayNights(n: number) {
  if (n == 1) {
    return `1 noche`;
  }
  return `${n} noches`;
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

onMounted(async () => {
  searchCountriesPlaceholder();
  window.addEventListener("scroll", handleScroll);
  let t = await authGetRoomTypes();
  todosTipo.value = t.data;
  await clearResults();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
#home-logged-banner {
  margin-top: 60px;
  width: 100%;
  min-height: 750px;
  position: relative;
}

#home-logged-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lodging-text-form {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lodging-form {
  width: 480px;
  max-width: 90vw;
  background-color: #ffffff;
  box-shadow: var(--ds-shadow-card);
  border-radius: var(--ds-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lodging-form :deep(.form-field-label) {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ds-text-primary);
  margin-bottom: 6px;
}

.lodging-form :deep(.form-field-label .required) {
  color: var(--ds-accent);
}

.lodging-text {
  display: none;
}

.selects-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.nights-row {
  width: 100%;
}

.form-actions {
  margin-top: 4px;
}

.form-actions button {
  width: 100%;
  height: 44px;
  background-color: var(--ds-accent);
  color: #ffffff;
  border: none;
  border-radius: var(--ds-radius-md);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-actions button:hover {
  background-color: var(--ds-accent-hover);
}

.form-actions button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

@media (max-width: 1440px) {
  #home-logged-banner {
    min-height: auto;
  }

  .lodging-text-form {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    padding: 20px;
    justify-content: center;
  }

  .lodging-form {
    width: 100%;
    max-width: 480px;
    padding: 20px;
    gap: 16px;
  }

  .selects-inline {
    gap: 12px;
  }
}
</style>
