<template>
  <div class="lodging-reservation-view">
    <div class="list-item-general">
      <div class="list-item-carousel">
        <div class="result-images-carousel">
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
              <img v-bind:src="destinyImage" alt="" />
            </div>
          </Slick>
        </div>
      </div>
      <div class="list-item-info">
        <div class="item-name hn-bdcn">
          {{ item.name }}
        </div>
        <div class="item-hotel-stars" v-if="item.stars">
          <ul class="stars">
            <li v-for="i in item.stars" :key="i">
              <i class="mdi mdi-star"></i>
            </li>
          </ul>
        </div>
        <div class="item-location" v-if="item.location">
          <span class="c-space"><i class="mdi mdi-map-marker"></i></span
          >{{ item.location }}
        </div>
        <div class="item-map-link" v-if="item.mapLink">
          <span class="c-space"><i class="mdi mdi-map"></i></span>
          <a :href="item.mapLink" class="map-location">Ubicación en el mapa</a>
        </div>
      </div>
      <div class="list-item-price">
        <div class="price-wrapper">
          <GttTwoRowsInfo :value="getDateEntrada(item)" class="info-item">
            <template slot="tr-icon-slot">
              <i class="mdi mdi-calendar"></i>
            </template>
            <template slot="tr-info-name"> Fecha de entrada </template>
          </GttTwoRowsInfo>
          <GttTwoRowsInfo :value="getDateSalida(item)" class="info-item">
            <template slot="tr-icon-slot">
              <i class="mdi mdi-calendar"></i>
            </template>
            <template slot="tr-info-name"> Fecha de salida </template>
          </GttTwoRowsInfo>
          <GttTwoRowsInfo :value="getVisitantes(item)" class="info-item">
            <template slot="tr-icon-slot">
              <i class="mdi mdi-account"></i>
            </template>
            <template slot="tr-info-name"> Visitantes </template>
          </GttTwoRowsInfo>
          <GttTwoRowsInfo :value="getHabitaciones(item)" class="info-item">
            <template slot="tr-icon-slot">
              <i class="mdi mdi-bed"></i>
            </template>
            <template slot="tr-info-name"> Habitaciones </template>
          </GttTwoRowsInfo>
          <!-- <GttTwoRowsInfo
            class="info-item"
            :value="getDiff()"
          >
            <template slot="tr-icon-slot">
              <i class="mdi mdi-calendar-week"></i>
            </template>
            <template slot="tr-info-name">
              Día(s) reservados
            </template>
          </GttTwoRowsInfo> -->
        </div>
      </div>
    </div>
    <div class="list-item-children">
      <div class="item-children">
        <div class="children-wrapper">
          <div class="item-children-header">
            <div class="item-children-info-btn">
              <button
                type="button"
                class="btn-children-info"
                :class="{ selected: selectedInfo == 'info' }"
                @click="selectInfo('info')"
              >
                <i class="mdi mdi-clipboard-text"></i>
              </button>
            </div>
            <div class="item-children-name hn-bdcn">
              {{ item.reservedRooms.name }}
            </div>
            <div class="item-children-right-part" v-if="can">
              <!-- <div class="item-children-price hn-roman">
                                <slot name="itemChildrenPriceSlot" v-bind:child="child">
                                    {{ styledPrice(child.precio).intPart}}.<sup>{{ styledPrice(child.precio).decimalPart}}</sup> USD
                                </slot>
                            </div> -->
              <div class="item-children-reserve form-actions">
                <button
                  type="button"
                  class="antonio-regular inverse btn-cart"
                  @click="$emit('edit', item)"
                >
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button
                  type="submit"
                  class="antonio-regular inverse btn-cart"
                  @click="$emit('remove', item)"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="item-children-content hn-roman">
            <div
              class="item-children-content-info font18"
              v-if="selectedInfo == 'info'"
            >
              <slot name="itemContentInfoSlot" v-bind:child="item">
                <div class="flex-wrapper">
                  <div class="to-uppercase hn-roman gtt-text-color">
                    Desglose del alojamiento
                  </div>
                  <div
                    class="ml-auto font24 printer-button"
                    v-if="ordenId != -1 && this.Voucher"
                  >
                    <!-- :class="{divDisabled: !hasVoucher}"> -->
                    <a :href="UrlVoucher" target="_blank">
                      <i class="mdi mdi-printer"></i>
                    </a>
                  </div>
                </div>
                <br />
                <div
                  class="flex-wrapper lodging-reservation-view"
                  v-for="(room, pos) in item.reservedRooms"
                  :key="room.id"
                >
                  <div class="to-left">
                    Hab. {{ pos + 1 }}, {{ room.CantAdulto }} adulto(s)
                    <template v-if="room.CantNino > 0">
                      y {{ room.CantNino }} niño(s)
                    </template>
                    <template v-else> sin niños</template>
                  </div>
                  <div class="payment-status">
                    <span v-if="room.IsPagado" class="paid-status">
                      <i class="mdi mdi-check-circle"></i> Pagado
                    </span>
                    <span v-else class="unpaid-status">
                      <i class="mdi mdi-alert-circle"></i> No pagado
                    </span>
                    <span v-if="room.IsPagado && room.FormaPago" class="payment-method">
                      <i class="mdi mdi-cash-multiple"></i> {{ room.FormaPago }}
                    </span>
                  </div>
                  <div class="to-right">
                    <div class="details-btn" v-if="state == 'Confirmed'">
                      <button
                        type="button"
                        class="payment-btn antonio-regular"
                         v-if="!room.IsPagado"
                        @click="openModalToPay(item, room, itemIndex)"
                      >
                        <i class="mdi mdi-cash"></i> Pagar
                      </button>
                    </div>
                    <div class="to-uppercase hn-roman gtt-text-color">
                      {{ room.CantidadHabitaciones }} X
                      {{ styledPrice(room.PrecioOrden).intPart }} USD
                    </div>
                  </div>
                </div>
                <!-- <p class="gtt-text-color general-text-opt">
                  Punto de recogida: {{ displayIfNoneLugarRecogida(item) }}
                </p>
                <p class="gtt-text-color general-text-opt">
                  Punto de entrega: {{ displayIfNoneLugarEntrega(item) }}
                </p>
                <p class="gtt-text-color general-text-opt">
                  Plazas: {{ item.plazas }}
                </p> -->
                <br />
                <div class="tab-precio flex-wrapper">
                  <div
                    class="to-uppercase hn-roman gtt-text-color flex-left-side"
                  >
                    Precio total
                  </div>
                  <div
                    class="
                      to-uppercase
                      hn-roman
                      gtt-text-color
                      flex-right-side
                      font24
                    "
                  >
                    {{ getTotal }} USD
                  </div>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GttTwoRowsInfo from "../custom-elements/GttTwoRowsInfo";
import Slick from "vue-slick-carousel";
import moment from "moment";

export default {
  created() {},
  components: {
    Slick,
    GttTwoRowsInfo,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
    itemIndex: {
      type: Number,
      default: -1,
    },
    can: {
      type: Boolean,
      default: false,
    },
    ordenId: {
      default: -1,
    },
    hasVoucher: {
      default: false,
      type: Boolean,
    },
    state: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedInfo: "info",
      pos: 1,
    };
  },
  computed: {
    // a computed getter
    getTotal: function() {
      let total = 0;
      this.item.reservedRooms.map((x) => {
        total += x.CantidadHabitaciones * x.PrecioOrden;
      });
      return total;
    },
  },
  methods: {
    getVisitantes(item) {
      let totalA = 0;
      let totalN = 0;
      item.reservedRooms.forEach((i) => {
        totalA = totalA + i.CantAdulto;
        totalN = totalN + i.CantNino;
      });

      return `${totalA} Adulto(s) · ${totalN} Niño(s)`;
    },
    getHabitaciones(item) {
      return `${item.reservedRooms.length} Habitación(es)`;
    },
    addPos() {
      this.pos = this.pos + 1;
      return this.pos;
    },
    selectInfo(section) {
      if (this.selectedInfo == section) {
        this.selectedInfo = "";
      } else {
        this.selectedInfo = section;
      }
    },
    toMoment(date) {
      return moment(date);
    },
    getDateEntrada(item) {
      moment.locale("es");
      return this.toMoment(item.entrada).format("DD MMMM YYYY");
    },
    getDateSalida(item) {
      moment.locale("es");
      return this.toMoment(item.salida).format("DD MMMM YYYY");
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = Math.round((number - intPart) * 100);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
    openModalToPay(order, room, itemIndex) {
      this.$emit('open-modal-to-pay', order, room, itemIndex);
    },
  },
};
</script>
  margin-bottom: 10px;
}
.btn-cart {
  margin-right: 5px;
  width: 50px;
}
.children-wrapper {
  border-bottom: 1px solid #c4c4c4;
}
.item-children-header {
  padding-bottom: 5px;
  display: flex;
}
.item-children-content {
  padding-right: 60px;
  padding-left: 60px;
}
.item-children-content-info {
  padding-bottom: 30px;
  /* font-size: 14px; */
}
.item-children-content-info p {
  margin-bottom: 5px;
}
.item-children-content pre {
  font-size: 16px;
  color: #6d6d6d;
  white-space: pre-wrap;
}
.item-children {
  /* display: flex; */
}
.item-children-name {
  margin-right: auto;
  color: #6d6d6d;
  font-size: 20px;
  width: 20%;
}
.item-children-section {
  color: #6d6d6d;
  font-size: 24px;
  display: flex;
}

.item-children-section-item {
  padding-right: 25px;
  align-self: center;
  font-size: 30px !important;
}
.item-children-section-icon {
  font-size: 30px !important;
  color: #212f3d;
  align-self: center;
}
.item-children-right-part {
  margin-left: auto;
  display: flex;
}
.item-children-price {
  padding-right: 60px;
  color: #6d6d6d;
  font-size: 24px;
}
.item-children-info-btn {
  font-size: 24px;
  color: #212f3d;
  padding-right: 20px;
}
.item-children-info-btn button {
  border: none;
  background-color: transparent;
}
.item-children-info-btn button:hover {
  cursor: pointer;
}
.item-children-info-btn button:focus {
  border: none;
  outline: none;
}
.item-children-name,
.item-children-section,
.item-children-price,
.item-children-info-btn {
  align-self: center;
}
.selected {
  color: #c4c4c4;
}
.item-children-reserve button {
  font-size: 24px;
}
.printer-button a {
  color: #212f3d;
}
.printer-button a:hover {
  color: #0056b3;
}
.divDisabled {
  pointer-events: none;
  color: #6d6d6d;
}
@media (max-width: 1440px) {
  .item-children-info-btn {
    font-size: 18px;
  }
  .item-children-name {
    font-size: 12px;
  }
  .item-children-section {
    color: #6d6d6d;
    font-size: 18px;
    display: flex;
  }
  .item-children-content-info {
    font-size: 12px;
  }
}
.flex-wrapper.lodging-reservation-view {
  display: flex;
  align-items: center;
  font-size: 12px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding-left: 15px;
  gap: 10px;
  justify-content: space-between;
  padding-bottom: 8px;
}
/* .to-right.details-btn {
  width: 100px;
  max-width: 100px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.details-btn button:hover {
  cursor: pointer;
}
.details-btn button:focus {
  border: none;
  outline: none;
} */
.to-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.payment-btn.antonio-regular {
  background-color: #11491e !important;
  color: #fff !important;
  border-radius: 4px !important;
  border: 1px solid transparent !important; /* <-- Cambiado aquí */
  padding: 4px 10px !important;
  margin-right: 15px;
  font-size: 10px;
  float: right;
  transition: background 0.2s, color 0.2s, border-color 0.2s; /* <-- Añadido border-color */
}
.payment-btn.antonio-regular:hover,
.payment-btn.antonio-regular:focus {
  background-color: #fff !important;
  color: #11491e !important;
  border: 1px solid #11491e !important;
  outline: none;
  cursor: pointer;
  padding: 4px 10px !important;
  font-size: 10px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.payment-status {
  color: #6d6d6d;
}
.payment-status i {
  color: #6d6d6d;
}
.payment-status .paid-status {
  color: green;
}
.payment-status .unpaid-status {
  color: red;
}
.payment-status .payment-method {
  color: #333;
  margin-left: 16px;
}
.payment-status .payment-method i {
  color: #333;
}
.payment-status .unpaid-status i {
  color: red;
}
.payment-status .paid-status i {
  color: green;
}
.payment-status .mdi-alert-circle {
  color: red;
}
.payment-status .mdi-check-circle {
  color: green;
}
.payment-status .mdi-credit-card {
  color: #333;
}
.payment-status .mdi-calendar {
  color: #333;
}
.payment-status .mdi-account {
  color: #333;
}
.payment-status .mdi-calendar-week {
  color: #333;
}
</style>
