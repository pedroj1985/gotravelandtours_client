<template>
        <div class="item-children">
            <div class="children-wrapper">
                <div class="item-children-header">
                    <div class="item-children-info-btn">
                        <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'info'}" @click="selectInfo('info')"><i class="mdi mdi-clipboard-text"></i></button>
                    </div>
                    <div class="item-children-name hn-roman">
                        <slot name="itemChildrenNameSlot" v-bind:child="child">
                            {{$helpers.traducir(child.marca)}} {{$helpers.traducir($helpers.findTransmissionLocale(child.transmision))}}
                        </slot>
                    </div>
                    <slot name="itemChildren" v-bind:child="child">
                            <div class="item-children-section hn-roman">
                                <div class="item-children-section-item item-children-section-icon item-children-info-btn" v-if="child.cancelation">
                                    <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'cancelation_policy'}" @click="selectInfo('cancelation_policy')">
                                        <i class="mdi mdi-credit-card-off-outline"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="item-children-section hn-roman">
                                <div class="item-children-section-item item-children-section-icon item-children-info-btn" v-if="child.cancelation">
                                    <button type="button" class="btn-children-info">
                                        <i class="mdi mdi-email"></i>
                                    </button>
                                </div>
                            </div>
                    </slot>
                    <div class="item-children-right-part">
                        <!-- <div class="item-children-price hn-roman">
                            <slot name="itemChildrenPriceSlot" v-bind:child="child">
                                {{ styledPrice(child.precio).intPart}}.<sup>{{ styledPrice(child.precio).decimalPart}}</sup> USD
                            </slot>
                        </div> -->
                        <div class="item-children-reserve form-actions">
                            <button type="submit" class="antonio-regular inverse btn-cart" @click="addToCartAndNotifyIt"><i class="mdi mdi-cart"></i></button>
                            <button type="submit" class="antonio-regular" @click="addToCartAndGoTo">Reservar</button>
                        </div>
                    </div>
                </div>
                <div class="item-children-content hn-roman">
                    <div class="item-children-content-info" v-if="selectedInfo == 'info'">
                        <slot name="itemContentInfoSlot" v-bind:child="child">
                            <!-- <pre class="hn-roman"> -->
                                <div v-html="child.descripcion"></div>
                            <!-- </pre> -->
                        </slot>
                    </div>
                    <div class="item-children-content-info" v-if="selectedInfo == 'cancelation_policy'">
                        <slot name="itemContentInfoSlot" v-bind:child="child">
                            <!-- <pre class="hn-roman"> -->
                                <div v-html="child.cancelation"></div>
                            <!-- </pre> -->
                        </slot>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
// import {authReserve} from '../../utils/auth'
export default {
    created(){
        this.filters = JSON.parse(localStorage.getItem('searchRentFilters'))
    },
    data(){
        return {
            selectedInfo: '',
            filters: null
        }
    },
    props: {
        child: Object
    },
    methods: {
        addToCartAndGoTo(){
            this.addToCart()
            this.$router.push(
                {
                    name: 'reservation',
                }
            )
        },
        addToCartAndNotifyIt(){
            this.addToCart()
            this.$toasted.show('Elemento agregado con éxito a su carrito de compra.' ,{
                type: 'success'
            })
        },
        addToCart(){
            let vo = this.child.orderVehiculo

            let arrLPRA = new Array()
            vo.ListaPreciosRentaAutos.forEach( item => {
                item.PrecioRentaAutos = {
                    PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
                }
                arrLPRA.push({
                    PrecioRentaAutos: {
                        PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
                    }
                })
            })
            vo.ListaPreciosRentaAutos = arrLPRA

            this.$helpers.shoppingCartAdd(this.child)
        },
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
        selectInfo(section)
        {
            if(this.selectedInfo == section)
            {
                this.selectedInfo = ''
            }
            else{
                this.selectedInfo = section
            }
        }
    }
}
</script>

<style scoped>
    .btn-cart{
        margin-right: 5px;
        width: 50px;
    }
    .children-wrapper{
        border-bottom: 1px solid #c4c4c4;
    }
    .item-children-header{
        padding-bottom: 5px;
        display: flex;
    }
    .item-children-content{
        padding-right: 60px;
        padding-left: 60px;
    }
    .item-children-content-info{
        padding-right: 230px;
        padding-left: 60px;
        padding-bottom: 30px;
    }
    .item-children-content pre{
        font-size: 16px;
        color: #6d6d6d;
        white-space: pre-wrap;
    }
    .item-children{
        /* display: flex; */
    }
    .item-children-name{
        margin-right: auto;
        color: #6d6d6d;
        font-size: 16px;
        width: 20%;
    }
    .item-children-section{
        color: #6d6d6d;
        font-size: 24px;
        display: flex;
    }

    .item-children-section-item{
        padding-right: 25px;
        align-self: center;
        font-size: 30px !important;
    }
    .item-children-section-icon{
        font-size: 30px !important;
        color: #212f3d;
        align-self: center;
    }
    .item-children-right-part{
        margin-left: auto;
        display: flex;
    }
    .item-children-price{
        padding-right: 60px;
        color: #6d6d6d;
        font-size: 24px;
    }
    .item-children-info-btn{
        font-size: 24px;
        color: #212f3d;
        padding-right: 20px;
    }
    .item-children-info-btn button{
        border: none;
        background-color: transparent;
    }
    .item-children-info-btn button:hover{
        cursor: pointer;
    }
    .item-children-info-btn button:focus{
        border: none;
        outline: none;
    }
    .item-children-name, .item-children-section, .item-children-price, .item-children-info-btn{
        align-self: center;
    }
    .selected{
        color: #c4c4c4;
    }
</style>