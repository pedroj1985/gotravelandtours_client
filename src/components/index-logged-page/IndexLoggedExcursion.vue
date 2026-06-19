<template>
  <div id="index-logged-excursion">
    <IndexLoggedExcursionSearch></IndexLoggedExcursionSearch>
    <div id="index-logged-excursion-wrapper">
      <div class="carousel-absolute">
        <IndexServicesCarousel></IndexServicesCarousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import IndexLoggedExcursionSearch from "./IndexLoggedExcursionSearch.vue"
import IndexServicesCarousel from "../index-page/IndexServicesCarousel.vue"
import { useScrollStore } from "../../stores/scrollStore"

function handleScroll() {
  const el = document.getElementById("index-logged-excursion")
  if (!el) return
  let height = window.innerHeight
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo("excursions")
  }
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
#index-logged-excursion {
  position: relative;
  width: 100%;
  margin-top: 120px;
  height: 1315px;
  margin-bottom: 30px;
}

#index-logged-excursion-wrapper {
  position: relative;
  width: 100%;
}
#index-logged-excursion .carousel-absolute {
  position: absolute;
  top: -107px;
  z-index: 2;
  width: 100%;
}
@media (max-width: 1440px) {
  #index-logged-excursion {
    height: 900px;
  }
}
</style>
