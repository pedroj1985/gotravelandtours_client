<template>
  <div id="right-column-list">
    <div class="map-wrapper">
      <div class="left-side-map">
        <div class="custom-line-1">
          <img
            src="../../../public/img/icopaq_renta_gris.svg"
            alt="alquiler"
          />
          <div class="result-search">
            <div class="result-search-text-title antonio-regular">
              Hemos encontrado del
              {{
                toMoment(filter.pickUpDate)
                  .locale("es")
                  .format("DD MMM YYYY")
              }}
              al
              {{
                toMoment(filter.deliveryDate)
                  .locale("es")
                  .format("DD MMM YYYY")
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
          toMoment(filter.deliveryDate),
          toMoment(filter.pickUpDate)
        )
      "
    >
    </RentResultList>
    <div class="pagination-section">
      <nav aria-label="Paginación">
        <ul class="gtt-pagination">
          <li class="gtt-page-item" :class="{ disabled: currentPage <= 1 }">
            <a class="gtt-page-link" href="#" @click.prevent="currentPage > 1 && getOthers($event, currentPage - 1)">&laquo;</a>
          </li>
          <li class="gtt-page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <a class="gtt-page-link" href="#" @click.prevent="getOthers($event, page)">{{ page }}</a>
          </li>
          <li class="gtt-page-item" :class="{ disabled: currentPage >= totalPages }">
            <a class="gtt-page-link" href="#" @click.prevent="currentPage < totalPages && getOthers($event, currentPage + 1)">&raquo;</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import RentResultList from "./RentResultList";
import moment from "moment";
import GttSelect from "../custom-elements/GttSelect";
import { calculateNights } from "../../utils/utils";
import _ from "lodash";
export default {
  components: {
    RentResultList,
    GttSelect
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  watch: {
    selectedOrganizeType: function(val) {
      if (val.code == "price_desc") {
        this.currentList = _.orderBy(
          this.currentList,
          function(o) {
            return o.precio;
          },
          "desc"
        );
      } else {
        this.currentList = _.orderBy(
          this.currentList,
          function(o) {
            return o.precio;
          },
          "asc"
        );
      }
    }
  },
  created() {
    this.filter = JSON.parse(localStorage.getItem("searchRentFilters"));
  },
  data() {
    return {
      total: 1,
      currentList: [],
      currentPage: 1,
      filter: Object,
      selectedOrganizeType: {
        displayName: "Precio (asc)",
        code: "price_asc"
      },

      organizedBy: [
        {
          displayName: "Precio (asc)",
          code: "price_asc"
        },
        {
          displayName: "Precio (desc)",
          code: "price_desc"
        }
      ]
    };
  },
  mounted() {
    this.getList(this.currentPage);
    this.total = this.list.length;
    // this.$emit('resultSize',this.total)
  },
  props: {
    list: Array,
    perPage: {
      default: 1
    },
    resultTotal: Number,
    onlyToSelect: Boolean
  },
  methods: {
    toMoment(date) {
      return moment(date);
    },
    getOthers(event, page) {
      this.getList(page);
    },
    getList(page) {
      let min = this.perPage * page - this.perPage;
      let max = this.perPage * page;

      this.currentList = this.list.slice(min, max);
      this.$scrollTo("#right-column-list");
    }
  }
};
</script>
