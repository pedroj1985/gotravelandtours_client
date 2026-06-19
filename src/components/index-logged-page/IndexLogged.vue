<template>
  <div id="content">
    <IndexLoggedBanner></IndexLoggedBanner>
    <!--      <IndexLoggedRent></IndexLoggedRent>-->
  </div>
</template>

<script setup lang="ts">
import IndexLoggedBanner from "./IndexLoggedBanner.vue"
import IndexLoggedRent from "./IndexLoggedRent.vue"

defineOptions({ name: "IndexLogged" })
</script>
