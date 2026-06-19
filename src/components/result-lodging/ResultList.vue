<template>
  <div id="result-list">
    <div class="list-item" v-for="item in resultList" :key="item.id">
      <ResultListItem
        :item="item"
        :filters="filters"
        :todosTipo="todosTipo"
      ></ResultListItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import ResultListItem from "./ResultListItem.vue";

defineProps<{
  resultList: any[]
  filters: any
  todosTipo: any[]
}>()
</script>
