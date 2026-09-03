<template>
  <div id="lodging-form">
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
            <span v-if="selectedLodgingDestinyValue">
              {{ selectedLodgingDestinyValue.nombre }}
            </span>
            <span v-else>cualquier lugar</span>
          </span>
        </div>
      </template>
      <template v-slot:searching-fields>
        <div class="searching-fields">
          <div>
            entre el {{ constructDate(selectedArriveDate) }} y el
            {{ constructDate(selectedDepartureDate) }} ({{
              calculateNights(selectedArriveDate, selectedDepartureDate)
            }}
            noches)
          </div>
          <div v-if="selectedRoomLayout">
            para {{ constructDisplay(selectedRoomLayout) }}
          </div>
        </div>
      </template>
    </GttModalSearch>
    <div ref="gttDestinyLodging">
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
          <span class="required-field">Destino</span>
        </template>
        <template v-slot:selectedPlaceholder>
          <span>¿Dónde desea alojarse?</span>
        </template>
        <template v-slot:option="option">{{ option.option.nombre }}</template>
        <template v-slot:selectedValue="selectedValue">{{
          selectedValue.selectedValue.nombre
        }}</template>
        <template v-slot:error>
          <span class="gtt-errors"></span>
        </template>
      </gtt-select>
    </div>
    <div ref="gttStartDate">
      <gtt-select-date
        v-model="selectedArriveDate"
        :min-date="minArriveDate"
        :mode="'single'"
      >
        <template v-slot:iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template v-slot:placeholder>
          <span class="required-field">Fecha de entrada</span>
        </template>
        <template v-slot:error>
          <span class="gtt-errors"></span>
        </template>
      </gtt-select-date>
    </div>
    <div ref="gttEndDate">
      <gtt-select-date
        v-model="selectedDepartureDate"
        :min-date="minDepartureDate"
        :mode="'single'"
      >
        <template v-slot:iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template v-slot:placeholder>
          <span class="required-field">Fecha de salida</span>
        </template>
        <template v-slot:error>
          <span class="gtt-errors"></span>
        </template>
      </gtt-select-date>
    </div>
    <gtt-select-form :options="roomLayout" v-model="selectedRoomLayout">
      <template v-slot:iconSelectedValue>
        <span>
          <i class="mdi mdi-account"></i>
        </span>
      </template>
      <template v-slot:placeholder>
        <span class="required-field">Visitantes</span>
      </template>
    </gtt-select-form>
    <!-- <gtt-select-form :options="rooms" v-model="selectedRooms">
            <span slot="iconSelectedValue"><i class="mdi mdi-bunk-bed"></i></span>
            <span slot="placeholder">Habitaciones</span>
    </gtt-select-form>-->
    <!-- <gtt-select :options="countries" v-model="selectedNationality">
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
    </gtt-select> -->
    <div class="form-actions lodging-form-search-btn">
      <button
        v-if="hasSearchResults"
        type="submit"
        class="antonio-regular regresar"
        @click="returnToPreviousSearch"
      >
        Regresar
      </button>
      <button type="submit" class="antonio-regular" @click="activateModal">
        Buscar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import GttSelectForm from "../custom-elements/GttSelectForm.vue";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";
import {
  authSearchRegions,
  authGetRoomTypes,
  authGetLodgingsAll,
  authGetHotelList,
} from "../../utils/auth";
import {
  constructDate,
  calculateNights,
  constructDisplay,
} from "../../utils/utils";
import { useLodging } from "../../composables/useLodging";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import type { ValidationContext } from "../../utils/validation";
import { helpers } from "../../utils/helpers";
import moment from "moment";

const $helpers = helpers;
const router = useRouter();
const route = useRoute();

const gttDestinyLodging = ref<HTMLElement | null>(null);
const gttStartDate = ref<HTMLElement | null>(null);
const gttEndDate = ref<HTMLElement | null>(null);

function getValidationContext(): ValidationContext {
  return {
    $refs: {
      gttDestinyLodging: gttDestinyLodging.value,
      gttStartDate: gttStartDate.value,
      gttEndDate: gttEndDate.value,
    },
    selectedArriveDate: selectedArriveDate.value,
  };
}

const {
  searchResult,
  searchPrev,
  searchPreviousResult,
  getResults,
  clearResults,
  roomCombination,
  buildCombo,
  buildRoomCombo,
  toAcomodation,
} = useLodging();

const props = defineProps<{
  propLodgingDestinyValue?: any;
  propArriveDate?: any;
  propDepartureDate?: any;
  propRoomLayout?: any;
  propNationality?: any;
}>();

const selectedLodgingDestinyValue = ref(props.propLodgingDestinyValue);
const selectedArriveDate = ref(new Date(moment(props.propArriveDate)));
const selectedDepartureDate = ref(new Date(moment(props.propDepartureDate)));
const selectedRoomLayout = ref<any>(null);
const selectedNationality = ref(props.propNationality);
const selectedNights = ref(3);
const roomComb = ref<any>(null);
const todosTipo = ref<any[]>([]);
const hasSearchResults = ref(false);
const isModalActive = ref(false);
const lodgingOpened = ref(false);
const destinies = ref<any[]>([]);
const defaultFlagImgPath = ref("img/flags/");
const roomLayout = ref([
  { code: "adults", label: "Adultos", display: "Adulto(s)", default: 1 },
  { code: "kids", label: "Niños", display: "Niño(s)", default: 0 },
]);
const countries = ref([
  { nombre: "Afganistán", flag: "flag_afganistan.jpg" },
  { nombre: "Albania", flag: "flag_albania.jpg" },
  { nombre: "Alemania", flag: "flag_alemania.jpg" },
  { nombre: "Estados Unidos", flag: "flag_estadosunidos.jpg" },
]);

const minArriveDate = computed(() =>
  moment().add(4, "days").format("YYYY-MM-DD"),
);

const minDepartureDate = computed(() => {
  let minDepartureDate = moment().add(7, "days").format("YYYY-MM-DD");
  if (selectedArriveDate.value) {
    minDepartureDate = moment(selectedArriveDate.value)
      .add(selectedNights.value, "days")
      .format("YYYY-MM-DD");
  }
  return minDepartureDate;
});

watch(
  () => props.propNationality,
  (sn: any) => {
    selectedNationality.value = sn;
  },
);

watch(
  () => props.propArriveDate,
  (i: any) => {
    if (i) selectedArriveDate.value = new Date(i);
  },
);

watch(
  () => props.propDepartureDate,
  (i: any) => {
    if (i) selectedDepartureDate.value = new Date(i);
  },
);

watch(
  () => props.propLodgingDestinyValue,
  (i: any) => {
    selectedLodgingDestinyValue.value = i;
  },
);

watch(selectedArriveDate, (i: any) => {
  if (i && moment(i).isAfter(selectedDepartureDate.value)) {
    selectedNights.value = 3;
    selectedDepartureDate.value = moment(i)
      .add(selectedNights.value, "days")
      .toDate();
    let n = moment(selectedDepartureDate.value).diff(
      selectedArriveDate.value,
      "days",
    );
    selectedNights.value = n;
  }
});

watch(selectedDepartureDate, (i: any) => {
  let n = moment(selectedDepartureDate.value).diff(
    selectedArriveDate.value,
    "days",
  );
  selectedNights.value = n;
});

watch(selectedNights, (i: number) => {
  selectedDepartureDate.value = new Date(
    moment(selectedArriveDate.value).add(i, "days"),
  );
});

onMounted(async () => {
  let t = await authGetRoomTypes();
  todosTipo.value = t.data;
  selectedRoomLayout.value = props.propRoomLayout;
  getResults().then((res: any) => {
    if (import.meta.env.DEV) {
      console.log("getResults", res);
    }
    if (
      Array.isArray(res) &&
      res.length > 0 &&
      route.name === "lodging-detail"
    ) {
      hasSearchResults.value = true;
    }
  });
});

function goToDetail(f: any, a: any, id: any) {
  const currentRoute = route;
  localStorage.setItem("searchLodgingFilters", JSON.stringify(f));
  localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));
  if (currentRoute.params.id != parseInt(id)) {
    router.push({ name: "lodging-detail", params: { id } });
  } else {
    router.go(0);
    router.push({ name: "lodging-detail", params: { id } });
  }
}

function gttValidate() {
  return [
    {
      rules: ["required"],
      name: "gttDestinyLodging",
      value: selectedLodgingDestinyValue.value,
      lang: "es",
    },
    {
      rules: ["required", "dateAfter:selectedArriveDate"],
      name: "gttEndDate",
      value: selectedDepartureDate.value,
      lang: "es",
    },
    {
      rules: ["required"],
      name: "gttStartDate",
      value: selectedArriveDate.value,
      lang: "es",
    },
  ];
}

async function returnToPreviousSearch() {
  let searchFilters = {
    Destiny: selectedLodgingDestinyValue.value,
    Region: {
      RegionId: selectedLodgingDestinyValue.value.id,
      RegionNombre: selectedLodgingDestinyValue.value.nombre,
    },
    Cliente: { ClienteId: localStorage.getItem("cliente") },
    Entrada: selectedArriveDate.value,
    Salida: selectedDepartureDate.value,
    Visitantes: selectedRoomLayout.value,
    Nacionalidad: selectedNationality.value,
  };
  let resultList = await searchPreviousResult();
  localStorage.setItem("searchLodgingFilters", JSON.stringify(searchFilters));
  if (import.meta.env.DEV) {
    console.log("desactivateModal");
  }
  desactivateModal();
  router.push({
    name: "lodgingResultHolder",
    params: { searchResult: resultList },
  });
}

async function activateModal() {
  let iv = gttIsValid(gttValidate(), getValidationContext());
  if (getValid(iv)) {
    isModalActive.value = true;
    await clearResults();
    if (selectedLodgingDestinyValue.value.type == "RGN") {
      console.info("RGN");
      let region = { RegionId: selectedLodgingDestinyValue.value.id };
      let cliente = { ClienteId: localStorage.getItem("cliente") };
      let searchItem = {
        Entrada: selectedArriveDate.value,
        Salida: selectedDepartureDate.value,
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
        Entrada: selectedArriveDate.value,
        Salida: selectedDepartureDate.value,
        Visitantes: selectedRoomLayout.value,
        Nacionalidad: selectedNationality.value,
      };
      let resultList: any[] = [];
      try {
        if (
          searchFilters.Visitantes.adults.value >=
          searchFilters.Visitantes.kids.value
        ) {
          roomComb.value = roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        } else {
          roomComb.value = roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        }
        let roomComb2 = roomCombination(
          searchFilters.Visitantes.adults.value,
          searchFilters.Visitantes.kids.value || 0,
        );
        if (roomComb.value != "ERROR") {
          resultList = await searchResult(
            searchItem,
            roomComb.value,
            roomComb2,
          );
          localStorage.setItem(
            "searchLodgingFilters",
            JSON.stringify(searchFilters),
          );
          if (import.meta.env.DEV) {
            console.log("desactivateModal");
          }
          desactivateModal();
          router.push({
            name: "lodgingResultHolder",
            params: { searchResult: resultList },
          });
        } else {
          desactivateModal();
          toast("Demasiados niños", { type: "error" });
        }
      } catch (error) {
        desactivateModal();
        toast("El servicio no está disponible en estos momentos", {
          type: "error",
        });
      }
    } else if (selectedLodgingDestinyValue.value.type == "HTL") {
      let searchFilters = {
        Destiny: selectedLodgingDestinyValue.value,
        NombreHotel: selectedLodgingDestinyValue.value.nombre,
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: selectedArriveDate.value,
        Salida: selectedDepartureDate.value,
        Visitantes: selectedRoomLayout.value,
        Nacionalidad: selectedNationality.value,
      };
      try {
        if (
          searchFilters.Visitantes.adults.value >=
          searchFilters.Visitantes.kids.value
        ) {
          roomComb.value = roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        } else {
          roomComb.value = roomCombination(
            searchFilters.Visitantes.adults.value,
            searchFilters.Visitantes.kids.value || 0,
          );
        }
        if (roomComb.value != "ERROR") {
          goToDetail(
            searchFilters,
            buildRoomCombo(roomComb.value),
            selectedLodgingDestinyValue.value.id,
          );
        } else {
          desactivateModal();
          toast("Demasiados niños", { type: "error" });
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
    renderValid(iv, getValidationContext());
  }
}

function desactivateModal() {
  isModalActive.value = false;
}

async function loadDestinies() {
  if (lodgingOpened.value == true) {
    let totalResult: any[] = [];
    let l = await authGetHotelList();
    l.data.forEach((i: any) => {
      totalResult = totalResult.concat({
        nombre: i.Nombre,
        id: i.IdObjeto,
        type: i.TipoObjeto,
      });
    });
    destinies.value = totalResult;
  }
}

function searchCountriesPlaceholder() {
  let usa = countries.value.find((el: any) => el.value == "Estados Unidos");
  if (usa) return usa;
  return countries.value[0];
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
#lodging-form .gtt__toggle {
  margin-bottom: 15px;
}
.antonio-regular.regresar {
  margin-right: 14px;
}
</style>
