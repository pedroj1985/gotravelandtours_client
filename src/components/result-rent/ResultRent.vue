<template>
  <div id="content">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
      <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
      <div id="twoColumn">
        <div class="left-column-filter-wrapper">
            <div id="left-column-filters">
                <RentForm
                    :propPickUpDate="filter.pickUpDate"
                    :propDeliveryDate="filter.deliveryDate"
                    :propPickUpPlace="filter.pickUpPlace"
                    :propDeliveryPlace="filter.deliveryPlace"
                    :propCarCategory="filter.marca"
                    :propTransmission="filter.transmision"
                    :propNationality="filter.nationality"
                ></RentForm>
            </div>
        </div>
        <div class="right-column-list-wrapper">
            <RentRightColumnList v-if="dataLoaded" :perPage="10" :resultTotal="resultTotal" :list="resultList" class="right-column-content"></RentRightColumnList>
        </div>
        </div>
  </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2';
import RentForm from './RentForm'
import Breadcrumb from '../shared/Breadcrumb';
import RentRightColumnList from './RentRightColumnList'
import {eventFiltersRent} from '../../main';

export default {
    components: {
        NavBar2,
        RentForm,
        Breadcrumb,
        RentRightColumnList
    },
    created(){
        this.resultTotal = this.$route.params['searchResult'].length
        let f = this.$route.params['filters']
        eventFiltersRent.$emit('filters',this.$route.params['filters'])
        this.filter = f
        let temp = this.$route.params['searchResult']
        this.createList(temp)
        
    },
    methods: {
        createList(temp){
            this.resultList = temp
            this.dataLoaded = true
        },
        constructDisplay(d){
            let s = '';
            Object.keys(d).forEach(element => {
                s = s+' · '+d[element].value+' '+d[element].display
            });

            return s.substring(2);
        },
        setResultTotal(value){
            this.resultTotal = value;
        },
        listenEventFilterRent(){
            return eventFiltersRent.$on('filters', (item) => {
                return item
            })
        }
    },
    data(){
        return {
            selectedNationality: Object,
            dataLoaded: false,
            resultList: [],
            filter: Object,
            resultTotal: 0,
            breadcrumbList: [
                'Inicio',
                'Renta',
                'Resultados de la búsqueda'
            ],
            menuLinks: [
                {
                    name: 'index',
                    displayName: 'Inicio',
                    id: 'home-logged-banner'
                },
                {
                    name: 'lodging',
                    displayName: 'alojamientos',
                    id: 'home-logged-banner'
                },
                {
                    name: 'car-rent',
                    displayName: 'renta de autos',
                    id: 'index-logged-rent-wrapper'
                },
                {
                    name: 'transfer',
                    displayName: 'traslados',
                    id: 'index-logged-transfer'
                },
                {
                    name: 'excursions',
                    displayName: 'Excursiones y actividades',
                    id: 'index-logged-excursion'
                },
            ]
        }
    }
}
</script>

<style>
</style>