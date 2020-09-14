<template>
  <div id="lodging-form">
        <gtt-select :options="destinies" :search="true" v-model="selectedLodgingDestinyValue">
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder">Destino u hoteles</span>
            <span slot="selectedPlaceholder">¿Dónde desea alojarse?</span>
        </gtt-select>
        <gtt-select-date v-model="selectedArriveDate" :mode="'single'">
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder">
                Fecha de entrada
            </span>
        </gtt-select-date>
        <gtt-select-date v-model="selectedDepartureDate" :mode="'single'">
            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
            <span slot="placeholder">
                Fecha de salida
            </span>
        </gtt-select-date>
        <gtt-select-form :options="roomLayout" v-model="selectedRoomLayout">
            <span slot="iconSelectedValue"><i class="mdi mdi-account"></i></span>
            <span slot="placeholder">Visitantes</span>
        </gtt-select-form>
        <gtt-select-form :options="rooms" v-model="selectedRooms">
            <span slot="iconSelectedValue"><i class="mdi mdi-bunk-bed"></i></span>
            <span slot="placeholder">Habitaciones</span>
        </gtt-select-form>
        <gtt-select :options="countries" v-model="selectedNationality">
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
</template>

<script>
import GttSelect from '../custom-elements/GttSelect';
import GttSelectDate from '../custom-elements/GttSelectDate';
import GttSelectForm from '../custom-elements/GttSelectForm';
import moment from 'moment'

export default {
    components: {
        GttSelect,
        GttSelectDate,
        GttSelectForm
    },
    methods: {
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
            selectedLodgingDestinyValue: '',
            selectedArriveDate: moment(),
            selectedDepartureDate: moment().add(1, 'days'),
            selectedRoomLayout: {},
            selectedRooms: {},
            selectedNationality: null,
            defaultFlagImgPath: 'img/flags/',
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
            rooms: [
                {
                    code: 'rooms',
                    label: 'Habitaciones',
                    display: 'Habitación(es)',
                    default: 1
                },
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
            destinies: [
                'Blau Varadero Hotel Cuba',
                'Iberostar Selection Varadero',
                'Royalton Hicacos Varadero Resort & Spa',
                'Sanctuary at Grand Memories Varadero',
            ]
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
</style>
<style>
    #lodging-form .gtt__toggle{
        margin-bottom: 15px;
    }
</style>