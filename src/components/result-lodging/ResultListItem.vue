<template>
  <div>
    <div class="list-item-general">
      <div class="list-item-carousel">
        <Slick
          ref="slick"
          :slidesToShow="1"
          :slidesToScroll="1"
          :draggable="true"
          :arrows="false"
          :dots="true"
          :autoplay="true"
        >
          <div
            class="result-images-carousel"
            v-for="destinyImage in item.images"
            :key="destinyImage"
          >
            <img v-if="destinyImage" v-bind:src="destinyImage" alt />
            <img v-else
                src="../../../public/img/icopaq_alojamiento_black.svg"
                alt="alojamiento"
            />
          </div>
        </Slick>
      </div>
      <div class="list-item-info">
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
                Recomendado para {{ filters.Visitantes.adults.value }} adulto(s)
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
      <div class="list-item-price">
        <div class="price-wrapper">
          <!-- <div class="hn-mdcn better-price">Mejor precio para:</div> -->
          <div class="hn-mdcn">{{ constructDisplay(filters.Visitantes) }}</div>
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
      v-if="item.habitaciones.length > 2"
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

<script>
import Slick from "vue-slick-carousel";
import ResultListRow from "./ResultListRow";
import _ from "lodash";
import { constructDisplay } from "../../utils/utils";
export default {
  created() {},
  components: {
    Slick,
    ResultListRow,
  },
  props: {
    item: Object,
    filters: Object,
    todosTipo: Array,
  },
  data() {
    return {
      isOpen: false,
      limit: 2,
      disabledItems: false
    };
  },
  computed: {
    filteredItems: function() {
      return this.item.habitaciones.slice(0, this.limit);
    },
  },
  methods: {
    constructDisplay,
    blockingOthers(status) {
      this.disabledItems = status;
    },
    goToDetail() {
      let f = this.filters;
      let a = this.item.acomodation;
      let id = this.item.lodging.ProductoId;

      localStorage.setItem("searchLodgingFilters", JSON.stringify(f));

      localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));

      this.$router.push({
        name: "lodging-detail",
        params: {
          id: id,
        },
      });
    },
    onLoading(value) {
      this.disabledItems = value;
    },
    addToCart(i, cant) {
      i.combinacion.listado[0].precioObjOne.OrdenAlojamientoId = 0;
      if (cant > 1) {
        i.combinacion.listado[0].precioObjOne.CantidadHabitaciones = cant;
        i.combinacion.total = i.combinacion.total * cant;
        i.combinacion.listado[0].precioObjOne["sameRoom"] = true;
      } else {
        i.combinacion.listado[0].precioObjOne["sameRoom"] = false;
      }
      this.item["reservedRooms"] = i;
      this.$helpers.shoppingCartAdd(this.item);
      this.$eventCartBus.$emit("updateCart");
    },
    reserve(i, cant) {
      this.addToCart(i, cant);
      this.$router.push({
        name: "reservation",
      });
    },
    getMinPrice(array) {
      return _.minBy(array, function(e) {
        return e.combinacion.listado[0].precioObjOne.PrecioOrden;
      });
    },
    openList() {
      if (!this.isOpen) {
        this.limit = this.item.habitaciones.length;
      } else {
        this.limit = 2;
      }
      this.isOpen = !this.isOpen;
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = Math.round((number - intPart) * 100);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
  },
};
</script>
