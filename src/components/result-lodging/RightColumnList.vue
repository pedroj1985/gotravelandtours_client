<template>
  <div id="right-column-list">
    <ResultList :resultList="currentList" :filters="filters"></ResultList>
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
import ResultList from './ResultList';
import {lodging_sites} from '../../utils/lodging';
export default {
  components: {
    ResultList,
  },
  data(){
    return {
      total: 1,
      currentList: [],
      currentPage: 1
    }
  },
  mounted(){
    this.getList(this.currentPage)
    this.total = lodging_sites.length
    this.$emit('resultSize',this.total)
  },
  props: {
    filters: Object,
    perPage: {
      default: 1
    },
  },
  methods: {
    getOthers(event, page){
      this.getList(page);
    },
    getList(page)
    {
      let min = this.perPage * page - this.perPage;
      let max = this.perPage * page;

      this.currentList = lodging_sites.slice(min, max);
    }
  }
}
</script>

<style>
    #right-column-list{
        /* height: 100%; */
    }
</style>