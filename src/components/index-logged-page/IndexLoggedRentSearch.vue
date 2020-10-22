<template>
    <div id="index-logged-rent-search">
        <div class="home-logged-rent-img">
            <img src="img/homelogin_img_form_renta.jpg" alt="">
        </div>
        <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
            <div slot="image">
                <img src="img/icopaq_renta_color.svg" alt="">
            </div>
            <div slot="searching-text" class="searching-text">
                <span class="antonio-light">Buscando disponibilidad de </span><span class="antonio-bold text-highlight">autos en renta</span> <span class="antonio-light">en <span v-if="selectedPickUpPlace">{{ selectedPickUpPlace.nombre }}</span><span v-else>cualquier lugar</span></span>
            </div>
            <div slot="searching-fields" class="searching-fields">
                <div v-if="selectedDates">entre el {{ constructDate(selectedDates.start) }} y el {{ constructDate(selectedDates.end) }} ({{ calculateNights(selectedDates.end, selectedDates.start)}} días)</div>
                <div v-if="selectedCarCategory">{{selectedCarCategory.nombre}}</div>
            </div>
        </GttModalSearch>
        <div class="custom-text-form custom-margin">
            <div class="custom-form">
                <div class="selects-inline">
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
                </div>
                <gtt-select-date v-model="selectedDates">
                    <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                </gtt-select-date>
                <div class="selects-inline">
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
                </div>
                <div class="selects-inline">
                    <gtt-select :openedLodging.sync="categoriesOpened" @click.native="loadMarcas" :options="carsCategories" class="cleft" v-model="selectedCarCategory">
                        <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
                        <span slot="placeholder"> Categoría</span>
                        <span slot="selectedPlaceholder">¿Cómo desea que sea el auto?</span>
                        <template v-slot:option="option">
                            {{option.option.nombre}}
                        </template>
                        <template v-slot:selectedValue="selectedValue">
                            {{overflowText(selectedValue.selectedValue.nombre)}}
                        </template>
                    </gtt-select>
                    <gtt-select :options="countries" v-model="selectedNationality" class="select-countries">
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
                </div>
                <div class="form-actions text-right">
                    <button type="submit" @click="activateModal" class="lodging-searchButton antonio-regular">Buscar</button>
                </div>
            </div>
            <div class="custom-text antonio-light"><span class="yellow-words antonio-bold">Renta de autos</span><span class="bannerText"> en más de 600 puntos del territorio nacional</span></div>
        </div>
    </div>
</template>

<script>
import GttSelect from '../custom-elements/GttSelect'
import GttSelectDate from '../custom-elements/GttSelectDate'
import GttModalSearch from '../custom-elements/GttModalSearch'
import moment from 'moment'
import { constructDate, calculateNights } from '../../utils/utils'
import {authSearchPuntosInteres, authSearchMarcas, authSearchCars} from '../../utils/auth'


export default {
    components: {
        GttSelect,
        GttSelectDate,
        GttModalSearch
    },
    created(){
        this.searchCountriesPlaceholder()
    },
    methods: {
        async activateModal(){
            this.isModalActive = true;
            // let otherData = {
            //     pickUpPlace: this.selectedPickUpPlace,
            //     deliveryPlace: this.selectedDeliveryPlace,
            // }
            let marca = {MarcaId: this.selectedCarCategory.marcaid, Nombre: this.selectedCarCategory.nombre}
            let cliente = {ClienteId: localStorage.getItem('cliente')}
            let transmissionType = this.selectedTransmissionType.nombre
            let searchItem = {
                FechaRecogida: this.selectedDates.start,
                FechaEntrega: this.selectedDates.end,
                Marca: marca,
                TipoTransmision: transmissionType,
                Cliente: cliente
           }
            try{
                let {data} = await authSearchCars(searchItem)
                this.desactivateModal()
                this.$router.push(
                    {
                        name: 'resultRent',
                        params: {
                            searchResult: data,
                            filters: {
                                marca: this.selectedCarCategory,
                                transmision: this.selectedTransmissionType,
                                pickUpPlace: this.selectedPickUpPlace,
                                deliveryPlace: this.selectedDeliveryPlace,
                                pickUpDate: this.selectedDates.start,
                                deliveryDate: this.selectedDates.end,
                                nationality: this.selectedNationality
                            }
                        }
                    }
                )
            }
            catch(error){
                console.log(error)
            }
        },
        desactivateModal(){
            this.isModalActive = false;
        },
        constructDate(date){
           return constructDate(date)
        },
        calculateNights(min, max){
            return calculateNights(min, max)
        },
        overflowText(text, l = 30){
            if(text.length > l){
                return `${text.substring(0, l)}...`
            }
            return text
        },
        searchCountriesPlaceholder(){
            let usa = this.countries.find((el)=>{
                return el.nombre == "Estados Unidos"
            })

            if(usa)
            {
                this.selectedNationality = usa
            }
            else{
                this.selectedNationality = this.countries[0]
            }

        },
        // async loadCountries(){
        //     let {data} = await authSearchCountries()
        //     let totalResult = []
        //     data.forEach(item=>{
        //         totalResult = totalResult.concat({
        //             value: item.name,
        //             flag: `flag_${item.name.toLowerCase()}.jpg`
        //         })
        //     })
        //     console.log(data)
        //     this.countries = totalResult
        // },
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
            countriesOpened: false,
            isModalActive: false,
            defaultFlagImgPath: 'img/flags/',
            selectedDates: {
                start: moment(),
                end: moment().add(1,'days')
            },
            selectedPickUpPlace: null,
            selectedDeliveryPlace: null,
            selectedCarCategory: '',
            selectedNationality: null,
            selectedTransmissionType: null,
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
            pickUpDeliveryOptions: []
        }
    }
}
</script>

<style scoped>
    #index-logged-rent-search{
        width: 100%;
        position: relative;
    }
    #index-logged-rent-search .home-logged-rent-img img{
        width: 100%;
        height: 100%;
    }

    .custom-text{
        text-align: left;
        margin-left: 30px;
    }

    @media(max-width: 1440px){
        #index-logged-rent-search{
            height: auto;
        }
    }
</style>