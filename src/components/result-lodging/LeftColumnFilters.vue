<template>
  <div id="left-column-filters">
    <LodgingForm
      :propLodgingDestinyValue="filters.Destiny"
      :propArriveDate="filters.Entrada"
      :propDepartureDate="filters.Salida"
      :propRoomLayout="filters.Visitantes"
    ></LodgingForm>
    <!-- <OtherFilters></OtherFilters> -->
  </div>
</template>

<script setup lang="ts">
import LodgingForm from "./LodgingForm.vue";
import OtherFilters from "./OtherFilters.vue";

defineProps<{
  filters: any;
}>();
</script>
