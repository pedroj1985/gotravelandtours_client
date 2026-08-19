<template>
  <div class="info-row gtt-text-color hn-roman">
    <div class="ir-text-wrapper font18">
      <i class="mdi mdi-account"></i>
      <span class="ir-text">
        <slot name="ir-text"> Información del vuelo(s) </slot>
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
              <template #iconSelectedValue>
                <i class="mdi mdi-map-marker"></i>
              </template>

              <template #selectedPlaceholder>¿Aerolinea?</template>
              <template #option="option">{{ option.option.Nombre }}</template>
              <template #selectedValue="selectedValue">
                <span class="wrap" id="selectedPickUp">
                  {{ selectedValue.selectedValue.Nombre }}
                </span>
              </template>
              <template #error><span class="gtt-errors"></span></template>
            </gtt-select>
            <span style="padding: 2px"> - </span>
            <input
              type="text"
              :value="nvuelo_landing"
              :disabled="!editable"
              @input="$emit('inputNvueloLanding', $event.target.value)"
              class="ir-input font18"
              placeholder="No. VUELO"
            />
          </div>
          <span class="gtt-errors"></span>
        </div>
      </div>
      <div ref="gttSalida" class="input-right flex-wrapper ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-airplane-takeoff"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14">Datos del vuelo (salida)</div>
          <div class="flex-wrapper">
            <gtt-select :clickable="editable" :options="airlines" v-model="ht">
              <template #iconSelectedValue>
                <i class="mdi mdi-map-marker"></i>
              </template>

              <template #selectedPlaceholder>¿Aerolinea?</template>
              <template #option="option">{{ option.option.Nombre }}</template>
              <template #selectedValue="selectedValue">
                <span class="wrap" id="selectedPickUp">
                  {{ selectedValue.selectedValue.Nombre }}
                </span>
              </template>
              <template #error><span class="gtt-errors"></span></template>
            </gtt-select>
            <span style="padding: 2px"> - </span>
            <input
              type="text"
              :value="nvuelo_takeoff"
              :disabled="!editable"
              @input="$emit('inputNvueloTakeoff', $event.target.value)"
              class="ir-input font14"
              placeholder="No. VUELO"
            />
          </div>
          <span class="gtt-errors"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { authGetAirlines } from "../../utils/auth";
import GttSelect from "../custom-elements/GttSelect.vue";

const props = defineProps<{
  hora_landing?: string;
  aerolinea_landing?: string;
  nvuelo_landing?: string;
  hora_takeoff?: string;
  aerolinea_takeoff?: string;
  nvuelo_takeoff?: string;
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: "inputAerolineaLanding", val: string): void;
  (e: "inputAerolineaTakeoff", val: string): void;
  (e: "inputNvueloLanding", val: string): void;
  (e: "inputNvueloTakeoff", val: string): void;
}>();

const airlines = ref<any[]>([]);
const hl = ref<any>("");
const ht = ref<any>("");

onMounted(() => {
  authGetAirlines()
    .then((json) => {
      airlines.value = json.data;
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.log(error);
      }
    });
});

watch(hl, (value: any) => {
  emit("inputAerolineaLanding", value?.Nombre);
});

watch(ht, (value: any) => {
  emit("inputAerolineaTakeoff", value?.Nombre);
});

watch(
  () => props.aerolinea_landing,
  (value) => {
    if (value) hl.value = { Nombre: value };
  },
);

watch(
  () => props.aerolinea_takeoff,
  (value) => {
    if (value) ht.value = { Nombre: value };
  },
);
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
