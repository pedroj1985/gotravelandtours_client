<template>
    <Slick class="custom-margin hotel-carousel"
        ref="slick"
        :slidesToShow="4"
        :arrows="true"
        > 
        <div class="index-logged-hotel-wrapper" v-for="hotel in hotels" :key="hotel.id">
            <div class="index-logged-hotel">
                <img :src="'img/'+hotel.img" alt="">
                <div class="name-weather">
                    <div class="name antonio-regular">{{hotel.weather.location}}</div>
                    <div class="weather hn-ltcn">
                        <div class="weather-time mdi" :class="setWeatherClass(hotel.weather.weather)"></div>
                        <div class="temp">{{hotel.weather.temp}}°C</div>
                    </div>
                </div>
                <div class="index-logged-hotel-description">
                    <div class="hotel-name hn-roman">
                        {{hotel.name}}
                    </div>
                    <div class="hotel-stars hn-roman">
                        <div><i class="mdi mdi-star"></i></div>
                        {{hotel.stars}}
                    </div>
                    <div class="hotel-price hn-roman">
                        <div class="desde-word">desde</div>
                        {{ styledPrice(hotel.min_price.value).intPart}}.<sup>{{ styledPrice(hotel.min_price.value).decimalPart}}</sup> <span class="currency">{{hotel.min_price.currency}}</span>
                    </div>
                    <div class="hotel-reserve">
                        <button class="gtt-button gtt-button-rounded gtt-button-thin gtt-button-transparent">Reservar</button>
                    </div>
                </div>
            </div>
        </div>
    </Slick>
</template>

<script>
import Slick from 'vue-slick-carousel'

export default {
    components: {
        Slick
    },
    methods: {
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
        setWeatherClass(weather)
        {
            if(weather == 'sun')
            {
                return 'mdi-weather-sunny';
            }
            if(weather == 'rain')
            {
                return 'mdi-weather-rainy';
            }
            if(weather == 'cloud')
            {
                return 'mdi-weather-partly-cloudy';
            }
            if(weather == 'ccloud')
            {
                return 'mdi-weather-cloudy';
            }
        },
    },
    data(){
        return {
            hotels: [
                {
                    name: "Hotel Jagua by Melia Hotels International",
                    stars: "4",
                    min_price: {
                        currency: "USD",
                        value: "62"
                    },
                    img: "homelogin_destino_cienfuegos.jpg",
                    weather: {
                        location: "Cienfuegos",
                        temp: "29",
                        weather: "rain"
                    }
                },
                {
                    name: "Iberostar Gran Hotel Packard",
                    stars: "5",
                    min_price: {
                        currency: "USD",
                        value: "231"
                    },
                    img: "homelogin_destino_habana.jpg",
                    weather: {
                        location: "La Habana",
                        temp: "28",
                        weather: "ccloud"
                    }
                },
                {
                    name: "Melia Internacional Varadero All Inclusive",
                    stars: "5",
                    min_price: {
                        currency: "USD",
                        value: "250"
                    },
                    img: "homelogin_destino_varadero.jpg",
                    weather: {
                        location: "Varadero",
                        temp: "32",
                        weather: "sun"
                    }
                },
                {
                    name: "Melia Santiago de Cuba",
                    stars: "5",
                    min_price: {
                        currency: "USD",
                        value: "90"
                    },
                    img: "homelogin_destino_santiago.jpg",
                    weather: {
                        location: "Santiago de Cuba",
                        temp: "28",
                        weather: "cloud"
                    }
                },
                {
                    name: "Melia Santiago de Cuba",
                    stars: "5",
                    min_price: {
                        currency: "USD",
                        value: "90"
                    },
                    img: "homelogin_destino_santiago.jpg",
                    weather: {
                        location: "Santiago de Cuba",
                        temp: "28",
                        weather: "cloud"
                    }
                }

            ]
        }
    }
}
</script>

<style scoped>
    .hotel-carousel{
        margin-top: 60px;
    }
    .index-logged-hotel{
        width: 18.75vw;
        height: 475px;
        border-radius: 10px;
        position: relative;
    }
    .index-logged-hotel img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .index-logged-hotel-description{
        position: absolute;
        padding: 15px;
        bottom: 0;
        width: 12vw;
        height: 229px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        left: 50%;
        transform: translate(-50%, 0);
        background: rgba(255,255,255,90%);
    }
    .hotel-name, .hotel-stars, .hotel-price{
        line-height: 1.2;
        text-align: center;
        color: #212f3d;
    }
    .hotel-name{
        margin-bottom: 12px;
        min-height: 22%;
        font-size: 18px;
    }
    .hotel-stars{
        margin-bottom: 20px;
        font-size: 18px;
    }
    .hotel-price{
        margin-bottom: 10px;
        font-size: 18px;
    }
    .hotel-price .currency{
        text-transform: uppercase;
    }
    .desde-word{
        font-size: 14px;
    }
    .hotel-reserve{
        text-align: center;
    }

</style>
<style>
    .hotel-carousel button.slick-arrow{
        z-index: 1;
        width: 45px;
        height: 45px;
    }
    .hotel-carousel button.slick-arrow::before{
        font-size: 45px;
    }
    .hotel-carousel button.slick-prev{
        left: 50px;
    }
    .hotel-carousel button.slick-next{
        right: 50px;
    }
</style>