<template>
    <div id="index-logged-excursion-search">
        <div class="home-logged-excursion-img">
            <img src="img/homelogin_img_form_actividades.jpg" alt="">
        </div>
        <div class="custom-text-form custom-margin">
            <div class="custom-form">
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="left" v-model="selectedPickUpPlace">
                        <div slot="placeholder"><i class="mdi mdi-map-marker"></i> Punto de recogida</div>
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                    </gtt-select>
                    <gtt-select :options="pickUpDeliveryOptions" v-model="selectedDeliveryPlace">
                        <div slot="placeholder"><i class="mdi mdi-map-marker"></i> Punto de entrega</div>
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                    </gtt-select>
                </div>
                <div class="selects-inline">
                    <gtt-select :options="pickUpDeliveryOptions" class="left custom-width-big" v-model="selectedDestiny">
                        <div slot="placeholder"><i class="mdi mdi-map-marker"></i> Destino</div>
                        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                    </gtt-select>
                    <gtt-select :options="activityTypes" class="custom-width-small" v-model="selectedActivityType">
                        <div slot="placeholder"><i class="mdi mdi-brightness-4"></i> Tipo de actividad</div>
                        <i slot="iconSelectedValue" class="mdi mdi-brightness-4"></i>
                    </gtt-select>
                </div>
                <div class="selects-inline">
                    <gtt-select-date v-model="selectedDate" :mode="'single'" class="left custom-width-big">
                        <div slot="placeholder">
                            <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                            Fecha
                        </div>
                        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                    </gtt-select-date>
                    <gtt-select-form :options="passengersLayout" class="custom-width-small" v-model="selectedPassengers">
                        <div slot="placeholder"><i class="mdi mdi-account"></i> Pasajeros</div>
                        <i slot="iconSelectedValue" class="mdi mdi-account"></i>
                    </gtt-select-form>
                </div>
                <div class="form-actions text-right">
                    <button type="submit" class="lodging-searchButton antonio-regular">Buscar</button>
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

export default {
    components: {
        GttSelect,
        GttSelectForm,
        GttSelectDate
    },
    data(){
        return {

            selectedPickUpPlace: '',
            selectedDeliveryPlace: '',
            selectedDestiny: '',
            selectedActivityType: '',
            selectedDate: null,
            selectedPassengers: null,
            activityTypes: [
                'Diurna',
                'Nocturna'
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
                    label: 'Adultos (+16 años)',
                    display: 'Adultos',
                    default: 0
                },
                {
                    code: 'kids',
                    label: 'Niños (-15 años)',
                    display: 'Niños',
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
        height: 750px;
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
</style>