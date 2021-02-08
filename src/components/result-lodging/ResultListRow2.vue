<template>
    <div>
        <div class="item-children">
            <div class="children-wrapper">
                <div class="item-children-header">
                    <div class="item-children-info-btn">
                        <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'info'}" @click="selectInfo('info')"><i class="mdi mdi-clipboard-text"></i></button>
                    </div>
                    <div class="item-children-name hn-roman">
                        <slot name="itemChildrenNameSlot" v-bind:child="child">
                            <span class="font16">{{child.habitacion.Habitacion.Nombre}}</span> 
                            <!-- <span class="dist">{{child.combinacion.display}}</span> -->
                        </slot>
                    </div>
                    <slot name="itemChildren" v-bind:child="child">
                            <div class="item-children-section hn-roman">
                                <div class="item-children-section-item">{{child.PA.Codigo}}</div>
                                <div class="item-children-section-item item-children-section-icon"><i class="mdi mdi-phone-check"></i></div>
                                <div>
                                    <template v-if="child.CantAdultos == 1">
                                        <i class="mdi mdi-account-box"></i>
                                    </template>
                                    <template v-if="child.CantAdultos == 2">
                                        <i class="mdi mdi-account-box"></i>
                                        <i class="mdi mdi-account-box"></i>
                                    </template>
                                    <template v-if="child.CantAdultos == 3">
                                        <i class="mdi mdi-account-box"></i>
                                        <i class="mdi mdi-account-box"></i>
                                        <i class="mdi mdi-account-box"></i>
                                    </template>
                                    <i class="mdi mdi-account-box-outline" v-for="k in child.CantMenores" :key="k"></i>
                                    <span class="hn-roman">
                                        {{child.CantAdultos}} adulto(s) <template v-if="child.CantMenores>0">y {{child.CantMenores}} niño(s)</template>
                                    </span>
                                </div>
                                <!-- <div class="item-children-section-item item-children-section-icon item-children-info-btn">
                                    <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'roomLayout'}" @click="selectInfo('roomLayout')">
                                        <i class="mdi mdi-floor-plan"></i>
                                    </button>
                                </div> -->
                            </div>
                    </slot>
                    <div class="item-children-right-part">
                        <div class="item-children-price hn-roman">
                            <slot name="itemChildrenPriceSlot" v-bind:child="child">
                                {{ styledPrice(child.habitacion.PrecioOrden).intPart}}.<sup>{{ styledPrice(child.habitacion.PrecioOrden).decimalPart}}</sup> USD
                            </slot>
                        </div>
                        <div class="item-children-reserve form-actions">
                            <!-- <button type="submit" class="antonio-regular inverse btn-cart" @click="addToCart"><i class="mdi mdi-cart"></i></button> -->
                            <button type="submit" class="antonio-regular" @click="addToCart">Seleccionar</button>
                        </div>
                    </div>
                </div>
                <div class="item-children-content hn-roman">
                    <div class="item-children-content-info" v-if="selectedInfo == 'info'">
                        <slot name="itemContentInfoSlot" v-bind:child="child">
                            <div class="hn-roman" v-html="child.habitacion.Habitacion.Descripcion"></div>
                        </slot>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {lodgingUtilsMixin} from "../../mixins/lodgingUtilsMixin"
import {authGetRoomTypes} from "../../utils/auth"
export default {
    mixins: [
        lodgingUtilsMixin
    ],
    data(){
        return {
            selectedInfo: '',
            todosTiposHabitaciones:  [],
        }
    },
    async created(){
        let tth = await authGetRoomTypes()
        this.todosTiposHabitaciones = tth.data
    },
    props: {
        child: Object
    },
    methods: {
        addToCart() {
            this.$emit('listReserve', this.child)
        },
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = Math.round((number - intPart) * 100);

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
        },
        reserve(){
            console.log(this.child)
            console.log('ajsdhasjkdhjkashdajksdhaskhdaskhdsakhdaskdjhdkjahdakjdh')
        },
        findPrecio(item, listadoPrecios){
            let tipoHabitacion = this.habitacionPorCantidadPersonas(item.CantAdult, this.todosTiposHabitaciones)
            let r = listadoPrecios.find( i => {
                return i.tipoHabitacion == tipoHabitacion.TipoHabitacionId
            })
            return  r.price       
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
        padding-right: 230px;
        padding-left: 60px;
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
        /* margin-right: auto; */
        color: #6d6d6d;
        font-size: 16px;
        width: 35%;
    }
    .dist{
        font-size: 12px;
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