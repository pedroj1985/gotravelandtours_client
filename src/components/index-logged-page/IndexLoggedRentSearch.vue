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
                <span class="antonio-light">Buscando disponibilidad de </span><span class="antonio-bold text-highlight">autos en renta</span> <span class="antonio-light">en <span v-if="selectedPickUpPlace">{{ selectedPickUpPlace.location }}</span><span v-else>cualquier lugar</span></span>
            </div>
            <div slot="searching-fields" class="searching-fields">
                <div v-if="selectedDates">entre el {{ constructDate(selectedDates.start) }} y el {{ constructDate(selectedDates.end) }} ({{ calculateNights(selectedDates.start, selectedDates.end)}} noches)</div>
                <div v-if="selectedCarCategory">{{selectedCarCategory}}</div>
            </div>
        </GttModalSearch>
        <div class="custom-text-form custom-margin">
            <div class="custom-form">
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="left" v-model="selectedPickUpPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de recogida</span>
                        <span slot="selectedPlaceholder">¿Dónde desea rentar el auto?</span>
                        <template v-slot:selectedValue="selectedValue">
                            {{selectedValue.selectedValue.agency}} - {{ selectedValue.selectedValue.location }}
                        </template>
                        <template v-slot:option="option">
                            {{option.option.agency}} - {{ option.option.location }}
                        </template>
                    </gtt-select>
                    <gtt-select :options="pickUpDeliveryOptions" v-model="selectedDeliveryPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de entrega</span>
                        <span slot="selectedPlaceholder">¿Dónde entregaría el auto?</span>
                        <template v-slot:selectedValue="selectedValue">
                            {{selectedValue.selectedValue.agency}} - {{ selectedValue.selectedValue.location }}
                        </template>
                        <template v-slot:option="option">
                            {{option.option.agency}} - {{ option.option.location }}
                        </template>
                    </gtt-select>
                </div>
                <gtt-select-date v-model="selectedDates">
                    <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                </gtt-select-date>
                <div class="selects-inline">
                    <gtt-select :options="carsCategories" class="left" v-model="selectedCarCategory">
                        <i slot="iconSelectedValue" class="mdi mdi-car-estate"></i>
                        <span slot="placeholder"> Categoría</span>
                        <span slot="selectedPlaceholder">¿Cómo desea que sea el auto?</span>
                    </gtt-select>
                    <gtt-select :options="countries" v-model="selectedNationality" class="select-countries">
                        <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
                        <span slot="placeholder"> Nacionalidad</span>
                        <template v-slot:selectedValue="selectedValue">
                            <img :src="defaultFlagImgPath+selectedValue.selectedValue.flag" :alt="selectedValue.selectedValue.value + 'flag'" class="select-flag"> {{ selectedValue.selectedValue.value }}
                        </template>
                        <template v-slot:option="option">
                            <img :src="defaultFlagImgPath+option.option.flag" :alt="option.option.value + 'flag'" class="select-flag"> {{ option.option.value }}
                        </template>
                        <template slot="selectedPlaceholder">
                            <img :src="defaultFlagImgPath+searchCountriesPlaceholder().flag" :alt="searchCountriesPlaceholder().value + 'flag'" class="select-flag"> {{ searchCountriesPlaceholder().value }}
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


export default {
    components: {
        GttSelect,
        GttSelectDate,
        GttModalSearch
    },
    methods: {
        activateModal(){
            this.isModalActive = true;
        },
        desactivateModal(){
            this.isModalActive = false;
        },
        constructDate(date){
           return constructDate(date)
        },
        calculateNights(date){
            return calculateNights(date)
        },
        searchCountriesPlaceholder(){
            let usa = this.countries.find((el)=>{
                return el.value == "Estados Unidos"
            })

            if(usa)
            {
                return usa
            }
            else{
                return this.countries[0]
            }

        }
    },
    data(){
        return {
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
            countries: [
                {
                    value: 'Afganistán',
                    flag: 'flag_afganistan.jpg'
                },
                {
                    value: 'Albania',
                    flag: 'flag_albania.jpg'
                },
                {
                    value: 'Alemania',
                    flag: 'flag_alemania.jpg'
                },
                {
                    value: 'Estados Unidos',
                    flag: 'flag_estadosunidos.jpg'
                },
            ],
            carsCategories: [
                'Alto estándar automático',
                'Económico automático',
                'Económico mecánico',
                'Estándar automático',
                'Jeep automático',
                'Lujo automático',
                'Medio automático',
                'Medio mecánico',
                'Minivan automático',
                'Premium automático',
            ],
            pickUpDeliveryOptions: [
                {
                    agency: 'Cubacar',
                    location: 'Hotel Copacabana'
                },
                {
                    agency: 'Cubacar',
                    location: 'Hotel Chateau Miramar'
                },
                {
                    agency: 'Cubacar',
                    location: 'Hotel Neptuno'
                },
                {
                    agency: 'Cubacar',
                    location: 'Kasalta'
                },
                {
                    agency: 'Havanautos',
                    location: 'Hotel Chateau Miramar'
                }
            ]
        }
    }
}
</script>

<style scoped>
    #index-logged-rent-search{
        width: 100%;
        position: relative;
        height: 750px;
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