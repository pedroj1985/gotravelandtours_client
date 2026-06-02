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
import ResultList from "./ResultList";
import _ from "lodash";
export default {
  components: {
    ResultList
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  data() {
    return {
      total: 1,
      currentList: [],
      currentPage: 1
    };
  },
  mounted() {
    this.getList(this.currentPage);
    this.total = this.resultList.length;
    this.$emit("resultSize", this.total);
  },
  props: {
    filters: Object,
    resultList: Array,
    perPage: {
      default: 1
    },
    todosTipo: Array,
    order: {
      type: Object,
      default() {
        return { displayName: "Precio (asc)", code: "price_asc" };
      }
    }
  },
  watch: {
    order: function(val) {
      if (val.code == "price_desc") {
        this.currentList = _.orderBy(
          this.currentList,
          o => {
            let r = this.getMinPrice(o.habitaciones).combinacion.total;
            return r;
          },
          "desc"
        );
      } else {
        this.currentList = _.orderBy(
          this.currentList,
          o => {
            return this.getMinPrice(o.habitaciones).combinacion.total;
          },
          "asc"
        );
      }
    }
  },
  methods: {
    getOthers(event, page) {
      this.getList(page);
    },
    getList(page) {
      let min = this.perPage * page - this.perPage;
      let max = this.perPage * page;

      this.currentList = this.resultList.slice(min, max);
      this.$scrollTo("#right-column-list-wrapper");
    },
    getMinPrice(array) {
      return _.minBy(array, function(e) {
        return e.combinacion.total;
      });
    }
  }
};
</script>
