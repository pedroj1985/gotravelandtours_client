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
                    <div slot="placeholder"><i slot="iconSelectedValue" class="mdi mdi-map-marker"></i> Destino</div>
                    <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
                </gtt-select>
                <gtt-select-date v-model="selectedDates">
                    <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                </gtt-select-date>
                <div class="selects-inline">
                    <gtt-select-form :options="roomLayout" class="left" v-model="selectedRoomLayout">
                        <span slot="iconSelectedValue"><i class="mdi mdi-account"></i></span>
                    </gtt-select-form>
                    <gtt-select :options="countries" v-model="selectedNationality" class="select-countries">
                        <div slot="placeholder"><i class="mdi mdi-earth"></i> Nacionalidad</div>
                        <template v-slot:selectedValue="selectedValue">
                            <img :src="defaultFlagImgPath+selectedValue.selectedValue.flag" :alt="selectedValue.selectedValue.value + 'flag'" class="select-flag"> {{ selectedValue.selectedValue.value }}
                        </template>
                        <template v-slot:option="option">
                            <img :src="defaultFlagImgPath+option.option.flag" :alt="option.option.value + 'flag'" class="select-flag"> {{ option.option.value }}
                        </template>
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
import GttSelectDate from '../custom-elements/GttSelectDate'

export default {
    components: {
        NavBar2,
        GttSelect,
        GttSelectForm,
        GttSelectDate
    },
    data(){
        return {
            defaultFlagImgPath: 'img/flags/',
            selectedLodgingDestinyValue: '',
            selectedRoomLayout: {},
            selectedDates: null,
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
        margin-right: 15px;
    }

</style>