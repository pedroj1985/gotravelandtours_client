<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const temp = route.params["searchResult"]
router.push({
  name: "resultLodging",
  key: "changed",
  params: {
    searchResult: temp
  }
})
</script>

<style></style>
