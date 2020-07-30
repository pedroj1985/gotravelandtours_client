<template>
    <Slick
        class="services-carousel"
        ref="slick"
        :slidesToShow="4"
        :slidesToScroll="4"
        :swipe="true"
        :arrows="false"
        :dots="true"
        >
        <div class="service-c" v-for="service in services" :key="service.id">
            <div class="service" >
                <img :src="'img/'+service.image" alt="">
                <div class="service-content-container">
                    <div class="tag hn-roman">{{service.tag}}</div>
                    <div class="service-desc">
                        <div class="service-desc-title hn-bdcn">{{service.name}}</div>
                        <div class="service-desc-text hn-roman">{{service.description}}</div>
                    </div>
                    <hr>
                    <div class="service-prices hn-roman">
                        <div class="hd">Rango de precios:</div>
                        <div class="price" v-for="price in service.prices" :key="price.id">
                            <span class="currency hn-ltcn">{{price.currency}}</span> <span class="price-interval hn-mdcn">{{ styledPrice(price.min).intPart}}.<sup>{{ styledPrice(price.min).decimalPart}}</sup> - {{ styledPrice(price.max).intPart}}.<sup>{{ styledPrice(price.max).decimalPart}}</sup></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Slick>
</template>

<script>
import Slick from 'vue-slick-carousel';

export default {
    components: {
        Slick
    },
    name: "IndexServices",
    data(){
        return {
            services: [
                {
                image: 'home_servicios_restaurant.jpg',
                tag: 'Restaurant',
                name: 'Habana 61',
                description: 'Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.',
                prices: [
                    {
                       currency: 'cuc',
                       min: 2,
                       max: 14  
                    },
                    {
                       currency: 'eur',
                       min: 1.8,
                       max: 12.6  
                    },
                    {
                       currency: 'usd',
                       min: 1.95,
                       max: 13.65  
                    }
                ]
            },
            {
                image: 'home_servicios_autos.jpg',
                tag: 'Autos clásicos',
                name: 'Havana Classic',
                description: 'Havana Classic es nuestra oferta para un viaje de un día a La Habana desde Varadero. El tour comienza a las 08:00hrs y finaliza a las 18:30hrs en el mismo punto de recogida.',
                prices: [
                    {
                       currency: 'cuc',
                       min: 45,
                       max: 80  
                    },
                    {
                       currency: 'eur',
                       min: 40.45,
                       max: 71.95  
                    },
                    {
                       currency: 'usd',
                       min: 43.80,
                       max: 77.85  
                    }
                ]
            },
            {
                image: 'home_servicios_restaurant.jpg',
                tag: 'Restaurant',
                name: 'Habana 61',
                description: 'Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.',
                prices: [
                    {
                       currency: 'cuc',
                       min: 2,
                       max: 14  
                    },
                    {
                       currency: 'eur',
                       min: 1.8,
                       max: 12.6  
                    },
                    {
                       currency: 'usd',
                       min: 1.95,
                       max: 13.65  
                    }
                ]
            },
            {
                image: 'home_servicios_restaurant.jpg',
                tag: 'Restaurant',
                name: 'Habana 61',
                description: 'Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.',
                prices: [
                    {
                       currency: 'cuc',
                       min: 2,
                       max: 14  
                    },
                    {
                       currency: 'eur',
                       min: 1.8,
                       max: 12.6  
                    },
                    {
                       currency: 'usd',
                       min: 1.95,
                       max: 13.65  
                    }
                ]
            },
            {
                image: 'home_servicios_restaurant.jpg',
                tag: 'Restaurant',
                name: 'Habana 61',
                description: 'Enclavado en el mismo centro histórico de la Habana Vieja. Incluye platos de la cocina cubana tradicional y contemporánea. Amplia carta de vinos y cocteles.',
                prices: [
                    {
                       currency: 'cuc',
                       min: 2,
                       max: 14  
                    },
                    {
                       currency: 'eur',
                       min: 1.8,
                       max: 12.6  
                    },
                    {
                       currency: 'usd',
                       min: 1.95,
                       max: 13.65  
                    }
                ]
            },
            ]
        }
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
    },
}
</script>