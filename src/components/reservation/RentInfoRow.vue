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
          @update:modelValue="$emit('inputPickUpPlace', $event)"
          v-model:openedLodging="pickUpOpened"
          :options="pickUpDeliveryOptions"
          class="cleft"
          v-model="selectedPickUpPlace"
        >
          <template #iconSelectedValue>
            <i class="mdi mdi-map-marker"></i>
          </template>

          <template #selectedPlaceholder>¿Dónde desea rentar el auto?</template>
          <template #option="option">{{ option.option.nombre }}</template>
          <template #selectedValue="selectedValue">
            <span
              class="wrap gtt-tooltip"
              :data-tooltip="selectedValue.selectedValue.nombre"
            >
              {{ overflowText(selectedValue.selectedValue.nombre) }}
            </span>
          </template>
          <template #error><span class="gtt-errors"></span></template>
        </gtt-select>
        <span style="padding: 2px"> - </span>
        <div class="container-left">
          <div class="ir-info-name font14">Hora Recogida</div>
          <input
            type="time"
            :value="pickUp"
            @input="$emit('inputPickUp', $event.target.value)"
            :disabled="!editable"
          />
        </div>
      </div>

      <div ref="gttDelivery" class="input-right ir-text-input">
        <div class="ir-info-name font14 required-field">Datos de entrega</div>
        <gtt-select
          @update:modelValue="$emit('inputDeliveryPlace', $event)"
          v-model:openedLodging="deliveryOpened"
          :options="pickUpDeliveryOptions"
          v-model="selectedDeliveryPlace"
        >
          <template #iconSelectedValue>
            <i class="mdi mdi-map-marker"></i>
          </template>

          <template #selectedPlaceholder>¿Dónde entregaría el auto?</template>
          <template #option="option">{{ option.option.nombre }}</template>
          <template #selectedValue="selectedValue">
            <span class="wrap" id="selectedPickUp">
              {{ overflowText(selectedValue.selectedValue.nombre) }}
            </span>
          </template>
          <template #error><span class="gtt-errors"></span></template>
        </gtt-select>
        <span style="padding: 2px"> - </span>

        <div class="container-left">
          <div class="ir-info-name font14">Hora Entrega</div>
          <input
            type="time"
            :disabled="true"
            :value="deliver"
            @input="$emit('inputDeliver', $event.target.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { toast } from "vue3-toastify";
import GttSelect from "../custom-elements/GttSelect.vue";
import GttSelectDate from "../custom-elements/GttSelectDate.vue";
import GttModalSearch from "../custom-elements/GttModalSearch.vue";

import { cleanVO } from "../../composables/useCleanup";
import { authSearchPuntosInteres } from "../../utils/auth";
import { overflowText } from "../../utils/utils";

const props = defineProps<{
  deliver?: string;
  pickUp?: string;
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: "inputDeliveryPlace", val: any): void;
  (e: "inputPickUpPlace", val: any): void;
  (e: "inputPickUp", val: string): void;
  (e: "inputDeliver", val: string): void;
}>();

const pickUpOpened = ref(false);
const deliveryOpened = ref(false);
const selectedPickUpPlace = ref<any>(null);
const selectedDeliveryPlace = ref<any>(null);
const pickUpDeliveryOptions = ref<any[]>([]);

onMounted(() => {
  loadPuntosInteres();
});

watch(selectedPickUpPlace, (newPickUpPlace) => {
  if (selectedDeliveryPlace.value == null) {
    emit("inputDeliveryPlace", newPickUpPlace);
    selectedDeliveryPlace.value = newPickUpPlace;
  }
});

function cleanOrder(order: any, pickUpPlace: any, DeliveryPlace: any) {
  cleanVO(
    order,
    pickUpPlace || selectedPickUpPlace.value,
    DeliveryPlace || selectedDeliveryPlace.value,
  );
}

async function loadPuntosInteres() {
  try {
    let { data } = await authSearchPuntosInteres();
    let totalResult: any[] = [];
    data.forEach((item: any) => {
      totalResult = totalResult.concat({
        nombre: item.Nombre,
        regionid: item.RegionId,
        puntointeresid: item.PuntoInteresId,
        type: "punto-interes",
      });
    });
    pickUpDeliveryOptions.value = totalResult;
  } catch (error) {
    toast("El servicio no está disponible en estos momentos", {
      type: "error",
    });
  }
}
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
