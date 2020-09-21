<template>
  <div id="content">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
      <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
      <div id="twoColumn">
        <div class="left-column-filter-wrapper">
            <LeftColumnFilters></LeftColumnFilters>
        </div>
        <div class="right-column-list-wrapper">
            <div class="map-wrapper">
                <div class="left-side-map">
                    <div class="custom-line-1">
                        <img src="../../../public/img/icopaq_alojamiento_black.svg" alt="alojamiento">
                        <div class="result-search">
                            <div class="result-search-text-title antonio-regular">Hemos encontrado en {{filters.selectedLodgingDestinyValue}} {{resultTotal}} sitios para alojarse.</div>
                            <div class="result-search-text hn-roman">Del {{filters.selectedArriveDate.locale('es').format('DD MMM YYYY')}} al 
                                                                         {{filters.selectedDepartureDate.locale('es').format('DD MMM YYYY')}}, para
                                                                         {{constructDisplay(filters.selectedRoomLayout)}}, {{constructDisplay(filters.selectedRooms)}}</div>
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
            <RightColumnList :filters="filters" class="right-column-content" @resultSize="setResultTotal"></RightColumnList>
        </div>
        </div>
  </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2';
import LeftColumnFilters from './LeftColumnFilters';
import RightColumnList from './RightColumnList';
import Breadcrumb from '../shared/Breadcrumb';
import GttSelect from '../custom-elements/GttSelect';
import moment from 'moment'

export default {
    components: {
        NavBar2,
        LeftColumnFilters,
        RightColumnList,
        Breadcrumb,
        GttSelect
    },
    methods: {
        constructDisplay(d){
            let s = '';
            Object.keys(d).forEach(element => {
                s = s+' · '+d[element].value+' '+d[element].display
            });

            return s.substring(2);
        },
        setResultTotal(value){
            this.resultTotal = value;
        }
    },
    data(){
        return {
            organizedBy: [
                'Prueba 1',
                'Prueba 2'
            ],
            resultTotal: 0,
            filters: {
                selectedLodgingDestinyValue: 'Santiago de Cuba',
                selectedArriveDate: moment(),
                selectedDepartureDate: moment().add(1, 'days'),
                selectedRoomLayout: {
                    adults: {
                        value: 2,
                        display: 'Adulto(s)'
                    },
                    kids: {
                        value: 1,
                        display: 'Niño(s)'
                    }
                },
                selectedRooms: {
                    rooms: {
                        value: 2,
                        display: 'Habitación(es)'
                    }
                },
                selectedNationality: null,
            },
            breadcrumbList: [
                'Inicio',
                'Alojamientos',
                'Matanzas',
                'Varadero',
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
    .left-column-filter-wrapper{
        padding-left: 0;
        padding-right: 30px;
        width: 450px;
    }
    .right-column-list-wrapper{
        width: 100%;
        padding-right: 0;
    }
    #twoColumn{
        display: flex;
        margin-left: 9.375%;
        padding-left: 30px;
    }
    .right-column-content{
        /* TODO Ver si usar vw en vez de height */
        margin-right: 9.375vw;
        padding-right: 30px;
    }
    .map-wrapper{
        background-color: #f5f5f5;
        margin-bottom: 50px;
        padding-left: 15px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-right: calc(9.375vw + 30px);
        display: flex;
    }
    .map-wrapper .left-side-map{
        padding-right: 30px;
        width: 100%;
    }
    .map-wrapper .left-side-map img{
        height: 60px;
    }
    .map-wrapper .right-side-map img{
        height: 150px;
        width: 230px;
        object-fit: cover;
    }
    .map-wrapper .right-side-map{
        margin-left: auto;
    }
    .map-wrapper .left-side-map .custom-line-1{
        display: flex;
        margin-bottom: 20px;
    }
    .map-wrapper .left-side-map .custom-line-2{
        display: flex;
    }
    .map-wrapper .left-side-map .custom-line-2 .organizedBySelect{
        margin-left: auto;
    }
    .result-search{
        padding-left: 45px;
    }
    .result-search-text-title{
        font-size: 30px;
        color: #212f3d;
    }
    .result-search-text{
        font-size: 18px;
        color: #6d6d6d;
    }
    #twoColumn .map-wrapper .gtt__select .gtt__toggle{
        margin-bottom: 0;
        font-size: 18px;
        background-color: transparent;
        width: 230px;
    }
</style>