<template>
    <div>
        <div class="list-item-general">
            <div class="list-item-carousel">
                <div class="result-images-carousel">
                    <img v-bind:src="item.imagen" alt="imagen no disponible">
                </div>
            </div>
            <div class="list-item-info">
                <div class="item-name hn-bdcn">
                    {{displayName(item.nombre)}}
                </div>
                <div class="item-subname hn-bdcn">
                    {{$helpers.traducir(item.marca)}},
                    {{$helpers.traducir($helpers.findTransmissionLocale(item.transmision))}}
                </div>
                <div class="item-provider hn-bdcn">
                    {{item.provider}}
                </div>
                <slot name="item-other-info" v-bind:item="item">
                    <div class="item-other-info hn-roman">
                        <!-- <div class="item-location" v-if="item.location">
                            <span class="c-space"><i class="mdi mdi-map-marker"></i></span>{{item.location}}
                        </div> -->
                        <div class="item-map-link" v-if="item.mapLink">
                            <span class="c-space"><i class="mdi mdi-map"></i></span>
                            <a :href="item.mapLink" class="map-location">Ubicación en el mapa</a>
                        </div>
                    </div>
                </slot>
                <div class="item-info-icon">
                    <div class="item-info-icon-people">
                        <div class="iii-info-item iii-info-icon"><i class="mdi mdi-account"></i></div>
                        <div class="iii-info-item iii-info-text">{{item.plazas}}</div>
                    </div>
                    <div class="item-info-icon-transmission">
                        <div class="iii-info-item iii-info-icon"><i class="mdi mdi-engine"></i></div>
                        <div class="iii-info-item iii-info-text">{{displayTransmission($helpers.traducir($helpers.findTransmissionLocale(item.transmision)))}}</div>
                    </div>
                </div>
            </div>
            <div class="list-item-price">
                <div class="price-wrapper">
                    <div class="hn-mdcn better-price">Precio para:</div>
                    <div class="price antonio-light">{{ styledPrice(item.precio).intPart}}.<sup>{{ styledPrice(item.precio).decimalPart}}</sup> USD</div>
                    <div class="details-btn form-actions">
                        <button type="submit" class="antonio-regular">Ver detalles</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-item-children">
            <RentResultListRow :child="item">
            </RentResultListRow>
        </div>
        <!-- <div class="open-close-button" @click="openList">
            <i class="mdi" :class="{'mdi-chevron-double-down': !isOpen,
                                                            'mdi-chevron-double-up': isOpen}"></i>
        </div> -->
     </div> 
</template>

<script>
import RentResultListRow from './RentResultListRow'
export default {
    components: {
        RentResultListRow
    },
    props: {
        item: Object,
    },
    data(){
        return {
            // isOpen: false,
            limit: 2
        }
    },
    computed: {
        filteredItems: function(){
            return this.item.items.slice(0, this.limit)
        }
    },
    methods: {
        displayTransmission(item){
            return item.split(' ')[0].toLowerCase()
        },
        displayName(data){
            let data_splitted = data.split('-')
            let sp = data_splitted.slice(1, data_splitted.lenght)

            return sp.join('-')

        },
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