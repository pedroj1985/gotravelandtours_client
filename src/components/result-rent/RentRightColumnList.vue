<template>
  <div id="right-column-list">
    <div class="map-wrapper">
        <div class="left-side-map">
            <div class="custom-line-1">
                <img src="../../../public/img/icopaq_renta_gris.svg" alt="alojamiento">
                <div class="result-search">
                    <div class="result-search-text-title antonio-regular">Hemos encontrado del 
                                                                {{toMoment(filter.pickUpDate).locale('es').format('DD MMM YYYY')}} al 
                                                                {{toMoment(filter.deliveryDate).locale('es').format('DD MMM YYYY')}} 
                                                                {{resultTotal}} autos.</div>
                </div>
            </div>
            <div class="custom-line-2">
                <div class="organizedBySelect">
                    <GttSelect :options="organizedBy" :twoRows="false">
                        <i slot="iconSelectedValue" class="mdi mdi-swap-vertical"></i>
                        <span slot="placeholder">Organizar por</span>
                    </GttSelect>
                </div>
            </div>
        </div>
        <div class="right-side-map">
            <img src="../../../public/img/icomap.svg" alt="mapa">
        </div>
    </div>
    <RentResultList :resultList="currentList"
                    :onlyToSelect="onlyToSelect"
                    :totalDays="calculateNights(toMoment(filter.deliveryDate), toMoment(filter.pickUpDate))">
    </RentResultList>
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
import moment from 'moment'
import GttSelect from '../custom-elements/GttSelect'
import {calculateNights} from '../../utils/utils'
export default {
  components: {
    RentResultList,
    GttSelect
  },
  created(){
      this.filter = JSON.parse(localStorage.getItem('searchRentFilters'))
  },
  data(){
    return {
      total: 1,
      currentList: [],
      currentPage: 1,
      filter: Object,
      organizedBy: [
          'Prueba 1',
          'Prueba 2'
      ],
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
    resultTotal: Number,
    onlyToSelect: Boolean
  },
  methods: {
    calculateNights(min, max){
      return calculateNights(min,max)
    },
    toMoment(date){
        return moment(date)
    },
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