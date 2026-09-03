<template>
  <div class="selected-room flex-wrapper">
    <div class="room-name">
      {{ item.name }} (
      <AdultsKidsIcons
        :adults="item.CantAdultos"
        :kids="item.CantidadMenores"
        :id="id"
      ></AdultsKidsIcons>
      )
    </div>
    <div class="flex-right-side room-price">
      {{
        styledPrice(item.habitacion.PrecioOrden).intPart *
        item.habitacion.CantidadHabitaciones
      }}
      USD
      <button type="button" class="antonio-regular remove-icon" @click="remove">
        <i class="mdi mdi-trash-can"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdultsKidsIcons from "./AdultsKidsIcons.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{
  item: any;
}>();

const emit = defineEmits<{
  (e: "removeFromList", item: any): void;
}>();

const id = uuidv4();

function remove() {
  emit("removeFromList", props.item);
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart: number | string = Math.round((number - intPart) * 100);
  if (decimalPart == 0) decimalPart = "00";
  return { intPart, decimalPart };
}
</script>
