<template>
  <div id="result-list">
      <div class="list-item" v-for="item in resultList" :key="item.id">
          <ResultListItem :item="item" :filters="filters" :todosTipo="todosTipo"></ResultListItem>
      </div>
    </div>
</template>
    <script>
    import ResultListItem from './ResultListItem';
    export default {
        components: {
            ResultListItem
        },
        props: {
            resultList: Array,
            filters: Object,
            todosTipo: Array
        },
    }
</script>