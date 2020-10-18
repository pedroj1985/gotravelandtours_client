<template>
  <div id="lodging-form">
        <gtt-select :openedLodging.sync="pickUpOpened" @click.native="loadPickUpPlaces" :options="pickUpDeliveryOptions" class="cleft" v-model="selectedPickUpPlace">
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder"> Punto de recogida</span>
            <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
            <template v-slot:option="option">
                {{option.option.nombre}}
            </template>
            <template v-slot:selectedValue="selectedValue">
                <span id="selectedPickUp">{{overflowText(selectedValue.selectedValue.nombre)}}</span>
                <b-tooltip target="selectedPickUp" triggers="hover">
                    {{selectedValue.selectedValue.nombre}}
                </b-tooltip>
            </template>
        </gtt-select>
        <gtt-select :openedLodging.sync="deliveryOpened" @click.native="loadDeliveryPlaces" :options="pickUpDeliveryOptions" v-model="selectedDeliveryPlace">
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder"> Punto de entrega</span>
            <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
            <template v-slot:option="option">
                {{option.option.nombre}}
            </template>
            <template v-slot:selectedValue="selectedValue">
                {{overflowText(selectedValue.selectedValue.nombre)}}
            </template>
        </gtt-select>
        <gtt-select-date v-model="selectedPickUpDate" :mode="'single'">
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder">
                Fecha de recogida
            </span>
        </gtt-select-date>
        <gtt-select-date v-model="selectedDeliveryDate" :mode="'single'">
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder">
                Fecha de entrega
            </span>
        </gtt-select-date>
        <gtt-select :options="transmissionTypes" v-model="selectedTransmissionType">
            <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
            <span slot="placeholder"> Tipo de transmisión</span>
            <span slot="selectedPlaceholder">¿Qué tipo de transmisión desea?</span>
            <template v-slot:selectedValue="selectedValue">
                {{selectedValue.selectedValue.display}}
            </template>
            <template v-slot:option="option">
                {{option.option.display}}
            </template>
        </gtt-select>
        <gtt-select :openedLodging.sync="categoriesOpened" @click.native="loadMarcas" :options="carsCategories" class="cleft" v-model="selectedCarCategory">
            <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
            <span slot="placeholder"> Categoría</span>
            <span slot="selectedPlaceholder">¿Cómo desea el auto?</span>
            <template v-slot:option="option">
                {{option.option.nombre}}
            </template>
            <template v-slot:selectedValue="selectedValue">
                {{overflowText(selectedValue.selectedValue.nombre)}}
            </template>
        </gtt-select>
        <gtt-select :options="countries" v-model="selectedNationality">
            <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
            <span slot="placeholder"> Nacionalidad</span>
            <template v-slot:selectedValue="selectedValue">
                <img :src="defaultFlagImgPath+selectedValue.selectedValue.flag" :alt="selectedValue.selectedValue.nombre + 'flag'" class="select-flag"> {{ selectedValue.selectedValue.nombre }}
            </template>
            <template v-slot:option="option">
                <img :src="defaultFlagImgPath+option.option.flag" :alt="option.option.nombre + 'flag'" class="select-flag"> {{ option.option.nombre }}
            </template>
            <template slot="selectedPlaceholder">
                <img :src="defaultFlagImgPath+selectedNationality.flag" :alt="selectedNationality.nombre + 'flag'" class="select-flag"> {{ selectedNationality.nombre }}
            </template>
        </gtt-select>
        <div class="form-actions lodging-form-search-btn">
            <button type="submit" class="antonio-regular">Buscar</button>
        </div>
  </div>
</template>

<script>
import GttSelect from '../custom-elements/GttSelect';
import GttSelectDate from '../custom-elements/GttSelectDate';
import {authSearchPuntosInteres, authSearchMarcas} from '../../utils/auth'

export default {
    components: {
        GttSelect,
        GttSelectDate,
    },
    props: {
        propPickUpDate:{
            default: null
        },
        propDeliveryDate:{
            default: null
        },
        propPickUpPlace:{
            default: null
        },
        propDeliveryPlace:{
            default: null
        },
        propCarCategory:{
            default: null
        },
        propTransmission:{
            default: null
        },
        propNationality:{
            default: null
        }
    },
    methods: {
        overflowText(text, l = 30){
            if(text.length > l){
                return `${text.substring(0, l)}...`
            }
            return text
        },
        async loadMarcas(){
            if(this.categoriesOpened == true){
                let {data} = await authSearchMarcas()
                let totalResult = []
                data.forEach(item=>{
                    totalResult = totalResult.concat({
                        nombre: item.Nombre,
                        marcaid: item.MarcaId,
                        type: 'marca'
                    })
                })
                console.log(data)
                this.carsCategories = totalResult
            }
        },
        async loadPickUpPlaces(){
            if(this.pickUpOpened == true){
                let {data} = await authSearchPuntosInteres()
                let totalResult = []
                data.forEach(item=>{
                    totalResult = totalResult.concat({
                        nombre: item.Nombre,
                        regionid: item.RegionId,
                        puntointeresid: item.PuntoInteresId,
                        type: 'punto-interes'
                    })
                })
                console.log(totalResult)
                this.pickUpDeliveryOptions = totalResult
            }
        },
        async loadDeliveryPlaces(){
            if(this.deliveryOpened == true){
                let {data} = await authSearchPuntosInteres()
                let totalResult = []
                data.forEach(item=>{
                    totalResult = totalResult.concat({
                        nombre: item.Nombre,
                        regionid: item.RegionId,
                        puntointeresid: item.PuntoInteresId,
                        type: 'punto-interes'
                    })
                })
                console.log(totalResult)
                this.pickUpDeliveryOptions = totalResult
            }
        },
    },
    data(){
        return {
            pickUpOpened: false,
            deliveryOpened: false,
            categoriesOpened: false,
            selectedPickUpPlace: this.propPickUpPlace,
            selectedDeliveryPlace: this.propDeliveryPlace,
            selectedNationality: this.propNationality,
            selectedPickUpDate: this.propPickUpDate,
            selectedDeliveryDate: this.propDeliveryDate,
            selectedTransmissionType: this.propTransmission,
            selectedCarCategory: this.propCarCategory,
            pickUpDeliveryOptions: [],
            carsCategories: [],
            transmissionTypes: [
                {
                    nombre: 'Automatico',
                    display: 'Automático'
                },
                {
                    nombre: 'Manual',
                    display: 'Manual'
                },
                {
                    nombre: 'Automatico S/Seguro',
                    display: 'Automático S/Seguro'
                },
                {
                    nombre: 'Manual S/Seguro',
                    display: 'Manual S/Seguro'
                }
            ],
            defaultFlagImgPath: 'img/flags/',
            countries: [
                {
                    nombre: 'Afganistán',
                    flag: 'flag_afganistan.jpg'
                },
                {
                    nombre: 'Albania',
                    flag: 'flag_albania.jpg'
                },
                {
                    nombre: 'Alemania',
                    flag: 'flag_alemania.jpg'
                },
                {
                    nombre: 'Estados Unidos',
                    flag: 'flag_estadosunidos.jpg'
                },
            ],
        }
    }
}
</script>

<style scoped>
    #lodging-form{
        width: 100%;
        /* height: 100%; */
        padding: 15px;
        background-color: #bcd01b;
        border-radius: 10px;
    }
    .lodging-form-search-btn{
        text-align: right;
    }
</style>
<style>
    #lodging-form .gtt__toggle{
        margin-bottom: 15px;
    }
</style>