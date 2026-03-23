<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <div id="twoColumn">
      <div class="left-column-filter-wrapper">
        <div id="left-column-filters">
          <RentForm
            :propPickUpDate="filter.pickUpDate"
            :propDeliveryDate="filter.deliveryDate"
            :propPickUpPlace="filter.pickUpPlace"
            :propDeliveryPlace="filter.deliveryPlace"
            :propCarCategory="filter.marca"
            :propTransmission="filter.transmision"
            :propNationality="filter.nationality"
          ></RentForm>
        </div>
      </div>
      <div class="right-column-list-wrapper">
        <RentRightColumnList
          :onlyToSelect="onlyToSelect"
          v-if="dataLoaded"
          :perPage="8"
          :resultTotal="resultTotal"
          :list="resultList"
          class="right-column-content"
        ></RentRightColumnList>
        <div v-else class="text-center">
          <!-- <b-spinner
            style="width: 5rem; height: 5rem;"
            class="loading-spinner"
            label="Text Centered"
          ></b-spinner>-->
          <div class="loader">
            <div class="balls-loader">
              <img
                src="../../../public/img/preloadSERVICIOrenta_bolas_verde.svg"
                alt="bolas cargando"
              />
            </div>
            <div class="icon-loader">
              <img
                src="../../../public/img/preloadSERVICIOrenta_icono_verde.svg"
                alt="auto cargando"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar2 from "../shared/NavBar2";
import RentForm from "./RentForm";
import Breadcrumb from "../shared/Breadcrumb";
import RentRightColumnList from "./RentRightColumnList";
import { eventFiltersRent } from "../../main";
import { cleanVoMixin } from "../../mixins/cleanVoMixin";
import { constructDisplay } from "../../utils/utils";
import {
  authSearchCars,
  authSearchMarca,
  authGetImage,
  authSearchProvider
} from "../../utils/auth";
import _ from "lodash";

export default {
  mixins: [cleanVoMixin],
  components: {
    NavBar2,
    RentForm,
    Breadcrumb,
    RentRightColumnList
  },
  async created() {
    let f = localStorage.getItem("searchRentFilters");
    if (f) {
      this.filter = JSON.parse(f);
      eventFiltersRent.$emit("filters", this.filter);
    }
    let rt = this.$route.params["searchResult"];
    if (rt) {
      let temp = this.$route.params["searchResult"];
      this.resultTotal = temp.length;
      temp = _.orderBy(
        temp,
        function(o) {
          return o.precio;
        },
        "asc"
      );
      this.createList(temp);
    } else {
      let temp = await this.searchResult();
      this.resultTotal = temp.length;
      temp = _.orderBy(
        temp,
        function(o) {
          return o.precio;
        },
        "asc"
      );
      this.createList(temp);
    }
  },
  methods: {
    async searchResult() {
      try {
        let marca = {
          MarcaId: this.filter.marca.marcaid,
          Nombre: this.filter.marca.nombre
        };
        let cliente = { ClienteId: localStorage.getItem("cliente") };
        let transmissionType = this.filter.transmision.nombre;
        let searchItem = {
          FechaRecogida: this.filter.pickUpDate,
          FechaEntrega: this.filter.deliveryDate,
          Marca: marca,
          TipoTransmision: transmissionType,
          Cliente: cliente
        };
        let resultList = [];
        let { data } = await authSearchCars(searchItem);
        await Promise.all(
          data
            .filter(j => {
              return j.ValorSobreprecioAplicado > 0;
            })
            .map(async item => {
              let image = await authGetImage(item.Vehiculo.ProductoId);
              let marca = await authSearchMarca(item.Vehiculo.MarcaId);
              let provider = await authSearchProvider(
                item.Vehiculo.ProveedorId
              );
              resultList.push({
                nombre: item.Vehiculo.Nombre,
                tipo: "rent",
                id: item.Vehiculo.ProductoId,
                plazas: item.Vehiculo.CantidadPlazas,
                descripcion: item.Vehiculo.Descripcion,
                cancelation: item.Vehiculo.DescripcionCorta,
                transmision: item.Vehiculo.TipoTransmision,
                modeloId: item.Vehiculo.ModeloId,
                marca: marca.data.Nombre,
                marcaid: marca.data.MarcaId,
                precio: item.PrecioOrden,
                seguro: item.Vehiculo.TieneSeguro,
                distribuidor: item.Distribuidor.Nombre,
                distribuidorId: item.Distribuidor.DistribuidorId,
                imagen: image.data.ImageContent,
                provider: provider.data.Nombre,
                providerImage: provider.data.ImageContent,
                orderVehiculo: item
              });
              this.cleanVO(
                item,
                this.filter.pickUpPlace,
                this.filter.deliveryPlace
              );
            })
        );
        return resultList;
      } catch (error) {
        this.$toasted.show("El servicio no está disponible en estos momentos", {
          type: "error"
        });

        return [];
      }
    },
    createList(temp) {
      this.resultList = temp;

      this.dataLoaded = true;
    },
    setResultTotal(value) {
      this.resultTotal = value;
    },
    listenEventFilterRent() {
      return eventFiltersRent.$on("filters", item => {
        return item;
      });
    }
  },
  data() {
    return {
      onlyToSelect: false,
      selectedNationality: Object,
      dataLoaded: false,
      resultList: [],
      filter: Object,
      resultTotal: 0,
      breadcrumbList: ["Inicio", "Renta", "Resultados de la búsqueda"],
      menuLinks: [
        {
          name: "index",
          displayName: "Inicio",
          id: "home-logged-banner"
        },
        {
          name: "lodging",
          displayName: "alojamientos",
          id: "home-logged-banner"
        },
/*         {
          name: "car-rent",
          displayName: "renta de autos",
          id: "index-logged-rent-wrapper"
        }, */
/*        {
          name: "transfer",
          displayName: "traslados",
          id: "index-logged-transfer"
        },
        {
          name: "excursions",
          displayName: "Excursiones y actividades",
          id: "index-logged-excursion"
        }*/
      ]
    };
  }
};
</script>
