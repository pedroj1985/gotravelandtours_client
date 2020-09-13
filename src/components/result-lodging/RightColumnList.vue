<template>
  <div id="right-column-list">
    <ResultList :resultList="resultList" :filters="filters"></ResultList>
  </div>
</template>

<script>
import ResultList from './ResultList';
export default {
  components: {
    ResultList
  },
  props: {
    resultList: Array,
    filters: Object
  }
}
</script>

<style>
    #right-column-list{
        /* height: 100%; */
    }
</style>