<template>
    <div id="lodging-detail"
        class="custom-padding-top-2-navbar" style="margin-top: 30px;"
        >
        <div class="row">
            <div class="col-md-3 col-sm-5">
                <div class="selected-rooms">
                    <SelectedRoom
                        v-for="item in roomsToReserve"
                        :key="item.id"
                        :item="item"
                        ></SelectedRoom>
                    <div class="form-actions">
                        <button type="button" v-if="roomsToReserve.length > 0">Reservar</button>
                    </div>
                </div>
            </div>
            <div class="col-md-9 col-sm-7">
                <div class="row lodging-detail-info">
                    <div class="col-md-9 col-sm-12 lodging-info-carousel">
                        <Slick
                            ref="slick"
                            :slidesToShow="1"
                            :slidesToScroll="1"
                            :draggable="true"
                            :arrows="false"
                            :dots="true"
                            :autoplay="true"
                            >
                            <div class="result-images-carousel" v-for="destinyImage in item.images" :key="destinyImage">
                                    <img v-bind:src="destinyImage" alt="">
                            </div>
                        </Slick>
                    </div>
                    <div class="col-md-3 col-sm-12 lodging-info-info">
                        <div class="lodging-info-name">
                            {{item.lodging.Nombre}}
                        </div>
                        <div class="lodging-info-stars">
                            <div class="item-hotel-stars">
                                <ul class="stars">
                                    <li v-for="i in item.lodging.NumeroEstrellas" :key="i">
                                        <i class="mdi mdi-star"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="lodging-info-location">
                            <div>ubicación</div>
                            <div>{{item.lodging.Direccion}}</div>
                        </div>
                        <div class="lodging-info-schedule">
                            <div>horario</div>
                            <div class="checkin">
                                <span class="check-sp">Check-In:</span>
                                <span>{{item.lodging.CheckIn}}</span>
                            </div>
                            <div class="checkout">
                                <span class="check-sp">Check-Out:</span>
                                <span>{{item.lodging.CheckOut}}</span>
                            </div>
                        </div>
                        <div class="lodging-info-lang"></div>
                        <div class="lodging-info-contacts">
                            <div>contactos del hotel</div>
                            <div>
                                <span>{{item.lodging.Telefono}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="prices-and-info">
                    <div class="verify-step-title">
                        Precios e información
                    </div>
                    <div class="info-box">
                        <div class="about">
                            <div>Acerca del hotel</div>
                            <div v-html="item.lodging.Descripcion"></div>
                        </div>
                        <div class="rooms-disponibility">
                            <div>Habitaciones y disponibilidad</div>
                            <div class="flex-wrapper">
                                <GttSelectDate
                                    :mode="'single'"
                                    v-model="inDate"
                                    :dsb="roomsSelecting"
                                >
                                    <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                                    <span slot="placeholder">
                                        Fecha de entrada
                                    </span>
                                </GttSelectDate>
                                <GttSelectDate
                                    :mode="'single'"
                                    v-model="outDate"
                                    :dsb="roomsSelecting"
                                >
                                >
                                    <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
                                    <span slot="placeholder">
                                        Fecha de salida
                                    </span>
                                </GttSelectDate>
                                <GttSelectForm2
                                    :options="roomLayout"
                                    v-model="selectedRoomLayout"
                                    :rooms="totalRooms.value"
                                    :dsb="roomsSelecting"
                                    >
                                    <span slot="iconSelectedValue"><i class="mdi mdi-account"></i></span>
                                    <span slot="placeholder">Visitantes</span>
                                </GttSelectForm2>
                                <GttSelect
                                    :options="roomsOpt"
                                    v-model="totalRooms"
                                    :isDisabled="roomsSelecting"
                                    >
                                    <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
                                    <span slot="placeholder"> Habitaciones</span>
                                    <template v-slot:option="option">
                                        {{ option.option.display }}
                                    </template>
                                    <template v-slot:selectedValue="selectedValue">
                                        {{ selectedValue.selectedValue.display }}
                                    </template>
                                </GttSelect>
                                <div class="form-actions prices-info-search-btn">
                                    <button type="submit" 
                                            class="antonio-regular inverse" 
                                            @click="btnSearch"
                                            >Buscar</button>
                                </div>
                            </div>
                        </div>
                        {{this.roomsSelecting}}
                        <div class="rooms-result">
                            <div class="list-item-children">
                                <ResultListRow2 v-for="child in roomsResult" :key="child.id" :child="child" @listReserve="addToCart"></ResultListRow2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    authGetLodging,
    authGetImage,
    authSearchRoomsByLodging,
    authGetRoomPrice,
    authGetLodgingEatingPlanOne
    } from '../../utils/auth'
import Slick from 'vue-slick-carousel'
import GttSelectDate from '../custom-elements/GttSelectDate'
import GttSelect from '../custom-elements/GttSelect'
import GttSelectForm2 from '../custom-elements/GttSelectForm2'
import ResultListRow2 from '../result-lodging/ResultListRow2'
import moment from 'moment'
import SelectedRoom from './SelectedRoom'

export default {
    components:{
        Slick,
        GttSelectDate,
        GttSelect,
        GttSelectForm2,
        ResultListRow2,
        SelectedRoom
    },
    async created(){
        this.roomsOpt = this.generateRooms()
        this.totalRooms = {
            value: 1,
            display: "1 habitación"
        }
        let f = JSON.parse(localStorage.getItem('searchLodgingFilters'))
        this.filters = f

        let id = this.$route.params.id
        let {data} = await authGetLodging(id)
        let img = await authGetImage(id)
        this.item = {
            'images': [img.data.ImageContent],
            'lodging': data
        }
    },
    data(){
        return {
            item: null,
            filters: null,
            totalRooms: null,
            roomsOpt: [],
            selectedRoomLayout: [],
            roomsToReserve: [],
            roomsSelecting: false,
            selectingWizardStep: 0,
            inDate: moment(),
            outDate: moment().add(1, "days"),
            roomsResult: [],
            roomLayout: [
                {
                    code: 'adults',
                    label: 'Adultos',
                    display: 'Adulto(s)',
                    default: 1
                },
                {
                    code: 'kids',
                    label: 'Niños',
                    display: 'Niño(s)',
                    default: 0
                },
            ]
        }
    },
    methods: {
        async addToCart(item){
            this.roomsToReserve.push(item)
            this.selectingWizardStep++
            if(this.selectingWizardStep == this.selectedRoomLayout.length)
            {
                this.roomsSelecting = false
            }
            else{
                await this.searchRooms(this.selectedRoomLayout[this.selectingWizardStep]) 
            }
            console.log(this.roomsToReserve)
        },
        async btnSearch(){
            this.roomsSelecting = true
            await this.searchRooms(this.selectedRoomLayout[0])
        },
        async searchRooms(room){
            this.roomsResult = [];
            let listaPlanesAlimenticios = this.item.lodging.ListaPlanesAlimenticios
            let ca = room.layout.find(p => p.code=='adults').value
            let cm = room.layout.find(p => p.code=='kids').value
            let rooms = await authSearchRoomsByLodging(this.item.lodging.ProductoId)
            await Promise.all(
                rooms.data.map( async j => {
                    await Promise.all(
                        listaPlanesAlimenticios.map( async i => {
                            let pa = await authGetLodgingEatingPlanOne(i.PlanesAlimenticiosId)
                            let sf = {
                                Cliente: {ClienteId: localStorage.getItem('cliente')},
                                PlanAlimenticio: {PlanAlimenticioId: i.PlanesAlimenticiosId},
                                Alojamiento: {ProductoId: this.item.lodging.ProductoId},
                                TipoHabitacion: {TipoHabitacionId: ca},
                                CantidadAdultos: ca,
                                CantidadMenores: cm,
                                CantidadInfantes: 0,
                                CantidadHabitaciones: 1,
                                Habitacion: {HabitacionId: j.HabitacionId},
                                Entrada: this.inDate,
                                Salida: this.outDate
                            }
                            try{
                                let r = await authGetRoomPrice(sf)
                                if(
                                    r.data.length != 0 
                                    && r.data[0].OrdenAlojamientoId != -1
                                    && r.data[0].PrecioOrden != 0
                                ){
                                    /*
                                        TODO: agregar id para poder borrarlo
                                    */
                                    this.roomsResult.push(
                                        {
                                            habitacion: r.data[0],
                                            CantAdultos: ca,
                                            CantidadMenores: cm,
                                            PA: pa.data
                                        }
                                    )
                                }
                            }
                            catch(e){
                                console.log(e)
                            }
                        })
                    )
                })
            )
        },
        generateRooms(){
            let i = []
            for (let key = 1; key <= 10; key++) {
                let d = ``
                if(key == 1)
                    d = `${key} habitación`
                else
                    d = `${key} habitaciones`
                i.push({
                    value: key,
                    display: d
                })
            }

            return i
        }
    }

}
</script>

<style>
    .check-sp{
        margin-right: 10px;
    }
</style>