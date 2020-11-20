<template>
        <div class="rent-edit-list-item">
            <div class="flex-wrapper">
                <div style="margin-bottom: 30px;" class="current-car font16 hn-roman gtt-first-color">
                    <b>Auto actual:</b> <span>{{displayName(currentCar)}}</span>
                </div>
                <button type="button" class="ml-auto btn-close" @click="$emit('close')">
                    <i class="mdi mdi-close"></i>
                </button>
            </div>
            <div class="list-wrapper">
                <div class="list-item" v-for="item in resultList" :key="item.id">
                    <RentResultListItem :totalDays="calculateNights(item.orderVehiculo.FechaEntrega, item.orderVehiculo.FechaRecogida)" :noDetail="true" @selectedElementEditItem="emitElement" :item="item" :onlyToSelect="true"></RentResultListItem>
                </div>
            </div>
        </div>
</template>

<script>
import RentResultListItem from '../result-rent/RentResultListItem'
import moment from 'moment'

export default {
    components: {
        RentResultListItem
    },
    props: {
        resultList: Array,
        currentCar: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            isLoadingEverything: false
        }
    },
    methods: {
        displayName(data){
            let data_splitted = data.split('-')
            let sp = data_splitted.slice(1, data_splitted.lenght)

            return sp.join('-')

        },
        calculateNights(min, max){
            return moment(min).diff(moment(max), 'days');
        },
        search(filters){
            console.log(filters)
            return []
        },
        emitElement(value){
            this.$emit('selectedElementEdit', value)
        }
    },
    
}
</script>

<style>
    .rent-edit-list-item{
        width: 70vw;
    }
</style>
<style>
    .btn-close{
        background: transparent;
        color: #212f3d;
        border: none;
    }
    .list-wrapper{
        max-height: 50vh;
        overflow: scroll;
    }
</style>