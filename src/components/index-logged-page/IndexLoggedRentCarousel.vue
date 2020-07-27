<template>
        <Slick class="car-carousel custom-margin"
            ref="slick"
            :slidesToShow="4"
            :arrows="true"
            > 
            <div class="index-logged-car-wrapper" v-for="car in cars" :key="car.id">
                <div class="index-logged-car">
                    <img :src="'img/'+car.img" alt="">
                    <div class="index-logged-car-name">
                        <div class="car-name antonio-bold">
                            {{car.model_name}}
                        </div>
                        <div class="car-category hn-roman">
                            {{car.category}}
                        </div>
                    </div>
                    <div class="index-logged-car-description hn-roman">
                        <div class="capacity">
                            <i class="mdi mdi-account"></i> {{car.capacity}} personas
                        </div>
                        <div class="luggage">
                            <i class="mdi mdi-briefcase"></i> {{car.luggage.quantity}} {{car.luggage.type}}
                        </div>
                        <div class="car-type">
                            <i class="mdi mdi-engine"></i> {{car.type}}
                        </div>
                        <div class="agencies">
                            <div class="agency-havanautos">
                                <i class="mdi mdi-alpha-h-box-outline" :class="{'non-selected': !isSelected('H',car.agencies)}"></i>
                            </div>
                            <div class="agency-cubacar">
                                <i class="mdi mdi-alpha-c-box-outline" :class="{'non-selected': !isSelected('C',car.agencies)}"></i>
                            </div>
                            <div class="agency-via">
                                <i class="mdi mdi-alpha-v-box-outline" :class="{'non-selected': !isSelected('V',car.agencies)}"></i>
                            </div>
                            <div class="agency-rex">
                                <i class="mdi mdi-alpha-r-box-outline" :class="{'non-selected': !isSelected('R',car.agencies)}"></i>
                            </div>
                        </div>
                        <div class="car-price hn-roman">
                            <span class="from-word">desde</span> {{ styledPrice(car.min_price.value).intPart}}.<sup>{{ styledPrice(car.min_price.value).decimalPart}}</sup> <span class="currency">{{car.min_price.currency}}</span>
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
    methods: {
        isSelected(word,list){
            return list.includes(word)
        },
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
    },
    data(){
        return {
            cars: [
                {
                    model_name: 'Mercedes Benz Clase C200',
                    img: 'homelogin_img_form_renta.jpg',
                    category: 'premium plus',
                    capacity: '4',
                    luggage: {
                        quantity: '2',
                        type: 'grandes'
                    },
                    type: 'automático',
                    min_price: {
                        currency: 'USD',
                        value: '145'
                    },
                    agencies: [
                        'R',
                    ]
                },
                {
                    model_name: 'Hyundai Santa Fe',
                    img: 'homelogin_img_form_renta.jpg',
                    category: 'jeep',
                    capacity: '5',
                    luggage: {
                        quantity: '2',
                        type: 'pequeños'
                    },
                    type: 'automático',
                    min_price: {
                        currency: 'USD',
                        value: '270'
                    },
                    agencies: [
                        'R',
                    ]
                },
                {
                    model_name: 'Peugeot 301',
                    img: 'homelogin_img_form_renta.jpg',
                    category: 'medium',
                    capacity: '5',
                    luggage: {
                        quantity: '2',
                        type: 'grandes'
                    },
                    type: 'automático',
                    min_price: {
                        currency: 'USD',
                        value: '66'
                    },
                    agencies: [
                        'V',
                    ]
                },
                {
                    model_name: 'Morris Garage MG3',
                    img: 'homelogin_img_form_renta.jpg',
                    category: 'económico',
                    capacity: '4',
                    luggage: {
                        quantity: '2',
                        type: 'pequeñas'
                    },
                    type: 'manual',
                    min_price: {
                        currency: 'USD',
                        value: '46'
                    },
                    agencies: [
                        'C',
                        'V'
                    ]
                },{
                    model_name: 'Morris Garage MG3',
                    img: 'homelogin_img_form_renta.jpg',
                    category: 'económico',
                    capacity: '4',
                    luggage: {
                        quantity: '2',
                        type: 'pequeñas'
                    },
                    type: 'manual',
                    min_price: {
                        currency: 'USD',
                        value: '46'
                    },
                    agencies: [
                        'C',
                        'V'
                    ]
                }

            ]
        }
    }
}
</script>

<style>
    .car-carousel{
        /* width: 100%; */
    }
    .index-logged-car{
        width: 18.75vw;
        height: 475px;
        border-radius: 10px;
        position: relative;
    }
    .index-logged-car img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .index-logged-car-description{
        position: absolute;
        padding: 15px;
        color: #ffffff;
        font-size: 16px;
        line-height: 1.2;
        bottom: 0;
        width: 12vw;
        height: 197px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        left: 50%;
        transform: translate(-50%, 0);
        background: rgba(33, 47, 61,80%);
    }
    .index-logged-car-name{
        color: #212f3d;
        text-align: center;
        position: absolute;
        padding: 15px;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        width: 12vw;
        height: 74px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        background: rgba(188, 208, 29, 80%);
    }
    .car-name{
        font-size: 18px;
    }
    .car-category{
        font-size: 16px;
    }
    .capacity, .luggage, .car-type{
        margin-bottom: 10px;
    }
    .agencies{
        margin-top: 20px;
        font-size: 30px;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .agencies div{
        margin-right: 10px;
    }
    .non-selected{
        color: #6d6d6d;
    }
    .car-price{
        margin-top: 15px;
        text-align: right;
        font-size: 18px;
    }
    .car-price .from-word{
        font-size: 14px;
    }
    .car-carousel button.slick-arrow{
        z-index: 1;
        width: 45px;
        height: 45px;
    }
    .car-carousel button.slick-arrow::before{
        font-size: 45px;
    }
    .car-carousel button.slick-prev{
        left: 50px;
    }
    .car-carousel button.slick-next{
        right: 50px;
    }
</style>