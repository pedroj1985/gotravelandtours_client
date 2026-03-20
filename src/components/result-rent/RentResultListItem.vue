<template>
  <div>
    <div class="list-item-general">
      <div class="list-item-carousel">
        <div class="result-images-carousel">
          <img v-bind:src="item.imagen" alt="imagen no disponible" />
        </div>
      </div>
      <div class="list-item-info">
        <div class="item-name hn-bdcn">
          {{ displayName(item.nombre) }}
        </div>
        <!-- <div class="item-subname hn-bdcn">
                    {{$helpers.traducir(item.marca)}},
                    {{$helpers.traducir($helpers.findTransmissionLocale(item.transmision))}}
                </div> -->
        <div
          class="item-provider hn-bdcn"
          :class="{ viaCar: item.provider == 'Via Car' }"
        >
          <img :src="item.providerImage" :alt="item.provider" />
        </div>
        <div class="item-info-icon">
          <div class="item-info-icon-people">
            <div class="iii-info-item iii-info-icon">
              <i class="mdi mdi-account"></i>
            </div>
            <div class="iii-info-item iii-info-text">{{ item.plazas }}</div>
          </div>
          <div class="item-info-icon-transmission">
            <div class="iii-info-item iii-info-icon">
              <i class="mdi mdi-engine"></i>
            </div>
            <div class="iii-info-item iii-info-text">
              {{
                displayTransmission(
                  $helpers.traducir(
                    $helpers.findTransmissionLocale(item.transmision)
                  )
                )
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="list-item-price">
        <div class="price-wrapper">
          <div class="hn-mdcn better-price">Precio para:</div>
          <span class="hn-roman total-days font20"
            >{{ totalDays }} día(s)
          </span>
          <span class="hn-roman has-insurance font20">
            <template v-if="item.seguro">
              <template>({{ item.seguro.toLowerCase() }})</template>
            </template>
          </span>
          <div class="price antonio-light">
            {{ styledPrice(item.precio).intPart }} USD
          </div>
          <div class="details-btn form-actions" v-if="!noDetail">
            <button
              type="submit"
              @click="goDetails(item.id)"
              class="antonio-regular"
            >
              Ver ofertas
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="list-item-children">
      <RentResultListRow
        :child="item"
        :onlyToSelect="onlyToSelect"
        @selectedElementEditRow="emitElement"
      >
      </RentResultListRow>
    </div>
    <!-- <div class="open-close-button" @click="openList">
            <i class="mdi" :class="{'mdi-chevron-double-down': !isOpen,
                                                            'mdi-chevron-double-up': isOpen}"></i>
        </div> -->
  </div>
</template>

<script>
import RentResultListRow from "./RentResultListRow";
import { constructDisplay } from "../../utils/utils";
export default {
  components: {
    RentResultListRow,
  },
  props: {
    item: Object,
    totalDays: {
      type: Number,
      default: 0,
    },
    onlyToSelect: {
      type: Boolean,
      default: false,
    },
    noDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // isOpen: false,
      limit: 2,
    };
  },
  computed: {
    filteredItems: function() {
      return this.item.items.slice(0, this.limit);
    },
  },
  methods: {
    constructDisplay,
    emitElement(value) {
      this.$emit("selectedElementEditItem", value);
    },
    goDetails(id) {
      this.$router.push({
        name: "rent-detail",
        params: {
          id: id,
        },
      });
    },
    hasInsurance(tString) {
      console.log(tString);
      let t = tString.split(" ").length;
      return t > 1;
    },
    displayTransmission(item) {
      return item.split(" ")[0].toLowerCase();
    },
    displayName(data) {
      let data_splitted = data.split("-");
      let sp = data_splitted.slice(1, data_splitted.lenght);

      return sp.join("-");
    },
    openList() {
      if (!this.isOpen) {
        this.limit = this.item.items.lenght;
      } else {
        this.limit = 2;
      }
      this.isOpen = !this.isOpen;
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = (number - intPart).toFixed(2) * 100;

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
  },
};
</script>
