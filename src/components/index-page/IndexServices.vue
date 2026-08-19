<template>
  <div id="services-you-like" class="custom-margin">
    <div class="service-you-like-title section-title hn-bdcn">
      Servicios que te pueden interesar con GT&amp;T
    </div>
    <IndexServicesCarousel :customMargin="false"></IndexServicesCarousel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useScrollStore } from "../../stores/scrollStore";
import IndexServicesCarousel from "./IndexServicesCarousel.vue";

function handleScroll() {
  const el = document.getElementById("services-you-like");
  if (!el) return;
  let height = window.innerHeight;
  if (
    height * 0.25 > el.getBoundingClientRect().top &&
    height * 0 < el.getBoundingClientRect().top
  ) {
    useScrollStore().scrollTo(el.id);
  }
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
