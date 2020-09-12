<template>
  <div id="content">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
      <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
      <TwoColumn></TwoColumn>
  </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2';
import TwoColumn from '../result-lodging/TwoColumn';
import Breadcrumb from '../shared/Breadcrumb';

export default {
    components: {
        NavBar2,
        TwoColumn,
        Breadcrumb
    },
    data(){
        return {
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

</style>