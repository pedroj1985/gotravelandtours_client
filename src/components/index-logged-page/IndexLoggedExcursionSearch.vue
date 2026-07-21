<template>
  <div id="index-logged-excursion-search">
    <div class="home-logged-excursion-img">
      <img src="/img/homelogin_img_form_actividades.jpg" alt="Excursiones y actividades" />
    </div>
    <div class="custom-text-form custom-margin">
      <div class="custom-form">
        <div class="selects-inline">
          <gtt-select
            :options="pickUpDeliveryOptions"
            class="custom-width-big"
            v-model="selectedDestiny"
            :alignLeft="true"
          >
            <template #iconSelectedValue><i class="mdi mdi-map-marker"></i></template>
            <template #placeholder> Destino</template>
            <template #selectedPlaceholder> ¿A dónde deseas ir?</template>
          </gtt-select>
          <gtt-select
            :options="activityTypes"
            class="custom-width-small"
            v-model="selectedActivityType"
          >
            <template #iconSelectedValue><i class="mdi mdi-brightness-4"></i></template>
            <template #placeholder> Tipo de actividad</template>
            <template #selectedPlaceholder> ¿Compartida?</template>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <gtt-select-date
            v-model="selectedDate"
            :mode="'single'"
            class="cleft"
          >
            <template #iconSelectedValue><i class="mdi mdi-calendar-today"></i></template>
            <template #placeholder>
              Fecha
            </template>
          </gtt-select-date>
          <gtt-select-form
            :options="passengersLayout"
            v-model="selectedPassengers"
          >
            <template #iconSelectedValue><i class="mdi mdi-account"></i></template>
            <template #placeholder> Pasajeros</template>
          </gtt-select-form>
        </div>
        <div class="selects-inline">
          <gtt-select
            :options="pickUpDeliveryOptions"
            class="cleft"
            v-model="selectedPickUpPlace"
          >
            <template #iconSelectedValue><i class="mdi mdi-map-marker"></i></template>
            <template #placeholder> Punto de recogida</template>
            <template #selectedPlaceholder> Salimos desde el:</template>
          </gtt-select>
          <gtt-select
            :options="pickUpDeliveryOptions"
            v-model="selectedDeliveryPlace"
          >
            <template #iconSelectedValue><i class="mdi mdi-map-marker"></i></template>
            <template #placeholder> Punto de entrega</template>
            <template #selectedPlaceholder> Te recogemos en el:</template>
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

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectForm from "../custom-elements/GttSelectForm";
import GttSelectDate from "../custom-elements/GttSelectDate";

export default {
  components: {
    GttSelect,
    GttSelectForm,
    GttSelectDate
  },
  methods: {
    activateModal() {
      this.$toasted.show(
        "La búsqueda de excursiones estará disponible próximamente.",
        { type: "info" }
      );
    }
  },
  data() {
    return {
      selectedPickUpPlace: "",
      selectedDeliveryPlace: "",
      selectedDestiny: "",
      selectedActivityType: "",
      selectedDate: null,
      selectedPassengers: null,
      activityTypes: ["Compartida", "Privada"],
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
      ]
    };
  }
};
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
