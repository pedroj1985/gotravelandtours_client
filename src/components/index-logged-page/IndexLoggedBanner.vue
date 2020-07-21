<template>
    <div id="home-logged-banner">
        <div class="home-logged-img">
            <img src="img/homelogin_img_form_alojamiento.jpg" alt="">
        </div>
        <div class="navs-wrapper">
            <NavBar2></NavBar2>
        </div>
        <div class="lodging-text-form custom-margin">
            <div class="lodging-text antonio-light"><span class="bannerText">Tenemos los mejores</span> <span class="yellow-words antonio-bold">alojamientos</span><span class="bannerText"> para usted y su familia</span></div>
            <div class="lodging-form">
                <gtt-select :options="destinies" v-model="selectedLodgingDestinyValue">
                    <div slot="placeholder"><i class="mdi mdi-map-marker"></i> Destino</div>
                </gtt-select>
                <select aria-placeholder="Fecha de entrada y salida" class="lodging-form-select lodging-form-big"></select>
                <div class="selects-inline">
                    <gtt-select-form :options="roomLayout" class="left" v-model="selectedRoomLayout">
                        <span slot="iconSelectedValue"><i class="mdi mdi-account"></i></span>
                    </gtt-select-form>
                    <gtt-select :options="countries" v-model="selectedNationality">
                        <div slot="placeholder"><i class="mdi mdi-earth"></i> Nacionalidad</div>
                    </gtt-select>
                </div>
                <div class="form-actions text-right">
                    <button type="submit" class="lodging-searchButton antonio-regular">Buscar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar2 from '../shared/NavBar2'; 
import GttSelect from '../custom-elements/GttSelect'
import GttSelectForm from '../custom-elements/GttSelectForm'

export default {
    components: {
        NavBar2,
        GttSelect,
        GttSelectForm
    },
    data(){
        return {
            selectedLodgingDestinyValue: '',
            selectedRoomLayout: {},
            selectedNationality: '',
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
                    label: 'Adultos (+16 años)',
                    display: 'Adultos',
                    default: 1
                },
                {
                    code: 'kids',
                    label: 'Niños (-15 años)',
                    display: 'Niños',
                    default: 0
                },
                {
                    code: 'rooms',
                    label: 'Habitaciones',
                    display: 'Habitaciones',
                    default: 1
                }
            ],
            countries: [
                'Cuba',
                'Estados Unidos',
                'España'
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

</style>