<template>
  <div id="right-column-list">
    <ResultList :resultList="currentList" :filters="filters" :todosTipo="todosTipo"></ResultList>
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
    todosTipo: Array
  },
  methods: {
    getOthers(event, page) {
      this.getList(page);
    },
    getList(page) {
      let min = this.perPage * page - this.perPage;
      let max = this.perPage * page;

      this.currentList = this.resultList.slice(min, max);
    }
  }
};
</script>

<style>
#right-column-list {
  /* height: 100%; */
}
</style>