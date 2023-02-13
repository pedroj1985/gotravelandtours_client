<template>
  <div class="info-row gtt-text-color hn-roman">
    <div class="ir-text-wrapper font18">
      <i class="mdi mdi-account"></i>
      <span class="ir-text">
        <slot name="ir-text">
          Información del vuelo(s)
        </slot>
      </span>
    </div>
    <div class="ir-inputs-wrapper general-text-opt">
      <div ref="gttLlegada" class="input-left flex-wrapper ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-airplane-landing"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14 required-field">
            Datos del vuelo (llegada)
          </div>
          <div class="flex-wrapper">
            <gtt-select :clickable="editable" :options="airlines" v-model="hl">
              <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>

              <span slot="selectedPlaceholder">¿Aerolinea?</span>
              <template v-slot:option="option">{{
                option.option.Nombre
              }}</template>
              <template v-slot:selectedValue="selectedValue">
                <span class="wrap" id="selectedPickUp">
                  {{ selectedValue.selectedValue.Nombre }}
                </span>
              </template>
              <span slot="error" class="gtt-errors"></span>
            </gtt-select>
            <span style="padding: 2px;"> - </span>
            <input
              type="text"
              :value="nvuelo_landing"
              :disabled="!editable"
              @input="$emit('inputNvueloLanding', $event.target.value)"
              class="ir-input font18"
              placeholder="No. VUELO"
            />
          </div>
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>
      <div ref="gttSalida" class="input-right flex-wrapper ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-airplane-takeoff"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14">
            Datos del vuelo (salida)
          </div>
          <div class="flex-wrapper">
            <gtt-select :clickable="editable" :options="airlines" v-model="ht">
              <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>

              <span slot="selectedPlaceholder">¿Aerolinea?</span>
              <template v-slot:option="option">{{
                option.option.Nombre
              }}</template>
              <template v-slot:selectedValue="selectedValue">
                <span class="wrap" id="selectedPickUp">
                  {{ selectedValue.selectedValue.Nombre }}
                </span>
              </template>
              <span slot="error" class="gtt-errors"></span>
            </gtt-select>
            <span style="padding: 2px;"> - </span>
            <input
              type="text"
              :value="nvuelo_takeoff"
              :disabled="!editable"
              @input="$emit('inputNvueloTakeoff', $event.target.value)"
              class="ir-input font14"
              placeholder="No. VUELO"
            />
          </div>
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { authGetAirlines } from "../../utils/auth";
import GttSelect from "../custom-elements/GttSelect.vue";

export default {
  mounted() {
    authGetAirlines()
      .then((json) => {
        this.airlines = json.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    hl: function(value) {
      this.$emit("inputAerolineaLanding", value.Nombre);
    },
    ht: function(value) {
      this.$emit("inputAerolineaTakeoff", value.Nombre);
    },
    aerolinea_landing: function(value) {
      this.hl = { Nombre: value };
    },
    aerolinea_takeoff: function(value) {
      this.ht = { Nombre: value };
    },
  },
  data() {
    return {
      airlines: [],
      hl: "",
      ht: "",
    };
  },
  props: {
    hora_landing: {
      type: String,
    },
    aerolinea_landing: {
      type: String,
    },
    nvuelo_landing: {
      type: String,
    },
    hora_takeoff: {
      type: String,
    },
    aerolinea_takeoff: {
      type: String,
    },
    nvuelo_takeoff: {
      type: String,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  components: { GttSelect },
};
</script>
<style scoped>
.info-row {
  width: 100%;
}
.ir-inputs-wrapper {
  display: flex;
  margin-top: 15px;
}
.input-two-rows {
  width: 100%;
}

.input-icon {
  align-self: center;
  margin-right: 5px;
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
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  width: 50%;
  border-radius: 10px;
  border: 1px solid #6d6d6d;
}
.flex-wrapper {
  display: flex;
  margin-top: 8px;
  align-items: center;
}
.gtt__select {
  margin-bottom: 0px;
}
.ir-input {
  border: none;
  width: 35%;
  text-align: center;
}
.ir-input:focus {
  border-bottom: 1px solid #f5f5f5;
  outline: none;
}
.ir-input:disabled {
  background-color: white;
  color: #b3b2b2;
}
.ir-input:disabled::placeholder {
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
