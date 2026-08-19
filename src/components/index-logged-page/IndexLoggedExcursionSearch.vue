<template>
  <div id="index-logged-excursion-search">
    <div class="home-logged-excursion-img">
      <img
        src="/img/homelogin_img_form_actividades.jpg"
        alt="Excursiones y actividades"
      />
    </div>
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <template v-slot:image>
        <div>
          <img src="/img/icopaq_excursiones_color.svg" alt="" />
        </div>
      </template>
      <template v-slot:searching-text>
        <div class="searching-text">
          <span class="antonio-light">Buscando disponibilidad de </span
          ><span class="antonio-bold text-highlight">excursiones</span>
          <span class="antonio-light"
            >en <span v-if="selectedDestiny">{{ selectedDestiny }}</span
            ><span v-else>cualquier lugar</span></span
          >
        </div>
      </template>
      <template v-slot:searching-fields>
        <div class="searching-fields">
          <div v-if="selectedDate">
            para el {{ constructDate(selectedDate) }}
          </div>
          <div v-if="selectedPassengers">
            para {{ constructDisplay(selectedPassengers) }}
          </div>
        </div>
      </template>
    </GttModalSearch>
    <div class="custom-text-form custom-margin">
      <div class="custom-form">
        <div class="selects-inline">
          <gtt-select
            :options="pickUpDeliveryOptions"
            class="custom-width-big"
            v-model="selectedDestiny"
            :alignLeft="true"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-map-marker"></i>
            </template>
            <template v-slot:placeholder>
              <span> Destino</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span> ¿A dónde deseas ir?</span>
            </template>
          </gtt-select>
          <gtt-select
            :options="activityTypes"
            class="custom-width-small"
            v-model="selectedActivityType"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-brightness-4"></i>
            </template>
            <template v-slot:placeholder>
              <span> Tipo de actividad</span>
            </template>
            <template v-slot:selectedPlaceholder>
              <span> ¿Compartida?</span>
            </template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <gtt-select-date
            v-model="selectedDate"
            :mode="'single'"
            class="cleft"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-calendar-today"></i>
            </template>
            <template v-slot:placeholder>
              <span> Fecha </span>
            </template>
          </gtt-select-date>
          <gtt-select-form
            :options="passengersLayout"
            v-model="selectedPassengers"
          >
            <template v-slot:iconSelectedValue>
              <i class="mdi mdi-account"></i>
            </template>
            <template v-slot:placeholder>
              <span> Pasajeros</span>
            </template>
          </gtt-select-form>
        </div>
        <div class="selects-inline">
          <gtt-select
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
              <span> Salimos desde el:</span>
            </template>
          </gtt-select>
          <gtt-select
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
              <span> Te recogemos en el:</span>
            </template>
          </gtt-select>
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
      <div class="custom-text antonio-light">
        <span class="bannerText">Tu mejor plan en </span
        ><span class="yellow-words antonio-bold"
          >Excursiones y actividades</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectForm from "../custom-elements/GttSelectForm.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";
import moment from "moment";
import {
  constructDate,
  constructDisplay,
  calculateNights,
} from "../../utils/utils";

const isModalActive = ref(false);
const selectedPickUpPlace = ref("");
const selectedDeliveryPlace = ref("");
const selectedDestiny = ref("");
const selectedActivityType = ref("");
const selectedDate = ref(moment());
const selectedPassengers = ref(null);
const activityTypes = ["Compartida", "Privada"];
const pickUpDeliveryOptions = [
  "Aeropuerto Internacional",
  "Blau Varadero Hotel Cuba",
  "Iberostar Selection Varadero",
  "Royalton Hicacos Varadero Resort & Spa",
  "Sanctuary at Grand Memories Varadero",
];
const passengersLayout = [
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

function activateModal() {
  isModalActive.value = true;
}

function desactivateModal() {
  isModalActive.value = false;
}
</script>

<style scoped>
#index-logged-excursion-search {
  position: relative;
  width: 100%;
  /* height: 750px; */
}
#index-logged-excursion-search img {
  width: 100%;
}
.minor-left {
  margin-right: 0.5%;
}
.custom-width-big {
  width: 22.96vw;
}
.custom-width-small {
  width: 12.7vw;
}
.custom-text {
  text-align: left;
  margin-left: 30px;
}

@media (max-width: 1440px) {
  .custom-width-big {
    width: 65%;
  }
  .custom-width-small {
    width: 35%;
  }
}
</style>
