<template>
  <div id="otherFilters">
    <OtherFiltersInput
      :placeholder="'Nombre del hotel'"
      :label="'Nombre del hotel'"
    ></OtherFiltersInput>
    <OtherFiltersInput
      :placeholder="'Provincia'"
      :label="'Ubicación'"
    ></OtherFiltersInput>
    <OtherFiltersInputRange
      :label="'Rango de precios'"
      v-model="range"
      :min="min_range"
      :max="max_range"
    ></OtherFiltersInputRange>
    <OtherFiltersInputStars :label="'Categoría'"></OtherFiltersInputStars>
  </div>
</template>

<script setup lang="ts">
import OtherFiltersInput from "../filters-side/OtherFiltersInput.vue";
import OtherFiltersInputRange from "../filters-side/OtherFiltersInputRange.vue";
import OtherFiltersInputStars from "../filters-side/OtherFiltersInputStars.vue";
import { ref, onMounted } from "vue";

const min_range = 50
const max_range = 100
const range = ref<number[]>([])

onMounted(() => {
  range.value = [min_range, max_range]
})
</script>

<style scoped>
#otherFilters {
  width: 100%;
  /* height: 100%; */
  padding: 30px 15px 30px 15px;
  margin-top: 30px;
  background-color: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 10px;
}
</style>
