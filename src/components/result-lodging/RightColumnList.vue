<template>
  <div id="right-column-list">
    <ResultList
      :resultList="currentList"
      :filters="filters"
      :todosTipo="todosTipo"
    ></ResultList>
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
import ResultList from "./ResultList.vue";
import _ from "lodash";

const props = defineProps<{
  filters: any;
  resultList: any[];
  perPage?: number;
  todosTipo: any[];
  order?: { displayName: string; code: string };
}>();

const emit = defineEmits<{
  (e: "resultSize", size: number): void;
}>();

const total = ref(1);
const currentList = ref<any[]>([]);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(total.value / (props.perPage || 1)),
);

onMounted(() => {
  getList(currentPage.value);
  total.value = props.resultList.length;
  emit("resultSize", total.value);
});

watch(
  () => props.order,
  (val) => {
    if (!val) return;
    if (val.code == "price_desc") {
      currentList.value = _.orderBy(
        currentList.value,
        (o: any) => {
          let r = getMinPrice(o.habitaciones)?.combinacion?.total ?? 0;
          return r;
        },
        "desc",
      );
    } else {
      currentList.value = _.orderBy(
        currentList.value,
        (o: any) => {
          return getMinPrice(o.habitaciones)?.combinacion?.total ?? 0;
        },
        "asc",
      );
    }
  },
  { deep: true },
);

function getOthers(event: Event, page: number) {
  getList(page);
}

function getList(page: number) {
  let min = (props.perPage || 1) * page - (props.perPage || 1);
  let max = (props.perPage || 1) * page;
  currentList.value = props.resultList.slice(min, max);
  document
    .querySelector("#right-column-list-wrapper")
    ?.scrollIntoView({ behavior: "smooth" });
}

function getMinPrice(array: any[]) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  return _.minBy(array, function (e: any) {
    return e.combinacion?.total ?? 0;
  });
}
</script>
