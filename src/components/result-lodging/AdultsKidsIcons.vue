<template>
  <span
    class="gtt-tooltip"
    :data-tooltip="adults + ' adulto(s) y ' + kids + ' niño(s)'"
  >
    <i class="mdi mdi-account-box" v-for="a in adults" :key="a.id"></i>
    <i class="mdi mdi-account-box-outline" v-for="k in kids" :key="k.id"></i>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  adults?: number;
  kids?: number;
}>();
</script>
