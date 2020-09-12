<template>
  <div id="twoColumn" class="custom-margin row">
      <div class="col-lg-3 left-column-filter-wrapper">
          <LeftColumnFilters></LeftColumnFilters>
      </div>
      <div class="col-lg-9 right-column-list-wrapper">
          <RightColumnList></RightColumnList>
      </div>
  </div>
</template>

<script>
import LeftColumnFilters from '../result-lodging/LeftColumnFilters';
import RightColumnList from '../result-lodging/RightColumnList';
export default {
    components: {
        LeftColumnFilters,
        RightColumnList
    }
}
</script>

<style scoped>
    div#twoColumn{
        /* height: 300px; */
    }
    .left-column-filter-wrapper{
        padding-left: 0;
        padding-right: 30px;
    }
    .right-column-list-wrapper{
        padding-right: 0;
    }
</style>