<template>
    <div class="info-row gtt-text-color hn-roman">
        <div class="ir-text-wrapper font18">
            <i class="mdi mdi-account"></i>
            <span class="ir-text">
                <slot name="ir-text">
                    Información pasajero principal
                </slot>
            </span>
        </div>
        <div class="ir-inputs-wrapper general-text-opt">
            <div class="input-left flex-wrapper ir-text-input">
                <div class="input-icon font18">
                    <i class="mdi mdi-account"></i>
                </div>
                <div class="input-two-rows">
                    <div class="ir-info-name font14">
                        Nombre(s)
                    </div>
                    <input type="text" :value="name" @input="$emit('inputName', $event.target.value)" class="ir-input font18" placeholder="Su(s) nombre(s)">
                </div>
            </div>
            <div class="input-right flex-wrapper ir-text-input">
                <div class="input-icon font18">
                    <i class="mdi mdi-account"></i>
                </div>
                <div class="input-two-rows">
                    <div class="ir-info-name font14">
                        Apellidos
                    </div>
                    <input type="text" :value="lastname" @input="$emit('inputLastname', $event.target.value)" class="ir-input font18" placeholder="Sus apellidos">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String
        },
        lastname: {
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
    }
    .ir-input:focus{
        border-bottom: 1px solid #f5f5f5;
        outline: none;
    }
</style>