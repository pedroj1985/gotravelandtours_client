<template>
  <div id="result-list">
      <div class="list-item" v-for="item in resultList" :key="item.id">
            <div class="list-item-general">
                <div class="list-item-carousel">
                    <Slick
                        ref="slick"
                        :slidesToShow="1"
                        :slidesToScroll="1"
                        :draggable="true"
                        :arrows="false"
                        :dots="true"
                        :autoplay="true"
                        >
                        <div class="result-images-carousel" v-for="destinyImage in item.images" :key="destinyImage.id">
                                <img v-bind:src="destinyImage" alt="">
                        </div>
                    </Slick>
                </div>
                <div class="list-item-info">
                    <div class="item-name hn-bdcn">
                        {{item.name}}
                    </div>
                    <slot name="item-other-info" v-bind:item="item">
                        <div class="item-other-info hn-roman">
                            <div class="item-hotel-stars" v-if="item.stars">
                                <ul class="stars">
                                    <li v-for="i in item.stars" :key="i">
                                        <i class="mdi mdi-star"></i>
                                    </li>
                                </ul>
                            </div>
                            <div class="item-location" v-if="item.location">
                                <span class="c-space"><i class="mdi mdi-map-marker"></i></span>{{item.location}}
                            </div>
                            <div class="item-map-link" v-if="item.mapLink">
                                <span class="c-space"><i class="mdi mdi-map"></i></span>
                                <a :href="item.mapLink" class="map-location">Ubicación en el mapa</a>
                            </div>
                        </div>
                    </slot>
                </div>
                <div class="list-item-price">
                    <div class="price-wrapper">
                        <div class="hn-mdcn better-price">Mejor precio para:</div>
                        <div class="hn-mdcn">{{constructDisplay(filters.selectedRoomLayout)}}, {{constructDisplay(filters.selectedRooms)}}</div>
                        <div class="price antonio-light">{{ styledPrice(item.price.value).intPart}}.<sup>{{ styledPrice(item.price.value).decimalPart}}</sup> {{item.price.currency}}</div>
                        <div class="details-btn form-actions">
                            <button type="submit" class="antonio-regular">Ver detalles</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-item-children">
                <ResultListRow v-for="child in item.items" :key="child.id" :child="child"></ResultListRow>
            </div>
        </div>
    </div>
    </template>

    <script>
    import Slick from 'vue-slick-carousel'
    import ResultListRow from './ResultListRow';
    export default {
        components: {
            Slick,
            ResultListRow
        },
        props: {
            resultList: Array,
            filters: Object
        },
        methods: {
            constructDisplay(d){
                let s = '';
                Object.keys(d).forEach(element => {
                    s = s+' · '+d[element].value+' '+d[element].display
                });

            return s.substring(2);
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

        }
    }
}
</script>

<style>
    .list-item{
        margin-bottom: 50px;
    }
    .list-item-general{
        display: flex;
        border: 1px solid #c4c4c4;
    }
    .list-item-info{
        padding-top: 15px;
        padding-left: 30px;
        width: 50%;
    }
    .list-item-carousel{
        width: 360px;
        height: 252px;
    }

    .item-name{
        min-height: 60px;
        font-size: 24px;
        color: #212f3d;
    }
    .result-images-carousel{
        width: 360px;
        height: 252px;
    }

    .result-images-carousel img{
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    .list-item-carousel .slick-dots{
        bottom: 15px !important;
    }

    .list-item-carousel .slick-dots li button::before {
        color: #ffffff !important;
        opacity: 70%;
    }
    .list-item-carousel .slick-dots li.slick-active button::before {
        color: #bcd01d !important;
        opacity: 70%;
    }

    .list-item-price{
        padding: 15px;
    }
    .price-wrapper{
        border-left: 1px solid #f5f5f5;
        padding-left: 30px;
        padding-right: 30px;
        height: 100%;
        color: #6d6d6d;
        font-size: 16px;
        position: relative;
    }

    .better-price{
        text-transform: uppercase;
    }

    .price-wrapper .price{
        padding-top: 15px;
        font-size: 48px;
        color: #6d6d6d;
    }

    .price-wrapper .details-btn{
        position: absolute;
        bottom: 0;
        left: 50%;
        -webkit-transform: translate(-50%, 0);
    }
</style>
<style scoped>
    .list-item-children{
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 5px;
        background-color: #f5f5f5;
    }
    .item-other-info{
        font-size: 16px;
        color: #6d6d6d;
    }
    .item-other-info a{
        color: #6d6d6d;
        text-decoration-line: underline;
    }
    .item-other-info a:hover{
        color: #212f3d;
    }
    .stars li{
        display: inline-block;
    }
    .stars{
        list-style: none;
        padding-left: 0;
        color: #bcd01d;
        margin-bottom: 0;
        font-size: 24px;
    }
    .c-space{
        padding-right: 5px;
    }
</style>