<template>
  <div id="index-logged-transfer">
    <div class="home-logged-transfer-img">
      <img src="/img/homelogin_img_form_traslados.jpg" alt="Traslados" />
    </div>
    <div class="custom-text-form custom-margin">
      <div class="custom-text antonio-light">
        <span class="bannerText">Las mejores ofertas en </span
        ><span class="yellow-words antonio-bold">traslados</span>
      </div>
      <div class="custom-form">
        <div class="selects-inline">
          <gtt-select
            :options="pickUpDeliveryOptions"
            class="cleft"
            v-model="selectedPickUpPlace"
          >
            <template #iconSelectedValue><i class="mdi mdi-map-marker"></i></template>
            <template #placeholder>Punto de origen</template>
            <template #selectedPlaceholder>Salimos desde el:</template>
          </gtt-select>
          <gtt-select
            :options="pickUpDeliveryOptions"
            v-model="selectedDestinyPlace"
          >
            <template #iconSelectedValue><i class="mdi mdi-map-marker"></i></template>
            <template #placeholder>Punto de destino</template>
            <template #selectedPlaceholder>Nos dirigimos hasta:</template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <gtt-select-date
            v-model="selectedDepartureDate"
            :mode="'single'"
            class="minor-left single-date-transfer"
          >
            <template #iconSelectedValue><i class="mdi mdi-calendar-today"></i></template>
            <template #placeholder>Fecha de salida</template>
          </gtt-select-date>
          <div class="date-select">
            <label for="hora-regreso" class="input-label small">
              Hora
            </label>
            <input
              type="time"
              v-model="departureTime"
              class="form-control"
            />
          </div>
          <gtt-select-date
            v-model="selectedArrivalDate"
            :mode="'single'"
            class="minor-left single-date-transfer"
          >
            <template #iconSelectedValue><i class="mdi mdi-calendar-today"></i></template>
            <template #placeholder>Fecha de regreso</template>
          </gtt-select-date>

          <div class="date-select">
            <label for="hora-regreso" class="input-label small">
              Hora
            </label>
            <input
              type="time"
              v-model="arrivalTime"
              class="form-control"
            />
          </div>
        </div>
        <div class="selects-inline">
          <gtt-select-form
            :options="passengersLayout"
            class="cleft"
            v-model="selectedPassengers"
          >
            <template #iconSelectedValue><i class="mdi mdi-account"></i></template>
            <template #placeholder>Pasajeros</template>
          </gtt-select-form>
          <gtt-select-form :options="luggagesLayout" v-model="selectedLuggages">
            <template #iconSelectedValue><i class="mdi mdi-bag-personal"></i></template>
            <template #placeholder>Equipaje</template>
          </gtt-select-form>
        </div>
        <div class="selects-inline">
          <gtt-select
            :options="journeyTypes"
            v-model="selectedJourneyType"
            class="cleft custom-width-select"
          >
            <template #iconSelectedValue><i class="mdi mdi-transit-transfer"></i></template>
            <template #placeholder>Tipo de trayecto</template>
            <template #selectedPlaceholder>¿ida y vuelta?</template>
          </gtt-select>
          <gtt-select
            :options="transferTypes"
            v-model="selectedTransferType"
            class="cleft custom-width-select"
          >
            <template #iconSelectedValue><i class="mdi mdi-bus-side"></i></template>
            <template #placeholder>Tipo de traslado</template>
            <template #selectedPlaceholder>¿Compartido?</template>
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
      </div>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttSelectForm from "../custom-elements/GttSelectForm";
import { scrollStore } from "../../stores/scrollStore";

export default {
  components: {
    GttSelect,
    GttSelectDate,
    GttSelectForm
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      let height = window.innerHeight;
      if (
        height * 0.25 > this.$el.getBoundingClientRect().top &&
        this.$el.getBoundingClientRect().top > 0
      ) {
        scrollStore.scrollTo("transfer");
      }
    },
    activateModal() {
      this.$toasted.show(
        "La búsqueda de traslados estará disponible próximamente.",
        { type: "info" }
      );
    }
  },
  data() {
    return {
      arrivalTime: "",
      departureTime: "",
      selectedPickUpPlace: "",
      selectedDestinyPlace: "",
      selectedDepartureDate: null,
      selectedDepartureHour: null,
      selectedArrivalDate: null,
      selectedArrivalHour: null,
      selectedPassengers: null,
      selectedLuggages: null,
      selectedJourneyType: null,
      selectedTransferType: null,
      journeyTypes: ["Ida y regreso", "Solo ida"],
      transferTypes: ["Compartido", "Privado"],
      pickUpDeliveryOptions: [
        "Aeropuerto Internacional",
        "Blau Varadero Hotel Cuba",
        "Iberostar Selection Varadero",
        "Royalton Hicacos Varadero Resort & Spa",
        "Sanctuary at Grand Memories Varadero"
      ],
      passengersLayout: [
        {
          code: "adults",
          label: "Adultos",
          display: "Adulto(s)",
          default: 1
        },
        {
          code: "kids",
          label: "Niños",
          display: "Niño(s)",
          default: 0
        }
      ],
      luggagesLayout: [
        {
          code: "big_bag",
          label: "Equipaje grande",
          display: "Equipaje(s) grande",
          default: 0
        },
        {
          code: "small_bag",
          label: "Equipaje pequeño",
          display: "Pequeño",
          default: 0
        }
      ]
    };
  }
};
</script>

<style scoped>
#index-logged-transfer {
  position: relative;
  width: 100%;
  /* height: 750px; */
}
#index-logged-transfer img {
  width: 100%;
}
.minor-left {
  margin-right: 0.5%;
}
#index-logged-transfer .single-date-transfer {
  width: 11.06vw;
}
#index-logged-transfer .hour {
  width: 6.5vw;
}

.custom-width-select {
  width: 10.42vw;
}

.form-actions {
  margin-left: auto;
}
.custom-text {
  margin-top: 100px;
}
@media (max-width: 1440px) {
  #index-logged-transfer .single-date-transfer {
    width: 30%;
  }
  #index-logged-transfer .hour {
    width: 20%;
  }
  .custom-width-select {
    width: 30%;
  }
}

.date-select {
  display: flex;
  position: relative;

  width: 20%;
  padding-right: 2px;
}
.input-label {
  position: absolute;
  top: 0px;
  left: 25px;
  z-index: 10;
}

.time-picker {
  width: 100%;
  padding: 2px;
  border: 1px solid #c4c4c4;
  height: 50px;
  border-radius: 5px;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: 16px;
  cursor: pointer;

  top: 0px;
}

.display-time:focus-visible {
  outline: none;
}
</style>
