<template>
  <div id="result-list">
      <div class="list-item" v-for="item in resultList" :key="item.id">
          <RentResultListItem :item="item" :totalDays="totalDays">
          </RentResultListItem>
      </div>
    </div>
</template>
    <script>
    import RentResultListItem from './RentResultListItem';
    export default {
        components: {
            RentResultListItem,
        },
        props: {
            resultList: Array,
            totalDays: {
                type: Number,
                default: 0
            }
        }
    }
</script>

<style>
    .list-item{
        margin-bottom: 50px;
        position: relative;
    }
</style>