<template>
  <div id="cbreadcrumb" class="custom-padding-top-2-navbar custom-margin">
      <ul class="cbreadcrumb-list">
          <li class="cbreadcrumb-item" :class="{'no-last':Object.keys(elementList).length-1 != i}" v-for="(item,i) in elementList" :key="item.id">
              {{item}}
          </li>
      </ul>
  </div>
</template>

<script>
//TODO hacer el breadcrumb semi-automático, en estos momentos va a estar fijo
export default {
    props: {
        elementList: {
            type: Array
        }
    }
}
</script>

<style scoped>

    ul.cbreadcrumb-list{
        padding-top: 15px;
        padding-left: 0;
        list-style: none;
    }
    ul.cbreadcrumb-list li{
        display: inline;
    }

    .cbreadcrumb-item.no-last::after{
        content: " > ";
    }
</style>