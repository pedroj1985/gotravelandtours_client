<template>
    <div id="index-logged-excursion-search">
        <div class="home-logged-excursion-img">
            <img src="img/homelogin_img_form_actividades.jpg" alt="">
        </div>
        <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
            <div slot="image">
                <img src="img/icopaq_excursiones_color.svg" alt="">
            </div>
            <div slot="searching-text" class="searching-text">
                <span class="antonio-light">Buscando disponibilidad de </span><span class="antonio-bold text-highlight">excursiones</span> <span class="antonio-light">en <span v-if="selectedDestiny">{{ selectedDestiny }}</span><span v-else>cualquier lugar</span></span>
            </div>
            <div slot="searching-fields" class="searching-fields">
                <div v-if="selectedDate">para el {{ constructDate(selectedDate) }} </div>
                <div v-if="selectedPassengers">para {{ constructDisplay(selectedPassengers) }}</div>
            </div>
        </GttModalSearch>
        <div class="custom-text-form custom-margin">
            <div class="custom-form">
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="cleft custom-width-big" v-model="selectedDestiny">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Destino</span>
                        <span slot="selectedPlaceholder"> ¿A dónde deseas ir?</span>
                    </gtt-select>
                    <gtt-select :options="activityTypes" class="custom-width-small" v-model="selectedActivityType">
                        <i slot="iconSelectedValue" class="mdi mdi-brightness-4"></i>
                        <span slot="placeholder"> Tipo de actividad</span>
                        <span slot="selectedPlaceholder"> ¿Compartida?</span>
                    </gtt-select>
                </div>
                <div class="selects-inline">
                    <gtt-select-date v-model="selectedDate" :mode="'single'" class="cleft">
                        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                        <span slot="placeholder">
                            Fecha
                        </span>
                    </gtt-select-date>
                    <gtt-select-form :options="passengersLayout" v-model="selectedPassengers">
                        <i slot="iconSelectedValue" class="mdi mdi-account"></i>
                        <span slot="placeholder"> Pasajeros</span>
                    </gtt-select-form>
                </div>
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="cleft" v-model="selectedPickUpPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de recogida</span>
                        <span slot="selectedPlaceholder"> Salimos desde el:</span>
                    </gtt-select>
                    <gtt-select :options="pickUpDeliveryOptions" v-model="selectedDeliveryPlace">
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                        <span slot="placeholder"> Punto de entrega</span>
                        <span slot="selectedPlaceholder"> Te recogemos en el:</span>
                    </gtt-select>
                </div>
                <div class="form-actions text-right">
                    <button type="submit" @click="activateModal" class="lodging-searchButton antonio-regular">Buscar</button>
                </div>
            </div>
            <div class="custom-text antonio-light"><span class="bannerText">Tu mejor plan en </span><span class="yellow-words antonio-bold">Excursiones y actividades</span></div>
        </div>
    </div>
</template>

<script>
import GttSelect from '../custom-elements/GttSelect'
import GttSelectForm from '../custom-elements/GttSelectForm'
import GttSelectDate from '../custom-elements/GttSelectDate'
import GttModalSearch from '../custom-elements/GttModalSearch'
import moment from 'moment'
import { constructDate, constructDisplay, calculateNights } from '../../utils/utils'

export default {
    components: {
        GttSelect,
        GttSelectForm,
        GttSelectDate,
        GttModalSearch
    },
    methods:{
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
        },
        calculateNights(min, max){
            return calculateNights(min, max);
        }
    },
    data(){
        return {
            isModalActive: false,
            selectedPickUpPlace: '',
            selectedDeliveryPlace: '',
            selectedDestiny: '',
            selectedActivityType: '',
            selectedDate: moment(),
            selectedPassengers: null,
            activityTypes: [
                'Compartida',
                'Privada'
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
        }
    }
}
</script>

<style scoped>
    #index-logged-excursion-search{
        position: relative;
        width: 100%;
        /* height: 750px; */
    }
    #index-logged-excursion-search img{
        width: 100%;
    }
    .minor-left{
        margin-right: 0.5%;
    }
    .custom-width-big{
        width: 22.96vw;
    }
    .custom-width-small{
        width: 12.7vw;
    }
    .custom-text{
        text-align: left;
        margin-left: 30px;
    }

    @media(max-width: 1440px)
    {
        .custom-width-big{
            width: 65%;
        }
        .custom-width-small{
            width: 35%;
        }
    }
</style>