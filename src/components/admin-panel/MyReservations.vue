<template>
  <div id="my-reservations">
    <div id="r-filters" class="br-10">
      <div id="r-filters-title" class="hn-bdcn font24 gtt-first-color">
        Buscar Reservaciones
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">Nombre de la orden</div>
            <div class="filter-input">
              <input
                type="text"
                placeholder="Nombre de la orden"
                v-model="filtroNombreOrden"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">Número de orden</div>
            <div class="filter-input">
              <input
                type="text"
                placeholder="Número de orden"
                v-model="filtroNumeroOrden"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">Estados</div>
            <div class="filter-input">
              <!-- <input type="text" placeholder="Estado" v-model="filtroEstado"> -->
              <select
                class="gtt__multiselect form-select"
                v-model="filtroEstado"
                multiple
              >
                <option
                  v-for="estado in estados"
                  :key="estado.value"
                  :value="estado"
                >
                  {{ estado.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">Fecha de inicio</div>
            <div class="filter-input">
              <input
                type="date"
                v-model="filtroFechaInicio"
                placeholder="Fecha de Inicio"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">Fecha de cierre</div>
            <div class="filter-input">
              <input
                type="date"
                v-model="filtroFechaFin"
                placeholder="Fecha de cierre"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="form-actions flex-wrapper" id="rfa">
        <button @click="search" type="submit" class="antonio-regular ml-auto">
          Buscar
        </button>
      </div>
    </div>
    <div id="r-results">
      <div id="r-header" class="flex-wrapper hn-roman pb-15">
        Se encontraron {{ totalItems }} reservaciones en estas fechas
      </div>
      <div id="r-table">
        <div v-if="searching" class="text-center text-danger my-2">
          <span class="gtt-spinner"></span>
          <strong>Buscando...</strong>
        </div>
        <table class="gtt-table gtt-table-hover gtt-table-sm" v-else>
          <thead class="gttTableHeader">
            <tr>
              <th v-for="field in fields" :key="field">{{ field }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="index"
              :class="rowClass(item, 'row')"
              @click="goDetails(item)"
            >
              <td v-for="field in fields" :key="field">
                <template v-if="field === 'estado'">
                  <span class="estado">{{ traducir(item[field]) }}</span>
                </template>
                <template v-else>{{ item[field] }}</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authGetOrders, authGetOrdersCount } from "../../utils/auth";
import { helpers } from "../../utils/helpers";
import moment from "moment";
import { toast } from "vue3-toastify";
import axios from "axios";

defineOptions({ name: "MyReservations" });

const props = defineProps<{
  user?: any;
}>();

const router = useRouter();

const emit = defineEmits<{
  (e: "adminPanelInfo", value: string): void;
}>();

const currentPage = ref(1);
const searching = ref(false);
const totalItems = ref(0);
const filters = ref<Record<string, any>>({
  IsRiesgo: null,
  TipoServicio: 0,
  col: 0,
  pageIndex: 1,
  pageSize: 20,
});
const estados = ref([
  {
    value: "Open",
    name: helpers.traducir("Open"),
  },
  {
    value: "Confirmed",
    name: helpers.traducir("Confirmed"),
  },
  {
    value: "Accepted",
    name: helpers.traducir("Accepted"),
  },
  {
    value: "Rejected",
    name: helpers.traducir("Rejected"),
  },
  {
    value: "Autorized",
    name: helpers.traducir("Autorized"),
  },
  {
    value: "Closed",
    name: helpers.traducir("Closed"),
  },
  {
    value: "Pending",
    name: helpers.traducir("Pending"),
  },
]);
const fields = ref([
  "númeroOrden",
  "nombreOrden",
  "fechaCreación",
  "fechaInicio",
  "fechaFin",
  "estado",
]);
const items = ref<any[]>([]);
const filtroNombreOrden = ref("");
const filtroNumeroOrden = ref("");
const filtroEstado = ref([
  { value: "Open", name: "Abierta" },
  { value: "Confirmed", name: "Confirmada" },
  { value: "Pending", name: "Pendiente" },
  { value: "Rejected", name: "Rechazada" },
]);
const filtroFechaInicio = ref(
  new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
);
const filtroFechaFin = ref("");

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / 10);
});

onMounted(async () => {
  emit("adminPanelInfo", "reservation");

  searching.value = true;
  await search();
  searching.value = false;
});

function goDetails(item: any) {
  router.push({
    name: "reservation-detail",
    params: {
      id: item.ordenId,
    },
  });
}

function getOthers(event: Event, page: number) {
  getList(page);
}

async function getList(page: number) {
  filters.value.pageIndex = page;
  await search();
}

function constructFilterObj() {
  filters.value.Nombre = filtroNombreOrden.value;
  filters.value.NumeroOrden = filtroNumeroOrden.value;
  filters.value.Estados = filtroEstado.value.map((item) => {
    return item.value;
  });

  filters.value.FechaI = (filtroFechaInicio.value as Date)
    .toISOString()
    .split("T")[0];
  if (filters.value.FechaF) {
    if (import.meta.env.DEV) {
      console.log("hay fecha fin ");
    }
    filters.value.FechaF = toMoment(filtroFechaFin.value);
  }

  filters.value.ClienteId = props.user.clienteId;
}

function traducir(item: string) {
  return helpers.traducir(item);
}

function toMoment(date: any) {
  return moment(date);
}

async function search() {
  if (filtroEstado.value.length == 0) {
    alert("Debe introducir un estado");
  } else {
    const versionActual = JSON.parse(localStorage.getItem("version") || "null");

    if (!versionActual) {
      const response = await axios.get(
        "http://gottours-001-site4.mtempurl.com/publicEliecer/api//Versions/1",
      );
      localStorage.setItem("version", JSON.stringify(response.data));
      toast(`Nueva version instalada`, {
        autoClose: 86400000,
      });
    } else {
      const response = await axios.get(
        "http://gottours-001-site4.mtempurl.com/publicEliecer/api//Versions/1",
      );
      const data = response.data;
      if (versionActual.VersionName != data.VersionName) {
        toast(`Nueva version.Actualizar?`, {
          autoClose: false,
          closeButton: true,
        });
      }
    }

    constructFilterObj();
    searching.value = true;
    totalItems.value = await searchOrdersCount(filters.value);
    items.value = await searchOrders(filters.value);
    searching.value = false;
  }
}

async function searchOrdersCount(filters: any) {
  let { data } = await authGetOrdersCount(filters);

  return data;
}

async function searchOrders(filters: any) {
  try {
    if (import.meta.env.DEV) {
      console.log("filtros", filters);
    }
    let { data } = await authGetOrders(filters);
    if (import.meta.env.DEV) {
      console.log(data);
    }
    return data.map((item: any) => {
      return {
        númeroOrden: item.NumeroOrden,
        nombreOrden: item.OrdenNombre,
        fechaInicio: toMoment(item.FechaInicio).format("DD/MM/YYYY"),
        fechaFin: toMoment(item.FechaFin).format("DD/MM/YYYY"),
        fechaCreación: toMoment(item.FechaCreacion).format("DD/MM/YYYY"),
        ordenId: item.OrdenId,
        estado: item.Estado,
      };
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.log(error);
    }
  }
}

function rowClass(item: any, type: string) {
  if (!item || type !== "row") return;
  if (item.estado === "Confirmed") return "r-table-success";
  if (item.estado === "Rejected") return "r-table-danger";
  if (item.estado === "Open") return "r-table-open";
  if (item.estado === "Closed") return "r-table-close";
  if (item.estado === "Pending") return "r-table-pending";
}
</script>
