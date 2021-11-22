<template>
  <div id="right-column-list">
    <ResultList
      :resultList="currentList"
      :filters="filters"
      :todosTipo="todosTipo"
    ></ResultList>
    <div class="pagination-section">
      <b-pagination
        v-model="currentPage"
        :total-rows="total"
        :per-page="perPage"
        @page-click="getOthers"
        align="center"
        class="custom-page-container"
      ></b-pagination>
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

<style>
  #right-column-list {
    /* height: 100%; */
  }
</style>
