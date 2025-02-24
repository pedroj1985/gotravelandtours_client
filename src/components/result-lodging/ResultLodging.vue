<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <div id="twoColumn">
      <div class="left-column-filter-wrapper">
        <LeftColumnFilters :filters="filters"></LeftColumnFilters>
      </div>
      <div
        class="right-column-list-wrapper position-relative"
        id="right-column-list-wrapper"
      >
        <div v-if="dataLoaded">
          <div class="map-wrapper">
            <div class="left-side-map">
              <div class="custom-line-1">
                <img
                  src="../../../public/img/icopaq_alojamiento_black.svg"
                  alt="alojamiento"
                />
                <div class="result-search">
                  <div class="result-search-text-title antonio-regular">
                    Hemos encontrado en {{ filters.Region.RegionNombre }}
                    {{ resultList.length }} sitios para alojarse.
                  </div>
                  <div class="result-search-text hn-roman">
                    Del
                    {{
                      toMoment(filters.Entrada)
                        .locale("es")
                        .format("DD MMM YYYY")
                    }}
                    al
                    {{
                      toMoment(filters.Salida)
                        .locale("es")
                        .format("DD MMM YYYY")
                    }}, para
                    {{ constructDisplay(filters.Visitantes) }}
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
                    <i
                      slot="iconSelectedValue"
                      class="mdi mdi-swap-vertical"
                    ></i>
                    <span slot="placeholder">Organizar por</span>
                    <template v-slot:option="option">{{
                      option.option.displayName
                    }}</template>
                    <template v-slot:selectedValue="selectedValue">
                      <span id="selectedPickUp">
                        {{ selectedValue.selectedValue.displayName }}
                      </span>
                    </template>
                  </GttSelect>
                </div>
              </div>
            </div>
            <div class="right-side-map">
              <img src="../../../public/img/icomap.svg" alt="mapa" />
            </div>
          </div>
          <RightColumnList
            :filters="filters"
            :todosTipo="todosTipo"
            :resultList="resultList"
            class="right-column-content"
            @resultSize="setResultTotal"
            :perPage="10"
            :order="selectedOrganizeType"
          ></RightColumnList>
        </div>
        <div v-else class="text-center w-100">
          <div class="loader">
            <div class="balls-loader lodging-loader">
              <img
                src="../../../public/img/preloadSERVICIOrenta_bolas_verde.svg"
                alt="bolas cargando"
              />
            </div>
            <div class="icon-loader lodging-loader-icon">
              <img
                src="../../../public/img/preloadSERVICIOalojamiento_icono_verde.svg"
                alt="alojamiento cargando"
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
  import LeftColumnFilters from "./LeftColumnFilters";
  import RightColumnList from "./RightColumnList";
  import Breadcrumb from "../shared/Breadcrumb";
  import GttSelect from "../custom-elements/GttSelect";
  // import { authSearchLodging } from '../../utils/auth';
  import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
  import moment from "moment";
  import { authGetRoomTypes } from "../../utils/auth";

  export default {
    components: {
      NavBar2,
      LeftColumnFilters,
      RightColumnList,
      Breadcrumb,
      GttSelect
    },
    mixins: [lodgingUtilsMixin],
    async created() {
      let t = await authGetRoomTypes();
      this.todosTipo = t.data;
      let f = localStorage.getItem("searchLodgingFilters");
      if (f) {
        this.filters = JSON.parse(f);
      }
      console.info('second', this);
      /* if (
        this.filters.Visitantes.adults.value >=
        this.filters.Visitantes.kids.value
      )
        this.roomComb = this.$helpers.roomCombination(
          this.filters.Visitantes.adults.value,
          this.filters.Visitantes.kids.value || 0
        );
      else {
        this.roomComb = this.$helpers.roomCombination2kids(
          this.filters.Visitantes.adults.value,
          this.filters.Visitantes.kids.value || 0
        );
      } */
      /* this.roomComb2 = this.$helpers.roomCombinationV2(
        this.filters.Visitantes.adults.value,
        this.filters.Visitantes.kids.value || 0
      ); */
      let r = this.$route.params["searchResult"];
      if (r) {
        let temp = r;
        this.createList(temp);
        this.resultTotal = this.resultList.length;
      } else {
        let temp = await this.searchCResult();
        this.createList(temp);
        this.resultTotal = this.resultList.length;
      }
    },
    methods: {
      toMoment(date) {
        return moment(date);
      },
      async searchCResult() {
        try {
          if (this.roomComb != "ERROR") {
            let ff = {
              Region: this.filters.Region,
              Cliente: this.filters.Cliente,
              Entrada: this.filters.Entrada,
              Salida: this.filters.Salida
            };
            let result = await this.searchResult(
              ff,
              this.roomComb,
              this.roomComb2
            );
            return result;
          } else {
            this.$toasted.show("Demasiados niños", {
              type: "error"
            });
            return null;
          }
        } catch (error) {
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
          return null;
        }
      },
      constructDisplay(d) {
        let s = "";
        Object.keys(d).forEach(element => {
          s = s + " · " + d[element].value + " " + d[element].display;
        });

        return s.substring(2);
      },
      setResultTotal(value) {
        this.resultTotal = value;
      },
      createList(list) {
        this.resultList = list;
        this.dataLoaded = true;
      }
    },
    data() {
      return {
        dataLoaded: false,
        roomComb: Object,
        roomComb2: Object,
        todosTipo: [],
        resultList: [],
        organizedBy: [
          {
            displayName: "Precio (asc)",
            code: "price_asc"
          },
          {
            displayName: "Precio (desc)",
            code: "price_desc"
          }
        ],
        selectedOrganizeType: {
          displayName: "Precio (asc)",
          code: "price_asc"
        },
        resultTotal: 0,
        filters: {},
        breadcrumbList: ["Inicio", "Alojamientos", "Resultados de la búsqueda"],
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
/*           {
            name: "car-rent",
            displayName: "renta de autos",
            id: "index-logged-rent-wrapper"
          }, */
/*          {
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

<style></style>
