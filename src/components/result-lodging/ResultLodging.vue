<template>
  <div id="content">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
      <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
      <div id="twoColumn" class="custom-margin row">
        <div class="col-lg-3 left-column-filter-wrapper">
            <LeftColumnFilters></LeftColumnFilters>
        </div>
        <div class="col-lg-9 right-column-list-wrapper">
            <RightColumnList :resultList="resultList" :filters="filters"></RightColumnList>
        </div>
        </div>
  </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2';
import LeftColumnFilters from './LeftColumnFilters';
import RightColumnList from './RightColumnList';
import Breadcrumb from '../shared/Breadcrumb';
import moment from 'moment'

export default {
    components: {
        NavBar2,
        LeftColumnFilters,
        RightColumnList,
        Breadcrumb
    },
    data(){
        return {
            filters: {
                selectedLodgingDestinyValue: '',
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
            resultList:[
                {
                    images: [
                        '/img/homelogin_destino_habana.jpg',
                        '/img/home_servicios_restaurant.jpg',
                        '/img/home_servicios_autos.jpg',
                    ],
                    name: 'Hotel Iberostar Grand Packard',
                    stars: 5,
                    location: 'La Habana, Cuba',
                    mapLink: 'http://a.a',
                    price: {
                        value: 87.5,
                        currency: 'USD'
                    }
                }
            ],
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
    }
    .right-column-list-wrapper{
        padding-right: 0;
    }
</style>