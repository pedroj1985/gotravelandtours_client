<template>
  <div id="content">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
      <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
      <div id="twoColumn">
        <div class="left-column-filter-wrapper">
            <div id="left-column-filters">
                <RentForm
                    :propPickUpDate="selectedPickUpDate"
                    :propDeliveryDate="selectedDeliveryDate"
                    :propPickUpPlace="selectedPickUpPlace"
                    :propDeliveryPlace="selectedDeliveryPlace"
                    :propCarCategory="selectedCarCategory"
                    :propTransmission="selectedTransmissionType"
                    :propNationality="selectedNationality"
                ></RentForm>
            </div>
        </div>
        <div class="right-column-list-wrapper">
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
            <RentRightColumnList v-if="dataLoaded" :perPage="2" :list="resultList" class="right-column-content"></RentRightColumnList>
        </div>
        </div>
  </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2';
import RentForm from './RentForm'
import moment from 'moment'
import Breadcrumb from '../shared/Breadcrumb';
import GttSelect from '../custom-elements/GttSelect'
import RentRightColumnList from './RentRightColumnList'
import {authGetImage} from '../../utils/auth'

export default {
    components: {
        NavBar2,
        RentForm,
        Breadcrumb,
        GttSelect,
        RentRightColumnList
    },
    created(){
        this.filter = this.$route.params['filters']
        this.resultTotal = this.$route.params['searchResult'].length
        let temp = this.$route.params['searchResult']
        this.setSearchValues(
            this.filter.deliveryDate,
            this.filter.deliveryPlace,
            this.filter.nationality,
            this.filter.marca,
            this.filter.pickUpDate,
            this.filter.pickUpPlace,
            this.filter.transmision
        )
        this.createList(temp)
        
    },
    methods: {
        async createList(temp){
            for (let item of temp){
                        let {data} = await authGetImage(item.Vehiculo.ProductoId)
                        this.resultList.push(
                            {
                                nombre: item.Vehiculo.Nombre,
                                plazas: item.Vehiculo.CantidadPlazas,
                                descripcion: item.Vehiculo.Descripcion,
                                transmision: item.Vehiculo.TipoTransmision,
                                modeloId: item.Vehiculo.ModeloId,
                                precio: item.PrecioOrden,
                                distribuidor: item.Distribuidor.Nombre,
                                distribuidorId: item.Distribuidor.DistribuidorId,
                                imagen: data.ImageContent
                            }
                        )
                        console.log(data)
                    }
            this.dataLoaded = true
        },
        toMoment(date){
            return moment(date)
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
        setSearchValues(
            selectedDeliveryDate,
            selectedDeliveryPlace,
            selectedNationality,
            selectedCarCategory,
            selectedPickUpDate,
            selectedPickUpPlace,
            selectedTransmissionType
        ){
            this.selectedPickUpPlace = selectedPickUpPlace
            this.selectedPickUpDate = selectedPickUpDate
            this.selectedDeliveryPlace = selectedDeliveryPlace
            this.selectedDeliveryDate = selectedDeliveryDate
            this.selectedNationality = selectedNationality
            this.selectedCarCategory = selectedCarCategory
            this.selectedTransmissionType = selectedTransmissionType
        }
    },
    data(){
        return {
            dataLoaded: false,
            resultList: [],
            filter: null,
            organizedBy: [
                'Prueba 1',
                'Prueba 2'
            ],
            selectedPickUpPlace: null,
            selectedDeliveryPlace: null,
            selectedNationality: null,
            selectedPickUpDate: null,
            selectedDeliveryDate: null,
            selectedTransmissionType: null,
            selectedCarCategory: null,
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
    #left-column-filters{
        height: 100%;
    }
</style>