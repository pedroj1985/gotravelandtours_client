<template>
  <div id="left-column-filters">
      <LodgingForm></LodgingForm>
  </div>
</template>

<script>
import LodgingForm from '../result-lodging/LodgingForm';
export default {
    components: {
        LodgingForm
    }
}
</script>

<style>
    #left-column-filters{
        height: 100%;
    }
</style>