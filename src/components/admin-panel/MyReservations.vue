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
                  readonly: true,
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
                  readonly: true,
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
        Se encontraron {{ totalItems }} reservaciones en estas fechas
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
import Vue from "vue";
import axios from "axios";

export default {
  async created() {
    this.$emit("adminPanelInfo", "reservation");

    this.searching = true;
    await this.search();
    this.searching = false;
  },
  props: {
    user: {
      type: Object,
    },
  },
  methods: {
    goDetails(item) {
      this.$router.push({
        name: "reservation-detail",
        params: {
          id: item.ordenId,
        },
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
      this.filters.Estados = this.filtroEstado.map((item) => {
        return item.value;
      });
      /*  this.filters.FechaI = new Date("2022-01-01").toISOString().split("T")[0]; */

      /* this.filters.FechaI = this.toMoment(this.filtroFechaInicio); */
      this.filters.FechaI = this.filtroFechaInicio.toISOString().split("T")[0];
      /* this.filters.FechaF = new Date(Date.now()).toISOString().split("T")[0]; */
      if (this.filters.FechaF) {
        console.log("hay fecha fin ");
        this.filters.FechaF = this.toMoment(this.filtroFechaFin);
      }

      this.filters.ClienteId = this.user.clienteId;
    },
    traducir(item) {
      return this.$helpers.traducir(item);
    },
    toMoment(date) {
      return moment(date);
    },
    async search() {
      if (this.filtroEstado.length == 0) {
        alert("Debe introducir un estado");
      } else {
        const versionActual = JSON.parse(localStorage.getItem("version"));

        if (!versionActual) {
          const response = await axios.get(
            "http://gottours-001-site4.mtempurl.com/publicEliecer/api//Versions/1"
          );
          localStorage.setItem("version", JSON.stringify(response.data));
          Vue.toasted.show(`Nueva version instalada`, {
            fullWidth: true,
            duration: 86400000,
          });
        } else {
          const response = await axios.get(
            "http://gottours-001-site4.mtempurl.com/publicEliecer/api//Versions/1"
          );
          const data = response.data;
          if (versionActual.VersionName != data.VersionName) {
            Vue.toasted.show(`Nueva version.Actualizar?`, {
              duration: 99999999,
              fullWidth: true,
              action: [
                {
                  text: "Si",
                  onClick: (e, toastObject) => {
                    localStorage.setItem("version", JSON.stringify(data));
                    window.location.reload();
                    toastObject.goAway(0);
                  },
                },
                {
                  text: "No",
                  onClick: (e, toastObject) => {
                    toastObject.goAway(0);
                  },
                },
              ],
            });
          }
        }

        this.constructFilterObj();
        this.searching = true;
        /* TODO filter */
        this.totalItems = await this.searchOrdersCount(this.filters);
        this.items = await this.searchOrders(this.filters);
        this.searching = false;
      }
    },
    async searchOrdersCount(filters) {
      let { data } = await authGetOrdersCount(filters);

      return data;
    },
    async searchOrders(filters) {
      try {
        console.log("filtros", filters);
        let { data } = await authGetOrders(filters);
        console.log(data);
        return data.map((item) => {
          return {
            númeroOrden: item.NumeroOrden,
            nombreOrden: item.OrdenNombre,
            fechaInicio: this.toMoment(item.FechaInicio).format("DD/MM/YYYY"),
            fechaFin: this.toMoment(item.FechaFin).format("DD/MM/YYYY"),
            fechaCreación: this.toMoment(item.FechaCreacion).format(
              "DD/MM/YYYY"
            ),
            ordenId: item.OrdenId,
            estado: item.Estado,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.estado === "Confirmed") return "r-table-success";
      if (item.estado === "Rejected") return "r-table-danger";
      if (item.estado === "Open") return "r-table-open";
      if (item.estado === "Closed") return "r-table-close";
      if (item.estado === "Pending") return "r-table-pending";
    },
  },
  data() {
    return {
      currentPage: 1,
      searching: false,
      totalItems: 0,
      filters: {
        IsRiesgo: null,
        TipoServicio: 0,
        col: 0,
        pageIndex: 1,
        pageSize: 20,
      },
      estados: [
        {
          value: "Open",
          name: this.traducir("Open"),
        },
        {
          value: "Confirmed",
          name: this.traducir("Confirmed"),
        },
        {
          value: "Accepted",
          name: this.traducir("Accepted"),
        },
        {
          value: "Rejected",
          name: this.traducir("Rejected"),
        },
        {
          value: "Autorized",
          name: this.traducir("Autorized"),
        },
        {
          value: "Closed",
          name: this.traducir("Closed"),
        },
        {
          value: "Pending",
          name: this.traducir("Pending"),
        },
      ],
      fields: [
        "númeroOrden",
        "nombreOrden",
        "fechaCreación",
        "fechaInicio",
        "fechaFin",
        "estado",
      ],
      items: [],
      filtroNombreOrden: "",
      filtroNumeroOrden: "",
      filtroEstado: [
        { value: "Open", name: "Abierta" },
        { value: "Confirmed", name: "Confirmada" },
        { value: "Pending", name: "Pendiente" },
        { value: "Rejected", name: "Rechazada" },
      ],
      /* filtroFechaInicio: new Date(Date.now() - 1440 * 60 * 60000), */
      filtroFechaInicio: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 2,
        1
      ),
      filtroFechaFin: "",
    };
  },
};
</script>
