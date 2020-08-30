<template>
    <div id="index-logged-transfer">
        <div class="home-logged-transfer-img">
            <img src="img/homelogin_img_form_traslados.jpg" alt="">
        </div>
        <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
            <div slot="image">
                <img src="img/icopaq_traslado_color.svg" alt="">
            </div>
            <div slot="searching-text" class="searching-text">
                <span class="antonio-light">Buscando disponibilidad de </span><span class="antonio-bold text-highlight">traslados</span> <span class="antonio-light">en <span v-if="selectedDestinyPlace">{{ selectedDestinyPlace }}</span><span v-else>cualquier lugar</span></span>
            </div>
            <div slot="searching-fields" class="searching-fields">
                <div v-if="selectedDepartureDate && selectedArrivalDate">entre el {{ constructDate(selectedDepartureDate) }} y el {{ constructDate(selectedArrivalDate) }}</div>
                <div v-if="selectedPassengers">para {{ constructDisplay(selectedPassengers) }}</div>
            </div>
        </GttModalSearch>
        <div class="custom-text-form custom-margin">
            <div class="custom-text antonio-light"><span class="bannerText">Las mejores ofertas en </span><span class="yellow-words antonio-bold">traslados</span></div>
            <div class="custom-form">
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="left" v-model="selectedPickUpPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de origen</span>
                        <span slot="selectedPlaceholder"> Salimos desde el:</span>
                    </gtt-select>
                    <gtt-select :options="pickUpDeliveryOptions" v-model="selectedDestinyPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de destino</span>
                        <span slot="selectedPlaceholder"> Nos dirigimos hasta:</span>
                    </gtt-select>
                </div>
                <div class="selects-inline">
                    <gtt-select-date v-model="selectedDepartureDate" :mode="'single'" class="minor-left single-date-transfer">
                        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                        <span slot="placeholder"> Fecha de salida</span>
                    </gtt-select-date>
                    <gtt-select :options="hours" class="left hour" v-model="selectedDepartureHour">
                        <i slot="iconSelectedValue" class="mdi mdi-alarm"></i>
                        <span slot="placeholder"> Hora</span>
                        <span slot="selectedPlaceholder"> 08:00</span>
                    </gtt-select>
                    <gtt-select-date v-model="selectedArrivalDate" :mode="'single'" class="minor-left single-date-transfer">
                        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                        <span slot="placeholder">Fecha de regreso</span>
                    </gtt-select-date>
                    <gtt-select :options="hours" v-model="selectedArrivalHour" class="hour">
                        <i slot="iconSelectedValue" class="mdi mdi-alarm"></i>
                        <span slot="placeholder"> Hora</span>
                        <span slot="selectedPlaceholder"> 08:00</span>
                    </gtt-select>
                </div>
                <div class="selects-inline">
                    <gtt-select-form :options="passengersLayout" class="left" v-model="selectedPassengers">
                        <i slot="iconSelectedValue" class="mdi mdi-account"></i>
                        <span slot="placeholder"> Pasajeros</span>
                    </gtt-select-form>
                    <gtt-select-form :options="luggagesLayout" v-model="selectedLuggages">
                        <i slot="iconSelectedValue" class="mdi mdi-bag-personal"></i>
                        <span slot="placeholder">Equipaje</span>
                    </gtt-select-form>
                </div>
                <div class="selects-inline">
                    <gtt-select :options="journeyTypes" v-model="selectedJourneyType" class="left custom-width-select">
                        <i slot="iconSelectedValue" class="mdi mdi-transit-transfer"></i>
                        <span slot="placeholder"> Tipo de trayecto</span>
                        <span slot="selectedPlaceholder"> ¿ida y vuelta?</span>
                    </gtt-select>
                    <gtt-select :options="transferTypes" v-model="selectedTransferType" class="left custom-width-select">
                        <i slot="iconSelectedValue" class="mdi mdi-bus-side"></i>
                        <span slot="placeholder"> Tipo de traslado</span>
                        <span slot="selectedPlaceholder"> ¿Compartido?</span>
                    </gtt-select>
                    <div class="form-actions text-right">
                        <button type="submit" @click="activateModal" class="lodging-searchButton antonio-regular">Buscar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GttSelect from '../custom-elements/GttSelect'
import GttSelectDate from '../custom-elements/GttSelectDate'
import GttSelectForm from '../custom-elements/GttSelectForm'
import GttModalSearch from '../custom-elements/GttModalSearch'
import moment from 'moment'
import { constructDate, constructDisplay } from '../../utils/utils'
import { eventBus } from '../../main';

export default {
    components: {
        GttSelect,
        GttSelectDate,
        GttSelectForm,
        GttModalSearch
    },
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll(){
            let height = window.innerHeight
            if(height*0.25 > this.$el.getBoundingClientRect().top
                && height*0 < this.$el.getBoundingClientRect().top)
            {
                eventBus.$emit('componentScrolled', 'transfer')
            }
        },
        activateModal(){
            this.isModalActive = true;
        },
        desactivateModal(){
            this.isModalActive = false;
        },
        constructDate(date){
            return constructDate(date);
        },
        constructDisplay(d){
            return constructDisplay(d);
        }
    },
    data(){
        return {
            isModalActive: false,
            selectedPickUpPlace: '',
            selectedDestinyPlace: '',
            selectedDepartureDate: moment(),
            selectedDepartureHour: null,
            selectedArrivalDate: moment().add(1, 'days'),
            selectedArrivalHour: null,
            selectedPassengers: null,
            selectedLuggages: null,
            selectedJourneyType: null,
            selectedTransferType: null,
            journeyTypes: [
                'Ida y regreso',
                'Solo ida'
            ],
            transferTypes: [
                'Compartido',
                'Privado'
            ],
            pickUpDeliveryOptions: [
                'Aeropuerto Internacional',
                'Blau Varadero Hotel Cuba',
                'Iberostar Selection Varadero',
                'Royalton Hicacos Varadero Resort & Spa',
                'Sanctuary at Grand Memories Varadero',
            ],
            passengersLayout: [
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
            luggagesLayout: [
                {
                    code: 'big_bag',
                    label: 'Equipaje grande',
                    display: 'Equipaje(s) grande',
                    default: 0
                },
                {
                    code: 'small_bag',
                    label: 'Equipaje pequeño',
                    display: 'Pequeño',
                    default: 0
                },
            ],
            hours: [
                '00:00',
                '00:05',
                '00:10',
                '00:15',
                '00:20',
                '00:25',
                '00:30',
            ]
        }
    }
}
</script>

<style scoped>
    #index-logged-transfer{
        position: relative;
        width: 100%;
        /* height: 750px; */
    }
    #index-logged-transfer img{
        width: 100%;
    }
    .minor-left{
        margin-right: 0.5%;
    }
    #index-logged-transfer .single-date-transfer{
        width: 11.06vw;
    }
    #index-logged-transfer .hour{
        width: 6.5vw;
    }

    .custom-width-select{
        width: 10.42vw;
    }

    .form-actions{
        margin-left: auto;
    }
    .custom-text{
        margin-top: 100px;
    }
    @media(max-width: 1440px)
    {
        #index-logged-transfer .single-date-transfer{
            width: 30%;
        }
        #index-logged-transfer .hour{
            width: 20%;
        }
        .custom-width-select{
            width: 30%;
        }
    }
</style>
<style>
    #index-logged-transfer .hour .gtt__list_area{
        width: 150px;
    }
</style>