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

<script>
import LodgingForm from "./LodgingForm";
import OtherFilters from "./OtherFilters";
export default {
  components: {
    LodgingForm,
    OtherFilters
  },
  props: {
    filters: {
      type: Object
    }
  }
};
</script>
