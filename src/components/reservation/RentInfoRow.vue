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
        <div class="ir-info-name font14 required-field">Datos de recogida</div>

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
            <span class="wrap" id="selectedPickUp">
              {{ overflowText(selectedValue.selectedValue.nombre) }}
            </span>
            <b-tooltip target="selectedPickUp" triggers="hover">{{
              selectedValue.selectedValue.nombre
            }}</b-tooltip>
          </template>
          <span slot="error" class="gtt-errors"></span>
        </gtt-select>
        <span style="padding: 2px;"> - </span>
        <div class="container-left">
          <div class="ir-info-name  font14">
            Hora Recogida
          </div>
          <vue-timepicker
            :value="pickUp"
            @input="$emit('inputPickUp', $event)"
            :disabled="!editable"
            lazy
            close-on-complete
            hide-clear-button
          />
        </div>
      </div>

      <div ref="gttDelivery" class="input-right ir-text-input">
        <div class="ir-info-name font14 required-field">Datos de entrega</div>
        <gtt-select
          v-on:input="$emit('inputDeliveryPlace', $event)"
          :openedLodging.sync="deliveryOpened"
          :options="pickUpDeliveryOptions"
          v-model="selectedDeliveryPlace"
          :isDisabled="true"
        >
          <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>

          <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
          <template v-slot:option="option">{{ option.option.nombre }}</template>
          <template v-slot:selectedValue="selectedValue">
            <span class="wrap" id="selectedPickUp">
              {{ overflowText(selectedValue.selectedValue.nombre) }}
            </span>
          </template>
          <span slot="error" class="gtt-errors"></span>
        </gtt-select>
        <span style="padding: 2px;"> - </span>

        <div class="container-left">
          <div class="ir-info-name  font14">
            Hora Entrega
          </div>
          <vue-timepicker
            :disabled="true"
            :value="deliver"
            @input="$emit('inputDeliver', $event)"
            lazy
            close-on-complete
            hide-clear-button
          />
        </div>
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

import { authSearchPuntosInteres } from "../../utils/auth";

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
  props: {
    deliver: {
      type: String,
    },
    pickUp: {
      type: String,
    },
    editable: {
      type: Boolean,
      default: true,
    },
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
    selectedPickUpPlace: function(newPickUpPlace, oldPickUpPlace) {
      if (this.selectedDeliveryPlace == null) {
        this.$emit("inputDeliveryPlace", newPickUpPlace);
        this.selectedDeliveryPlace = newPickUpPlace;
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.container-left {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20%;
}
.left {
  right: 2px;
}
.time-picker {
  height: 100% !important;
  width: 100%;
}
span {
  font-size: 12px;
}

.info-row {
  width: 100%;
}
.input-two-rows {
  width: 100%;
}
.ir-inputs-wrapper {
  display: flex;

  margin-top: 15px;

  justify-content: space-between;
}
.input-icon {
  align-self: center;
  margin-right: 5px;
}

.gtt__select {
  position: relative;
  margin-bottom: 0px;
}
.gtt__toggle {
  width: 100%;
}

.input-left {
  margin-right: auto;
  margin-right: 30px;
}
.input-right {
  margin-left: auto;
}

.ir-text-input {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 30px;
  padding-bottom: 10px;
  background-color: white;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #6d6d6d;
  position: relative;
}
.ir-info-name {
  position: absolute;
  top: 8px;
}
.ir-input {
  border: none;
  width: 100%;
}
.time-input {
  display: flex;
  justify-content: center;
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
