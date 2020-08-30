<template>
    <div id="home-logged-banner">
        <div class="home-logged-img">
            <img src="img/homelogin_img_form_alojamiento.jpg" alt="">
        </div>
        <div class="navs-wrapper">
            <NavBar2 :menuLinks="menuLinks"></NavBar2>
        </div>
        <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
            <div slot="image">
                <img src="img/icopaq_alojamiento_color.svg" alt="">
            </div>
            <div slot="searching-text" class="searching-text">
                <span class="antonio-light">Buscando disponibilidad de </span><span class="antonio-bold text-highlight">alojamientos</span> <span class="antonio-light">en <span v-if="selectedLodgingDestinyValue">{{ selectedLodgingDestinyValue }}</span><span v-else>cualquier lugar</span></span>
            </div>
            <div slot="searching-fields" class="searching-fields">
                <div v-if="selectedDates">entre el {{ constructDate(selectedDates.start) }} y el {{ constructDate(selectedDates.end) }} ({{ calculateNights(selectedDates.start, selectedDates.end)}} noches)</div>
                <div v-if="selectedRoomLayout">para {{ constructDisplay(selectedRoomLayout) }}</div>
            </div>
        </GttModalSearch>
        <div class="lodging-text-form custom-margin">
            <div class="lodging-text antonio-light"><span class="bannerText">Tenemos los mejores</span> <span class="yellow-words antonio-bold">alojamientos</span><span class="bannerText"> para usted y su familia</span></div>
            <div class="lodging-form">
                    <gtt-select :options="destinies" :search="true" v-model="selectedLodgingDestinyValue">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder">Destino</span>
                        <span slot="selectedPlaceholder">¿Dónde desea alojarse?</span>
                    </gtt-select>
                    <gtt-select-date v-model="selectedDates">
                        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                    </gtt-select-date>
                    <div class="selects-inline">
                        <gtt-select-form :options="roomLayout" class="left" v-model="selectedRoomLayout">
                            <span slot="iconSelectedValue"><i class="mdi mdi-account"></i></span>
                            <span slot="placeholder">Visitantes</span>
                        </gtt-select-form>
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
        </div>
    </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2'; 
import GttSelect from '../custom-elements/GttSelect'
import GttSelectForm from '../custom-elements/GttSelectForm'
import GttSelectDate from '../custom-elements/GttSelectDate'
import GttModalSearch from '../custom-elements/GttModalSearch'
import moment from 'moment'
import { eventBus } from '../../main';

export default {
    components: {
        NavBar2,
        GttSelect,
        GttSelectForm,
        GttSelectDate,
        GttModalSearch
    },
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods:{
        handleScroll(){
            let height = window.innerHeight
            if(height*0.25 > this.$el.getBoundingClientRect().top
                && height*0 < this.$el.getBoundingClientRect().top)
            {
                eventBus.$emit('componentScrolled', 'lodging')
            }
        },
        activateModal(){
            this.isModalActive = true;
        },
        desactivateModal(){
            this.isModalActive = false
        },
        constructDate(date){
           return moment(date).locale('es').format('DD MMM YYYY');
        },
        calculateNights(min, max){
            return moment(min).diff(moment(max), 'days') * -1;
        },
        constructDisplay(d){
            let s = '';
            Object.keys(d).forEach(element => {
                s = s+' · '+d[element].value+' '+d[element].display
            });

            return s.substring(2);
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
            ],
            isModalActive: false,
            defaultFlagImgPath: 'img/flags/',
            selectedLodgingDestinyValue: '',
            selectedRoomLayout: {},
            selectedDates: {
                start: moment(),
                end: moment().add(1, 'days')
            },
            selectedNationality: null,
            destinies: [
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
                'Option 1',
                'Option 2',
            ],
            roomLayout: [
                {
                    code: 'adults',
                    label: 'Adultos',
                    display: 'Adulto(s)',
                    default: 1
                },
                {
                    code: 'kids',
                    label: 'Niños',
                    display: 'Niño(s)',
                    default: 0
                },
            ],
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
            ]
        }
    }
}
</script>

<style scoped>
    #home-logged-banner{
        margin-top: 60px;
        width: 100%;
        height: 750px;
        position: relative;
    }

    #home-logged-banner img{
        width: 100%;
        height: 100%;
    }
    .lodging-text-form{
        position: absolute;
        display: flex;
        top: 26%;
        padding-left: 8vw;
    }

    .lodging-form{
        width: 39.06vw;
        height: 350px;
        background-color: #ffffff;
        box-shadow: 0.5px 2px 15px rgba(0, 0, 0, 15%);
        border-radius: 10px;
        padding: 1.5625vw;
    }

    .lodging-text{
        font-size: 48px;
        color: #ffffff;
        margin-top: 70px;
        height: auto;
        margin-right: 1.5625vw;
        line-height: 1.2;
        text-align: right;
        width: 24.74vw;
    }

    .lodging-form .lodging-form-select{
        border-radius: 5px;
        margin-bottom: 30px;
        height: 50px;
        font-size: 18px !important;
    }
    .lodging-form-big{
        width: 100%;
    }
    .lodging-form-small{
        width: 49.5%;
    }

    .left{
        margin-right: 1%;
    }

    .selects-inline{
        display: flex;
    }

    #home-logged-banner .select-flag{
        width: 30px;
        height: 20px;
        margin-right: 5px;
    }

    @media(max-width: 1440px){
        #home-logged-banner{
            width: 100%;
            height: 100%;
        }
        .lodging-text-form{
            position: absolute;
            display: flex;
            top: 26%;
            padding-left: 8vw;
        }
        .lodging-form{
            height: 230px;
            width: 45.06vw;
        }

        .lodging-text{
            font-size: 36px;
        }

        #home-logged-banner .select-flag{
            width: 25px;
            height: 15px;
        }
    }

</style>