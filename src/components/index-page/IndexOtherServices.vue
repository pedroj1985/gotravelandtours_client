<template>
  <div id="other-services" class="custom-margin">
    <div class="other-services-title section-title hn-bdcn">
      Otros servicios
    </div>
    <swiper
      id="other-services-carousel"
      :slides-per-view="3"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :navigation="false"
      :pagination="{ clickable: true }"
      :modules="swiperModules"
    >
      <swiper-slide
        :key="oService.id"
        class="other-services-container"
        v-for="oService in oServices"
      >
        <img :src="'img/' + oService.image" :alt="oService.name" />
        <div class="other-service-content">
          <hr />
          <div class="other-service-text hn-roman">{{ oService.name }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

defineOptions({ name: "IndexOtherServices" });

const swiperModules = [Navigation, Pagination, Autoplay];
const oServices = ref([
  {
    name: "Buceo",
    image: "home_otrosservicios_buceo.jpg",
  },
  {
    name: "Senderismo",
    image: "home_otrosservicios_senderismo.jpg",
  },
  {
    name: "Torcedor de tabaco",
    image: "home_otrosservicios_tabaco.jpg",
  },
  {
    name: "Senderismo",
    image: "home_otrosservicios_senderismo.jpg",
  },
]);
</script>
