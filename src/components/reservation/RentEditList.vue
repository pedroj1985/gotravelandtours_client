<template>
  <div class="rent-edit-list-item">
    <div class="flex-wrapper">
      <div
        style="margin-bottom: 30px"
        class="current-car font16 hn-roman gtt-first-color"
      >
        <b>Auto actual:</b> <span>{{ displayName(currentCar) }}</span>
      </div>
      <button type="button" class="ml-auto btn-close" @click="$emit('close')">
        <i class="mdi mdi-close"></i>
      </button>
    </div>
    <div class="list-wrapper">
      <div class="list-item" v-for="item in resultList" :key="item.id">
        <RentResultListItem
          :totalDays="
            calculateNights(
              item.orderVehiculo.FechaEntrega,
              item.orderVehiculo.FechaRecogida,
            )
          "
          :noDetail="true"
          @selectedElementEditItem="emitElement"
          :item="item"
          :onlyToSelect="true"
        ></RentResultListItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RentResultListItem from "../result-rent/RentResultListItem.vue";
import moment from "moment";
import { calculateNights } from "../../utils/utils";

const props = defineProps<{
  resultList: any[];
  currentCar?: string;
}>();

const emit = defineEmits<{
  (e: "selectedElementEdit", value: any): void;
}>();

const isLoadingEverything = ref(false);

function displayName(data: string) {
  let data_splitted = data.split("-");
  let sp = data_splitted.slice(1, data_splitted.length);
  return sp.join("-");
}

function search(filters: any) {
  if (import.meta.env.DEV) {
    console.log(filters);
  }
  return [];
}

function emitElement(value: any) {
  emit("selectedElementEdit", value);
}
</script>
