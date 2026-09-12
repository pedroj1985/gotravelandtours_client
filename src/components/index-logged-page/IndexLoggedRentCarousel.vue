<template>
  <div class="custom-margin">
    <swiper
      class="car-carousel"
      :slides-per-view="4"
      :navigation="true"
      :modules="swiperModules"
    >
      <swiper-slide
        class="index-logged-car-wrapper"
        v-for="(car, i) in cars"
        :key="i"
      >
        <div class="index-logged-car">
          <img :src="'img/' + car.img" :alt="car.model_name" />
          <div class="index-logged-car-name">
            <div class="car-name antonio-bold">
              {{ car.model_name }}
            </div>
            <div class="car-category hn-roman">
              {{ car.category }}
            </div>
          </div>
          <div class="index-logged-car-description hn-roman">
            <div class="capacity">
              <i class="mdi mdi-account"></i> {{ car.capacity }} personas
            </div>
            <div class="luggage">
              <i class="mdi mdi-briefcase"></i> {{ car.luggage.quantity }}
              {{ car.luggage.type }}
            </div>
            <div class="car-type">
              <i class="mdi mdi-engine"></i> {{ car.type }}
            </div>
            <div class="agencies">
              <div class="agency-havanautos">
                <i
                  class="mdi mdi-alpha-h-box-outline"
                  :class="{ 'non-selected': !isSelected('H', car.agencies) }"
                ></i>
              </div>
              <div class="agency-cubacar">
                <i
                  class="mdi mdi-alpha-c-box-outline"
                  :class="{ 'non-selected': !isSelected('C', car.agencies) }"
                ></i>
              </div>
              <div class="agency-via">
                <i
                  class="mdi mdi-alpha-v-box-outline"
                  :class="{ 'non-selected': !isSelected('V', car.agencies) }"
                ></i>
              </div>
              <div class="agency-rex">
                <i
                  class="mdi mdi-alpha-r-box-outline"
                  :class="{ 'non-selected': !isSelected('R', car.agencies) }"
                ></i>
              </div>
            </div>
            <div class="car-price hn-roman">
              <span class="from-word">desde</span>
              {{ styledPrice(Number(car.min_price.value)).intPart }}
              <span class="currency">{{ car.min_price.currency }}</span>
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

const swiperModules = [Navigation, Pagination, Autoplay];

interface CarLuggage {
  quantity: string;
  type: string;
}

interface CarMinPrice {
  currency: string;
  value: string;
}

interface Car {
  model_name: string;
  img: string;
  category: string;
  capacity: string;
  luggage: CarLuggage;
  type: string;
  min_price: CarMinPrice;
  agencies: string[];
}

const cars: Car[] = [
  {
    model_name: "Mercedes Benz Clase C200",
    img: "homelogin_renta_mercedesbenzcc.jpg",
    category: "premium plus",
    capacity: "4",
    luggage: {
      quantity: "2",
      type: "grandes",
    },
    type: "automático",
    min_price: {
      currency: "USD",
      value: "145",
    },
    agencies: ["R"],
  },
  {
    model_name: "Hyundai Santa Fe",
    img: "homelogin_renta_hyundaisantafe.jpg",
    category: "jeep",
    capacity: "5",
    luggage: {
      quantity: "2",
      type: "pequeños",
    },
    type: "automático",
    min_price: {
      currency: "USD",
      value: "270",
    },
    agencies: ["R"],
  },
  {
    model_name: "Peugeot 301",
    img: "homelogin_renta_peugeot.jpg",
    category: "medium",
    capacity: "5",
    luggage: {
      quantity: "2",
      type: "grandes",
    },
    type: "automático",
    min_price: {
      currency: "USD",
      value: "66",
    },
    agencies: ["V"],
  },
  {
    model_name: "Morris Garage MG3",
    img: "homelogin_renta_mg.jpg",
    category: "económico",
    capacity: "4",
    luggage: {
      quantity: "2",
      type: "pequeñas",
    },
    type: "manual",
    min_price: {
      currency: "USD",
      value: "46",
    },
    agencies: ["C", "V"],
  },
  {
    model_name: "Morris Garage MG3",
    img: "homelogin_renta_mg.jpg",
    category: "económico",
    capacity: "4",
    luggage: {
      quantity: "2",
      type: "pequeñas",
    },
    type: "manual",
    min_price: {
      currency: "USD",
      value: "46",
    },
    agencies: ["C", "V"],
  },
];

function isSelected(word: string, list: string[]) {
  return list.includes(word);
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart: number | string =
    Number((number - intPart).toFixed(2)) * 100;

  if (decimalPart == 0) decimalPart = "00";

  return { intPart: intPart, decimalPart: decimalPart };
}
</script>
