<template>
  <div id="index-logged-transfer">
    <div class="home-logged-transfer-img">
      <img src="/img/homelogin_img_form_traslados.jpg" alt="Traslados" />
    </div>
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <div slot="image">
        <img src="/img/icopaq_traslado_color.svg" alt="" />
      </div>
      <div slot="searching-text" class="searching-text">
        <span class="antonio-light">Buscando disponibilidad de </span
        ><span class="antonio-bold text-highlight">traslados </span>
        <span class="antonio-light"
          >en <span v-if="selectedDestinyPlace">{{ selectedDestinyPlace }}</span
          ><span v-else>cualquier lugar</span></span
        >
      </div>
      <div slot="searching-fields" class="searching-fields">
        <div v-if="selectedDepartureDate && selectedArrivalDate">
          entre el {{ constructDate(selectedDepartureDate) }} y el
          {{ constructDate(selectedArrivalDate) }}
        </div>
        <div v-if="selectedPassengers">
          para {{ constructDisplay(selectedPassengers) }}
        </div>
      </div>
    </GttModalSearch>
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
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder"> Punto de origen</span>
            <span slot="selectedPlaceholder"> Salimos desde el:</span>
          </gtt-select>
          <gtt-select
            :options="pickUpDeliveryOptions"
            v-model="selectedDestinyPlace"
          >
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder"> Punto de destino</span>
            <span slot="selectedPlaceholder"> Nos dirigimos hasta:</span>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <gtt-select-date
            v-model="selectedDepartureDate"
            :mode="'single'"
            class="minor-left single-date-transfer"
          >
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder"> Fecha de salida</span>
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
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder">Fecha de regreso</span>
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
            <i slot="iconSelectedValue" class="mdi mdi-account"></i>
            <span slot="placeholder"> Pasajeros</span>
          </gtt-select-form>
          <gtt-select-form :options="luggagesLayout" v-model="selectedLuggages">
            <i slot="iconSelectedValue" class="mdi mdi-bag-personal"></i>
            <span slot="placeholder">Equipaje</span>
          </gtt-select-form>
        </div>
        <div class="selects-inline">
          <gtt-select
            :options="journeyTypes"
            v-model="selectedJourneyType"
            class="cleft custom-width-select"
          >
            <i slot="iconSelectedValue" class="mdi mdi-transit-transfer"></i>
            <span slot="placeholder"> Tipo de trayecto</span>
            <span slot="selectedPlaceholder"> ¿ida y vuelta?</span>
          </gtt-select>
          <gtt-select
            :options="transferTypes"
            v-model="selectedTransferType"
            class="cleft custom-width-select"
          >
            <i slot="iconSelectedValue" class="mdi mdi-bus-side"></i>
            <span slot="placeholder"> Tipo de traslado</span>
            <span slot="selectedPlaceholder"> ¿Compartido?</span>
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"
import GttSelect from "../custom-elements/GttSelect.vue"
import GttSelectDate from "../custom-elements/GttSelectDate.vue"
import GttSelectForm from "../custom-elements/GttSelectForm.vue"
import GttModalSearch from "../custom-elements/GttModalSearch.vue"
import moment from "moment"
import { constructDate, constructDisplay } from "../../utils/utils"
import { useScrollStore } from "../../stores/scrollStore"
import { getValid, renderValid, gttIsValid } from "../../utils/validation"

const router = useRouter()

const arrivalTime = ref("")
const departureTime = ref("")
const isModalActive = ref(false)
const selectedPickUpPlace = ref("")
const selectedDestinyPlace = ref("")
const selectedDepartureDate = ref(moment())
const selectedDepartureHour = ref(null)
const selectedArrivalDate = ref(moment().add(1, "days"))
const selectedArrivalHour = ref(null)
const selectedPassengers = ref(null)
const selectedLuggages = ref(null)
const selectedJourneyType = ref(null)
const selectedTransferType = ref(null)
const journeyTypes = ["Ida y regreso", "Solo ida"]
const transferTypes = ["Compartido", "Privado"]
const pickUpDeliveryOptions = [
  "Aeropuerto Internacional",
  "Blau Varadero Hotel Cuba",
  "Iberostar Selection Varadero",
  "Royalton Hicacos Varadero Resort & Spa",
  "Sanctuary at Grand Memories Varadero"
]
const passengersLayout = [
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
]
const luggagesLayout = [
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

function handleScroll() {
  const el = document.getElementById("index-logged-transfer")
  if (!el) return
  let height = window.innerHeight
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo("transfer")
  }
}

/* TODO: llamada a la api */
async function activateModal() {
  //let iv = gttIsValid(this.gttValidate());  getValid(iv
  if (true) {
    try {
      isModalActive.value = true
      if (import.meta.env.DEV) { console.log(iv) }
      /* let { data } = await authSearchCars(searchItem); */
      desactivateModal()
      router.push({
        name: "resultRent",
        params: {
          searchResult: resultList
        }
      })
    } catch (error) {
      if (import.meta.env.DEV) { console.log(error) }
      desactivateModal()
      toast("El servicio no está disponible en estos momentos", {
        type: "error"
      })
    }
  } else {
    renderValid(iv)
  }
}

function desactivateModal() {
  isModalActive.value = false
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
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
