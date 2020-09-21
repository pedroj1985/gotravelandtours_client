<template>
  <div id="left-column-filters">
      <LodgingForm></LodgingForm>
      <OtherFilters></OtherFilters>
  </div>
</template>

<script>
import LodgingForm from '../result-lodging/LodgingForm';
import OtherFilters from './OtherFilters'
export default {
    components: {
        LodgingForm,
        OtherFilters
    }
}
</script>

<style>
    #left-column-filters{
        height: 100%;
    }
</style>