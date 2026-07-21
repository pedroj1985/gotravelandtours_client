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
        <div v-if="isLoading" class="text-center w-100">
          <div class="skeleton-list">
            <div
              class="skeleton-item d-flex"
              v-for="n in 3"
              :key="n"
            >
              <GttSkeleton type="rect" :width="30" height="180px" class="skeleton-image"></GttSkeleton>
              <div class="skeleton-info flex-grow-1">
                <GttSkeleton type="text" :width="60" height="1.2em"></GttSkeleton>
                <GttSkeleton type="text" :width="40" height="1em"></GttSkeleton>
                <GttSkeleton type="text" :width="80" height="1em"></GttSkeleton>
                <GttSkeleton type="text" :width="50" height="1em"></GttSkeleton>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="hasError" class="text-center w-100">
          <GttErrorState :retryable="true" @retry="retrySearch"></GttErrorState>
        </div>
        <div v-else-if="dataLoaded && resultList.length === 0" class="text-center w-100">
          <GttEmptyState>
            <template #icon><i class="mdi mdi-bed-outline"></i></template>
            <template #title>Sin alojamientos disponibles</template>
            No se encontraron alojamientos para los filtros seleccionados.
          </GttEmptyState>
        </div>
        <div v-else-if="dataLoaded">
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
                    <template #iconSelectedValue>
                      <i class="mdi mdi-swap-vertical"></i>
                    </template>
                    <template #placeholder>Organizar por</template>
                    <template #option="option">{{
                      option.option.displayName
                    }}</template>
                    <template #selectedValue="selectedValue">
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
import GttSkeleton from "../shared/GttSkeleton";
import GttEmptyState from "../shared/GttEmptyState";
import GttErrorState from "../shared/GttErrorState";
// import { authSearchLodging } from '../../utils/auth';
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import moment from "moment";
import { authGetRoomTypes } from "../../utils/auth";
import { constructDisplay } from "../../utils/utils";

export default {
  components: {
    NavBar2,
    LeftColumnFilters,
    RightColumnList,
    Breadcrumb,
    GttSelect,
    GttSkeleton,
    GttEmptyState,
    GttErrorState
  },
  mixins: [lodgingUtilsMixin],
  async created() {
    this.isLoading = true;
    this.hasError = false;
    try {
      let t = await authGetRoomTypes();
      this.todosTipo = t.data;
      let f = localStorage.getItem("searchLodgingFilters");
      if (f) {
        this.filters = JSON.parse(f);
      }
      let r = this.$route.params["searchResult"];
      if (r) {
        let temp = r;
        this.createList(temp);
        this.resultTotal = this.resultList.length;
      } else {
        let temp = await this.searchCResult();
        if (temp) {
          this.createList(temp);
          this.resultTotal = this.resultList.length;
        } else {
          this.dataLoaded = true;
        }
      }
    } catch (error) {
      this.hasError = true;
      this.dataLoaded = true;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    constructDisplay,
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
        this.$toasted.show("El servicio no está disponible en estos momentos", {
          type: "error"
        });
        return null;
      }
    },
    setResultTotal(value) {
      this.resultTotal = value;
    },
    createList(list) {
      this.resultList = list || [];
      this.dataLoaded = true;
    },
    async retrySearch() {
      this.isLoading = true;
      this.hasError = false;
      this.dataLoaded = false;
      try {
        let temp = await this.searchCResult();
        if (temp) {
          this.createList(temp);
          this.resultTotal = this.resultList.length;
        } else {
          this.dataLoaded = true;
        }
      } catch (error) {
        this.hasError = true;
        this.dataLoaded = true;
      } finally {
        this.isLoading = false;
      }
    }
  },
  data() {
    return {
      dataLoaded: false,
      isLoading: false,
      hasError: false,
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
        }
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
