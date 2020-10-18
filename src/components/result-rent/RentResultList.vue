<template>
  <div id="result-list">
      <div class="list-item" v-for="item in resultList" :key="item.id">
          <RentResultListItem :item="item">
          </RentResultListItem>
      </div>
    </div>
</template>
    <script>
    import RentResultListItem from './RentResultListItem';
    export default {
        components: {
            RentResultListItem
        },
        props: {
            resultList: Array,
        },
    }
</script>

<style>
    .list-item{
        margin-bottom: 50px;
        position: relative;
    }
</style>