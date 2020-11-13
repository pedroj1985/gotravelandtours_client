<template>
  <div id="my-reservations">
    <div id="r-filters" class="br-10">
      <div id="r-filters-title" class="hn-bdcn font24 gtt-first-color">
        Buscar Reservaciones
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">
              Nombre de la orden
            </div>
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
            <div class="filter-title">
              Número de orden
            </div>
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
            <div class="filter-title">
              Estados
            </div>
            <div class="filter-input">
              <!-- <input type="text" placeholder="Estado" v-model="filtroEstado"> -->
              <multiselect
                class="gtt__multiselect"
                v-model="filtroEstado"
                placeholder="Estados"
                label="name"
                track-by="value"
                :options="estados"
                :multiple="true"
                :taggable="true"
                :searchable="false"
              ></multiselect>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">
              Fecha de inicio
            </div>
            <div class="filter-input">
              <v-date-picker
                v-model="filtroFechaInicio"
                mode="single"
                locale="es"
                :input-props="{
                  placeholder: 'Fecha de Inicio',
                  readonly: true
                }"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="filter-wrapper">
            <div class="filter-title">
              Fecha de cierre
            </div>
            <div class="filter-input">
              <v-date-picker
                v-model="filtroFechaFin"
                mode="single"
                locale="es"
                :input-props="{
                  placeholder: 'Fecha de cierre',
                  readonly: true
                }"
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
        Se encontraron {{ totalItems }} reservaciones
      </div>
      <div id="r-table">
        <b-table
          :items="items"
          :fields="fields"
          small
          hover
          :busy="searching"
          :tbody-tr-class="rowClass"
          :thead-class="'gttTableHeader'"
          @row-clicked="goDetails"
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Buscando...</strong>
            </div>
          </template>
          <template #cell(estado)="data">
            <span class="estado">{{ traducir(data.item.estado) }}</span>
          </template>
        </b-table>
      </div>
      <div class="pagination-section">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalItems"
          :per-page="10"
          @page-click="getOthers"
          align="center"
          class="custom-page-container"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { authGetOrders, authGetOrdersCount } from "../../utils/auth";
import moment from "moment";

export default {
  async created() {
    this.$emit("adminPanelInfo", "reservation");

    this.searching = true;
    await this.search();
    this.searching = false;
  },
  props: {
    user: {
      type: Object
    }
  },
  methods: {
    goDetails(item) {
      this.$router.push({
        name: "reservation-detail",
        params: {
          id: item.ordenId
        }
      });
    },
    getOthers(event, page) {
      this.getList(page);
    },
    async getList(page) {
      this.filters.pageIndex = page;
      await this.search();
    },
    constructFilterObj() {
      this.filters.Nombre = this.filtroNombreOrden;
      this.filters.NumeroOrden = this.filtroNumeroOrden;
      this.filters.Estados = this.filtroEstado.map(item => {
        return item.value;
      });
      this.filters.FechaI = this.toMoment(this.filtroFechaInicio);
      this.filters.FechaF = this.toMoment(this.filtroFechaFin);
      this.filters.ClienteId = this.user.clienteId;
    },
    traducir(item) {
      return this.$helpers.traducir(item);
    },
    toMoment(date) {
      return moment(date);
    },
    async search() {
      this.constructFilterObj();
      this.searching = true;
      this.totalItems = await this.searchOrdersCount(this.filters);
      this.items = await this.searchOrders(this.filters);
      this.searching = false;
    },
    async searchOrdersCount(filters) {
      let { data } = await authGetOrdersCount(filters);

      return data;
    },
    async searchOrders(filters) {
      let { data } = await authGetOrders(filters);
      console.log(data);

      return data.map(item => {
        return {
          númeroOrden: item.NumeroOrden,
          nombreOrden: item.NombreOrden,
          fechaInicio: this.toMoment(item.FechaInicio).format("DD/MM/YYYY"),
          fechaFin: this.toMoment(item.FechaFin).format("DD/MM/YYYY"),
          fechaCreación: this.toMoment(item.FechaCreacion).format("DD/MM/YYYY"),
          ordenId: item.OrdenId,
          estado: item.Estado
        };
      });
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.estado === "Confirmed") return "r-table-success";
      if (item.estado === "Rejected") return "r-table-danger";
      if (item.estado === "Open") return "r-table-open";
      if (item.estado === "Closed") return "r-table-close";
    }
  },
  data() {
    return {
      currentPage: 1,
      searching: false,
      totalItems: 0,
      filters: {
        col: 0,
        pageIndex: 1,
        pageSize: 10
      },
      estados: [
        {
          value: "Open",
          name: this.traducir("Open")
        },
        {
          value: "Confirmed",
          name: this.traducir("Confirmed")
        },
        {
          value: "Accepted",
          name: this.traducir("Accepted")
        },
        {
          value: "Rejected",
          name: this.traducir("Rejected")
        },
        {
          value: "Autorized",
          name: this.traducir("Autorized")
        },
        {
          value: "Closed",
          name: this.traducir("Closed")
        }
      ],
      fields: ["númeroOrden", "nombreOrden", "fechaCreación", "fechaInicio", "fechaFin", "estado"],
      items: [],
      filtroNombreOrden: "",
      filtroNumeroOrden: "",
      filtroEstado: [],
      filtroFechaInicio: null,
      filtroFechaFin: null
    };
  }
};
</script>

<style>
#my-reservations {
  margin-bottom: 120px;
}
.gttTableHeader {
  background-color: #c4c4c4;
  color: #6d6d6d;
  font-size: 14px;
  text-transform: uppercase;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
#r-filters {
  padding: 30px;
  background-color: #f5f5f5;
  margin-bottom: 30px;
}
.filter-wrapper {
  margin-top: 15px;
}
.filter-title {
  font-size: 16px;
  font-family: "Helvetica Neue LT Std-Roman";
  color: #6d6d6d;
}
.filter-input input {
  width: 100%;
  border-radius: 5px;
  color: #212f3d;
  border: 1px solid #c4c4c4;
  padding: 10px;
}
#rfa {
  margin-top: 60px;
}
.gtt__multiselect {
  border: 1px solid #c4c4c4;
  color: #212f3d;
  border-radius: 5px;
}
.gtt__multiselect .multiselect__tags {
  border: none;
  /* padding-bottom: 10px; */
}
.gtt__multiselect .multiselect__placeholder {
  font-size: 16px;
  /* margin-bottom: 0; */
}
.r-table-success {
  background: #f1ffe6;
}
.r-table-danger {
  background: #ffefef;
}
.r-table-open {
  background: #ececff;
}
.r-table-close {
  background: #f5f5f5;
}
.r-table-success .estado {
  color: #307000;
}
.r-table-danger .estado {
  color: #ff0000;
}
.r-table-open .estado {
  color: #0000ff;
}
.r-table-close .estado {
  color: #212f3d;
}
tbody tr:hover {
  cursor: pointer;
}
</style>