<template>
  <div id="destinies" class="custom-margin">
    <div class="destiny-title section-title hn-bdcn">Destinos Cuba</div>
    <DestiniesCarousel :arrows="false" :dots="true"></DestiniesCarousel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import { useScrollStore } from "../../stores/scrollStore"
import DestiniesCarousel from "../shared/DestiniesCarousel.vue"

function handleScroll() {
  const el = document.getElementById("destinies")
  if (!el) return
  let height = window.innerHeight
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo(el.id)
  }
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>
