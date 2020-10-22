<template>
    <div>
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
                <ResultListRow v-for="child in filteredItems" :key="child.id" :child="child"></ResultListRow>
            </div>
            <div class="open-close-button" @click="openList">
                <i class="mdi" :class="{'mdi-chevron-double-down': !isOpen,
                                                                'mdi-chevron-double-up': isOpen}"></i>
            </div>
     </div> 
</template>

<script>
import Slick from 'vue-slick-carousel'
import ResultListRow from './ResultListRow'
export default {
    components: {
        Slick,
        ResultListRow
    },
    props: {
        item: Object,
        filters: Object
    },
    data(){
        return {
            isOpen: false,
            limit: 2
        }
    },
    computed: {
        filteredItems: function(){
            return this.item.items.slice(0, this.limit)
        }
    },
    methods: {
        constructDisplay(d){
            let s = '';
            Object.keys(d).forEach(element => {
                s = s+' · '+d[element].value+' '+d[element].display
            });

            return s.substring(2);
        },
        openList(){
            if(!this.isOpen){
                this.limit = this.item.items.lenght
            }
            else{
                this.limit = 2;
            }
            this.isOpen = !this.isOpen;
        },
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
    }
}
</script>