<template>
    <Slick
        id="destinies-carousel"
        class="custom-margin"
        ref="slick"
        :slidesToShow="4"
        :draggable="true"
        :arrows="true"
        >
        <div class="wrapper service-c" v-for="destiny in destinies" :key="destiny.id">
            <div class="dest">
                <img v-bind:src="'img/'+destiny.image" alt="">
                <div class="name-weather">
                    <div class="name antonio-regular">{{destiny.name}}</div>
                    <div class="weather hn-ltcn">
                        <div class="weather-time mdi" :class="setWeatherClass(destiny.weather.weather)"></div>
                        <div class="temp">{{destiny.weather.temp}}°C</div>
                    </div>
                </div>
                <div class="description hn-roman"><div class="inner-text">{{destiny.description}}</div></div>
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
    data(){
        return {
            destinies: [
            {
                name: 'Cienfuegos',
                weather: {temp: 25, weather: 'rain'},
                description: 'Cienfuegos es una ciudad y municipio de Cuba, capital de la provincia del mismo nombre (anteriormente pertenecía a la provincia de Las Villas). Está ubicada en la llamada península de la Majagua, a la orilla de la bahía de Jagua, de 88km², al fondo de la misma. Esta bahía de nombre aborigen (significa origen, fuente, manantial, riqueza) está abierta al Mar Caribe por un estrecho canal que sirve de acceso a las embarcaciones que usan el puerto.',
                image: 'home_destino_cienfuegos.jpg'
            },
            {
                name: 'La Habana',
                weather: {temp: 28, weather: 'cloud'},
                description: 'Fundada en 1514 por el conquistador Pánfilo de Narváez (bajo las órdenes de Diego Velázquez de Cuéllar), bajo el nombre de Villa de San Cristóbal de La Habana, fue la sexta villa fundada por la Corona española en la isla. Debido a su privilegiada ubicación, y las características de su bahía, se convirtió en un importante centro comercial, razón por la cual fue sometida a ataques y saqueos por parte de piratas y corsarios.',
                image: 'home_destino_habana.jpg'
            },
            {
                name: 'Varadero',
                weather: {temp: 32, weather: 'sun'},
                description: 'Varadero es una ciudad de Cuba perteneciente el municipio Cárdenas, situada en la península de Hicacos, provincia Matanzas a 130km al este de La Habana. Al noreste Punta Hicacos es el lugar más septentrional de Cuba. Es un territorio especial de la República de Cuba. Una de las mejores playas para el snorkel y el buceo. Varadero la mejor playa de Cuba y una de las mejores playas del mundo.',
                image: 'home_destino_varadero.jpg'
            },
            {
                name: 'Santiago de Cuba',
                weather: {temp: 28, weather: 'ccloud'},
                description: 'Santiago de Cuba es una ciudad de Cuba, situada en el oriente de la isla. Es la segunda ciudad más importante del país debido a su economía y población. Fue capital de la antigua provincia de Oriente y actualmente lo es de la provincia del mismo nombre. Fue fundada en 1515 por el conquistador español Diego Velázquez de Cuéllar, entre las primeras ocho villas de Cuba.',
                image: 'home_destino_santiago.jpg'
            },
            {
                name: 'Varadero',
                weather: {temp: 32, weather: 'sun'},
                description: 'Varadero es una ciudad de Cuba perteneciente el municipio Cárdenas, situada en la península de Hicacos, provincia Matanzas a 130km al este de La Habana. Al noreste Punta Hicacos es el lugar más septentrional de Cuba. Es un territorio especial de la República de Cuba. Una de las mejores playas para el snorkel y el buceo. Varadero la mejor playa de Cuba y una de las mejores playas del mundo.',
                image: 'home_destino_varadero.jpg'
            }
            ]
        }
    },
    methods: {
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
    }
}
</script>

<style scoped>

</style>