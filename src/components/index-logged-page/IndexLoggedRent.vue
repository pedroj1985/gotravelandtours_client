<template>
  <div id="index-logged-rent-wrapper">
    <IndexLoggedRentSearch></IndexLoggedRentSearch>
    <!--        <div id="rent-carousel-wrapper">
            <div class="carousel-absolute">
                <IndexLoggedRentCarousel></IndexLoggedRentCarousel>
            </div>
        </div>-->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import IndexLoggedRentSearch from "../index-logged-page/IndexLoggedRentSearch.vue"
import IndexLoggedRentCarousel from "./IndexLoggedRentCarousel.vue"
import { useScrollStore } from "../../stores/scrollStore"

function handleScroll() {
  const el = document.getElementById("index-logged-rent-wrapper")
  if (!el) return
  let height = window.innerHeight
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo("car-rent")
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
#index-logged-rent-wrapper {
  width: 100%;
  margin-top: 120px;
  height: 1345px;
}
#rent-carousel-wrapper {
  position: relative;
  width: 100%;
}
@media (max-width: 1440px) {
  #index-logged-rent-wrapper {
    height: 950px;
  }
}
</style>
