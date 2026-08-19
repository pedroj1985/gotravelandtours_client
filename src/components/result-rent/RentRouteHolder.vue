<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const f = route.params["filters"];
const temp = route.params["searchResult"];
router.push({
  name: "resultRent",
  key: "changed",
  params: {
    searchResult: temp,
    filters: f,
  },
});
</script>
