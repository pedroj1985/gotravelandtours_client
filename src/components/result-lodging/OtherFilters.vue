<template>
  <div id="otherFilters">
    <OtherFiltersInput :placeholder="'Nombre del hotel'" :label="'Nombre del hotel'"></OtherFiltersInput>
    <OtherFiltersInput :placeholder="'Provincia'" :label="'Ubicación'"></OtherFiltersInput>
    <OtherFiltersInputRange :label="'Rango de precios'" v-model="range" :min="min_range" :max="max_range"></OtherFiltersInputRange>
    <OtherFiltersInputStars :label="'Categoría'"></OtherFiltersInputStars>
  </div>
</template>

<script>
import OtherFiltersInput from '../filters-side/OtherFiltersInput'
import OtherFiltersInputRange from '../filters-side/OtherFiltersInputRange'
import OtherFiltersInputStars from '../filters-side/OtherFiltersInputStars'
export default {
  components: {
    OtherFiltersInput,
    OtherFiltersInputRange,
    OtherFiltersInputStars
  },
  mounted(){
    this.range = [this.min_range, this.max_range]
  },
  data(){
    return {
      min_range: 50,
      max_range: 100,
      range: []
    }
  }
}
</script>

<style scoped>
    #otherFilters{
        width: 100%;
        /* height: 100%; */
        padding: 30px 15px 30px 15px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 1px solid #c4c4c4;
        border-radius: 10px;
    }
</style>