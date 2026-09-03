<template>
  <div id="rent-reservation-view">
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
                    $helpers.findTransmissionLocale(item.transmision),
                  ),
                )
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="list-item-price">
        <div class="price-wrapper">
          <GttTwoRowsInfo :value="getDateRecogida(item)" class="info-item">
            <template #tr-icon-slot>
              <i class="mdi mdi-calendar"></i>
            </template>
            <template #tr-info-name> Fecha de recogida </template>
          </GttTwoRowsInfo>
          <GttTwoRowsInfo :value="getDateEntrega(item)" class="info-item">
            <template #tr-icon-slot>
              <i class="mdi mdi-calendar"></i>
            </template>
            <template #tr-info-name> Fecha de entrega </template>
          </GttTwoRowsInfo>
          <GttTwoRowsInfo class="info-item" :value="getDiff()">
            <template #tr-icon-slot>
              <i class="mdi mdi-calendar-week"></i>
            </template>
            <template #tr-info-name> Día(s) reservados </template>
          </GttTwoRowsInfo>
          <!-- <GttTwoRowsInfo
            class="info-item"
            :value="
              displayTransmission(
                $helpers.traducir(
                  $helpers.findTransmissionLocale(item.transmision)
                )
              )
            "
          >
            <template slot="tr-icon-slot">
              <i class="mdi mdi-car"></i>
            </template>
            <template slot="tr-info-name">
              Tipo de transmisión
            </template>
          </GttTwoRowsInfo> -->
          <GttTwoRowsInfo :value="item.seguro" class="info-item">
            <template #tr-icon-slot>
              <i class="mdi mdi-shield-car"></i>
            </template>
            <template #tr-info-name> Seguro </template>
          </GttTwoRowsInfo>
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
              <slot name="itemChildrenNameSlot" v-bind:child="item">
                {{ $helpers.traducir(item.marca) }}
                {{
                  $helpers.traducir(
                    $helpers.findTransmissionLocale(item.transmision),
                  )
                }}
              </slot>
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
                    Detalle de la renta
                  </div>
                  <div
                    v-if="ordenId != -1 && hasVoucher"
                    class="ml-auto font24 printer-button"
                  >
                    <a
                      :class="{ divDisabled: UrlVoucher == '' }"
                      :href="UrlVoucher"
                      target="_blank"
                    >
                      <i class="mdi mdi-printer"></i>
                    </a>
                  </div>
                </div>
                <br />
                <p class="gtt-text-color general-text-opt">
                  Punto de recogida: {{ displayIfNoneLugarRecogida(item) }}
                </p>
                <p class="gtt-text-color general-text-opt">
                  Punto de entrega: {{ displayIfNoneLugarEntrega(item) }}
                </p>
                <p class="gtt-text-color general-text-opt">
                  Plazas: {{ item.plazas }}
                </p>
                <p class="gtt-text-color general-text-opt">
                  Transmisión:
                  {{
                    displayTransmission(
                      $helpers.traducir(
                        $helpers.findTransmissionLocale(item.transmision),
                      ),
                    )
                  }}
                </p>
                <br />
                <div class="tab-precio flex-wrapper">
                  <div
                    class="to-uppercase hn-roman gtt-text-color flex-left-side"
                  >
                    Precio total
                  </div>
                  <div
                    class="to-uppercase hn-roman gtt-text-color flex-right-side font24"
                  >
                    {{ styledPrice(item.precio).intPart }} USD
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
<script setup lang="ts">
import { ref, onMounted } from "vue";
import GttTwoRowsInfo from "../custom-elements/GttTwoRowsInfo.vue";
import moment from "moment";
import { voucher } from "../../utils/auth";

const props = defineProps<{
  overDay?: number;
  item: any;
  can?: boolean;
  ordenId?: any;
  hasVoucher?: boolean;
}>();

const selectedInfo = ref("info");
const UrlVoucher = ref("");

onMounted(async () => {
  await getVoucher();
});

function getDateEntrega(item: any) {
  moment.locale("es");
  return toMoment(item.orderVehiculo.FechaEntrega).format("DD MMMM YYYY");
}

function getDateRecogida(item: any) {
  moment.locale("es");
  return toMoment(item.orderVehiculo.FechaRecogida).format("DD MMMM YYYY");
}

function getDiff() {
  return constructDates(
    props.item.orderVehiculo.FechaRecogida,
    props.item.orderVehiculo.FechaEntrega,
  );
}

function constructDates(startDate: string, endDate: string) {
  let start = moment(startDate);
  let end = moment(endDate);
  let diff = start.diff(end, "days") * -1;
  let dayNightString = "";
  if (diff > 1) dayNightString = " días";
  else dayNightString = " día";
  return (props.overDay || 0) + diff + dayNightString;
}

function displayIfNoneLugarRecogida(item: any) {
  return item.orderVehiculo.LugarRecogida
    ? item.orderVehiculo.LugarRecogida.nombre
    : "N/A";
}

function displayIfNoneLugarEntrega(item: any) {
  return item.orderVehiculo.LugarEntrega
    ? item.orderVehiculo.LugarEntrega.nombre
    : "N/A";
}

function toMoment(date: string) {
  return moment(date);
}

function selectInfo(section: string) {
  if (selectedInfo.value == section) {
    selectedInfo.value = "";
  } else {
    selectedInfo.value = section;
  }
}

function openList() {
  // This function references this.isOpen and this.limit which don't exist as data
  // Keeping for compatibility but it has no effect
}

function styledPrice(number: number) {
  let intPart = Math.floor(number);
  let decimalPart: number | string =
    Number((number - intPart).toFixed(2)) * 100;
  if (decimalPart == 0) decimalPart = "00";
  return { intPart, decimalPart };
}

function displayTransmission(item: string) {
  return item.split(" ")[0].toLowerCase();
}

function displayName(data: string) {
  let data_splitted = data.split("-");
  if (data_splitted.length == 1) {
    return data;
  }
  let sp = data_splitted.slice(1, data_splitted.length);
  return sp.join("-");
}

async function getVoucher() {
  try {
    let v = await voucher(props.ordenId);
    if (import.meta.env.DEV) {
      console.log(v.data);
    }
    if (v.data.length == 0) {
      UrlVoucher.value =
        `//admin.gotravelandtours.com/#/dasboard/admin/voucher?id=` +
        props.ordenId +
        `&type=Vehicle&position=0`;
    } else {
      UrlVoucher.value = v.data[0].UrlVoucher;
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.log(e);
    }
    return null;
  }
}
</script>
<style scoped>
.divDisabled {
  pointer-events: none;
  color: #6d6d6d;
}
.info-item {
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
</style>
