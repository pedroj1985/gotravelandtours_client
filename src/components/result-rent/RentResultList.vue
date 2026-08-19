<template>
  <div id="result-list">
    <div class="list-item" v-for="item in resultList" :key="item.id">
      <RentResultListItem
        :onlyToSelect="onlyToSelect"
        :item="item"
        :totalDays="totalDays"
        :noDetail="true"
      >
      </RentResultListItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import RentResultListItem from "./RentResultListItem.vue";

defineProps<{
  resultList: any[];
  totalDays?: number;
  onlyToSelect?: boolean;
}>();
</script>
