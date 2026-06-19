<template>
  <div id="index-logged-destinies">
    <div class="custom-margin">
      <Destinies :arrows="true" :dots="false"> </Destinies>
    </div>
  </div>
</template>

<script setup lang="ts">
import Destinies from "../shared/DestiniesCarousel.vue"
</script>

<style scoped>
#index-logged-destinies {
  width: 100%;
  margin-top: 60px;
}
</style>
