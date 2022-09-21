<template>
  <div class="info-row gtt-text-color hn-roman">
    <div class="ir-text-wrapper font18">
      <i class="mdi mdi-account"></i>
      <span class="ir-text">
        <slot name="ir-text"> Información de la renta </slot>
      </span>
    </div>

    <div class="ir-inputs-wrapper general-text-opt">
      <div ref="gttPickUp" class="input-left ir-text-input">
        <div class="ir-info-name font14 required-field">Punto de recogida</div>

        <gtt-select
          v-on:input="$emit('inputPickUpPlace', $event)"
          :openedLodging.sync="pickUpOpened"
          :options="pickUpDeliveryOptions"
          class="cleft"
          v-model="selectedPickUpPlace"
        >
          <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>

          <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
          <template v-slot:option="option">{{ option.option.nombre }}</template>
          <template v-slot:selectedValue="selectedValue">
            <span id="selectedPickUp">
              {{ overflowText(selectedValue.selectedValue.nombre) }}
            </span>
            <b-tooltip target="selectedPickUp" triggers="hover">{{
              selectedValue.selectedValue.nombre
            }}</b-tooltip>
          </template>
          <span slot="error" class="gtt-errors"></span>
        </gtt-select>
      </div>
      <!-- flex-wrapper  -->
      <div ref="gttDelivery" class="input-right ir-text-input">
        <div class="ir-info-name font14 required-field">Punto de entrega</div>
        <gtt-select
          v-on:input="$emit('inputDeliveryPlace', $event)"
          :openedLodging.sync="deliveryOpened"
          :options="pickUpDeliveryOptions"
          v-model="selectedDeliveryPlace"
        >
          <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>

          <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
          <template v-slot:option="option">{{ option.option.nombre }}</template>
          <template v-slot:selectedValue="selectedValue">{{
            overflowText(selectedValue.selectedValue.nombre)
          }}</template>
          <span slot="error" class="gtt-errors"></span>
        </gtt-select>
      </div>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttModalSearch from "../custom-elements/GttModalSearch";

import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import { cleanVoMixin } from "../../mixins/cleanVoMixin";

import {
  authSearchPuntosInteres,
  authSearchMarcas,
  authSearchCars,
  authGetImage,
  authSearchProvider,
  authSearchMarca,
} from "../../utils/auth";

export default {
  created() {
    this.loadPuntosInteres();
  },
  data() {
    return {
      pickUpOpened: false,
      deliveryOpened: false,
      selectedPickUpPlace: null,
      selectedDeliveryPlace: null,
      pickUpDeliveryOptions: [],
    };
  },
  components: {
    GttSelect,
    GttSelectDate,
    GttModalSearch,
  },
  mixins: [cleanVoMixin],
  methods: {
    overflowText(text, l = 30) {
      if (text.length > l) {
        return `${text.substring(0, l)}...`;
      }
      return text;
    },
    async loadPuntosInteres() {
      try {
        let { data } = await authSearchPuntosInteres();
        let totalResult = [];
        data.forEach((item) => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            puntointeresid: item.PuntoInteresId,
            type: "punto-interes",
          });
        });
        this.pickUpDeliveryOptions = totalResult;
      } catch (error) {
        this.$toasted.show("El servicio no está disponible en estos momentos", {
          type: "error",
        });
      }
    },
  },
  watch: {
    // cada vez que la pregunta cambie, esta función será ejecutada
    selectedPickUpPlace: function (newPickUpPlace, oldPickUpPlace) {
      if (this.selectedDeliveryPlace==null) {
        this.$emit('inputDeliveryPlace', newPickUpPlace)
        this.selectedDeliveryPlace = newPickUpPlace
      }
      
    }
  },
};
</script>

<style scoped>
span {
  font-size: 12px;
}

.info-row {
  padding-top: 30px;
  width: 100%;
}
.input-two-rows {
  width: 100%;
}
.ir-inputs-wrapper {
  display: flex;
  margin-top: 15px;
  justify-content: space-evenly;
}
.input-icon {
  align-self: center;
  margin-right: 5px;
}

.gtt__select {
  width: 100%;
  position: relative;
  margin-bottom: 0px;
}

.ir-text-input {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  width: 100%;
  margin-right: 30px;
  border-radius: 10px;
  border: 1px solid #6d6d6d;
}
.ir-input {
  border: none;
  width: 100%;
}
.ir-input:focus {
  /* border-bottom: 1px solid #f5f5f5; */
  outline: none;
}
.ir-input:disabled {
  background-color: rgb(255, 255, 255);
  color: #b3b2b2;
}
@media (max-width: 1440px) {
  .ir-text-wrapper {
    font-size: 12px;
  }
  .ir-inputs-wrapper {
    margin-top: 10px;
  }
  .ir-info-name {
    font-size: 10px;
  }
  .ir-input {
    font-size: 12px;
  }
  .input-icon {
    font-size: 12px;
  }
}
</style>