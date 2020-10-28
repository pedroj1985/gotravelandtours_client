<template>
    <div class="info-row gtt-text-color hn-roman">
        <div class="ir-text-wrapper font18">
            <i class="mdi mdi-account"></i>
            <span class="ir-text">
                <slot name="ir-text">
                    Información del vuelo(s)
                </slot>
            </span>
        </div>
        <div class="ir-inputs-wrapper general-text-opt">
            <div class="input-left flex-wrapper ir-text-input">
                <div class="input-icon font18">
                    <i class="mdi mdi-airplane-landing"></i>
                </div>
                <div class="input-two-rows">
                    <div class="ir-info-name font14">
                        Datos del vuelo (llegada)
                    </div>
                    <div class="flex-wrapper">
                        <vue-timepicker  v-model="hl"
                                         close-on-complete hide-clear-button>
                                         </vue-timepicker>
                        <span>-</span>
                        <input type="text" :value="aerolinea_landing" 
                                           @input="$emit('inputAerolineaLanding', $event.target.value)" 
                                           class="ir-input font18" placeholder="AEROLÍNEA">
                        <span>-</span>
                        <input type="text" :value="nvuelo_landing" 
                                           @input="$emit('inputNvueloLanding', $event.target.value)"
                                           class="ir-input font18" placeholder="No. VUELO">
                    </div>
                </div>
            </div>
            <!-- <div class="input-left flex-wrapper ir-text-input">
                <div class="input-two-rows">
                    <div class="ir-info-name font14">
                        Hora del vuelo (llegada)
                    </div>
                    <b-form-timepicker locale="es" placeholder="--:--"></b-form-timepicker>
                </div>
            </div> -->
            <div class="input-right flex-wrapper ir-text-input">
                <div class="input-icon font18">
                    <i class="mdi mdi-airplane-takeoff"></i>
                </div>
                <div class="input-two-rows">
                    <div class="ir-info-name font14">
                        Datos del vuelo (salida)
                    </div>
                    <div class="flex-wrapper">
                        <vue-timepicker  v-model="ht"
                                         close-on-complete hide-clear-button>
                                         </vue-timepicker>
                        <span>-</span>
                        <input type="text" :value="aerolinea_takeoff" 
                                           @input="$emit('inputAerolineaTakeoff', $event.target.value)" 
                                           class="ir-input font18" placeholder="AEROLÍNEA">
                        <span>-</span>
                        <input type="text" :value="nvuelo_takeoff" 
                                           @input="$emit('inputNvueloTakeoff', $event.target.value)"
                                           class="ir-input font18" placeholder="No. VUELO">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    created(){
        this.hl = this.hora_landing
        this.ht = this.hora_takeoff
    },
    watch: {
        hl: function(value){
            this.$emit('inputHoraLanding', value)
        },
        ht: function(value){
            this.$emit('inputHoraTakeoff', value)
        },
    },
    data(){
        return {
            hl: '',
            ht: ''
        }
    },
    props: {
        hora_landing: {
            type: String
        },
        aerolinea_landing: {
            type: String
        },
        nvuelo_landing: {
            type: String
        },
        hora_takeoff: {
            type: String
        },
        aerolinea_takeoff: {
            type: String
        },
        nvuelo_takeoff: {
            type: String
        }
    }
}
</script>
<style scoped>
    .info-row{
        width: 100%;
    }
    .ir-inputs-wrapper{
        display: flex;
        margin-top: 15px;
    }
    .input-two-rows{
        width: 100%;
    }
    .input-icon{
        align-self: center;
        margin-right: 5px;
    }
    .input-left{
        margin-right: auto;
        margin-right: 30px;
    }
    .input-right{
        margin-left: auto;
    }
    .ir-text-input{
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: white;
        width: 50%;
        border-radius: 10px;
        border: 1px solid #6d6d6d;
    }
    .ir-input{
        border: none;
        width: 33%;
        text-align: center;
    }
    .ir-input:focus{
        border-bottom: 1px solid #f5f5f5;
        outline: none;
    }
</style>