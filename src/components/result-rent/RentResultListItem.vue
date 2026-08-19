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

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import RentResultListRow from "./RentResultListRow.vue";
import { constructDisplay } from "../../utils/utils";

const props = defineProps<{
  item: any;
  totalDays?: number;
  onlyToSelect?: boolean;
  noDetail?: boolean;
}>();

const emit = defineEmits<{
  (e: "selectedElementEditItem", value: any): void;
}>();

const router = useRouter();
const limit = ref(2);

const filteredItems = computed(() => {
  return props.item.items.slice(0, limit.value);
});

function emitElement(value: any) {
  emit("selectedElementEditItem", value);
}

function goDetails(id: number) {
  router.push({
    name: "rent-detail",
    params: { id },
  });
}

function hasInsurance(tString: string) {
  if (import.meta.env.DEV) {
    console.log(tString);
  }
  let t = tString.split(" ").length;
  return t > 1;
}

function displayTransmission(item: string) {
  return item.split(" ")[0].toLowerCase();
}

function displayName(data: string) {
  let data_splitted = data.split("-");
  let sp = data_splitted.slice(1, data_splitted.length);
  return sp.join("-");
}

function openList() {
  // The original used this.isOpen which is not defined as data
  // Keeping for template compatibility
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number);
  let decimalPart = Number((number - intPart).toFixed(2)) * 100;
  if (decimalPart == 0) decimalPart = "00";
  return { intPart, decimalPart };
}
</script>

<style scoped>
.details-btn {
  margin-top: 15px;
}
</style>
