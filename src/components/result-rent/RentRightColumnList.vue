<template>
  <div id="right-column-list">
    <div class="map-wrapper">
      <div class="left-side-map">
        <div class="custom-line-1">
          <img src="../../../public/img/icopaq_renta_gris.svg" alt="alquiler" />
          <div class="result-search">
            <div class="result-search-text-title antonio-regular">
              Hemos encontrado del
              {{
                toMoment(filter.pickUpDate).locale("es").format("DD MMM YYYY")
              }}
              al
              {{
                toMoment(filter.deliveryDate).locale("es").format("DD MMM YYYY")
              }}
              {{ resultTotal }} autos.
            </div>
          </div>
        </div>
        <div class="custom-line-2">
          <div class="organizedBySelect">
            <GttSelect
              :options="organizedBy"
              :twoRows="false"
              v-model="selectedOrganizeType"
            >
              <template #iconSelectedValue>
                <i class="mdi mdi-swap-vertical"></i>
              </template>
              <template #placeholder>Organizar por</template>
              <template #option="option">
                {{ option.option.displayName }}
              </template>
              <template #selectedValue="selectedValue">
                <span id="selectedPickUp">{{
                  selectedValue.selectedValue.displayName
                }}</span>
              </template>
            </GttSelect>
          </div>
        </div>
      </div>
      <div class="right-side-map">
        <img src="../../../public/img/icomap.svg" alt="mapa" />
      </div>
    </div>
    <RentResultList
      :resultList="currentList"
      :onlyToSelect="onlyToSelect"
      :totalDays="
        calculateNights(
          toMoment(filter.deliveryDate).toDate(),
          toMoment(filter.pickUpDate).toDate(),
        )
      "
    >
    </RentResultList>
    <div class="pagination-section">
      <nav aria-label="Paginación">
        <ul class="gtt-pagination">
          <li class="gtt-page-item" :class="{ disabled: currentPage <= 1 }">
            <a
              class="gtt-page-link"
              href="#"
              @click.prevent="
                currentPage > 1 && getOthers($event, currentPage - 1)
              "
              >&laquo;</a
            >
          </li>
          <li
            class="gtt-page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <a
              class="gtt-page-link"
              href="#"
              @click.prevent="getOthers($event, page)"
              >{{ page }}</a
            >
          </li>
          <li
            class="gtt-page-item"
            :class="{ disabled: currentPage >= totalPages }"
          >
            <a
              class="gtt-page-link"
              href="#"
              @click.prevent="
                currentPage < totalPages && getOthers($event, currentPage + 1)
              "
              >&raquo;</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import RentResultList from "./RentResultList.vue";
import moment from "moment";
import GttSelect from "../custom-elements/GttSelect.vue";
import { calculateNights } from "../../utils/utils";
import _ from "lodash";

const props = defineProps<{
  list: any[];
  perPage?: number;
  resultTotal: number;
  onlyToSelect: boolean;
}>();

const total = ref(1);
const currentList = ref<any[]>([]);
const currentPage = ref(1);
const filter = ref<any>({});
const selectedOrganizeType = ref({
  displayName: "Precio (asc)",
  code: "price_asc",
});
const organizedBy = ref([
  { displayName: "Precio (asc)", code: "price_asc" },
  { displayName: "Precio (desc)", code: "price_desc" },
]);

const totalPages = computed(() =>
  Math.ceil(total.value / (props.perPage || 1)),
);

filter.value = JSON.parse(localStorage.getItem("searchRentFilters") || "{}");

onMounted(() => {
  getList(currentPage.value);
  total.value = props.list.length;
});

watch(selectedOrganizeType, (val) => {
  if (val.code == "price_desc") {
    currentList.value = _.orderBy(
      currentList.value,
      (o: any) => o.precio,
      "desc",
    );
  } else {
    currentList.value = _.orderBy(
      currentList.value,
      (o: any) => o.precio,
      "asc",
    );
  }
});

function toMoment(date: string) {
  return moment(date);
}

function getOthers(event: Event, page: number) {
  getList(page);
}

function getList(page: number) {
  let min = (props.perPage || 1) * page - (props.perPage || 1);
  let max = (props.perPage || 1) * page;
  currentList.value = props.list.slice(min, max);
  document
    .querySelector("#right-column-list")
    ?.scrollIntoView({ behavior: "smooth" });
}
</script>
