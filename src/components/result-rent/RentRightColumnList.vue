<template>
  <div id="right-column-list">
    <RentResultList :resultList="currentList"></RentResultList>
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
import RentResultList from './RentResultList';
export default {
  components: {
    RentResultList,
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
    this.total = this.list.length
    // this.$emit('resultSize',this.total)
  },
  props: {
    list: Array,
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

      this.currentList = this.list.slice(min, max);
    }
  }
}
</script>

<style>
    #right-column-list{
        /* height: 100%; */
    }
</style>