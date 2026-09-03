<template>
  <div>
    <template v-if="loading">
      <div class="result-item">
        <div class="result-item-carousel">
          <GttSkeleton type="rect" :width="100" height="200px"></GttSkeleton>
        </div>
        <div class="result-item-info">
          <GttSkeleton type="text" :width="70" height="1.4em"></GttSkeleton>
          <div class="item-other-info">
            <GttSkeleton type="text" :width="50" height="1em"></GttSkeleton>
            <GttSkeleton type="text" :width="40" height="1em"></GttSkeleton>
            <GttSkeleton type="text" :width="60" height="1em"></GttSkeleton>
          </div>
        </div>
        <div class="result-item-price">
          <div class="price-wrapper">
            <GttSkeleton type="text" :width="40" height="1em"></GttSkeleton>
            <div class="details-btn">
              <GttSkeleton type="rect" :width="40" height="40px"></GttSkeleton>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="result-item">
        <div class="result-item-carousel">
          <swiper
            :slides-per-view="1"
            :navigation="false"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :modules="swiperModules"
          >
            <swiper-slide
              class="result-images-carousel"
              v-for="destinyImage in item.images"
              :key="destinyImage"
            >
              <img
                v-if="destinyImage"
                v-bind:src="destinyImage"
                :alt="'Imagen de ' + item.name"
              />
              <img
                v-else
                src="../../../public/img/icopaq_alojamiento_black.svg"
                alt="alojamiento"
              />
            </swiper-slide>
          </swiper>
        </div>
        <div class="result-item-info">
          <div class="item-name hn-bdcn">{{ item.name }}</div>
          <slot name="item-other-info" v-bind:item="item">
            <div class="item-other-info hn-roman">
              <div class="item-hotel-stars" v-if="item.stars">
                <ul class="stars">
                  <li v-for="i in item.stars" :key="i">
                    <i class="mdi mdi-star"></i>
                  </li>
                </ul>
              </div>
              <div class="item-location" v-if="item.location">
                <span class="c-space">
                  <i class="mdi mdi-map-marker"></i>
                </span>
                {{ item.location }}
              </div>
              <div class="item-map-link" v-if="item.mapLink">
                <span class="c-space">
                  <i class="mdi mdi-map"></i>
                </span>
                <a :href="item.mapLink" class="map-location"
                  >Ubicación en el mapa</a
                >
              </div>
              <div class="item-suggestion">
                <div class="item-suggestion-text hn-bdcn">
                  Recomendado para
                  {{ filters.Visitantes.adults.value }} adulto(s)
                  <template v-if="filters.Visitantes.kids.value > 0"
                    >y {{ filters.Visitantes.kids.value }} niño(s)</template
                  >
                </div>
                <div v-for="ac in item.acomodation" :key="ac.code">
                  <template v-if="ac.hab == 'Sencilla'">
                    <i class="mdi mdi-account-box"></i>
                  </template>
                  <template v-if="ac.hab == 'Doble'">
                    <i class="mdi mdi-account-box"></i>
                    <i class="mdi mdi-account-box"></i>
                  </template>
                  <template v-if="ac.hab == 'Triple'">
                    <i class="mdi mdi-account-box"></i>
                    <i class="mdi mdi-account-box"></i>
                    <i class="mdi mdi-account-box"></i>
                  </template>
                  <i
                    class="mdi mdi-account-box-outline"
                    v-for="k in ac.kids"
                    :key="k"
                  ></i>
                  <span class="hn-roman">
                    {{ ac.cantidad }} hab. {{ ac.hab }} para
                    {{ ac.adults }} adulto(s)
                    <template v-if="ac.kids > 0"
                      >y {{ ac.kids }} niño(s)</template
                    >
                  </span>
                </div>
              </div>
            </div>
          </slot>
        </div>
        <div class="result-item-price">
          <div class="price-wrapper">
            <!-- <div class="hn-mdcn better-price">Mejor precio para:</div> -->
            <div class="hn-mdcn">
              {{ constructDisplay(filters.Visitantes) }}
            </div>
            <!-- <div class="price antonio-light">
            {{
              styledPrice(
                getMinPrice(item.habitaciones).combinacion.listado[0]
                  .precioObjOne.PrecioOrden
              ).intPart
            }}
            USD
          </div> -->
            <div class="details-btn form-actions">
              <button @click="goToDetail" type="submit" class="antonio-regular">
                Ver ofertas
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- <div class="list-item-children">
      <ResultListRow
        v-for="child in filteredItems"
        :key="child.id"
        :child="child"
        :disabled="disabledItems"
        @listReserve="addToCart"
        @loading="onLoading"
        @reserve="reserve"
      ></ResultListRow>
    </div> -->
    <div
      class="open-close-button"
      @click="openList"
      v-if="item.habitaciones && item.habitaciones.length > 2"
    >
      <i
        class="mdi"
        :class="{
          'mdi-chevron-double-down': !isOpen,
          'mdi-chevron-double-up': isOpen,
        }"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ResultListRow from "./ResultListRow.vue";
import GttSkeleton from "../shared/GttSkeleton.vue";
import _ from "lodash";
import { constructDisplay } from "../../utils/utils";
import { addToCartItem, reserveItem } from "../../composables/useCartItem";
import { helpers } from "../../utils/helpers";

const router = useRouter();
const $helpers = helpers;

const props = defineProps<{
  item: any;
  filters: any;
  todosTipo: any[];
  loading?: boolean;
}>();

const swiperModules = [Navigation, Pagination, Autoplay];
const isOpen = ref(false);
const limit = ref(2);
const disabledItems = ref(false);

const filteredItems = computed(() => {
  const habitaciones = props.item?.habitaciones || [];
  return habitaciones.slice(0, limit.value);
});

function blockingOthers(status: boolean) {
  disabledItems.value = status;
}

function goToDetail() {
  let f = props.filters;
  let a = props.item.acomodation;
  let id = props.item.lodging.ProductoId;
  localStorage.setItem("searchLodgingFilters", JSON.stringify(f));
  localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));
  router.push({
    name: "lodging-detail",
    params: { id },
  });
}

function onLoading(value: boolean) {
  disabledItems.value = value;
}

function addToCart(i: any, cant: number) {
  addToCartItem(props.item, i, cant, $helpers);
}

function reserve(i: any, cant: number) {
  reserveItem(router, props.item, i, cant, $helpers);
}

function getMinPrice(array: any[]) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  return _.minBy(array, function (e: any) {
    return e.combinacion?.listado?.[0]?.precioObjOne?.PrecioOrden ?? 0;
  });
}

function openList() {
  const habitaciones = props.item?.habitaciones || [];
  if (!isOpen.value) {
    limit.value = habitaciones.length || 2;
  } else {
    limit.value = 2;
  }
  isOpen.value = !isOpen.value;
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart = Math.round((number - intPart) * 100);
  if (decimalPart == 0) decimalPart = "00";
  return { intPart, decimalPart };
}
</script>

<style lang="scss" scoped>
@media (max-width: 1024px) {
  .result-item {
    flex-direction: column;
  }
  .result-item-carousel {
    width: 100%;
  }
  .result-images-carousel {
    width: 100%;
    height: 200px;
  }
  .result-item-info {
    width: 100%;
    padding: var(--spacing-md);
  }
  .result-item-price {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .result-images-carousel {
    height: 160px;
  }
  .item-name {
    font-size: var(--font-size-lg);
  }
  .item-other-info {
    font-size: var(--font-size-xs);
  }
  .details-btn button {
    width: 100%;
  }
}
</style>
