<template>
  <div :class="{ 'custom-margin': customMargin }">
    <swiper
      class="services-carousel"
      :slides-per-view="4"
      :navigation="false"
      :pagination="{ clickable: true }"
      :modules="swiperModules"
    >
      <swiper-slide class="service-c" v-for="(service, i) in services" :key="i">
        <div class="service">
          <img :src="'img/' + service.image" :alt="service.name" />
          <div class="service-content-container">
            <div class="tag hn-roman">{{ service.tag }}</div>
            <div class="service-desc">
              <div class="service-desc-title hn-bdcn">{{ service.name }}</div>
              <div class="service-desc-text hn-roman">
                {{ service.description }}
              </div>
            </div>
            <hr />
            <div class="service-prices hn-roman">
              <div class="hd">Rango de precios:</div>
              <div class="price" v-for="(price, j) in service.prices" :key="j">
                <span class="currency hn-ltcn">{{ price.currency }}</span>
                <span class="price-interval hn-mdcn"
                  >{{ styledPrice(price.min).intPart }} -
                  {{ styledPrice(price.max).intPart }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface Price {
  currency: string;
  min: number;
  max: number;
}

interface Service {
  image: string;
  tag: string;
  name: string;
  description: string;
  prices: Price[];
}

const swiperModules = [Navigation, Pagination, Autoplay];

defineOptions({ name: "IndexServices" });

withDefaults(
  defineProps<{
    customMargin?: boolean;
  }>(),
  {
    customMargin: true,
  },
);

const services: Service[] = [
  {
    image: "home_servicios_restaurant.jpg",
    tag: "Restaurant",
    name: "Habana 61",
    description:
      "Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.",
    prices: [
      {
        currency: "cuc",
        min: 2,
        max: 14,
      },
      {
        currency: "eur",
        min: 1.8,
        max: 12.6,
      },
      {
        currency: "usd",
        min: 1.95,
        max: 13.65,
      },
    ],
  },
  {
    image: "home_servicios_autos.jpg",
    tag: "Autos clásicos",
    name: "Havana Classic",
    description:
      "Havana Classic es nuestra oferta para un viaje de un día a La Habana desde Varadero. El tour comienza a las 08:00hrs y finaliza a las 18:30hrs en el mismo punto de recogida.",
    prices: [
      {
        currency: "cuc",
        min: 45,
        max: 80,
      },
      {
        currency: "eur",
        min: 40.45,
        max: 71.95,
      },
      {
        currency: "usd",
        min: 43.8,
        max: 77.85,
      },
    ],
  },
  {
    image: "home_servicios_restaurant.jpg",
    tag: "Restaurant",
    name: "Habana 61",
    description:
      "Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.",
    prices: [
      {
        currency: "cuc",
        min: 2,
        max: 14,
      },
      {
        currency: "eur",
        min: 1.8,
        max: 12.6,
      },
      {
        currency: "usd",
        min: 1.95,
        max: 13.65,
      },
    ],
  },
  {
    image: "home_servicios_restaurant.jpg",
    tag: "Restaurant",
    name: "Habana 61",
    description:
      "Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.",
    prices: [
      {
        currency: "cuc",
        min: 2,
        max: 14,
      },
      {
        currency: "eur",
        min: 1.8,
        max: 12.6,
      },
      {
        currency: "usd",
        min: 1.95,
        max: 13.65,
      },
    ],
  },
  {
    image: "home_servicios_restaurant.jpg",
    tag: "Restaurant",
    name: "Habana 61",
    description:
      "Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.",
    prices: [
      {
        currency: "cuc",
        min: 2,
        max: 14,
      },
      {
        currency: "eur",
        min: 1.8,
        max: 12.6,
      },
      {
        currency: "usd",
        min: 1.95,
        max: 13.65,
      },
    ],
  },
];

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart: number | string =
    Number((number - intPart).toFixed(2)) * 100;

  if (decimalPart == 0) decimalPart = "00";

  return { intPart: intPart, decimalPart: decimalPart };
}
</script>

<style scoped>
.services-carousel {
  width: 100%;
}
</style>
